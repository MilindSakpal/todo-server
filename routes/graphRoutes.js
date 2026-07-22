const express = require("express");
const router = express.Router();

const { getGraphClient } =  require("../services/graphService");

router.get("/user", async (req, res) => {
  try {
    const client = await getGraphClient();

    const user = await client
      .api("/users/info@intellysisdigital.com")
      .get();

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;