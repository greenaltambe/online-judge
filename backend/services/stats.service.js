import Submission from "../models/submission.model.js";
import Problem from "../models/problem.model.js";
import { PROBLEM_TAG_MAP } from "../constants/problemTags.js";

// Helper for calculating streak ending at a given date
function getStreakEndingAt(uniqueDates, endDateStr) {
  let streak = 0;
  const checkDate = new Date(endDateStr);
  while (true) {
    const checkDateStr = checkDate.toISOString().split("T")[0];
    if (uniqueDates.includes(checkDateStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export const getOverview = async (userId) => {
  const submissions = await Submission.find({ user: userId }).sort({ createdAt: 1 });
  const totalSubmissions = submissions.length;
  
  const acceptedSubmissions = submissions.filter(s => s.status === "accepted");
  const acceptedCount = acceptedSubmissions.length;
  const acceptanceRate = totalSubmissions > 0 ? (acceptedCount / totalSubmissions) * 100 : 0;
  
  // Solved unique problems
  const solvedProblemIds = new Set();
  for (const s of acceptedSubmissions) {
    if (s.problem) {
      solvedProblemIds.add(s.problem.toString());
    }
  }
  const solvedCount = solvedProblemIds.size;
  
  // Streak calculations
  const dates = submissions
    .filter(s => s.createdAt)
    .map(s => s.createdAt.toISOString().split("T")[0]);
  const uniqueDates = [...new Set(dates)].sort();
  
  let currentStreak = 0;
  let longestStreak = 0;
  
  if (uniqueDates.length > 0) {
    let tempStreak = 0;
    let lastDate = null;
    
    for (const dateStr of uniqueDates) {
      const currentDate = new Date(dateStr);
      if (!lastDate) {
        tempStreak = 1;
      } else {
        const diffTime = Math.abs(currentDate - lastDate);
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          tempStreak++;
        } else if (diffDays > 1) {
          tempStreak = 1;
        }
      }
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
      lastDate = currentDate;
    }
    
    const todayStr = new Date().toISOString().split("T")[0];
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    
    if (uniqueDates.includes(todayStr)) {
      currentStreak = getStreakEndingAt(uniqueDates, todayStr);
    } else if (uniqueDates.includes(yesterdayStr)) {
      currentStreak = getStreakEndingAt(uniqueDates, yesterdayStr);
    } else {
      currentStreak = 0;
    }
  }
  
  return {
    solvedCount,
    totalSubmissions,
    acceptanceRate: parseFloat(acceptanceRate.toFixed(1)),
    currentStreak,
    longestStreak,
  };
};

export const getDifficultyStats = async (userId) => {
  const totalEasy = await Problem.countDocuments({ difficulty: "easy" });
  const totalMedium = await Problem.countDocuments({ difficulty: "medium" });
  const totalHard = await Problem.countDocuments({ difficulty: "hard" });
  
  const acceptedSubmissions = await Submission.find({
    user: userId,
    status: "accepted",
  }).populate("problem");
  
  const solvedEasy = new Set();
  const solvedMedium = new Set();
  const solvedHard = new Set();
  
  for (const sub of acceptedSubmissions) {
    if (sub.problem) {
      const problemId = sub.problem._id.toString();
      if (sub.problem.difficulty === "easy") {
        solvedEasy.add(problemId);
      } else if (sub.problem.difficulty === "medium") {
        solvedMedium.add(problemId);
      } else if (sub.problem.difficulty === "hard") {
        solvedHard.add(problemId);
      }
    }
  }
  
  return {
    easy: { solved: solvedEasy.size, total: totalEasy },
    medium: { solved: solvedMedium.size, total: totalMedium },
    hard: { solved: solvedHard.size, total: totalHard },
  };
};

export const getLanguageStats = async (userId) => {
  const submissions = await Submission.find({ user: userId });
  const totalSubmissions = submissions.length;
  
  const languageCounts = {};
  for (const sub of submissions) {
    const lang = sub.language || "Unknown";
    languageCounts[lang] = (languageCounts[lang] || 0) + 1;
  }
  
  const stats = Object.entries(languageCounts).map(([language, count]) => {
    const percentage = totalSubmissions > 0 ? (count / totalSubmissions) * 100 : 0;
    return {
      language,
      count,
      percentage: parseFloat(percentage.toFixed(1)),
    };
  });
  
  return stats.sort((a, b) => b.count - a.count);
};

export const getTagStats = async (userId) => {
  const submissions = await Submission.find({ user: userId }).populate("problem");
  
  const tagSubmissions = {};
  const tagAccepted = {};
  const tagSolved = {};
  
  for (const sub of submissions) {
    if (!sub.problem) continue;
    const tags = sub.problem.tags || [];
    for (const tag of tags) {
      tagSubmissions[tag] = (tagSubmissions[tag] || 0) + 1;
      if (sub.status === "accepted") {
        tagAccepted[tag] = (tagAccepted[tag] || 0) + 1;
        if (!tagSolved[tag]) {
          tagSolved[tag] = new Set();
        }
        tagSolved[tag].add(sub.problem._id.toString());
      }
    }
  }
  
  const allTags = Object.keys(tagSubmissions);
  const tagStatsList = allTags.map(tagId => {
    const label = PROBLEM_TAG_MAP[tagId]?.label || tagId;
    const solvedCount = tagSolved[tagId]?.size || 0;
    const totalCount = tagSubmissions[tagId] || 0;
    const acceptedCount = tagAccepted[tagId] || 0;
    const acceptanceRate = totalCount > 0 ? (acceptedCount / totalCount) * 100 : 0;
    
    return {
      tagId,
      label,
      solvedCount,
      totalCount,
      acceptanceRate: parseFloat(acceptanceRate.toFixed(1)),
    };
  });
  
  const mostSolved = [...tagStatsList]
    .filter(t => t.solvedCount > 0)
    .sort((a, b) => b.solvedCount - a.solvedCount)
    .slice(0, 10);
    
  const weakest = [...tagStatsList]
    .filter(t => t.totalCount > 0)
    .sort((a, b) => a.acceptanceRate - b.acceptanceRate)
    .slice(0, 10);
    
  return { mostSolved, weakest };
};

export const getRecentActivity = async (userId) => {
  const submissions = await Submission.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(15)
    .populate("problem");
    
  return submissions.map(sub => {
    return {
      _id: sub._id,
      problem: sub.problem ? {
        _id: sub.problem._id,
        title: sub.problem.title,
        difficulty: sub.problem.difficulty,
        tags: sub.problem.tags,
      } : null,
      status: sub.status,
      language: sub.language,
      createdAt: sub.createdAt,
    };
  });
};

export const getSubmissionCalendar = async (userId) => {
  const oneYearAgo = new Date();
  oneYearAgo.setDate(oneYearAgo.getDate() - 365);
  
  const submissions = await Submission.find({
    user: userId,
    createdAt: { $gte: oneYearAgo },
  });
  
  const calendar = {};
  for (const sub of submissions) {
    if (sub.createdAt) {
      const dateStr = sub.createdAt.toISOString().split("T")[0];
      calendar[dateStr] = (calendar[dateStr] || 0) + 1;
    }
  }
  
  return calendar;
};
