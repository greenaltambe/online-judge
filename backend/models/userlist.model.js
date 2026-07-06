import mongoose from "mongoose";

const userListSchema = mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    isPublic: {
      type: Boolean,
      default: false,
    },

    problems: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Problem",
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const UserList = mongoose.model("UserList", userListSchema);
export default UserList;
