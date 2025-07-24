const express = require('express');
const router = express.Router();
const { Schedule } = require('../Models/TaskSchema'); // You don't use Task directly here
const authMiddleware = require('../MiddleWare/authMiddleWare');

// GET all schedules (public, with createdBy name populated)
router.get('/', async (req, res, next) => {
  try {
    const schedules = await Schedule.find().populate('createdBy', 'name');
    res.json(schedules);
  } catch (error) {
    next(error);
  }
});

// GET schedules created by the logged-in user
router.get('/my', authMiddleware, async (req, res, next) => {
  try {
    const user = req.user;
    const schedules = await Schedule.find({ createdBy: user.id }).populate('createdBy', 'name');
    res.json({
      username: user.name,
      plan: user.plan || 'Basic',
      schedules
    });
  } catch (error) {
    next(error);
  }
});

// POST add a task to a specific schedule (authenticated)
router.post('/my/:scheduleId/create-task', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { scheduleId } = req.params;
    const {
      name, color, difficulty, endBy, priority, status,
      tags, description, subtasks, activityLog
    } = req.body;

    const schedule = await Schedule.findOne({ _id: scheduleId, createdBy: userId });
    if (!schedule) return res.status(404).json({ message: 'Schedule not found or unauthorized' });

    const newTask = {
      name,
      color,
      difficulty,
      endBy,
      priority,
      status,
      tags,
      description,
      createdAt: new Date(),
      activityLog: activityLog || [],
      subtasks: subtasks || []
    };

    schedule.tasks.push(newTask);
    await schedule.save();

    res.status(201).json({ message: 'Task added successfully', schedule });
  } catch (error) {
    next(error);
  }
});

// POST add an activity log entry to a task in a schedule
router.post('/my/:scheduleId/:taskId/newActivity', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { scheduleId, taskId } = req.params;
    const { type, time } = req.body;

    const schedule = await Schedule.findOne({ _id: scheduleId, createdBy: userId });
    if (!schedule) return res.status(404).json({ message: 'Schedule not found or unauthorized' });

    const task = schedule.tasks.id(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found in schedule' });

    task.activityLog.push({ type, time });

    await schedule.save();

    res.status(200).json({ message: 'Activity added successfully', task });
  } catch (error) {
    next(error);
  }
});

// POST add a new subtask to a task in a schedule
router.post('/my/:scheduleId/:taskId/new-subtask', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { scheduleId, taskId } = req.params;
    const { name, des, color, date, completion } = req.body;

    const schedule = await Schedule.findOne({ _id: scheduleId, createdBy: userId });
    if (!schedule) return res.status(404).json({ message: 'Schedule not found or unauthorized' });

    const task = schedule.tasks.id(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found in schedule' });

    const newSubtask = { name, des, color, date, completion };

    task.subtasks.push(newSubtask);

    await schedule.save();

    res.status(200).json({ message: 'Subtask added successfully', task });
  } catch (error) {
    next(error);
  }
});

// GET a single schedule by ID (public)
router.get('/:id', async (req, res, next) => {
  try {
    const schedule = await Schedule.findById(req.params.id).populate('createdBy', 'name');
    if (!schedule) return res.status(404).json({ message: 'Schedule Not Found' });
    res.json(schedule);
  } catch (error) {
    next(error);
  }
});

// POST create a new schedule (authenticated)
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { scheduleName, color, type, tasks } = req.body;

    if (!scheduleName) {
      return res.status(400).json({ message: 'scheduleName is required' });
    }

    const schedule = new Schedule({
      scheduleName,
      createdBy: req.user.id,
      color,
      type,
      tasks: tasks || []
    });

    const savedSchedule = await schedule.save();
    const populatedSchedule = await savedSchedule.populate('createdBy', 'name');
    res.status(201).json(populatedSchedule);
  } catch (error) {
    next(error);
  }
});

// PATCH update status of a specific task in a schedule (authenticated)
router.patch('/my/:scheduleId/:taskId/status', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { scheduleId, taskId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const schedule = await Schedule.findOne({ _id: scheduleId, createdBy: userId });
    if (!schedule) return res.status(404).json({ message: 'Schedule not found or unauthorized' });

    const task = schedule.tasks.id(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found in schedule' });

    task.status = status;

    await schedule.save();

    res.status(200).json({ message: "Task status updated successfully", task });
  } catch (error) {
    next(error);
  }
});

router.delete('/my/:scheduleId/delete', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { scheduleId } = req.params;
    const schedule = await Schedule.findOne({ _id: scheduleId, createdBy: userId });
    if (!schedule) return res.status(404).json({ message: 'Schedule not found or unauthorized' });
    await Schedule.deleteOne({ _id: scheduleId, createdBy: userId });
    res.status(200).json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// DELETE a task from a schedule (authenticated)
router.delete('/my/:scheduleId/:taskId/delete', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { scheduleId, taskId } = req.params;

    const schedule = await Schedule.findOne({ _id: scheduleId, createdBy: userId });
    if (!schedule) return res.status(404).json({ message: 'Schedule not found or unauthorized' });

    const task = schedule.tasks.id(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found in schedule' });

    schedule.tasks = schedule.tasks.filter(
      (t) => t._id.toString() !== taskId
    );
    await schedule.save();

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Simple PATCH test route to verify router loading
router.patch('/my/test', (req, res) => {
  res.json({ message: 'Patch test route works' });
});

module.exports = router;
