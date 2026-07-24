const { getGraphClient } = require("./graphService");

const USER_ID = "4e2610c5-da92-480b-80a8-8b05ff2724e5";

const EMPLOYEE_FILES = {
  9: "FILE_ID_OF_KASHYAP",
  10: "FILE_ID_OF_PARTH",
  11: "FILE_ID_OF_DHAIRYA",
  12: "FILE_ID_OF_MILIND",
};
const TABLE_NAME = "TaskTable";

async function appendTaskToExcel(task) {
  try {
    console.log("========== EXCEL SYNC START ==========");
    console.log("Task Data:", task);

    const client = await getGraphClient();

    const response = await client
      .api(
        `/users/${USER_ID}/drive/items/${FILE_ID}/workbook/tables/${TABLE_NAME}/rows/add`
      )
      .post({
        values: [[
          task.no ?? "",
          task.date ?? "",
          task.project ?? "",
          task.description ?? "",
          task.taskType ?? "",
          task.priority ?? "Medium",
          Number(task.plannedHours) || 0,
          Number(task.actualHours) || 0,
          task.status ?? "",
          task.workMode ?? "Office",
          task.blocker ?? "",
          task.endOfDay ?? "",
          task.outputLink ?? "",
          Number(task.completion) || 0
        ]]
      });

    console.log("========== EXCEL SYNC SUCCESS ==========");
    console.log(response);

    return response;

  } catch (error) {
    console.error("========== EXCEL SYNC FAILED ==========");

    if (error.body) {
      console.error(error.body);
    } else {
      console.error(error);
    }

    throw error;
  }
}

module.exports = {
  appendTaskToExcel,
};