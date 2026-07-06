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

    const output = response_data.data;

    // Check if there was an error in the output
    if (output.error) {
      response.push({
        input,
        output: output.error,
        expectedOutput,
        passed: false,
      });
      continue;
    }

    // Compare the output with the expected output
    if (output.output.trim() === expectedOutput.trim()) {
      response.push({
        input,
        output: output.output.trim(),
        expectedOutput,
        passed: true,
      });
    } else {
      response.push({
        input,
        output: output.output.trim(),
        expectedOutput,
        passed: false,
      });
    }
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

      const actualOutput = response_data.data?.output;
      if (typeof actualOutput !== "string") {
        console.error(
          "Unexpected response from code runner:",
          response_data.data,
        );
        throw new AppError("Code runner did not return valid output.", 500);
      }

      const normalizedOutput = actualOutput.trim();
      const passed = normalizedOutput === expectedOutputContent.trim(); // Compare the actual output with the expected output

      // Store the result for this test case
      results.push({
        input: inputContent,
        output: actualOutput,
        expectedOutput: expectedOutputContent.trim(),
        passed,
      });

      if (!passed) {
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
    status: allPassed ? "accepted" : "rejected",
  });

  return {
    status: allPassed ? "accepted" : "rejected",
    results,
    submissionId: submission._id,
  };
};

export const getSubmissions = async (problemId) => {
  if (!problemId) {
    throw new AppError("Problem not found", 400);
  }

  const submissions = await Submission.find({ problem: problemId });
  return { submissions };
};
