const User = require("../models/user.js");
const Task = require("../models/task.js")
const Board = require("../models/board.js")

const bcrypt = require("bcrypt");


const index = async (req, res) => {
  res.render("index.ejs", {
    pageTitle: "Register - Flogrid"
  })
}

const showNewForm = async (req, res) => {
  res.render("auth/new.ejs", {
    pageTitle: "Register - Flogrid"
  })
}

const showSigninForm = async (req, res) => {
  res.render("auth/index.ejs", {
    pageTitle: "Log In - Flogrid"
  })
}

const show = async (req, res) => {
  res.send("User Account Page");
}

const create = async (req, res) => {

  const emailInDatabase = await User.findOne({ email: req.body.email });
  if (emailInDatabase) {
    return res.send("Email already in use.")
  }
  if (req.body.password !== req.body.passwordConfirm) {
    return res.send("Password and Confirm Password must match.")
  }

  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  req.body.password = hashedPassword;

  const user = await User.create(req.body);
  console.log(user)

  res.redirect("/kanban");
}

const update = async (req, res) => {
  res.send("[Edited] User Account Page")
}

const del = async (req, res) => {
  res.send("Redirect to /")
}



module.exports = {
  index,
  showNewForm,
  showSigninForm,
  show,
  create,
  update,
  del,
}