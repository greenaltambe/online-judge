import asyncHandler from "express-async-handler";
import * as discussionService from "../services/discussion.service.js";

// @desc    Get nested comments for a problem
// @route   GET /api/discussions/problem/:problemId
// @access  Private
export const getCommentsForProblem = asyncHandler(async (req, res) => {
  const result = await discussionService.getCommentsForProblem(req.params.problemId);
  res.status(200).json(result);
});

// @desc    Create a comment or reply
// @route   POST /api/discussions/problem/:problemId
// @access  Private
export const createComment = asyncHandler(async (req, res) => {
  const result = await discussionService.createComment({
    problemId: req.params.problemId,
    userId: req.user._id,
    content: req.body.content,
    parentId: req.body.parentId || null,
  });
  res.status(201).json(result);
});

// @desc    Edit a comment
// @route   PUT /api/discussions/:id
// @access  Private
export const updateComment = asyncHandler(async (req, res) => {
  const result = await discussionService.updateComment({
    commentId: req.params.id,
    userId: req.user._id,
    content: req.body.content,
  });
  res.status(200).json(result);
});

// @desc    Delete a comment
// @route   DELETE /api/discussions/:id
// @access  Private
export const deleteComment = asyncHandler(async (req, res) => {
  const result = await discussionService.deleteComment({
    commentId: req.params.id,
    userId: req.user._id,
    userRole: req.user.role,
  });
  res.status(200).json(result);
});

// @desc    Toggle upvote on a comment
// @route   POST /api/discussions/:id/vote
// @access  Private
export const toggleVote = asyncHandler(async (req, res) => {
  const result = await discussionService.toggleVote({
    commentId: req.params.id,
    userId: req.user._id,
  });
  res.status(200).json(result);
});
