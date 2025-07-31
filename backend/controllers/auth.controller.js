import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
	const { name, email, password, role = "user" } = req.body;

	if (!name || !email || !password) {
		res.status(400);
		throw new Error("Please add all fields");
	}

	// check if user exists
	const userExists = await User.findOne({ email });
	if (userExists) {
		res.status(400);
		throw new Error("User already exists");
	}

	// hash password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	// create user
	const user = await User.create({
		name,
		email,
		password: hashedPassword,
		role,
	});

	if (user) {
		res.status(201).json({
			_id: user.id,
			name: user.name,
			email: user.email,
			role: user.role,
			token: generateToken(user._id),
		});
	} else {
		res.status(400);
		throw new Error("Invalid user data");
	}
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		res.status(400);
		throw new Error("Please add all fields");
	}

	// check for user email
	const user = await User.findOne({ email });

	if (user && (await bcrypt.compare(password, user.password))) {
		res.status(200).json({
			_id: user.id,
			name: user.name,
			email: user.email,
			role: user.role,
			token: generateToken(user._id),
		});
	} else {
		res.status(400);
		throw new Error("Invalid credentials");
	}
});

// @desc    Get user
// @route   GET /api/auth/user
// @access  Private
export const getUser = asyncHandler(async (req, res) => {
	// check link 20 in auth.middleware.js => we set req.user to User without password

	res.status(200).json(req.user);
});

// generate JWT
const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: "30d",
	});
};
