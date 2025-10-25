const mongoose = require("mongoose");


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
    boardId: [String],
    name: String,
  }],
  createdAt: Date,
})

const User = mongoose.model("User", userSchema);

module.exports = User;