import express from "express";
import {
	login,
	register,
	logout,
	getUser,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.get("/user", protect, getUser);

export default router;
