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
const session = require('express-session');
const MongoStore = require("connect-mongo");
const isSignedIn = require("./middleware/is-signed-in.js");
const passUserToView = require("./middleware/pass-user-to-view.js");


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
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);
// This middleware ensures that every route will:
// - All templates will have access to `user` session
// - No need to `req.session.user` at every route
app.use(passUserToView);


// Boards Controller
const authCtrl = require("./controllers/auth.js")
const boardsCtrl = require("./controllers/boards.js")
const tasksCtrl = require("./controllers/tasks.js")


// ======================
// Routing and Navigation
// ======================

// Board Views
app.get('/kanban', isSignedIn, boardsCtrl.index); // [SHOW] Board overview
app.get('/kanban/new', isSignedIn, boardsCtrl.showNewForm); // [FORM] New inner board form
app.get('/kanban/:boardId', isSignedIn, boardsCtrl.show); // [SHOW] Board inner
app.post('/kanban', isSignedIn, boardsCtrl.create); // [POST] Create a new board
app.get('/kanban/:boardId/edit', isSignedIn, boardsCtrl.edit); // [FORM] Edit existing board
app.put('/kanban/:boardId', isSignedIn, boardsCtrl.update); // [PUT] Edit existing board
app.delete('/kanban/:boardId', isSignedIn, boardsCtrl.del); // [DEL] Delete existing board



// Task Views
app.get('/kanban/:boardId/new', isSignedIn, tasksCtrl.showNewForm); // [FORM] New Task Form
app.get('/kanban/:boardId/:taskId', isSignedIn, tasksCtrl.show); // [SHOW] Task Overview
app.post('/kanban/:boardId/', isSignedIn, tasksCtrl.create); // [POST] Create a new Task
app.post('/kanban/:boardId/:taskId/comment', isSignedIn, tasksCtrl.comment); // [POST] Create a new Task
app.put('/kanban/:boardId/:taskId', isSignedIn, tasksCtrl.update); // [PUT] Edit a Task (Clicks Save)
app.delete('/kanban/:boardId/:taskId', isSignedIn, tasksCtrl.del); // [DEL] Delete a Task



// Auth
app.get('/', authCtrl.index); // Landing Page
app.get('/join', authCtrl.showNewForm); // Sign Up Page
app.get('/login', authCtrl.showSigninForm); // Sign In Page
app.get('/logout', authCtrl.logout);
app.post('/login', authCtrl.login);
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