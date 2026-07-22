const express = require("express");
const router = express.Router();

router.get("/user", (req, res) => {
  res.json({
    success: true,
    message: "Graph router is working!"
  });
});

module.exports = router;