const express = require('express');
const router = express.Router();
const {
  getReminders,
  getReminder,
  createReminder,
  updateReminder,
  deleteReminder,
  getUpcomingReminders,
  getReminderStats
} = require('../controllers/reminderController');
const { reminderValidation } = require('../middleware/validation');

// @route   GET /api/reminders
// @desc    Get all reminders with optional filters
// @access  Public
router.get('/', getReminders);

// @route   GET /api/reminders/upcoming
// @desc    Get upcoming reminders
// @access  Public
router.get('/upcoming', getUpcomingReminders);

// @route   GET /api/reminders/stats
// @desc    Get reminder statistics
// @access  Public
router.get('/stats', getReminderStats);

// @route   GET /api/reminders/:id
// @desc    Get single reminder
// @access  Public
router.get('/:id', getReminder);

// @route   POST /api/reminders
// @desc    Create new reminder
// @access  Public
router.post('/', reminderValidation, createReminder);

// @route   PUT /api/reminders/:id
// @desc    Update reminder
// @access  Public
router.put('/:id', reminderValidation, updateReminder);

// @route   DELETE /api/reminders/:id
// @desc    Delete reminder
// @access  Public
router.delete('/:id', deleteReminder);

module.exports = router;
