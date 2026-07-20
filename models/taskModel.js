const db = require("../config/db");

const getAllTasks = async (employeeId) => {
  const [rows] = await db.query(
    `
    SELECT
      t.*,
      DATE_FORMAT(t.task_date, '%Y-%m-%d') AS task_date,
      e.full_name AS assigned_employee
    FROM tasks t
    LEFT JOIN employees e
      ON t.assigned_to = e.id
    WHERE t.assigned_to = ?
    `,
    [employeeId]
  );

  return rows;
};

const createTask = async (taskData) => {
  console.log("Task Data:", taskData);
  const {
    task_name,
    project,
    category,
    description,
    task_date,
    start_time,
    end_time,
    duration,
    status,
    assigned_to,
    created_by,
  } = taskData;

  const [result] = await db.query(
    `
    INSERT INTO tasks
    (
      task_name,
      project,
      category,
      description,
      task_date,
      start_time,
      end_time,
      duration,
      status,
      assigned_to,
      created_by
    )
    VALUES (?,?,?,?,?,?,?,?,?,?,?)
    `,
    [
      task_name,
      project,
      category,
      description,
      task_date,
      start_time,
      end_time,
      duration,
      status,
      assigned_to,
      created_by,
    ]
  );

  return result;
};

const updateTask = async (id, taskData) => {
  const {
    task_name,
    project,
    category,
    description,
    task_date,
    start_time,
    end_time,
    duration,
    status,
    assigned_to,
  } = taskData;

  const [result] = await db.query(
    `
    UPDATE tasks
    SET
      task_name=?,
      project=?,
      category=?,
      description=?,
      task_date=?,
      start_time=?,
      end_time=?,
      duration=?,
      status=?,
      assigned_to=?
    WHERE id=?
    `,
    [
      task_name,
      project,
      category,
      description,
      task_date,
      start_time,
      end_time,
      duration,
      status,
      assigned_to,
      id,
    ]
  );

  return result;
};

const deleteTask = async (id) => {
  const [result] = await db.query(
    "DELETE FROM tasks WHERE id=?",
    [id]
  );

  return result;
};

const updateStatus = async (id, status) => {
  const [result] = await db.query(
    "UPDATE tasks SET status=? WHERE id=?",
    [status, id]
  );

  return result;
};

module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  updateStatus,
};