const express = require('express');
const router = express.Router();
const {
  getGoals,
  getGoal,
  createGoal,
  updateGoal,
  updateGoalProgress,
  deleteGoal,
  getGoalStats
} = require('../controllers/goalController');
const { goalValidation } = require('../middleware/validation');
const { body } = require('express-validator');

// @route   GET /api/goals
// @desc    Get all goals with optional filters
// @access  Public
router.get('/', getGoals);

// @route   GET /api/goals/stats
// @desc    Get goal statistics
// @access  Public
router.get('/stats', getGoalStats);

// @route   GET /api/goals/:id
// @desc    Get single goal
// @access  Public
router.get('/:id', getGoal);

// @route   POST /api/goals
// @desc    Create new goal
// @access  Public
router.post('/', goalValidation, createGoal);

// @route   PUT /api/goals/:id
// @desc    Update goal
// @access  Public
router.put('/:id', goalValidation, updateGoal);

// @route   PUT /api/goals/:id/progress
// @desc    Update goal progress
// @access  Public
router.put('/:id/progress', [
  body('currentValue').isNumeric().isFloat({ min: 0 }).withMessage('Current value must be a positive number')
], updateGoalProgress);

// @route   DELETE /api/goals/:id
// @desc    Delete goal
// @access  Public
router.delete('/:id', deleteGoal);

module.exports = router;
