import Problem from "../models/problem.model.js";
import Submission from "../models/submission.model.js";
import storage from "../config/storage.js";
import axios from "axios";
import { AppError } from "../utils/errors.js";

export const runSolution = async ({ problemId, code, language }) => {
  // Validate that all required fields are present
  if (!problemId || !code || !language) {
    throw new AppError("One or more fields are missing while submitting solution", 400);
  }

  // Fetch the problem from the database
  const problem = await Problem.findById(problemId);
  console.log(problem);

  // Validate that the problem exists
  if (!problem) {
    throw new AppError("Problem not found while submitting solution", 400);
  }

  // Get the test cases for the problem (basic test cases)
  const testCases = problem.testCases;
  const response = [];

  for (const testCase of testCases) {
    const input = testCase.input;
    const expectedOutput = testCase.expectedOutput;

    const response_data = await axios.post(
      process.env.JUDGE_SERVICE_URL + `/run`,
      {
        code,
        language,
        input,
      },
      {
        headers: {
          "x-judge-service-secret": process.env.JUDGE_SERVICE_SECRET,
        },
      }
    );

    const result = response_data.data;
    let actualOutput = "";
    let passed = false;

    if (result.status === "compile_error") {
      actualOutput = result.compileOutput || "Compile Error";
    } else if (result.status === "time_limit_exceeded") {
      actualOutput = "Time Limit Exceeded";
    } else if (result.status === "memory_limit_exceeded") {
      actualOutput = "Memory Limit Exceeded";
    } else if (result.status === "runtime_error") {
      actualOutput = result.stderr || "Runtime Error";
    } else {
      actualOutput = result.stdout || "";
      passed = actualOutput.trim() === expectedOutput.trim();
    }

    response.push({
      input,
      output: actualOutput,
      expectedOutput,
      passed,
    });
  }

  return { response };
};

export const submitSolution = async ({ userId, problemId, code, language }) => {
  if (!problemId || !code || !language) {
    throw new AppError("One or more fields are missing while submitting solution", 400);
  }

  const problem = await Problem.findById(problemId);

  if (!problem) {
    throw new AppError("Problem not found while submitting solution", 400);
  }

  const testCases = await storage.listTestCases(problemId); // List all test cases for the problem
  const results = [];
  let allPassed = true;
  let finalStatus = "accepted";
  let maxTime = 0;
  let maxMemory = 0;
  let finalExitCode = 0;
  let finalCompileOutput = "";
  let finalStderr = "";

  for (const tc of testCases) {
    const inputContent = await storage.getInputContent(problemId, tc.input);
    const expectedOutputContent = await storage.getOutputContent(
      problemId,
      tc.output,
    );

    try {
      const response_data = await axios.post(
        process.env.JUDGE_SERVICE_URL + `/run`,
        {
          code,
          language,
          input: inputContent,
        },
        {
          headers: {
            "x-judge-service-secret": process.env.JUDGE_SERVICE_SECRET,
          },
        }
      );

      const result = response_data.data;
      if (!result || typeof result.status !== "string") {
        console.error("Unexpected response from code runner:", result);
        throw new AppError("Code runner did not return valid output.", 500);
      }

      if (typeof result.executionTime === "number" && result.executionTime > maxTime) {
        maxTime = result.executionTime;
      }
      if (typeof result.memoryUsage === "number" && result.memoryUsage > maxMemory) {
        maxMemory = result.memoryUsage;
      }

      let actualOutput = "";
      let passed = false;

      if (result.status === "compile_error") {
        actualOutput = result.compileOutput || "Compile Error";
        finalStatus = "compile_error";
        finalExitCode = typeof result.exitCode === "number" ? result.exitCode : 111;
        finalCompileOutput = result.compileOutput || "";
      } else if (result.status === "time_limit_exceeded") {
        actualOutput = "Time Limit Exceeded";
        finalStatus = "time_limit_exceeded";
        finalExitCode = typeof result.exitCode === "number" ? result.exitCode : 124;
        finalStderr = result.stderr || "Time Limit Exceeded";
      } else if (result.status === "memory_limit_exceeded") {
        actualOutput = "Memory Limit Exceeded";
        finalStatus = "memory_limit_exceeded";
        finalExitCode = typeof result.exitCode === "number" ? result.exitCode : 137;
        finalStderr = result.stderr || "Memory Limit Exceeded";
      } else if (result.status === "runtime_error") {
        actualOutput = result.stderr || "Runtime Error";
        finalStatus = "runtime_error";
        finalExitCode = typeof result.exitCode === "number" ? result.exitCode : 0;
        finalStderr = result.stderr || "";
      } else {
        actualOutput = result.stdout || "";
        passed = actualOutput.trim() === expectedOutputContent.trim();
        if (!passed) {
          finalStatus = "wrong_answer";
          finalExitCode = typeof result.exitCode === "number" ? result.exitCode : 0;
          finalStderr = result.stderr || "";
        }
      }

      // Store the result for this test case
      results.push({
        input: inputContent,
        output: actualOutput,
        expectedOutput: expectedOutputContent.trim(),
        passed,
      });

      if (!passed || finalStatus !== "accepted") {
        allPassed = false;
        break; // Stop further testing if one test case fails
      }
    } catch (error) {
      console.error(
        `Error running solution for problem ${problemId}:`,
        error.message,
      );
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("An error occurred while running your solution.", 500);
    }
  }

  const submission = await Submission.create({
    user: userId,
    problem: problemId,
    code: code,
    language: language,
    status: finalStatus,
    executionTime: maxTime,
    memoryUsage: maxMemory,
    exitCode: finalExitCode,
    compileOutput: finalCompileOutput,
    stderr: finalStderr,
  });

  return {
    status: finalStatus,
    results,
    submissionId: submission._id,
    executionTime: maxTime,
    memoryUsage: maxMemory,
  };
};

export const getSubmissions = async (problemId) => {
  if (!problemId) {
    throw new AppError("Problem not found", 400);
  }

  const submissions = await Submission.find({ problem: problemId });
  return { submissions };
};
