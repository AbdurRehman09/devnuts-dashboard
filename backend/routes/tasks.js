const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
} = require('../controllers/taskController');
const { taskValidation } = require('../middleware/validation');

// @route   GET /api/tasks
// @desc    Get all tasks with optional filters
// @access  Public
router.get('/', getTasks);

// @route   GET /api/tasks/stats
// @desc    Get task statistics
// @access  Public
router.get('/stats', getTaskStats);

// @route   GET /api/tasks/:id
// @desc    Get single task
// @access  Public
router.get('/:id', getTask);

// @route   POST /api/tasks
// @desc    Create new task
// @access  Public
router.post('/', taskValidation, createTask);

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Public
router.put('/:id', taskValidation, updateTask);

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Public
router.delete('/:id', deleteTask);

module.exports = router;
