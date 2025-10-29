const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  message: {
    type: String,
    trim: true,
  },
  time: {
    type: Date,
    default: Date.now,
  },
  likes: Number,
}, { _id: false });

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  board: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board",
  },
  section: {
    type: String,
    required: true,
    // Ref not needed since we already know the Board Schema
  },
  owner: {
    type: String,
    ref: "User",
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  comments: [commentSchema],
  startDate: Date,
  dueDate: Date,
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;