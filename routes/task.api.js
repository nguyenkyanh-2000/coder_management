const express = require("express");
const router = express.Router();
const {
  createTask,
  getTasks,
  deleteTaskById,
  assignTaskToUser,
  getTaskById,
  updateTaskById,
} = require("../controllers/task.controller");

/**
 * @route GET api/tasks
 * @description Get a list of tasks
 * @access public
 * @requiredQueries: name, role
 * @allowedQueries: status, sortBy (default: "createdAt"), sortOrder (default: "ascending")
 */
router.get("/api/tasks", getTasks);

/**
 * @route GET api/tasks/:id
 * @description Get task by id
 * @access public
 */
router.get("/api/tasks/:id", getTaskById);
/**
 * @route POST api/tasks/:id
 * @description Assign a user to task with :id
 * @access private, manager
 * @requiredBody: userId, type ("Assign" / "Unassign"),
 */
router.post("/api/tasks/:id", assignTaskToUser);

/**
 * @route POST api/tasks
 * @description Create a new task
 * @access private, manager
 * @requiredBody: name, description, status
 * @allowedStatus: pending, working, review, done, archieve
 */
router.post("/api/tasks", createTask);
/**
 * @route DELETE api/tasks/:id
 * @description Soft delete a task by id
 * @access private, manager
 */
router.delete("/api/tasks/:id", deleteTaskById);

/**
 * @route PUT api/tasks/:id
 * @description Update a task by id
 * @access private, manager
 * @requireBody: name, description, status
 * @allowedStatus: pending, working, review, done, archieve
 * @rules: "status" can only be "archieve" if it's currently "done"
 */

router.put("/api/tasks/:id", updateTaskById);

module.exports = router;
