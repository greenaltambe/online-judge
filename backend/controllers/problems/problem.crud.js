import asyncHandler from "express-async-handler";
import Problem from "../../models/problem.model.js";
import Submission from "../../models/submission.model.js";
import storage from "../../config/storage.js";

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

  // Match input and output files based on their naming convention
  for (const input of inputs) {
    const match = input.originalname.match(/input_(\d+)/); // Extract the number from the input file name
    if (!match) continue;

    const id = match[1];
    const output = outputs.find((o) => o.originalname === `output_${id}.txt`); // Find the corresponding output file

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

  let parsedTestCases;
  try {
    parsedTestCases = JSON.parse(req.body.testCases);
  } catch (error) {
    res.status(400);
    throw new Error("Invalid test cases format");
  }

  const inputs = req.files.inputs || [];
  const outputs = req.files.outputs || [];

  // Validate that there is at least one input and output file, and that they match in number
  if (inputs.length === 0 || outputs.length === 0) {
    return res
      .status(400)
      .json({ message: "Please upload both input and output test files" });
  }

  if (inputs.length !== outputs.length) {
    return res
      .status(400)
      .json({ message: "Mismatched input/output submission test files" });
  }

  // map input 1 with output 1, input 2 with output 2, etc. based on the naming convention
  const testPairs = getTestPairs(inputs, outputs);
  if (testPairs.length !== inputs.length) {
    return res.status(400).json({
      message: "Mismatched number of test pairs",
    });
  }

  console.log(`New problem added: ${req.body.title} [${req.body.difficulty}]`);

  const problem = await Problem.create({
    title: req.body.title,
    description: req.body.description,
    difficulty: req.body.difficulty,
    testCases: parsedTestCases,
  });

  for (const pair of testPairs) {
    console.log(pair);

    await storage.uploadTestCase(problem._id, pair.input, pair.output, pair.id);

    console.log("Uploaded testcase", pair.id);
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
    },
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

  await problem.deleteOne(); // This delete the problem from the database

  // Delete the test cases from storage
  await storage.deleteTestCases(problem._id); // This deletes the test cases from the storage
  res.status(200).json({ message: "Problem removed" });
});

export { getProblems, getProblem, setProblem, updateProblem, deleteProblem };
