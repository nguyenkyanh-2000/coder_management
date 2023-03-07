const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "working", "review", "done", "archive"],
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: "false",
    },
  },
  { timestamps: true, collection: "tasks", versionKey: false }
);

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
