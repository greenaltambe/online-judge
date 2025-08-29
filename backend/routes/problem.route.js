import express from "express";
import {
	getProblems,
	getProblem,
	setProblem,
	updateProblem,
	deleteProblem,
	runSolution,
	submitSolution,
	getSubmissions,
} from "../controllers/problem.controller.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getProblems);
router.get("/:id", protect, getProblem);
router.post("/", protect, adminOnly, setProblem);
router.put("/:id", protect, adminOnly, updateProblem);
router.delete("/:id", protect, adminOnly, deleteProblem);
router.post("/run", protect, runSolution);
router.post("/submit", protect, submitSolution);
router.get("/:id/submissions", protect, getSubmissions);

export default router;
