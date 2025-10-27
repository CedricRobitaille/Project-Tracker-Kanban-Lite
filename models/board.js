const mongoose = require("mongoose");


const boardSchema = new mongoose.Schema({
  title: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members: [{ 
    userId: String,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    ref: 'User'
  }],
  columns: [{
    title: String,
    order: Number,
  }],
  createdAt: Date,
})

const Board = mongoose.model("Board", boardSchema);

module.exports = Board;