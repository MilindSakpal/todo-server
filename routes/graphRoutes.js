const express = require("express");
const router = express.Router();

const { getGraphClient } = require("../services/graphService");

// Get all columns
router.get("/column-names", async (req, res) => {
  try {
    const client = await getGraphClient();

    const columns = await client
      .api("/users/4e2610c5-da92-480b-80a8-8b05ff2724e5/drive/items/01RFGZXZ3DXGXPOPIDDRHZTJA4BFHA2YFH/workbook/tables/TaskTable/columns")
      .get();

    res.json(columns.value.map(c => c.name));

  } catch (err) {
    res.status(500).json(err);
  }
});

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
      body: err.body,
    });
  }
});

// Add a row
router.post("/add-row", async (req, res) => {
  try {
    const client = await getGraphClient();

    const response = await client
  .api(
    "/users/4e2610c5-da92-480b-80a8-8b05ff2724e5/drive/items/01RFGZXZ3DXGXPOPIDDRHZTJA4BFHA2YFH/workbook/tables/TaskTable/rows/add"
  )
  .post({
    values: [[
      "",
      "2026-07-22",
      "Internal",
      "Testing Graph API",
      "Medium",
      "High",
      2,
      2,
      "Done",
      "Office",
      "",
      "Successfully added from Graph API"
    ]]
  });

    res.json(response);
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