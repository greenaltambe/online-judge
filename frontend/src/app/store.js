import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";
import problemReducer from "../features/problem/problemSlice.js";

// Configure the store
export const store = configureStore({
	reducer: {
		auth: authReducer, // auth slice for authentication (login, register, logout)
		problems: problemReducer, // problem slice for problems
	},
});
