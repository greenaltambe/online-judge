import asyncHandler from "express-async-handler";
import * as statsService from "../services/stats.service.js";

// @desc    Get statistics overview
// @route   GET /api/stats/overview
// @access  Private
export const getOverview = asyncHandler(async (req, res) => {
  const result = await statsService.getOverview(req.user._id);
  res.status(200).json(result);
});

// @desc    Get stats difficulty breakdown
// @route   GET /api/stats/difficulty
// @access  Private
export const getDifficultyStats = asyncHandler(async (req, res) => {
  const result = await statsService.getDifficultyStats(req.user._id);
  res.status(200).json(result);
});

// @desc    Get stats language usage breakdown
// @route   GET /api/stats/languages
// @access  Private
export const getLanguageStats = asyncHandler(async (req, res) => {
  const result = await statsService.getLanguageStats(req.user._id);
  res.status(200).json(result);
});

// @desc    Get stats tag analytics (most solved and weakest)
// @route   GET /api/stats/tags
// @access  Private
export const getTagStats = asyncHandler(async (req, res) => {
  const result = await statsService.getTagStats(req.user._id);
  res.status(200).json(result);
});

// @desc    Get recent submissions/activity
// @route   GET /api/stats/activity
// @access  Private
export const getRecentActivity = asyncHandler(async (req, res) => {
  const result = await statsService.getRecentActivity(req.user._id);
  res.status(200).json(result);
});

// @desc    Get submission calendar (contributions heatmap)
// @route   GET /api/stats/calendar
// @access  Private
export const getSubmissionCalendar = asyncHandler(async (req, res) => {
  const result = await statsService.getSubmissionCalendar(req.user._id);
  res.status(200).json(result);
});
