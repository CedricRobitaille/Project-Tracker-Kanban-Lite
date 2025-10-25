const User = require("../models/user.js")
const Task = require("../models/task.js")
const Board = require("../models/board.js")

// Kanban Root
// GET
// /
const index = async (req, res) => {
  res.send("Board Home");
}

// Kanban Inner board
// GET
// /:boardId"
const show = async (req, res) => {
  res.send("Board Inner");
}

// Form to create a new board
// GET
// /new
const showNewForm = async (req, res) => {
  res.render("kanban/new.ejs")
}

// Form to edit an existing board
// GET
// /:boarId/edit
const edit = async (req, res) => {
  res.send("Edit Board Form")
}

// Create new board
// POST
// "/"
const create = async (req, res) => {
  const board = await Board.create(req.body);
  console.log(board);
  res.redirect("/kanban/:boardId");
}

// Edit board properties
// PUT
// "/:boardId"
const update = async (req, res) => {
  res.redirect("/kanban");
}

// Delete board
// DELETE
// "/:boardId"
const del = async (req, res) => {
  res.redirect("/kanban");
}



module.exports = {
  index,
  show,
  showNewForm,
  edit,
  create,
  update,
  del,
};
