const express = require("express");
const router = express.Router();
const {
  createUser,
  getUsers,
  getUserById,
  deleteUserById,
  getTasksByUser,
} = require("../controllers/user.controller");

/**
 * @route GET api/users
 * @description Get a list of users
 * @access private
 * @allowedQueries: name, role
 */
router.get("/api/users", getUsers);

/**
 * @route GET api/users/:id
 * @description Get user by id
 * @access public
 */
router.get("/api/users/:id", getUserById);

/**
 * @route POST api/users
 * @description Create a new user
 * @access private, manager
 * @requiredBody: name
 */

router.post("/api/users", createUser);

/**
 * @route DELETE api/users/:id
 * @description Soft delete a user by id
 * @access private, manager
 */
router.delete("/api/users/:id", deleteUserById);

/**
 * @route GET api/users/:id/tasks
 * @description Get all tasks of a user
 * @access public
 */

router.get("/api/users/:id/tasks", getTasksByUser);

module.exports = router;
