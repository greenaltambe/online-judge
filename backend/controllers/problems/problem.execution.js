import asyncHandler from "express-async-handler";
import Problem from "../../models/problem.model.js";
import Submission from "../../models/submission.model.js";
import axios from "axios";

// @desc    Run solution
// @route   POST /api/problems/run
// @access  Private
const runSolution = asyncHandler(async (req, res) => {
	const { problemId, code, language } = req.body;

	if (!problemId || !code || !language) {
		res.status(400);
		throw new Error(
			"One or more fields are missing while submitting solution"
		);
	}

	const problem = await Problem.findById(problemId);
	console.log(problem);

	if (!problem) {
		res.status(400);
		throw new Error("Problem not found while submitting solution");
	}

	const testCases = problem.testCases;

	const response = [];

	for (const testCase of testCases) {
		const input = testCase.input;
		const expectedOutput = testCase.expectedOutput;

		const response_data = await axios.post("http://localhost:5010/run", {
			code,
			language,
			input,
		});

		const output = response_data.data;

		let passed = true;

		if (output.error) {
			response.push({
				input,
				output: output.error,
				expectedOutput,
				passed: false,
			});
			continue;
		}
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

		const submission = await Submission.create({
			user: req.user._id,
			problem: problemId,
			code: code,
			language: language,
			status: passed ? "accepted" : "rejected",
		});

		console.log(submission);
	}

	res.status(200).json({ response });
});

export { runSolution };
