const { getGraphClient } = require("./graphService");

const USER_ID = "4e2610c5-da92-480b-80a8-8b05ff2724e5";
const FILE_ID = "01RFGZXZ3DXGXPOPIDDRHZTJA4BFHA2YFH";
const TABLE_NAME = "TaskTable";

async function appendTaskToExcel(task) {
  const client = await getGraphClient();

  await client
    .api(
      `/users/${USER_ID}/drive/items/${FILE_ID}/workbook/tables/${TABLE_NAME}/rows/add`
    )
    .post({
      values: [[
        task.no || "",
        task.date,
        task.project,
        task.description,
        task.taskType,
        task.priority,
        task.plannedHours,
        task.actualHours,
        task.status,
        task.workMode,
        task.blocker || "",
        task.endOfDay || "",
        task.outputLink || "",
        task.completion
      ]]
    });
}

module.exports = {
  appendTaskToExcel,
};