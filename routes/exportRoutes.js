const express = require("express");
const router = express.Router();
const { getGraphClient } = require("../services/graphService");

const USER_ID = "4e2610c5-da92-480b-80a8-8b05ff2724e5";
const FILE_ID = "01RFGZXZ3DXGXPOPIDDRHZTJA4BFHA2YFH";

router.get("/excel", async (req, res) => {
  try {
    const client = await getGraphClient();

    console.log("✅ Graph Client Created");

    const file = await client
      .api(`/users/${USER_ID}/drive/items/${FILE_ID}`)
      .get();

    console.log(file);

    res.json({
      success: true,
      downloadUrl: file["@microsoft.graph.downloadUrl"],
    });

  } catch (err) {
    console.error("❌ EXPORT ERROR");
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
      body: err.body,
      stack: err.stack,
    });
  }
});

module.exports = router;