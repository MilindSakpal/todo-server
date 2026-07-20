const taskModel = require("../models/taskModel");

const calculateDuration = (start, end) => {
  const startTime = new Date(`2000-01-01T${start}`);
  const endTime = new Date(`2000-01-01T${end}`);

  const diff = endTime - startTime;

  if (diff <= 0) {
    return null;
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours}h ${minutes}m`;
};
const getTasks = async (req, res) => {
  try {
    const employeeId = req.user.id;

    const tasks = await taskModel.getAllTasks(employeeId);

    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch tasks",
    });
  }
};
const createTask = async (req, res) => {
  try {
    const {
      task_name,
      project,
      category,
      description,
      task_date,
      start_time,
      end_time,
      status,
    } = req.body;

    const assigned_to = req.user.id;
    const created_by = req.user.id;

    console.log("Logged in user:", req.user);

    const duration = calculateDuration(start_time, end_time);

    if (!duration) {
      return res.status(400).json({
        message: "End time must be after start time.",
      });
    }

    console.log("JWT User:", req.user);
console.log("assigned_to:", assigned_to);
console.log("created_by:", created_by);

    await taskModel.createTask({
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
    });

    res.status(201).json({
      message: "Task created successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create task",
    });
  }
};

const updateTask = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      task_name,
      project,
      category,
      description,
      task_date,
      start_time,
      end_time,
      status,
      assigned_to,
    } = req.body;

    const duration = calculateDuration(start_time, end_time);

    if (!duration) {
      return res.status(400).json({
        message: "End time must be after start time.",
      });
    }

    await taskModel.updateTask(id, {
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
    });

    res.json({
      message: "Task updated successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update task",
    });
  }
};

const deleteTask = async (req, res) => {

  try {

    await taskModel.deleteTask(req.params.id);

    res.json({
      message: "Task deleted successfully",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to delete task",
    });

  }

};

const updateTaskStatus = async (req, res) => {

  try {

    await taskModel.updateStatus(
      req.params.id,
      req.body.status
    );

    res.json({
      message: "Status updated successfully",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to update status",
    });

  }

};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
};