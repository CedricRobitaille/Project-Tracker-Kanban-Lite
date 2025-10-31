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

  const userInDatabase = await User.findOne({ email: req.body.email });
  if (userInDatabase) {
    return res.send("Email already in use.")
  }
  if (req.body.password !== req.body.passwordConfirm) {
    return res.send("Password and Confirm Password must match.")
  }

  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  req.body.password = hashedPassword;

  const nickname = req.body.fullName;
  req.body.nickname = nickname.split(" ")[0];

  const user = await User.create(req.body);
  console.log(user)

  const boardTemplate = {
    title: "Welcome!",
    description: "Welcome to Flōgrid! To help you get started, we've provided an introductory project.",
    owner: user._id,
    color: "#a681c2",
    icon: "/icons/projects/anchor.svg",
    progressCounter: 1,
    section: [
      { title: "On Hold", color: "#ebd974ff" },
      { title: "In Progress", color: "#61db75ff", size: 1 },
      { title: "Awaiting Approval", color: "#ae74dc" }
    ]
  }
  const firstBoard = await Board.create(boardTemplate);
  
  const taskTemplate = {
    title: "Your first task!",
    description: "To help you get started, we've set given you a demo task to see how this all works!",
    board: firstBoard._id,
    section: "InProgress",
    owner: nickname,
    priority: "low",
    dueDate: Date.now()
  }
  const firstTask = await Task.create(taskTemplate);
  console.log(firstTask)

  req.session.user = {
    email: req.body.email,
  }

  req.session.save(() => {
    res.redirect("/kanban");
  });
}



const login = async (req, res) => {
  const userInDatabase = await User.findOne({ email: req.body.email });
  if (!userInDatabase) {
    return res.send("Login Failed. Email provided was not found.")
  }

  const validPassword = bcrypt.compareSync(
    req.body.password,
    userInDatabase.password
  );
  if (!validPassword) {
    return res.send("Login Failed, Password was incorrect.")
  };

  req.session.user = {
    email: userInDatabase.email,
  }

  req.session.save(() => {
    res.redirect("/kanban");
  })
}



const logout = async (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
}



const update = async (req, res) => {
  const pfp = req.file ? `/uploads/${req.file.filename}` : "/uploads/default-pfp.jpg";
  req.body.profilePicture = pfp;

  if (req.body.password) {
    if (req.body.password !== req.body.passwordConfirm) {
      return res.send("Password and Confirm Password must match.")
    }
  }
  
  const currentUser = await User.findOne({ email: req.session.user.email })
  const updatedUser = await User.findByIdAndUpdate(currentUser._id, req.body);
  res.redirect("/kanban")
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
  login,
  logout,
  update,
  del,
}