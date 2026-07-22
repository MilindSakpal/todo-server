const express = require("express");
const router = express.Router();

const { getGraphClient } =  require("../services/graphService");

router.get("/drive", async (req, res) => {
  try {
    const client = await getGraphClient();

    const drive = await client
      .api("/users/info@intellysisdigital.com/drive")
      .get();

    res.json(drive);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;