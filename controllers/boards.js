const User = require("../models/user.js")
const Task = require("../models/task.js")
const Board = require("../models/board.js")
const fs = require("fs");

// Kanban Root
// GET
// /

const index = async (req, res) => {
  const boardCollection = await Board.find();
  res.render("kanban/index.ejs", { 
    boardCollection, 
    currentPage: "Dashboard",
    pageIcon: "/icons/24px-grey/grid.svg",
    icons: fs.readdirSync("public/icons/16px-grey"),
  });
}

// Kanban Inner board
// GET
// /:boardId"
const show = async (req, res) => {
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
  
  res.render(`kanban/show.ejs`, { 
    boardCollection,
    board,
    taskCollection,
    currentPage: board.title,
    pageIcon: board.icon,
  });
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
  const boardId = req.params.boardId;
  const board = await Board.findById(boardId);
  console.log(board)
  res.render("kanban/edit.ejs", { board })
}

// Create new board
// POST
// "/"
const create = async (req, res) => {
  const board = await Board.create(req.body);
  res.redirect(`/kanban/${board._id}`);
}

// Edit board properties
// PUT
// "/:boardId"
const update = async (req, res) => {
  const boardId = req.params.boardId;
  const board = await Board.findByIdAndUpdate(boardId, req.body)
  res.redirect("/kanban/");
}

// Delete board
// DELETE
// "/:boardId"
const del = async (req, res) => {
  const boardId = req.params.boardId;
  const board = await Board.findByIdAndDelete(boardId)
  res.redirect("/kanban/");
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
