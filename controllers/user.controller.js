const mongoose = require("mongoose");
const User = require("../models/User");
const { sendResponse, AppError } = require("../helpers/utils");
const _ = require("lodash");
const userController = {};

// Create a User
userController.createUser = async (req, res, next) => {
  try {
    const info = req.body;
    const allowedRoles = ["employee", "manager"];
    // request validation
    if (_.isEmpty(info.name)) throw new AppError(400, "Bad request");
    if (!_.includes(allowedRoles, info.role))
      throw new AppError(400, "Bad request");
    // request processing
    const newUser = await User.create(info);
    // sending response
    sendResponse(res, 200, true, { newUser }, null, "Create User Success");
  } catch (error) {
    next(error);
  }
};

// Soft delete a User by id
userController.deleteUserById = async (req, res, next) => {
  try {
    // request validation
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) throw new AppError(400, "Bad request");
    // request processing
    const deletedUser = await User.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
    sendResponse(res, 200, true, { deletedUser }, null, "Delete User Success");
  } catch (error) {
    next(error);
  }
};

// Get a list of Users
userController.getUsers = async (req, res, next) => {
  try {
    // request validation
    const allowedFilters = ["name", "role"];
    let filter = _.pick(req.query, allowedFilters);
    filter.isDeleted = "false";
    // request processing
    const listOfUsers = await User.find(filter);
    // sending response
    sendResponse(
      res,
      200,
      true,
      { listOfUsers },
      null,
      "Get list of users successfully"
    );
  } catch (error) {
    next(error);
  }
};

// Get a user by ID
userController.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    // request validation
    if (!mongoose.isValidObjectId(id)) throw new AppError(400, "Bad request");
    // request processing
    const user = await User.findOne({ _id: id, isDeleted: false });
    // sending response
    sendResponse(res, 200, true, { user }, null, "Get a user successfully!");
  } catch (error) {
    next(error);
  }
};

// Get list of tasks assigned to User
userController.getTasksByUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    // request validation
    if (!mongoose.isValidObjectId(id)) throw new AppError(400, "Bad request");
    // request processing
    let listOfTasks = await User.findOne({ _id: id, isDeleted: false })
      .populate("assignedTasks")
      .select("assignedTasks");

    if (!listOfTasks) listOfTasks = { assignedTasks: [] };
    // send responses
    sendResponse(
      res,
      200,
      true,
      listOfTasks,
      null,
      "Get list of tasks from a user successfully!"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = userController;
