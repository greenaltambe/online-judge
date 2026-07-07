import Discussion from "../models/discussion.model.js";
import { AppError } from "../utils/errors.js";

export const getCommentsForProblem = async (problemId) => {
  if (!problemId) {
    throw new AppError("Problem ID is required to fetch discussions", 400);
  }

  // Find all comments for this problem, populate author details
  const comments = await Discussion.find({ problem: problemId })
    .populate("user", "name email role")
    .sort({ createdAt: 1 });

  // Separate top-level comments and nested replies
  const topLevelComments = [];
  const repliesMap = {}; // parentId -> array of replies

  for (const comment of comments) {
    if (comment.parentId) {
      const pId = comment.parentId.toString();
      if (!repliesMap[pId]) {
        repliesMap[pId] = [];
      }
      repliesMap[pId].push(comment);
    } else {
      topLevelComments.push(comment);
    }
  }

  // Attach replies array directly to top-level comments
  const nestedComments = topLevelComments.map((comment) => {
    const commentObj = comment.toObject();
    commentObj.replies = repliesMap[comment._id.toString()] || [];
    return commentObj;
  });

  return nestedComments;
};

export const createComment = async ({ problemId, userId, content, parentId }) => {
  if (!problemId || !userId || !content) {
    throw new AppError("Missing fields for creating comment", 400);
  }

  const commentData = {
    problem: problemId,
    user: userId,
    content: content,
  };

  if (parentId) {
    // Verify parent comment exists
    const parentComment = await Discussion.findById(parentId);
    if (!parentComment) {
      throw new AppError("Parent comment not found", 404);
    }
    commentData.parentId = parentId;
  }

  const comment = await Discussion.create(commentData);
  const populated = await Discussion.findById(comment._id).populate("user", "name email role");
  return populated;
};

export const updateComment = async ({ commentId, userId, content }) => {
  if (!commentId || !userId || !content) {
    throw new AppError("Missing fields to edit comment", 400);
  }

  const comment = await Discussion.findById(commentId);
  if (!comment) {
    throw new AppError("Comment not found", 404);
  }

  // Only the author can edit their comment
  if (comment.user.toString() !== userId.toString()) {
    throw new AppError("Not authorized to edit this comment", 403);
  }

  comment.content = content;
  comment.editedAt = new Date();
  await comment.save();

  const populated = await Discussion.findById(comment._id).populate("user", "name email role");
  return populated;
};

export const deleteComment = async ({ commentId, userId, userRole }) => {
  if (!commentId || !userId) {
    throw new AppError("Missing fields to delete comment", 400);
  }

  const comment = await Discussion.findById(commentId);
  if (!comment) {
    throw new AppError("Comment not found", 404);
  }

  // Only the author or an admin can delete a comment
  if (comment.user.toString() !== userId.toString() && userRole !== "admin") {
    throw new AppError("Not authorized to delete this comment", 403);
  }

  // Remove comment
  await Discussion.findByIdAndDelete(commentId);

  // Remove child replies if it is a top-level comment
  if (!comment.parentId) {
    await Discussion.deleteMany({ parentId: commentId });
  }

  return { success: true };
};

export const toggleVote = async ({ commentId, userId }) => {
  if (!commentId || !userId) {
    throw new AppError("Missing fields for voting", 400);
  }

  const comment = await Discussion.findById(commentId);
  if (!comment) {
    throw new AppError("Comment not found", 404);
  }

  const upvotes = comment.upvotes || [];
  const userIdx = upvotes.indexOf(userId);

  if (userIdx > -1) {
    // Already upvoted, so pull it (remove)
    upvotes.splice(userIdx, 1);
  } else {
    // Add vote
    upvotes.push(userId);
  }

  comment.upvotes = upvotes;
  await comment.save();

  const populated = await Discussion.findById(comment._id).populate("user", "name email role");
  return populated;
};
