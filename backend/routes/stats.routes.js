import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  getOverview,
  getDifficultyStats,
  getLanguageStats,
  getTagStats,
  getRecentActivity,
  getSubmissionCalendar,
} from "../controllers/stats.controller.js";

const router = express.Router();

router.get("/overview", protect, getOverview);
router.get("/difficulty", protect, getDifficultyStats);
router.get("/languages", protect, getLanguageStats);
router.get("/tags", protect, getTagStats);
router.get("/activity", protect, getRecentActivity);
router.get("/calendar", protect, getSubmissionCalendar);

export default router;
