const { getGraphClient } = require("./graphService");

const USER_ID = "4e2610c5-da92-480b-80a8-8b05ff2724e5";

const EMPLOYEE_FILES = {
  9: "01RFGZXZ3AQ5K4KQTQZBH2N2EZ7ADGCTYW", // Kashyap
  10: "01RFGZXZ454PZ5EKZJ6NHJCCZWDUKBFONK", // Parth
  11: "01RFGZXZ2BPFZWNKOKA5DIHB5QAP2USGKP", // Dhairya
  12: "01RFGZXZ3DXGXPOPIDDRHZTJA4BFHA2YFH", // Milind
};
const TABLE_NAME = "TaskTable";

async function appendTaskToExcel(employeeId, task) {
  try {
    console.log("========== EXCEL SYNC START ==========");
    console.log("Task Data:", task);
    const FILE_ID = EMPLOYEE_FILES[employeeId];

    if (!FILE_ID) {
      throw new Error(`No Excel file mapped for employee ${employeeId}`);
    }
    const client = await getGraphClient();

    const rows = await client
      .api(
        `/users/${USER_ID}/drive/items/${FILE_ID}/workbook/tables/${TABLE_NAME}/rows`,
      )
      .get();

    let maxNo = 0;

    rows.value.forEach((row) => {
      const no = Number(row.values[0][0]);

      if (!isNaN(no) && no > maxNo) {
        maxNo = no;
      }
    });

    const nextNo = maxNo + 1;

    console.log("Next Serial Number:", nextNo);

    let lastDate = "";

    for (let i = rows.value.length - 1; i >= 0; i--) {
      const date = rows.value[i].values?.[0]?.[1];

      if (date && String(date).trim() !== "") {
        lastDate = date;
        break;
      }
    }

    console.log("Last Date:", lastDate);
    console.log("Current Date:", task.date);

    if (lastDate && lastDate !== task.date) {
      console.log("New day detected. Adding separator row...");

      await client
        .api(
          `/users/${USER_ID}/drive/items/${FILE_ID}/workbook/tables/${TABLE_NAME}/rows/add`,
        )
        .post({
          values: [["", "", "", "", "", "", "", "", "", "", "", "", "", ""]],
        });
    }

    const response = await client
      .api(
        `/users/${USER_ID}/drive/items/${FILE_ID}/workbook/tables/${TABLE_NAME}/rows/add`,
      )
      .post({
        values: [
          [
            nextNo,
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
            Number(task.completion) || 0,
          ],
        ],
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
