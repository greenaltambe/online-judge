import "dotenv/config";
import express from "express";
import executeCpp from "./executors/cppExecutor.js";
import executeJava from "./executors/javaExecutor.js";
import executePython from "./executors/pythonExecutor.js";

const app = express();

app.use(express.json());

const authenticateRequest = (req, res, next) => {
  const secret = req.headers["x-judge-service-secret"];
  if (!secret || secret !== process.env.JUDGE_SERVICE_SECRET) {
    return res.status(401).json({
      error: "Unauthorized: Invalid or missing Judge Service Secret",
    });
  }
  next();
};

app.post("/run", authenticateRequest, async (req, res) => {
  const { code, language, input } = req.body;

  try {
    let result = null;
    if (language === "cpp") {
      result = await executeCpp(code, input);
    } else if (language === "python") {
      result = await executePython(code, input);
    } else if (language === "java") {
      result = await executeJava(code, input);
    } else {
      return res.status(400).json({ error: "Invalid language" });
    }

    // Classify low-level execution verdicts
    let status = "success";
    if (result.isCompileError) {
      status = "compile_error";
    } else if (result.timeout) {
      status = "time_limit_exceeded";
    } else if (result.oomKilled) {
      status = "memory_limit_exceeded";
    } else if (result.exitCode !== 0) {
      status = "runtime_error";
    }

    res.status(200).json({
      status,
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode: result.exitCode,
      timeout: result.timeout,
      oomKilled: result.oomKilled,
      compileOutput: result.compileOutput,
      executionTime: result.executionTime,
      memoryUsage: result.memoryUsage,
    });
  } catch (error) {
    // Infrastructure/Unexpected failures
    console.error("Infrastructure failure in Judge Service:", error);
    res.status(500).json({
      error: error?.message || error?.toString() || "Infrastructure execution error occurred",
    });
  }
});

const PORT = process.env.PORT || 5010;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
