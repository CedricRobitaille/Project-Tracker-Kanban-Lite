const mongoose = require("mongoose");


const taskSchema = new mongoose.Schema({
  boardId: String,
  columnNum: String,
  order: Number,
  title: String,
  description: String,
  subtasks: [{
    createdBy: String,
    description: String,
    isCompleted: Boolean,
  }],
  attachments: [String],
  comments: [{
    createdBy: String,
    value: String,
  }],
  createdBy: String,
  CreatedAt: Date,
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;