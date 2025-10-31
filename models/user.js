const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  nickname: {
    type: String,
    trim: true,
    default: this.fullName
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  profilePicture: {
    type: String,
    default: "/uploads/default-pfp.jpg"
  },
  jobTitle: String,
  team: String,
  phoneNumber: Number,
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;