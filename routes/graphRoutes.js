const express = require("express");
const router = express.Router();

const { getGraphClient } = require("../services/graphService");

router.get("/drive", async (req, res) => {
  try {
    const client = await getGraphClient();

    const drive = await client
      .api("/users/4e2610c5-da92-480b-80a8-8b05ff2724e5/drive")
      .get();

    res.json(drive);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
      body: err.body,
    });
  }
});

module.exports = router;