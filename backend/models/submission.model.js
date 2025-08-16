import mongoose from "mongoose";

const submissionSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

		problem: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Problem",
			required: true,
		},

		code: {
			type: String,
			required: true,
		},

		language: {
			type: String,
			required: true,
		},

		status: {
			type: String,
			required: true,
			enum: ["pending", "accepted", "rejected"],
			default: "pending",
		},
	},
	{
		timestamps: true,
	}
);

const Submission = mongoose.model("Submission", submissionSchema);
export default Submission;
