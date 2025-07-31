import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import errorHandler from "./middleware/error.middleware.js";
import authRouter from "./routes/auth.routes.js";
import problemsRouter from "./routes/problem.route.js";
import connectDB from "./config/db.js";
import cors from "cors";

dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/auth", authRouter); // for login, register, logout
app.use("/api/problems", problemsRouter); // for all problems

app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
