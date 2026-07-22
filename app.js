const express = require("express");
const cors = require("cors");

require("dotenv").config();
require("./config/db");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

const graphRoutes = require("./routes/graphRoutes");

app.use(cors());
app.use(express.json());
app.use("/graph", graphRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to Office Task Management API 🚀");
});

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

module.exports = app;