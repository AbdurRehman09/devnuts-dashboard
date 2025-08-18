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
const { body } = require('express-validator');

// Goal validation
const goalValidation = [
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('targetValue').isNumeric().isFloat({ min: 0 }).withMessage('Target value must be a positive number'),
  body('currentValue').optional().isNumeric().isFloat({ min: 0 }).withMessage('Current value must be a positive number'),
  body('category').optional().isIn(['personal', 'work', 'health', 'learning', 'financial', 'other']).withMessage('Invalid category'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('status').optional().isIn(['active', 'completed', 'paused', 'cancelled']).withMessage('Invalid status'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('targetDate').isISO8601().withMessage('Valid target date is required')
];

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
