const express = require("express");
const router = express.Router();
const { getGraphClient } = require("../services/graphService");

const USER_ID = "4e2610c5-da92-480b-80a8-8b05ff2724e5";
const FILE_ID = "01RFGZXZ3DXGXPOPIDDRHZTJA4BFHA2YFH";

router.get("/excel", async (req, res) => {
  try {
    const client = await getGraphClient();

    const stream = await client
      .api(`/users/${USER_ID}/drive/items/${FILE_ID}/content`)
      .getStream();

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Timesheet.xlsx"
    );

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    stream.pipe(res);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;