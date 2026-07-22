const taskModel = require("../models/taskModel");
const { appendTaskToExcel } = require("../services/excelService");

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

const durationToHours = (duration) => {
  const match = duration.match(/(\d+)h\s*(\d+)m/);

  if (!match) return 0;

  const hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);

  return +(hours + minutes / 60).toFixed(2);
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

    const excelHours = durationToHours(duration);

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

    try {
      await appendTaskToExcel({
        no: "",
        date: task_date,
        project,
        description: description ? `${task_name} - ${description}` : task_name,
        taskType: category,
        priority: "Medium", // or priority || "Medium" if frontend sends it
        plannedHours: excelHours,
        actualHours: excelHours,
        status,
        workMode: "Office",
        blocker: "",
        endOfDay: description,
        outputLink: "",
        completion: status === "Done" ? 1 : 0,
      });

      console.log("✅ Excel updated successfully");
    } catch (excelError) {
      console.error("❌ Excel Sync Failed:", excelError.message);
    }

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
    } = req.body;

    // Always use the logged-in employee
    const assigned_to = req.user.id;

    const duration = calculateDuration(start_time, end_time);

    if (!duration) {
      return res.status(400).json({
        message: "End time must be after start time.",
      });
    }
    console.log({
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
    await taskModel.updateStatus(req.params.id, req.body.status);

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
