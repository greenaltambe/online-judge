// @desc    Get all problems
// @route   GET /api/problems
// @access  Private
const getProblems = (req, res) => {
	res.status(200).json({ message: "All problems" });
};

// @desc    Get single problem
// @route   GET /api/problems/:id
// @access  Private
const getProblem = (req, res) => {
	res.status(200).json({ message: `Get problem ${req.params.id}` });
};

// @desc    Set problem
// @route   POST /api/problems
// @access  Private
const setProblem = (req, res) => {
	res.status(200).json({ message: "Set problem" });
};

// @desc    Update problem
// @route   PUT /api/problems/:id
// @access  Private
const updateProblem = (req, res) => {
	res.status(200).json({ message: `Update problem ${req.params.id}` });
};

// @desc    Delete problem
// @route   DELETE /api/problems/:id
// @access  Private
const deleteProblem = (req, res) => {
	res.status(200).json({ message: `Delete problem ${req.params.id}` });
};

export { getProblems, getProblem, setProblem, updateProblem, deleteProblem };
