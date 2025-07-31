import mongoose from "mongoose";

const problemSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},

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
	},
	{
		timestamps: true,
	}
);

const Problem = mongoose.model("Problem", problemSchema);
export default Problem;
