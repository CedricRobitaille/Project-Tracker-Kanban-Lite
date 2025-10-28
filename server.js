// Environment Variables
const dotenv = require("dotenv");
dotenv.config();

// Express Setup
const express = require("express");
const app = express();

// Server Dependancies
const mongoose = require("mongoose");
const methodOverride = require("method-override")
const morgan = require("morgan");
const path = require("path");


// Connection to the DB
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB: ${mongoose.connection.name}.`);
})

// Express Dependancies
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")))


// Boards Controller
const authCtrl = require("./controllers/auth.js")
const boardsCtrl = require("./controllers/boards.js")
const tasksCtrl = require("./controllers/tasks.js")


// ======================
// Routing and Navigation
// ======================

// Board Views
app.get('/kanban', boardsCtrl.index); // [SHOW] Board overview
app.get('/kanban/new', boardsCtrl.showNewForm); // [FORM] New inner board form
app.get('/kanban/:boardId', boardsCtrl.show); // [SHOW] Board inner
app.post('/kanban', boardsCtrl.create); // [POST] Create a new board
app.get('/kanban/:boardId/edit', boardsCtrl.edit); // [FORM] Edit existing board
app.put('/kanban/:boardId', boardsCtrl.update); // [PUT] Edit existing board
app.delete('/kanban/:boardId', boardsCtrl.del); // [DEL] Delete existing board



// Task Views
app.get('/kanban/:boardId/new', tasksCtrl.showNewForm); // [FORM] New Task Form
app.get('/kanban/:boardId/:taskId', tasksCtrl.show); // [SHOW] Task Overview
app.post('/kanban/:boardId/', tasksCtrl.create); // [POST] Create a new Task
app.put('/kanban/:boardId/:taskId', tasksCtrl.update); // [PUT] Edit a Task (Clicks Save)
app.delete('/kanban/:boardId/:taskId', tasksCtrl.del); // [DEL] Delete a Task



// Auth
app.get('/', authCtrl.index); // Landing Page
app.get('/join', authCtrl.showNewForm); // Sign Up Page
app.get('/login', authCtrl.showSigninForm); // Sign In Page
app.get('/:userId', authCtrl.show); // Account Page
app.post('/', authCtrl.create); // [POST] Creates user account
app.put('/:userId', authCtrl.update); // [PUT] Edits user details
app.delete('/:userId', authCtrl.del); // [DELETE] Removes user








// Define the port the app is listening on
const port = process.env.PORT;

// Port Error Handling
const handleServerError = (error) => {
  if (error.code = "EADDRINUSE") {  // Error code = Port in use
    console.log(`Warning! Port ${port} is already in use!`)
  } else {  // Unexpected Error
    console.log("Error:", error);
  }
}

// Express Listening
app.listen(port, () => {
  console.log(`Express is listening on port ${port}`);
}).on("error", handleServerError); // On error, error handling function