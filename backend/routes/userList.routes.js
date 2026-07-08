import express from "express";
import {
  createUserList,
  getAllUserLists,
  getUserListById,
  updateUserList,
  deleteUserList,
  addProblemToUserList,
  removeProblemFromUserList,
  importUserList,
  getDueCards,
  getReviewStats,
  updateReviewCard,
  resetReviewProgress,
} from "../controllers/userList.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getAllUserLists);
router.post("/", protect, createUserList);

router.get("/:id", protect, getUserListById);
router.put("/:id", protect, updateUserList);
router.delete("/:id", protect, deleteUserList);

router.post("/:id/problems", protect, addProblemToUserList);
router.delete("/:id/problems/:problemId", protect, removeProblemFromUserList);
router.post("/:id/import", protect, importUserList);

router.get("/:id/review/due", protect, getDueCards);
router.get("/:id/review/stats", protect, getReviewStats);
router.post("/:id/review/reset", protect, resetReviewProgress);
router.post("/:id/review/:problemId", protect, updateReviewCard);

export default router;
