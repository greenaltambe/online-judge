import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";

export const protect = asyncHandler(async (req, res, next) => {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		try {
			// Get token from header
			token = req.headers.authorization.split(" ")[1];

			// Verify token
			const decoded = jwt.verify(token, process.env.JWT_SECRET);

			// Get user and attach to request object (excluding password)
			req.user = await User.findById(decoded.id).select("-password");

			next();
		} catch (error) {
			console.error(error);
			res.status(401);
			throw new Error("Not authorized");
		}
	}

	if (!token) {
		res.status(401);
		throw new Error("Not authorized, no token");
	}
});

export const adminOnly = (req, res, next) => {
	if (req.user && req.user.role === "admin") {
		next();
	} else {
		res.status(401);
		throw new Error("Not authorized as admin");
	}
};

// Bearer token => format of token
// [0] => Bearer
// [1] => token
