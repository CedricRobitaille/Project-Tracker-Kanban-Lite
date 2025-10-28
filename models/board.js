const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  size: {
    type: Number,
    default: 0
  },
  color: {
    type: String,
    default: "#A681C2",
  },
});

const boardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  progressCounter: {
    type: Number,
    default: 0,
  },
  section: [sectionSchema], // Call to create a new Section
  color: String,
  icon: String,
}, { timestamps: true });

const Board = mongoose.model("Board", boardSchema);

module.exports = Board;