const { body } = require('express-validator');

// Task validation
const taskValidation = [
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('assignedBy').trim().isLength({ min: 1 }).withMessage('Assigned by is required'),
  body('assignedTo').trim().isLength({ min: 1 }).withMessage('Assigned to is required'),
  body('status').optional().isIn(['new', 'inprogress', 'completed', 'closed']).withMessage('Invalid status'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('progress').optional().isInt({ min: 0, max: 100 }).withMessage('Progress must be between 0 and 100'),
  body('dueDate').optional().isISO8601().withMessage('Invalid due date format')
];

// Reminder validation
const reminderValidation = [
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('reminderDate').isISO8601().withMessage('Valid reminder date is required'),
  body('reminderTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid time format (HH:MM)'),
  body('status').optional().isIn(['pending', 'completed', 'cancelled']).withMessage('Invalid status'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('category').optional().isIn(['personal', 'work', 'meeting', 'deadline', 'other']).withMessage('Invalid category'),
  body('isRecurring').optional().isBoolean().withMessage('isRecurring must be boolean'),
  body('recurringType').optional().isIn(['daily', 'weekly', 'monthly', 'yearly']).withMessage('Invalid recurring type')
];

// Meeting validation
const meetingValidation = [
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('meetingDate').isISO8601().withMessage('Valid meeting date is required'),
  body('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid start time format (HH:MM)'),
  body('endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid end time format (HH:MM)'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive number'),
  body('organizer').trim().isLength({ min: 1 }).withMessage('Organizer is required'),
  body('meetingType').optional().isIn(['in-person', 'video-call', 'phone-call']).withMessage('Invalid meeting type'),
  body('status').optional().isIn(['scheduled', 'ongoing', 'completed', 'cancelled']).withMessage('Invalid status'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('participants').optional().isArray().withMessage('Participants must be an array'),
  body('participants.*.name').optional().trim().isLength({ min: 1 }).withMessage('Participant name is required'),
  body('participants.*.email').optional().isEmail().withMessage('Invalid participant email'),
  body('participants.*.status').optional().isIn(['pending', 'accepted', 'declined', 'maybe']).withMessage('Invalid participant status')
];

// Project validation
const projectValidation = [
  body('name').trim().isLength({ min: 1 }).withMessage('Project name is required'),
  body('status').optional().isIn(['planning', 'active', 'on-hold', 'completed', 'cancelled']).withMessage('Invalid status'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('progress').optional().isInt({ min: 0, max: 100 }).withMessage('Progress must be between 0 and 100'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').optional().isISO8601().withMessage('Invalid end date format'),
  body('expectedEndDate').optional().isISO8601().withMessage('Invalid expected end date format'),
  body('projectManager').trim().isLength({ min: 1 }).withMessage('Project manager is required'),
  body('budget.allocated').optional().isNumeric().withMessage('Allocated budget must be a number'),
  body('budget.spent').optional().isNumeric().withMessage('Spent budget must be a number'),
  body('teamMembers').optional().isArray().withMessage('Team members must be an array'),
  body('teamMembers.*.name').optional().trim().isLength({ min: 1 }).withMessage('Team member name is required'),
  body('teamMembers.*.role').optional().trim().isLength({ min: 1 }).withMessage('Team member role is required'),
  body('teamMembers.*.email').optional().isEmail().withMessage('Invalid team member email')
];

module.exports = {
  taskValidation,
  reminderValidation,
  meetingValidation,
  projectValidation
};
