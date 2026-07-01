import asyncHandler from "express-async-handler";
import Problem from "../../models/problem.model.js";
import Submission from "../../models/submission.model.js";
import axios from "axios";

// @desc    Run solution
// @route   POST /api/problems/run
// @access  Private
const runSolution = asyncHandler(async (req, res) => {
  const { problemId, code, language } = req.body;

  // Validate that all required fields are present
  if (!problemId || !code || !language) {
    res.status(400);
    throw new Error("One or more fields are missing while submitting solution");
  }

  // Fetch the problem from the database
  const problem = await Problem.findById(problemId);
  console.log(problem);

  // Validate that the problem exists
  if (!problem) {
    res.status(400);
    throw new Error("Problem not found while submitting solution");
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
    );

    const output = response_data.data;

    let passed = true;

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
      passed = false;
    }
  }

  res.status(200).json({ response });
});

export { runSolution };
