import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  getCommentsForProblem,
  createComment,
  updateComment,
  deleteComment,
  toggleVote,
} from "../controllers/discussion.controller.js";

const router = express.Router();

router.get("/problem/:problemId", protect, getCommentsForProblem);
router.post("/problem/:problemId", protect, createComment);
router.put("/:id", protect, updateComment);
router.delete("/:id", protect, deleteComment);
router.post("/:id/vote", protect, toggleVote);

export default router;
