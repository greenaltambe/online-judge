import mongoose from "mongoose";

const userNoteSchema = mongoose.Schema(
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
    content: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index to guarantee one note per user-problem pair
userNoteSchema.index({ user: 1, problem: 1 }, { unique: true });

const UserNote = mongoose.model("UserNote", userNoteSchema);
export default UserNote;
