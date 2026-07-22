const express = require("express");
const router = express.Router();

const { getGraphClient } = require("../services/graphService");

router.get("/user", async (req, res) => {
  try {
    const client = await getGraphClient();

    const user = await client
      .api("/users/info@intellysisdigital.com")
      .get();

    res.json(user);

  } catch (err) {
    console.error("STATUS:", err.statusCode);
    console.error("CODE:", err.code);
    console.error("MESSAGE:", err.message);
    console.error("BODY:", err.body);

    res.status(500).json({
      success: false,
      status: err.statusCode,
      code: err.code,
      message: err.message,
      body: err.body,
    });
  }
});

module.exports = router;