const Task = require('../models/Task');
const { validationResult } = require('express-validator');

// Get all tasks
const getTasks = async (req, res) => {
  try {
    const { status, priority, project, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (project) filter.project = project;

    const tasks = await Task.find(filter)
      .populate('project', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Task.countDocuments(filter);

    res.json({
      tasks,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single task
const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('project', 'name');
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new task
const createTask = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const task = new Task(req.body);
    const savedTask = await task.save();
    
    const populatedTask = await Task.findById(savedTask._id).populate('project', 'name');
    
    res.status(201).json(populatedTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update task
const updateTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('project', 'name');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get task statistics
const getTaskStats = async (req, res) => {
  try {
    const stats = await Task.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalTasks = await Task.countDocuments();
    const averageProgress = await Task.aggregate([
      {
        $group: {
          _id: null,
          avgProgress: { $avg: '$progress' }
        }
      }
    ]);

    res.json({
      statusBreakdown: stats,
      totalTasks,
      averageProgress: averageProgress[0]?.avgProgress || 0
    });
  } catch (error) {
    console.error('Error fetching task stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
};
