const User = require("../models/user.js");
const Task = require("../models/task.js");
const Board = require("../models/board.js");

// Show Page
const show = async (req, res) => {
  res.send("Task Show Page");
}

const showNewForm = async (req, res) => {
  res.send("Task Edit Form");
}

const create = async (req, res) => {
  res.send("Redirect to /kanban/:boardId/taskId")
}

const update = async (req, res) => {
  res.send("Redirect to /kanban/:boardId/taskId");
}

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