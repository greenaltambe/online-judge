import UserNote from "../models/userNote.model.js";
import { AppError } from "../utils/errors.js";

export const getNote = async (userId, problemId) => {
  if (!userId || !problemId) {
    throw new AppError("User ID and Problem ID are required to fetch note", 400);
  }

  const note = await UserNote.findOne({ user: userId, problem: problemId });
  return note;
};

export const saveNote = async (userId, problemId, content) => {
  if (!userId || !problemId) {
    throw new AppError("User ID and Problem ID are required to save note", 400);
  }

  // Enforce 5000 character limit on backend
  const trimmedContent = content ? content.toString() : "";
  if (trimmedContent.length > 5000) {
    throw new AppError("Note content exceeds the maximum limit of 5000 characters", 400);
  }

  // Find and update, or insert if it doesn't exist
  const note = await UserNote.findOneAndUpdate(
    { user: userId, problem: problemId },
    { content: trimmedContent },
    { new: true, upsert: true }
  );

  return note;
};

export const deleteNote = async (userId, problemId) => {
  if (!userId || !problemId) {
    throw new AppError("User ID and Problem ID are required to delete note", 400);
  }

  const note = await UserNote.findOneAndDelete({ user: userId, problem: problemId });
  if (!note) {
    throw new AppError("Note not found", 404);
  }

  return { success: true };
};
