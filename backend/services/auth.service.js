import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { AppError } from "../utils/errors.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const registerUser = async ({ name, email, password, role = "user" }) => {
  if (!name || !email || !password) {
    throw new AppError("Please add all fields", 400);
  }

  // check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new AppError("User already exists", 400);
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

  if (!user) {
    throw new AppError("Invalid user data", 400);
  }

  return {
    _id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  };
};

export const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new AppError("Please add all fields", 400);
  }

  // check for user email
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    return {
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    };
  } else {
    throw new AppError("Invalid credentials", 400);
  }
};
