import UserList from "../models/userlist.model.js";
import Problem from "../models/problem.model.js";
import ReviewProgress from "../models/reviewProgress.model.js";
import { AppError } from "../utils/errors.js";

export const syncReviewProgress = async (userListId, problemIds, ownerId) => {
  for (const problemId of problemIds) {
    await ReviewProgress.findOneAndUpdate(
      { owner: ownerId, userList: userListId, problem: problemId },
      {
        $setOnInsert: {
          owner: ownerId,
          userList: userListId,
          problem: problemId,
          easeFactor: 2.5,
          repetitions: 0,
          interval: 0,
          nextReviewDate: new Date(),
          lastReviewDate: null,
        }
      },
      { upsert: true, new: true }
    );
  }
};

export const createUserList = async ({
  owner,
  name,
  description,
  isPublic,
  spacedRepetitionEnabled,
  problems,
}) => {
  if (!owner) {
    throw new AppError("Please add an owner field", 400);
  }

  const trimmedName = name ? name.trim() : "";
  const trimmedDescription = description ? description.trim() : "";

  if (!trimmedName) {
    throw new AppError("Please add a name field", 400);
  }

  if (!trimmedDescription) {
    throw new AppError("Please add a description field", 400);
  }

  const existingUserList = await UserList.findOne({ owner, name: trimmedName });
  if (existingUserList) {
    throw new AppError("A user list with this name already exists", 400);
  }

  const newUserList = new UserList({
    owner,
    name: trimmedName,
    description: trimmedDescription,
    isPublic: isPublic !== undefined ? isPublic : false,
    spacedRepetitionEnabled: spacedRepetitionEnabled !== undefined ? spacedRepetitionEnabled : false,
    problems: problems || [],
  });
  await newUserList.save();

  if (newUserList.spacedRepetitionEnabled && newUserList.problems.length > 0) {
    await syncReviewProgress(newUserList._id, newUserList.problems, owner);
  }

  return newUserList;
};

export const addProblemToUserList = async (userListId, problemId, owner) => {
  const userList = await UserList.findOne({
    _id: userListId,
    owner: owner,
  });
  if (!userList) {
    throw new AppError("User list not found", 404);
  }

  const problemExists = await Problem.findById(problemId);
  if (!problemExists) {
    throw new AppError("Problem not found", 404);
  }

  const exists = userList.problems.findIndex(
    (id) => id.toString() === problemId.toString(),
  );

  if (exists !== -1) {
    throw new AppError("Problem already exists in the user list", 400);
  }

  userList.problems.push(problemId);
  await userList.save();

  if (userList.spacedRepetitionEnabled) {
    await syncReviewProgress(userListId, [problemId], owner);
  }

  return userList;
};

export const removeProblemFromUserList = async (
  userListId,
  problemId,
  owner,
) => {
  const userList = await UserList.findOne({
    _id: userListId,
    owner: owner,
  });
  if (!userList) {
    throw new AppError("User list not found", 404);
  }

  const problemIndex = userList.problems.findIndex(
    (id) => id.toString() === problemId.toString(),
  );
  if (problemIndex === -1) {
    throw new AppError("Problem not found in the user list", 404);
  }

  userList.problems.splice(problemIndex, 1);
  await userList.save();

  // Remove review progress
  await ReviewProgress.deleteOne({
    owner: owner,
    userList: userListId,
    problem: problemId,
  });

  return userList;
};

export const getUserListById = async (userListId, owner) => {
  const userList = await UserList.findOne({
    _id: userListId,
    $or: [{ owner: owner }, { isPublic: true }],
  }).populate("problems", "title difficulty tags");
  if (!userList) {
    throw new AppError("User list not found", 404);
  }
  return await enrichListWithSRStats(userList, owner);
};

export const getAllUserLists = async (owner) => {
  const userLists = await UserList.find({ owner }).populate("problems", "title difficulty tags");
  const enriched = [];
  for (const list of userLists) {
    enriched.push(await enrichListWithSRStats(list, owner));
  }
  return enriched;
};

export const updateUserList = async (userListId, updateData, owner) => {
  const userList = await UserList.findOne({
    _id: userListId,
    owner: owner,
  });
  if (!userList) {
    throw new AppError("User list not found", 404);
  }

  if (updateData.name !== undefined) {
    const trimmedName = updateData.name.trim();
    if (!trimmedName) {
      throw new AppError("Please add a name field", 400);
    }
    const existingUserList = await UserList.findOne({
      _id: { $ne: userListId },
      owner: owner,
      name: trimmedName,
    });
    if (existingUserList) {
      throw new AppError("A user list with this name already exists", 400);
    }
    userList.name = trimmedName;
  }

  if (updateData.description !== undefined) {
    const trimmedDescription = updateData.description.trim();
    if (!trimmedDescription) {
      throw new AppError("Please add a description field", 400);
    }
    userList.description = trimmedDescription;
  }

  if (updateData.isPublic !== undefined) {
    userList.isPublic = updateData.isPublic;
  }

  if (updateData.spacedRepetitionEnabled !== undefined) {
    const prevSR = userList.spacedRepetitionEnabled;
    userList.spacedRepetitionEnabled = updateData.spacedRepetitionEnabled;
    if (updateData.spacedRepetitionEnabled && !prevSR) {
      await syncReviewProgress(userListId, userList.problems, owner);
    }
  }

  await userList.save();
  return await enrichListWithSRStats(userList, owner);
};

export const deleteUserList = async (userListId, owner) => {
  const userList = await UserList.findOne({
    _id: userListId,
    owner: owner,
  });
  if (!userList) {
    throw new AppError("User list not found", 404);
  }

  await userList.deleteOne();

  // Delete all associated review progress cards
  await ReviewProgress.deleteMany({
    owner: owner,
    userList: userListId,
  });

  return { message: "User list deleted successfully" };
};

export const importUserList = async (userListId, targetUserId) => {
  const sourceList = await UserList.findOne({
    _id: userListId,
    $or: [{ owner: targetUserId }, { isPublic: true }],
  });
  if (!sourceList) {
    throw new AppError("Source user list not found or not public", 404);
  }

  let newName = sourceList.name;
  let count = 0;
  // Resolve name collisions
  while (true) {
    const existing = await UserList.findOne({ owner: targetUserId, name: newName });
    if (!existing) break;
    count++;
    newName = `${sourceList.name} (${count})`;
  }

  const newDescription = sourceList.description || "Imported list";

  const newUserList = new UserList({
    owner: targetUserId,
    name: newName,
    description: newDescription,
    isPublic: false, // Cloned list is private by default
    spacedRepetitionEnabled: false, // Default is disabled
    problems: [...sourceList.problems],
  });
  await newUserList.save();
  return newUserList;
};

// Spaced Repetition Helpers and Actions
export const enrichListWithSRStats = async (userList, ownerId) => {
  const listObj = userList.toObject ? userList.toObject() : userList;
  
  // SR stats are private to the deck owner
  if (String(ownerId) !== String(listObj.owner)) {
    return listObj;
  }

  if (!listObj.spacedRepetitionEnabled) {
    return listObj;
  }

  const now = new Date();
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const cards = await ReviewProgress.find({ owner: ownerId, userList: listObj._id });

  let dueTodayCount = 0;
  let studiedTodayCount = 0;
  let nextReviewDate = null;
  let learnedCount = 0;

  cards.forEach((card) => {
    if (card.nextReviewDate && card.nextReviewDate <= now) {
      dueTodayCount++;
    }
    if (card.lastReviewDate && card.lastReviewDate >= startOfToday) {
      studiedTodayCount++;
    }
    if (card.nextReviewDate && card.nextReviewDate > now) {
      if (!nextReviewDate || card.nextReviewDate < nextReviewDate) {
        nextReviewDate = card.nextReviewDate;
      }
    }
    if (card.repetitions > 0) {
      learnedCount++;
    }
  });

  if (dueTodayCount > 0) {
    nextReviewDate = now;
  }

  const totalProblems = listObj.problems ? listObj.problems.length : 0;
  const progressPercent = totalProblems > 0 ? Math.round((learnedCount / totalProblems) * 100) : 0;

  listObj.srStats = {
    dueTodayCount,
    studiedTodayCount,
    nextReviewDate,
    learnedCount,
    progressPercent,
  };

  return listObj;
};

export const calculateSM2 = (easeFactor, repetitions, interval, rating) => {
  // rating: 1 = Again, 2 = Hard, 3 = Good, 4 = Easy
  // Map 1-4 scale to SM2 quality (0-5 scale):
  // 1 (Again) -> quality 1
  // 2 (Hard) -> quality 3
  // 3 (Good) -> quality 4
  // 4 (Easy) -> quality 5
  let q = 4;
  if (rating === 1) q = 1;
  else if (rating === 2) q = 3;
  else if (rating === 3) q = 4;
  else if (rating === 4) q = 5;

  let nextEaseFactor = easeFactor;
  let nextRepetitions = repetitions;
  let nextInterval = interval;

  if (q < 3) {
    nextRepetitions = 0;
    nextInterval = 1;
  } else {
    if (nextRepetitions === 0) {
      nextInterval = 1;
    } else if (nextRepetitions === 1) {
      nextInterval = 6;
    } else {
      nextInterval = Math.ceil(interval * easeFactor);
    }
    nextRepetitions++;
  }

  // Adjust ease factor
  nextEaseFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (nextEaseFactor < 1.3) {
    nextEaseFactor = 1.3;
  }

  return {
    easeFactor: parseFloat(nextEaseFactor.toFixed(2)),
    repetitions: nextRepetitions,
    interval: nextInterval,
  };
};

export const getDueCards = async (userListId, ownerId) => {
  const userList = await UserList.findOne({ _id: userListId, owner: ownerId });
  if (!userList) {
    throw new AppError("User list not found or access denied", 404);
  }
  if (!userList.spacedRepetitionEnabled) {
    throw new AppError("Spaced repetition is not enabled on this list", 400);
  }

  const now = new Date();

  // Find all cards where nextReviewDate <= now
  const dueCards = await ReviewProgress.find({
    owner: ownerId,
    userList: userListId,
    nextReviewDate: { $lte: now },
  }).populate("problem", "title difficulty tags");

  return dueCards;
};

export const getReviewStats = async (userListId, ownerId) => {
  const userList = await UserList.findOne({ _id: userListId, owner: ownerId });
  if (!userList) {
    throw new AppError("User list not found or access denied", 404);
  }

  const enriched = await enrichListWithSRStats(userList, ownerId);
  return enriched.srStats || {
    dueTodayCount: 0,
    studiedTodayCount: 0,
    nextReviewDate: null,
    learnedCount: 0,
    progressPercent: 0,
  };
};

export const updateReviewCard = async (userListId, problemId, rating, ownerId) => {
  const userList = await UserList.findOne({ _id: userListId, owner: ownerId });
  if (!userList) {
    throw new AppError("User list not found or access denied", 404);
  }
  if (!userList.spacedRepetitionEnabled) {
    throw new AppError("Spaced repetition is not enabled on this list", 400);
  }

  // Ensure card exists
  let card = await ReviewProgress.findOne({
    owner: ownerId,
    userList: userListId,
    problem: problemId,
  });

  if (!card) {
    // Fallback sync
    await syncReviewProgress(userListId, [problemId], ownerId);
    card = await ReviewProgress.findOne({
      owner: ownerId,
      userList: userListId,
      problem: problemId,
    });
  }

  const { easeFactor, repetitions, interval } = card;
  const nextStats = calculateSM2(easeFactor, repetitions, interval, rating);

  card.easeFactor = nextStats.easeFactor;
  card.repetitions = nextStats.repetitions;
  card.interval = nextStats.interval;

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + nextStats.interval);
  nextDate.setHours(0, 0, 0, 0); // Reset time to 00:00:00 local day boundary

  card.nextReviewDate = nextDate;
  card.lastReviewDate = new Date();

  await card.save();
  return card;
};

export const resetReviewProgress = async (userListId, ownerId) => {
  const userList = await UserList.findOne({ _id: userListId, owner: ownerId });
  if (!userList) {
    throw new AppError("User list not found or access denied", 404);
  }

  await ReviewProgress.updateMany(
    { owner: ownerId, userList: userListId },
    {
      $set: {
        easeFactor: 2.5,
        repetitions: 0,
        interval: 0,
        nextReviewDate: new Date(),
        lastReviewDate: null,
      }
    }
  );

  return { message: "Review progress reset successfully" };
};

