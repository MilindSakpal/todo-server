const express = require("express");
const router = express.Router();

const { getGraphClient } = require("../services/graphService");

router.get("/columns", async (req, res) => {
  try {
    const client = await getGraphClient();

    const columns = await client
      .api(
        "/users/4e2610c5-da92-480b-80a8-8b05ff2724e5/drive/items/01RFGZXZ3DXGXPOPIDDRHZTJA4BFHA2YFH/workbook/tables/TaskTable/columns"
      )
      .get();

    res.json(columns);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;