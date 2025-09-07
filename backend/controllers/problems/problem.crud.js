import asyncHandler from "express-async-handler";
import Problem from "../../models/problem.model.js";
import Submission from "../../models/submission.model.js";
import storage from "../../config/miniostorage.js";

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

function getTestPairs(inputs, outputs) {
	const pairs = [];

	for (const input of inputs) {
		const match = input.originalname.match(/input_(\d+)/);
		if (!match) continue;

		const id = match[1];
		const output = outputs.find(
			(o) => o.originalname === `output_${id}.txt`
		);

		if (output) {
			pairs.push({ input, output, id });
		}
	}

	return pairs;
}

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

	console.log("Step 1: starting problem creation");

	let parsedTestCases;
	console.log(JSON.parse(req.body.testCases));
	try {
		parsedTestCases = JSON.parse(req.body.testCases);
	} catch (error) {
		res.status(400);
		throw new Error("Invalid test cases format");
	}

	const inputs = req.files.inputs || [];
	const outputs = req.files.outputs || [];

	if (inputs.length !== outputs.length) {
		return res
			.status(400)
			.json({ message: "Mismatched input/output submission test files" });
	}

	const testPairs = getTestPairs(inputs, outputs);
	if (testPairs.length !== inputs.length) {
		return res.status(400).json({
			message: "Mismatched number of test pairs",
		});
	}

	console.log(
		`New problem added: ${req.body.title} [${req.body.difficulty}]`
	);

	const problem = await Problem.create({
		title: req.body.title,
		description: req.body.description,
		difficulty: req.body.difficulty,
		testCases: parsedTestCases,
	});

	for (const pair of testPairs) {
		await storage.uploadFile(problem._id, pair.input, "input", pair.id);
		await storage.uploadFile(problem._id, pair.output, "output", pair.id);
	}

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

export { getProblems, getProblem, setProblem, updateProblem, deleteProblem };
