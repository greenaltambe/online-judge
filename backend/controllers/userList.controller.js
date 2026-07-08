import asyncHandler from "express-async-handler";
import * as userListService from "../services/userlist.service.js";

// @desc    Create new user list
// @route   POST /api/userlists
// @access  Private
export const createUserList = asyncHandler(async (req, res) => {
  const result = await userListService.createUserList({
    owner: req.user._id,
    name: req.body.name,
    description: req.body.description,
    isPublic: req.body.isPublic,
    problems: req.body.problems,
  });
  res.status(201).json(result);
});

// @desc    Get all user lists for the logged in user
// @route   GET /api/userlists
// @access  Private
export const getAllUserLists = asyncHandler(async (req, res) => {
  const result = await userListService.getAllUserLists(req.user._id);
  res.status(200).json(result);
});

// @desc    Get user list by ID
// @route   GET /api/userlists/:id
// @access  Private
export const getUserListById = asyncHandler(async (req, res) => {
  const result = await userListService.getUserListById(req.params.id, req.user._id);
  res.status(200).json(result);
});

// @desc    Update user list
// @route   PUT /api/userlists/:id
// @access  Private
export const updateUserList = asyncHandler(async (req, res) => {
  const result = await userListService.updateUserList(req.params.id, req.body, req.user._id);
  res.status(200).json(result);
});

// @desc    Delete user list
// @route   DELETE /api/userlists/:id
// @access  Private
export const deleteUserList = asyncHandler(async (req, res) => {
  const result = await userListService.deleteUserList(req.params.id, req.user._id);
  res.status(200).json(result);
});

// @desc    Add problem to user list
// @route   POST /api/userlists/:id/problems
// @access  Private
export const addProblemToUserList = asyncHandler(async (req, res) => {
  const result = await userListService.addProblemToUserList(
    req.params.id,
    req.body.problemId,
    req.user._id
  );
  res.status(200).json(result);
});

// @desc    Remove problem from user list
// @route   DELETE /api/userlists/:id/problems/:problemId
// @access  Private
export const removeProblemFromUserList = asyncHandler(async (req, res) => {
  const result = await userListService.removeProblemFromUserList(
    req.params.id,
    req.params.problemId,
    req.user._id
  );
  res.status(200).json(result);
});

// @desc    Import/clone a public user list
// @route   POST /api/userlists/:id/import
// @access  Private
export const importUserList = asyncHandler(async (req, res) => {
  const result = await userListService.importUserList(req.params.id, req.user._id);
  res.status(201).json(result);
});
