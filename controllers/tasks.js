const User = require("../models/user.js");
const Task = require("../models/task.js");
const Board = require("../models/board.js");




// Show Page
const show = async (req, res) => {
  let user = await User.findOne({ email: req.session.user.email });
  

  const boardId = req.params.boardId
  const boardCollection = await Board.find({ owner: user._id });
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
  });

  const commentUsers = []
  for (const comment of currentTask.comments) {
    const user = await User.findById(comment.user);
    commentUsers.push(user);
  };


  res.render("tasks/index.ejs", {
    boardCollection,
    board,
    taskCollection,
    currentTask,
    currentPage: board.title,
    pageIcon: board.icon,
    pageTitle: `${currentTask.title} - ${board.title} - Flogrid`,
    currentUser: user,
    commentUsers,
  });
}





// Form to create a new Task
const showNewForm = async (req, res) => {
  let user = await User.findOne({ email: req.session.user.email });

  const boardId = req.params.boardId
  const boardCollection = await Board.find({ owner: user._id });
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
    pageTitle: `New Task - ${board.title} - Flogrid`,
    currentUser: user,
   });
}






// Create a new Task
const create = async (req, res) => {
  let user = await User.findOne({ email: req.session.user.email });
  req.body.board = req.params.boardId;

  const board = await Board.findById(req.params.boardId); // Get the board by ID
  board.progressCounter += 1; // Increment in-progress by 1

  const section = board.section.find(sec => sec.title.replaceAll(" ", "") === req.body.section); // Get the section (on the board) that the task belongs to
  section.size += 1; // Increment the section's size by 1

  await board.save(); // Save all changes to the board

  const newTask = await Task.create(req.body);
  res.redirect(`/kanban/${req.params.boardId}`)
}



const comment = async (req, res) => {
  let user = await User.findOne({ email: req.session.user.email });
  const comment = { message: req.body.message, user: user._id }

  const updatedTask = await Task.findByIdAndUpdate(req.params.taskId, 
    { $push: { comments: comment } }, // Push to add a new comment array element
    { new: true } // Tells mongoose it's a new entry
  );
  console.log("New Comment:", updatedTask)
  res.redirect(`/kanban/${req.params.boardId}/${req.params.taskId}`)
}



// Update/Save Task Changes
const update = async (req, res) => {
  let user = await User.findOne({ email: req.session.user.email });
  req.body.board = req.params.boardId;
  
  const prevTask = await Task.findById(req.params.taskId);
  const board = await Board.findById(req.params.boardId);

  // Dealing with the task state changes
  const newState = req.body.isCompleted === "on";
  if (newState !== prevTask.isCompleted) {
    req.body.isCompleted = newState;

    if (newState) {
      board.progressCounter--; // task marked completed
    } else {
      board.progressCounter++; // task marked incomplete
    }
  } else {
    req.body.isCompleted = prevTask.isCompleted;
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
  

  const section = board.section.find(sec => sec.title.replaceAll(" ", "") === prevTask.section); // Get the section (on the board) that the task belongs to
  if (!prevTask.isCompleted) {
    board.progressCounter -= 1; // Increment in-progress by 1
  }
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
  comment,
  update,
  del,
}