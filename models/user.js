const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  nickName: {
    type: String,
    trim: true,
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
  profilePicture: String,
  jobTitle: String,
  phoneNumber: Number,
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;