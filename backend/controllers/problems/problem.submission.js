import asyncHandler from "express-async-handler";
import Problem from "../../models/problem.model.js";
import Submission from "../../models/submission.model.js";
import axios from "axios";
import MinIOStorage from "../../storage/MinIOStorage.js";
const storage = new MinIOStorage("problems");

// @desc    Submit solution
// @route   POST /api/problems/submit
// @access  Private
const submitSolution = asyncHandler(async (req, res) => {
	const { problemId, code, language } = req.body;

	if (!problemId || !code || !language) {
		res.status(400);
		throw new Error(
			"One or more fields are missing while submitting solution"
		);
	}

	const problem = await Problem.findById(problemId);

	if (!problem) {
		res.status(400);
		throw new Error("Problem not found while submitting solution");
	}

	const testCases = await storage.listTestCases(problemId);
	const results = [];
	let allPassed = true;

	for (const tc of testCases) {
		const inputContent = await storage.getInputContent(problemId, tc.input);
		const expectedOutputContent = await storage.getOutputContent(
			problemId,
			tc.output
		);

		try {
			const response_data = await axios.post(
				"http://localhost:5010/run",
				{
					code,
					language,
					input: inputContent,
				}
			);

			const actualOutput = response_data.data.output.trim();
			const passed = actualOutput === expectedOutputContent.trim();

			results.push({
				input: inputContent,
				output: actualOutput,
				expectedOutput: expectedOutputContent.trim(),
				passed,
			});

			if (!passed) {
				allPassed = false;
				break;
			}
		} catch (error) {
			console.error(
				`Error running solution for problem ${problemId}:`,
				error.message
			);
			// Send a specific error response to the client
			res.status(500).json({
				message: "An error occurred while running your solution.",
				error: error.message,
				status: "error",
			});
			return;
		}
	}

	const submission = await Submission.create({
		user: req.user._id,
		problem: problemId,
		code: code,
		language: language,
		status: allPassed ? "accepted" : "rejected",
	});

	console.log(`Submission created:`, submission);

	res.status(200).json({
		status: allPassed ? "accepted" : "rejected",
		results,
		submissionId: submission._id,
	});
});

const getSubmissions = asyncHandler(async (req, res) => {
	const problemId = req.params.id;

	console.log(req.params.id);
	console.log(problemId);

	if (!problemId) {
		res.status(400);
		throw new Error("Problem not found");
	}

	const submissions = await Submission.find({ problem: problemId });
	res.status(200).json({ submissions });
});

export { submitSolution, getSubmissions };
