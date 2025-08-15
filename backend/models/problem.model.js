import mongoose from "mongoose";

const problemSchema = mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		difficulty: {
			type: String,
			required: true,
			enum: ["easy", "medium", "hard"],
		},
		testCases: [
			{
				input: {
					type: String,
					required: true,
				},
				expectedOutput: {
					type: String,
					required: true,
				},
			},
		],
	},
	{
		timestamps: true,
	}
);

const Problem = mongoose.model("Problem", problemSchema);
export default Problem;
