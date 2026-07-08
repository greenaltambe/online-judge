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
      enum: [
        "pending",
        "accepted",
        "rejected",
        "wrong_answer",
        "compile_error",
        "runtime_error",
        "time_limit_exceeded",
        "memory_limit_exceeded",
      ],
      default: "pending",
    },

    executionTime: {
      type: Number,
      default: 0,
    },

    memoryUsage: {
      type: Number,
      default: 0,
    },

    exitCode: {
      type: Number,
      default: 0,
    },

    compileOutput: {
      type: String,
      default: "",
    },

    stderr: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const Submission = mongoose.model("Submission", submissionSchema);
export default Submission;
