const User = require("../models/user.js");
const Task = require("../models/task.js");
const Board = require("../models/board.js");

// Show Page
const show = async (req, res) => {
  const task = ""
  const board = ""
  res.render("tasks/index.ejs", { task, board });
}

// Form to create a new Task
const showNewForm = async (req, res) => {
  const boardId = req.params.boardId
  const boardCollection = await Board.find();
  const board = await Board.findById(boardId);

  const taskCollection = [];
  const tasksFound = await Task.find({ board: board._id });

  // Function to order the tasks into their parent collection
  board.section.forEach(section => {
    const orderedList = []
    tasksFound.forEach(task => {
      if (task.title === section.title) {
        orderedList.push(task);
      }
    });
    taskCollection.push(orderedList)
  })

  res.render("tasks/new.ejs", { 
    boardCollection,
    board,
    taskCollection,
    currentPage: board.title,
    pageIcon: board.icon
   });
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