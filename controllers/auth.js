const User = require("../models/user.js");
const Task = require("../models/task.js")
const Board = require("../models/board.js")

//
const index = async (req, res) => {
  res.send("Landing Page!");
}

const showNewForm = async (req, res) => {
  res.send("Sign Up Page");
}

const showSigninForm = async (req, res) => {
  res.send("Sign In Page");
}

const show = async (req, res) => {
  res.send("User Account Page");
}

const create = async (req, res) => {
  res.send("Redirect to /kanban");
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