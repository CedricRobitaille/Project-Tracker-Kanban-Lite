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

  const user = await User.create(req.body);
  console.log(user)

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
  login,
  logout,
  update,
  del,
}