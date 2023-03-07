const mongoose = require("mongoose");
const Task = require("../models/Task");
const User = require("../models/User");
const { sendResponse, AppError } = require("../helpers/utils");
const _ = require("lodash");
const taskController = {};

// Create a task
taskController.createTask = async (req, res, next) => {
  try {
    const { name, description, status } = req.body;
    const allowedStatus = ["pending", "working", "review", "done", "archive"];
    // request validation
    if (_.isEmpty(name) || _.isEmpty(description))
      throw new AppError(400, "Bad request");

    if (!_.includes(allowedStatus, status))
      throw new AppError(400, "Bad request");
    // request processing
    const newTask = await Task.create({
      name: name,
      description: description,
      status: status,
      isDeleted: false,
    });
    // sending response
    sendResponse(res, 200, true, { newTask }, null, "Create Task Success");
  } catch (error) {
    next(error);
  }
};

// Get a task by ID
taskController.getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    // request validation
    if (!mongoose.isValidObjectId(id)) throw new AppError(400, "Bad request");
    // request processing
    const task = await Task.findOne({ _id: id, isDeleted: false }).populate(
      "assignee"
    );
    // sending response
    sendResponse(res, 200, true, { task }, null, "Get a task successfully!");
  } catch (error) {
    next(error);
  }
};

// Soft delete a task
taskController.deleteTaskById = async (req, res, next) => {
  try {
    // request validation
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) throw new AppError(400, "Bad request");
    // request processing
    const deletedTask = await Task.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
    sendResponse(res, 200, true, { deletedTask }, null, "Delete Task Success");
  } catch (error) {
    next(error);
  }
};

// Update task by Id
taskController.updateTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;
    const allowedStatus = ["pending", "working", "review", "done", "archive"];
    // request validation
    if (_.isEmpty(name) || _.isEmpty(description))
      throw new AppError(400, "Bad request");

    if (!_.includes(allowedStatus, status))
      throw new AppError(400, "Bad request");

    if (!mongoose.isValidObjectId(id)) throw new AppError(400, "Bad request");

    // request processing

    const updatedTask = await Task.findById(id);
    if (!updatedTask) throw new AppError(400, "Bad request");
    const currentStatus = updatedTask.status;
    updatedTask.status =
      currentStatus !== "done"
        ? status
        : status === "archive"
        ? "archive"
        : "done";
    updatedTask.name = name;
    updatedTask.description = description;
    updatedTask.save();
    // sending response
    sendResponse(res, 200, true, { updatedTask }, null, "Update Task Success");
  } catch (error) {
    next(error);
  }
};

// Get a list of tasks
taskController.getTasks = async (req, res, next) => {
  try {
    // request validation
    const allowedFilters = ["name", "description", "status"];
    const allowedSortBy = ["createdAt", "updatedAt"];
    const allowedSortOrder = [
      "asc",
      "desc",
      "ascending",
      "descending",
      "1",
      "-1",
    ];

    let filter = _.pick(req.query, allowedFilters);
    filter = _(filter).omitBy(_.isEmpty).value();
    let sortBy = _.includes(allowedSortBy, req.query.sortBy)
      ? req.query.sortBy
      : "createdAt";
    let sortOrder = _.includes(allowedSortOrder, req.query.sortOrder)
      ? req.query.sortOrder
      : "ascending";
    filter.isDeleted = "false";
    // request processing
    let listOfTasks = await Task.find(filter).sort([[sortBy, sortOrder]]);
    // sending response
    sendResponse(
      res,
      200,
      true,
      { listOfTasks },
      null,
      "Get list of tasks successfully"
    );
  } catch (error) {
    next(error);
  }
};

// Assign a task to a user
taskController.assignTaskToUser = async (req, res, next) => {
  try {
    // request validation
    const taskId = req.params.id;
    const userId = req.body.userId;
    const type = req.body.type;
    const allowedType = ["Assign", "Unassign"];

    if (
      !mongoose.isValidObjectId(userId) ||
      !mongoose.isValidObjectId(taskId) ||
      !_.includes(allowedType, type)
    )
      throw new AppError(400, "Bad request");

    const newAssignee = await User.exists({ _id: userId, isDeleted: false });
    if (!newAssignee) throw new AppError(400, "Bad request");

    // request processing

    if (type === "Assign") {
      // If type is assign, assign input user to task
      const chosenTask = await Task.findById(taskId, { isDeleted: false });
      if (!chosenTask) throw new AppError(400, "Bad request");
      currentAssigneeId = chosenTask.assignee;
      if (currentAssigneeId) {
        await User.findByIdAndUpdate(currentAssigneeId, {
          $pull: { assignedTasks: taskId },
        });
      }

      await User.findByIdAndUpdate(userId, {
        $addToSet: { assignedTasks: taskId },
      });

      chosenTask.assignee = userId;
      chosenTask.save();

      sendResponse(
        res,
        200,
        true,
        chosenTask,
        null,
        "Assign Task Successfully"
      );
    } else {
      const chosenTask = await Task.findById(taskId);
      currentAssigneeId = chosenTask.assignee;
      if (currentAssigneeId) {
        await User.findByIdAndUpdate(currentAssigneeId, {
          $pull: { assignedTasks: taskId },
        });
        chosenTask.assignee = null;
        chosenTask.save();
      }
      sendResponse(
        res,
        200,
        true,
        chosenTask,
        null,
        "Unassign Task Successfully"
      );
    }
  } catch (error) {
    next(error);
  }
};

module.exports = taskController;
