const express = require("express");
const router = express.Router();
const { getGraphClient } = require("../services/graphService");

const USER_ID = "4e2610c5-da92-480b-80a8-8b05ff2724e5";
const FILE_ID = "01RFGZXZ3DXGXPOPIDDRHZTJA4BFHA2YFH";
const TABLE_NAME = "TaskTable";

router.post("/add-row", async (req, res) => {
  try {
    const {
      no,
      date,
      project,
      description,
      taskType,
      priority,
      plannedHours,
      actualHours,
      status,
      workMode,
      blocker,
      endOfDay,
      outputLink,
      completion
    } = req.body;

    const client = await getGraphClient();

    const response = await client
      .api(
        `/users/${USER_ID}/drive/items/${FILE_ID}/workbook/tables/${TABLE_NAME}/rows/add`
      )
      .post({
        values: [[
          no ?? "",
          date ?? "",
          project ?? "",
          description ?? "",
          taskType ?? "",
          priority ?? "",
          plannedHours ?? "",
          actualHours ?? "",
          status ?? "",
          workMode ?? "",
          blocker ?? "",
          endOfDay ?? "",
          outputLink ?? "",
          completion ?? ""
        ]]
      });

    res.json({
      success: true,
      data: response,
    });

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