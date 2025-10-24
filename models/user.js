const mongoose = require("mongoose");
const boardSchema = require("");

const userSchema = new mongoose.Schema({
  name: String,
  passwordHash: String,
  email: {
    type: String,
    unique: true,
    index: true
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  boards: [{
    boardId: [boardSchema],
    name: String,
  }],
  createdAt: Date,
})

const User = mongoose.model("User", userSchema);

module.exports = User;