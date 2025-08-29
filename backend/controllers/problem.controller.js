import asyncHandler from "express-async-handler";
import Problem from "../models/problem.model.js";
import Submission from "../models/submission.model.js";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import MinIOStorage from "../storage/MinIOStorage.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const storage = new MinIOStorage("problems");

// @desc    Get all problems
// @route   GET /api/problems
// @access  Private
const getProblems = asyncHandler(async (req, res) => {
	const problems = await Problem.find();
	res.status(200).json({ problems });
});

// @desc    Get single problem
// @route   GET /api/problems/:id
// @access  Private
const getProblem = asyncHandler(async (req, res) => {
	const problem = await Problem.findById(req.params.id);
	if (!problem) {
		res.status(400);
		throw new Error("Problem not found");
	}

	const lastSubmission = await Submission.findOne({
		user: req.user._id,
		problem: problem.id,
	}).sort({ createdAt: -1 });
	res.status(200).json({ problem, lastSubmission });
});

// @desc    Set problem
// @route   POST /api/problems
// @access  Private
const setProblem = asyncHandler(async (req, res) => {
	if (!req.body.title) {
		res.status(400);
		throw new Error("Please add a title field");
	}

	if (!req.body.description) {
		res.status(400);
		throw new Error("Please add a description field");
	}

	if (!req.body.difficulty) {
		res.status(400);
		throw new Error("Please add a difficulty field");
	}

	if (!req.body.testCases) {
		res.status(400);
		throw new Error("Please add test cases");
	}

	console.log(
		`New problem added: ${req.body.title} [${req.body.difficulty}]`
	);

	const problem = await Problem.create({
		title: req.body.title,
		description: req.body.description,
		difficulty: req.body.difficulty,
		testCases: req.body.testCases,
	});

	console.log(problem);
	res.status(201).json({ problem });
});

// @desc    Update problem
// @route   PUT /api/problems/:id
// @access  Private
const updateProblem = asyncHandler(async (req, res) => {
	const problem = await Problem.findById(req.params.id);

	if (!problem) {
		res.status(400);
		throw new Error("Problem not found");
	}

	const updatedProblem = await Problem.findByIdAndUpdate(
		req.params.id,
		req.body,
		{
			new: true,
		}
	);

	res.status(200).json({ problem: updatedProblem });
});

// @desc    Delete problem
// @route   DELETE /api/problems/:id
// @access  Private
const deleteProblem = asyncHandler(async (req, res) => {
	const problem = await Problem.findById(req.params.id);

	if (!problem) {
		res.status(400);
		throw new Error("Problem not found");
	}

	await problem.deleteOne();
	res.status(200).json({ message: "Problem removed" });
});

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

const streamToString = (stream) => {
	let data = "";
	return new Promise((resolve, reject) => {
		stream
			.setEncoding("utf8")
			.on("data", (chunk) => {
				data += chunk;
			})
			.on("error", reject)
			.on("end", () => resolve(data));
	});
};

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
			}
		} catch (error) {
			console.error(
				`Error running solution for problem ${problemId}:`,
				error
			);
			results.push({
				input: inputContent,
				output: `Error: ${error.message}`,
				expectedOutput: expectedOutputContent.trim(),
				passed: false,
			});
			allPassed = false;
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

export {
	getProblems,
	getProblem,
	setProblem,
	updateProblem,
	deleteProblem,
	runSolution,
	submitSolution,
	getSubmissions,
};
