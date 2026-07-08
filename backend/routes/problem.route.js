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
  importProblems,
} from "../controllers/problem.controller.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.get("/", protect, getProblems);
router.get("/:id", protect, getProblem);
router.post(
  "/",
  protect,
  adminOnly,
  upload.fields([
    { name: "inputs", maxCount: 20 },
    { name: "outputs", maxCount: 20 },
  ]),
  setProblem,
);
router.post(
  "/import",
  protect,
  adminOnly,
  upload.single("file"),
  importProblems,
);
router.put("/:id", protect, adminOnly, updateProblem);
router.delete("/:id", protect, adminOnly, deleteProblem);
router.post("/run", protect, runSolution);
router.post("/submit", protect, submitSolution);
router.get("/:id/submissions", protect, getSubmissions);

export default router;
