const express = require('express');
const router = express.Router();
const Schedule = require('../Models/TaskSchema');
const authMiddleware = require('../MiddleWare/authMiddleWare');

// GET all schedules with populated createdBy name (no filtering)
router.get('/', async (req, res, next) => {
  try {
    const schedules = await Schedule.find().populate('createdBy', 'name');
    res.json(schedules);
  } catch (error) {
    next(error);
  }
});

// IMPORTANT: Place this BEFORE the '/:id' route
// GET schedules created by logged-in user only
router.get('/my', authMiddleware, async (req, res, next) => {
  try {
    const userOB = req.user;
    const userId = req.user.id;
    const schedules = await Schedule.find({ createdBy: userId }).populate('createdBy', 'name');
    return res.json({
      username: userOB.name,
      plan: userOB.plan || 'Basic',
      schedules
    });
     
  } catch (error) {
    next(error);
  }
});

// GET single schedule by ID with populated createdBy name
router.get('/:id', async (req, res, next) => {
  try {
    const schedule = await Schedule.findById(req.params.id).populate('createdBy', 'name');
    if (!schedule) return res.status(404).json({ message: 'Schedule Not Found' });
    res.json(schedule);
  } catch (error) {
    next(error);
  }
});

// POST create a new schedule — requires auth, uses logged-in user
router.post('/', authMiddleware, async (req, res, next) => {
  const { scheduleName, color, type, tasks } = req.body;

  if (!scheduleName) {
    return res.status(400).json({ message: 'scheduleName is required' });
  }

  try {
    const schedule = new Schedule({
      scheduleName,
      createdBy: req.user.id,  // Use authenticated user's ID
      color,
      type,
      tasks: tasks || []
    });

    const savedSchedule = await schedule.save();
    const populated = await savedSchedule.populate('createdBy', 'name');

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
