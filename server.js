const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();

const mongoose = require("mongoose");
const methodOverride = require("method-override")
const morgan = require("morgan");
const path = require("path");

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB: ${mongoose.connection.name}.`);
})

app.use(express.urlencoded({ extended: false }))
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")))

// Boards Controller
const boardsCtrl = require("./controllers/boards.js")




// Homepage
app.get("/", (req, res) => {
  // Session Authentication here
  res.send("Landing Page");
})

// Board Views
// kanban -> Board overview
// kanban/new -> New inner board form
// kanban/:boardId -> Board inner
// kanban/:boardId/edit -> Board inner edit form
app.get('/kanban', boardsCtrl.index);
app.get('/kanban/new', boardsCtrl.showNewForm)
app.get('/kanban/:boardId', boardsCtrl.show);
app.post('/kanban', boardsCtrl.create);
app.get('/kanban/:boardId/edit', boardsCtrl.edit);
app.put('/kanban/:boardId', boardsCtrl.update);
app.delete('/kanban/:boardId', boardsCtrl.del)










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