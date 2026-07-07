import asyncHandler from "express-async-handler";
import * as userNoteService from "../services/userNote.service.js";

// @desc    Get user note for a problem
// @route   GET /api/notes/problem/:problemId
// @access  Private
export const getNote = asyncHandler(async (req, res) => {
  const result = await userNoteService.getNote(req.user._id, req.params.problemId);
  if (!result) {
    return res.status(200).json({ content: "", updatedAt: null });
  }
  res.status(200).json({
    content: result.content,
    updatedAt: result.updatedAt,
  });
});

// @desc    Save (create/update) user note for a problem
// @route   PUT /api/notes/problem/:problemId
// @access  Private
export const saveNote = asyncHandler(async (req, res) => {
  const result = await userNoteService.saveNote(
    req.user._id,
    req.params.problemId,
    req.body.content
  );
  res.status(200).json({
    content: result.content,
    updatedAt: result.updatedAt,
  });
});

// @desc    Delete user note for a problem
// @route   DELETE /api/notes/problem/:problemId
// @access  Private
export const deleteNote = asyncHandler(async (req, res) => {
  await userNoteService.deleteNote(req.user._id, req.params.problemId);
  res.status(200).json({ success: true });
});
