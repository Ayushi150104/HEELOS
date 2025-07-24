const mongoose = require('mongoose');

// Subtask schema
const SubtaskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  des: String,
  color: String,
  date: Date,
  completion: Number
});

// Activity Log schema
const ActivitySchema = new mongoose.Schema({
  type: String,
  time: Date
});

// Task schema
const TaskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: String,
  difficulty: String,
  endBy: Date,
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'overdue'],
    default: 'pending'
  },
  tags: [String],
  description: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  activityLog: [ActivitySchema],
  subtasks: [SubtaskSchema]
});

// Schedule schema
const ScheduleSchema = new mongoose.Schema({
  scheduleName: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  color: String,
  type: String,
  tasks: [TaskSchema]
}, { timestamps: true });

// ✅ Export models properly
const Schedule = mongoose.model('Schedule', ScheduleSchema);
const Task = mongoose.model('Task', TaskSchema);
const SubTask = mongoose.model('SubTask', SubtaskSchema);
const TimeLine = mongoose.model('TimeLine', ActivitySchema);

module.exports = { Schedule, Task, TimeLine, SubTask };
