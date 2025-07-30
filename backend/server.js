import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes.js";
import problemsRouter from "./routes/problem.route.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use("/api/auth", authRouter); // for login, register, logout
app.use("/api/problems", problemsRouter); // for all problems

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
