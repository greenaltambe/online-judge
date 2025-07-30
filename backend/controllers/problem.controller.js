import asyncHandler from "express-async-handler";

// @desc    Get all problems
// @route   GET /api/problems
// @access  Private
const getProblems = asyncHandler((req, res) => {
	res.status(200).json({ message: "All problems" });
});

// @desc    Get single problem
// @route   GET /api/problems/:id
// @access  Private
const getProblem = asyncHandler((req, res) => {
	res.status(200).json({ message: `Get problem ${req.params.id}` });
});

// @desc    Set problem
// @route   POST /api/problems
// @access  Private
const setProblem = asyncHandler((req, res) => {
	if (!req.body.title) {
		res.status(400);
		throw new Error("Please add a title field");
	}

	res.status(200).json({ message: "Set problem" });
});

// @desc    Update problem
// @route   PUT /api/problems/:id
// @access  Private
const updateProblem = asyncHandler((req, res) => {
	res.status(200).json({ message: `Update problem ${req.params.id}` });
});

// @desc    Delete problem
// @route   DELETE /api/problems/:id
// @access  Private
const deleteProblem = asyncHandler((req, res) => {
	res.status(200).json({ message: `Delete problem ${req.params.id}` });
});

export { getProblems, getProblem, setProblem, updateProblem, deleteProblem };
