import mongoose from "mongoose";

const reviewProgressSchema = mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userList: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserList",
      required: true,
    },
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    easeFactor: {
      type: Number,
      default: 2.5,
    },
    repetitions: {
      type: Number,
      default: 0,
    },
    interval: {
      type: Number,
      default: 0, // in days
    },
    nextReviewDate: {
      type: Date,
      default: Date.now,
    },
    lastReviewDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index for uniqueness guarantees
reviewProgressSchema.index({ owner: 1, userList: 1, problem: 1 }, { unique: true });

const ReviewProgress = mongoose.model("ReviewProgress", reviewProgressSchema);
export default ReviewProgress;
