const mongoose = require("mongoose");
const userSchema = require("/models/user");
const taskSchema = require("/models/task");

const boardSchema = new mongoose.Schema({
  title: String,
  ownerId: String,
  members: [{ 
    userId: String,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  }],
  columns: [{
    title: String,
    order: Number,
  }],
  tasks: [{
    taskId: String,
    title: String,
    order: Number,
  }],
  createdAt: Date,
})

const Board = mongoose.model("Board", boardSchema);

module.exports = Board;