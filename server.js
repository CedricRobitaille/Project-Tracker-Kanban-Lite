const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();

const mongoose = require("mongoose");
const methodOverride = require("method-override")


app.get("/", (req, res) => {
  res.send("Landing Page");
})











// Define the port the app is listening on
const port = process.env.PORT;

// Port Error Handling
const handleServerError = (error) => {
  if (error.code = "EADDRINUSE") {  // Error code = Port in use
    console.log(`Warning! Port ${port} is already in use!`)
  } else {  // Unexpected Error
    console.log("Error:", error);
  }
}

// Express Listening
app.listen(port, () => {
  console.log(`Express is listening on port ${port}`);
}).on("error", handleServerError); // On error, error handling function