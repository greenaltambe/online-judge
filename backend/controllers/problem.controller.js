import asyncHandler from "express-async-handler";
import Problem from "../models/problem.model.js";

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
	res.status(200).json({ problem });
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

	console.log(
		`New problem added: ${req.body.title} [${req.body.difficulty}]`
	);

	const problem = await Problem.create({
		title: req.body.title,
		description: req.body.description,
		difficulty: req.body.difficulty,
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

export { getProblems, getProblem, setProblem, updateProblem, deleteProblem };
