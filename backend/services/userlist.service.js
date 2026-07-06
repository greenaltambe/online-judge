import UserList from "../models/userlist.model";
import { AppError } from "../utils/errors";

export const createUserList = async ({
  owner,
  name,
  description,
  isPublic,
  problems,
}) => {
  if (!owner) {
    throw new AppError("Please add an owner field", 400);
  }

  if (!name) {
    throw new AppError("Please add a name field", 400);
  }

  if (!description) {
    throw new AppError("Please add a description field", 400);
  }

  const existingUserList = await UserList.findOne({ owner, name });
  if (existingUserList) {
    throw new AppError("A user list with this name already exists", 400);
  }

  const newUserList = new UserList({
    owner,
    name,
    description,
    isPublic,
    problems,
  });
  await newUserList.save();
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

  const exists = userList.problems.findIndex(
    (id) => id.toString() === problemId.toString(),
  );

  if (exists !== -1) {
    throw new AppError("Problem already exists in the user list", 400);
  }

  userList.problems.push(problemId);
  await userList.save();
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
  return userList;
};

export const getUserListById = async (userListId, owner) => {
  const userList = await UserList.findOne({
    _id: userListId,
    owner: owner,
  }).populate("problems", "title difficulty tags");
  if (!userList) {
    throw new AppError("User list not found", 404);
  }
  return userList;
};

export const getAllUserLists = async (owner) => {
  const userLists = await UserList.find({ owner }).populate("problems");
  return userLists;
};

export const updateUserList = async (userListId, updateData, owner) => {
  const userList = await UserList.findOne({
    _id: userListId,
    owner: owner,
  });
  if (!userList) {
    throw new AppError("User list not found", 404);
  }

  const existingUserList = await UserList.findOne({
    _id: { $ne: userListId },
    owner: owner,
    name: updateData.name,
  });
  if (existingUserList) {
    throw new AppError("A user list with this name already exists", 400);
  }

  if (updateData.name) {
    userList.name = updateData.name;
  }

  if (updateData.description) {
    userList.description = updateData.description;
  }

  if (updateData.isPublic !== undefined) {
    userList.isPublic = updateData.isPublic;
  }

  await userList.save();
  return userList;
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
  return { message: "User list deleted successfully" };
};
