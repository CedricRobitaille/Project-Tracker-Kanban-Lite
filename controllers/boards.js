

// Kanban Root
// GET
// /
const index = async (req, res) => {
  res.send("Board Home");
}

// Kanban Inner board
// GET
// /:boardId"
const show = async (req, res) => {
  res.send("Board Inner");
}

// Form to create a new board
// GET
// /new
const showNewForm = async (req, res) => {
  res.send("New Board Form")
}

// Form to edit an existing board
// GET
// /:boarId/edit
const edit = async (req, res) => {
  res.send("Edit Board Form")
}

// Create new board
// POST
// "/"
const create = async (req, res) => {
  res.redirect("/:boardId");
}

// Edit board properties
// PUT
// "/:boardId"
const update = async (req, res) => {
  res.redirect("/");
}

// Delete board
// DELETE
// "/:boardId"
const del = async (req, res) => {
  res.redirect("/");
}



module.exports = {
  index,
  show,
  showNewForm,
  edit,
  create,
  update,
  del,
};
