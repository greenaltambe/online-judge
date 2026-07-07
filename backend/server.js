import express from "express";
import colors from "colors";
import errorHandler from "./middleware/error.middleware.js";
import authRouter from "./routes/auth.routes.js";
import problemsRouter from "./routes/problem.route.js";
import userListsRouter from "./routes/userList.routes.js";
import connectDB from "./config/db.js";
import cors from "cors";
import { validateEnv } from "./config/validateEnv.js";
import storage from "./config/storage.js";

validateEnv();
connectDB();

// Check if storage is healthy before starting the server
const healthy = await storage.isHealthy();

if (!healthy) {
  console.error("Storage health check failed");
  process.exit(1);
}

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: false })); // Middleware to parse URL-encoded bodies

app.use("/api/auth", authRouter); // for login, register, logout
app.use("/api/problems", problemsRouter); // for all problems related routes
app.use("/api/userlists", userListsRouter); // for user lists related routes

app.use(errorHandler); // Custom error handling middleware

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
