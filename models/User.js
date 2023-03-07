const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["employee", "manager"],
      default: "employee",
    },
    assignedTasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    isDeleted: {
      type: Boolean,
      default: "false",
    },
  },
  { timestamps: false, collection: "users", versionKey: false }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
