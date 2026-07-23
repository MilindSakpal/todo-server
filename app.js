const express = require("express");
const cors = require("cors");

require("dotenv").config();
require("./config/db");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

const graphRoutes = require("./routes/graphRoutes");
const exportRoutes = require("./routes/exportRoutes");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Office Task Management API 🚀");
});

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);
app.use("/graph", graphRoutes);
app.use("/export", exportRoutes);

app.get("/test123", (req, res) => {
  res.json({
    message: "Backend updated successfully"
  });
});

module.exports = app;