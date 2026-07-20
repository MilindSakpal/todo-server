const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Backend is running 🚀" });
});

app.get("/todos", (req, res) => {
  res.json([
    { id: 1, title: "Learn MERN" }
  ]);
});

module.exports = app;