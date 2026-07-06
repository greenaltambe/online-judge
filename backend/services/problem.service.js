import Problem from "../models/problem.model.js";
import Submission from "../models/submission.model.js";
import storage from "../config/storage.js";
import { AppError } from "../utils/errors.js";

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

export const getAllProblems = async () => {
  const problems = await Problem.find();
  return { problems };
};

export const getProblemById = async (id, userId) => {
  const problem = await Problem.findById(id);
  if (!problem) {
    throw new AppError("Problem not found", 400);
  }

  const lastSubmission = await Submission.findOne({
    user: userId,
    problem: problem.id,
  }).sort({ createdAt: -1 });

  return { problem, lastSubmission };
};

export const createProblem = async ({ title, description, difficulty, testCases, files }) => {
  if (!title) {
    throw new AppError("Please add a title field", 400);
  }
  if (!description) {
    throw new AppError("Please add a description field", 400);
  }
  if (!difficulty) {
    throw new AppError("Please add a difficulty field", 400);
  }
  if (!testCases) {
    throw new AppError("Please add test cases", 400);
  }

  let parsedTestCases;
  try {
    parsedTestCases = typeof testCases === "string" ? JSON.parse(testCases) : testCases;
  } catch (error) {
    throw new AppError("Invalid test cases format", 400);
  }

  const inputs = files?.inputs || [];
  const outputs = files?.outputs || [];

  // Validate that there is at least one input and output file, and that they match in number
  if (inputs.length === 0 || outputs.length === 0) {
    throw new AppError("Please upload both input and output test files", 400);
  }

  if (inputs.length !== outputs.length) {
    throw new AppError("Mismatched input/output submission test files", 400);
  }

  // map input 1 with output 1, input 2 with output 2, etc. based on the naming convention
  const testPairs = getTestPairs(inputs, outputs);
  if (testPairs.length !== inputs.length) {
    throw new AppError("Mismatched number of test pairs", 400);
  }

  console.log(`New problem added: ${title} [${difficulty}]`);

  const problem = await Problem.create({
    title,
    description,
    difficulty,
    testCases: parsedTestCases,
  });

  for (const pair of testPairs) {
    console.log(pair);
    await storage.uploadTestCase(problem._id, pair.input, pair.output, pair.id);
    console.log("Uploaded testcase", pair.id);
  }

  console.log(problem);
  return { problem };
};

export const updateProblem = async (id, updateData) => {
  const problem = await Problem.findById(id);

  if (!problem) {
    throw new AppError("Problem not found", 400);
  }

  const updatedProblem = await Problem.findByIdAndUpdate(
    id,
    updateData,
    {
      new: true,
    },
  );

  return { problem: updatedProblem };
};

export const deleteProblem = async (id) => {
  const problem = await Problem.findById(id);

  if (!problem) {
    throw new AppError("Problem not found", 400);
  }

  await problem.deleteOne(); // This deletes the problem from the database

  // Delete the test cases from storage
  await storage.deleteTestCases(problem._id); // This deletes the test cases from the storage
  return { message: "Problem removed" };
};
