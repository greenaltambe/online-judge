import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getNote, saveNote, deleteNote } from "../controllers/userNote.controller.js";

const router = express.Router();

router.get("/problem/:problemId", protect, getNote);
router.put("/problem/:problemId", protect, saveNote);
router.delete("/problem/:problemId", protect, deleteNote);

export default router;
