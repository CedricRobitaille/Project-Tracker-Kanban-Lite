const User = require("../models/user.js");
const Task = require("../models/task.js");
const Board = require("../models/board.js");

// Show Page
const show = async (req, res) => {
  res.send("Task Show Page");
}

// Form to create a new Task
const showNewForm = async (req, res) => {
  res.send("Task Edit Form");
}

// Create a new Task
const create = async (req, res) => {
  res.send("Redirect to /kanban/:boardId/taskId")
}

// Update/Save Task Changes
const update = async (req, res) => {
  res.send("Redirect to /kanban/:boardId/taskId");
}

// Delete a Task
const del = async (req, res) => {
  res.send("Redirect to /kanban/:boardId/")
}



module.exports = {
  show,
  showNewForm,
  create,
  update,
  del,
}