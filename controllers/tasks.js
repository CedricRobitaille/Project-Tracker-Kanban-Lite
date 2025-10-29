const User = require("../models/user.js");
const Task = require("../models/task.js");
const Board = require("../models/board.js");




// Show Page
const show = async (req, res) => {
  const boardId = req.params.boardId
  const boardCollection = await Board.find();
  const board = await Board.findById(boardId);

  const currentTask = await Task.findById(req.params.taskId)
  const taskCollection = [];
  const tasksFound = await Task.find({ board: board._id });

  // Function to order the tasks into their parent collection
  board.section.forEach(section => {
    const orderedList = []
    tasksFound.forEach(task => {
      if (task.section === section.title.replace(" ", "")) {
        orderedList.push(task);
      }
    });
    taskCollection.push(orderedList)
  })

  res.render("tasks/index.ejs", {
    boardCollection,
    board,
    taskCollection,
    currentTask,
    currentPage: board.title,
    pageIcon: board.icon,
  });
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
      if (task.section === section.title.replace(" ", "")) {
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
    pageIcon: board.icon,
    section: req.query.section,
   });
}






// Create a new Task
const create = async (req, res) => {
  req.body.board = req.params.boardId;

  const board = await Board.findById(req.params.boardId); // Get the board by ID
  board.progressCounter += 1; // Increment in-progress by 1

  const section = board.section.find(sec => sec.title.replaceAll(" ", "") === req.body.section); // Get the section (on the board) that the task belongs to
  section.size += 1; // Increment the section's size by 1

  await board.save(); // Save all changes to the board

  const newTask = await Task.create(req.body);
  res.redirect(`/kanban/${req.params.boardId}`)
}






// Update/Save Task Changes
const update = async (req, res) => {
  req.body.board = req.params.boardId;
  
  const prevTask = await Task.findById(req.params.taskId);
  const board = await Board.findById(req.params.boardId);

  // INCREMEMENT PROGRESS COUNTER ON COMPLETE
  if (typeof req.body.isCompleted !== "undefined") { // On do this when a there's a change
    if (req.body.isCompleted !== prevTask.isCompleted) {
      if (isCompleted === true) {
        board.progressCounter--;
      } else {
        board.progressCounter++;
      }
    }
  }

  // CHANGE BOARD SECTION SIZE ON SECTION CHANGE
  if (typeof req.body.section !== "undefined") {
    if (req.body.section !== prevTask.section) {
      const newSection = board.section.find(sec => sec.title.replaceAll(" ", "") === req.body.section);
      const oldSection = board.section.find(sec => sec.title.replaceAll(" ", "") === prevTask.section);
      newSection.size++;
      oldSection.size--;
    }
  }

  await board.save();

  const updatedTask = await Task.findByIdAndUpdate(req.params.taskId, req.body);
  res.redirect(`/kanban/${req.params.boardId}`);
}





// Delete a Task
const del = async (req, res) => {
  const prevTask = await Task.findById(req.params.taskId);
  const board = await Board.findById(req.params.boardId); // Get the board by ID
  board.progressCounter -= 1; // Increment in-progress by 1

  const section = board.section.find(sec => sec.title.replaceAll(" ", "") === prevTask.section); // Get the section (on the board) that the task belongs to
  section.size -= 1; // Increment the section's size by 1

  await board.save(); // Save all changes to the board


  const deletedTask = await Task.findByIdAndDelete(req.params.taskId);
  console.log("Removed Board:", deletedTask)
  res.redirect(`/kanban/${req.params.boardId}`);
}



module.exports = {
  show,
  showNewForm,
  create,
  update,
  del,
}