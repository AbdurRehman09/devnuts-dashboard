const express = require('express');
const router = express.Router();
const {
  getMeetings,
  getMeeting,
  createMeeting,
  updateMeeting,
  deleteMeeting,
  getTodayMeetings,
  getUpcomingMeetings,
  getMeetingStats
} = require('../controllers/meetingController');
const { meetingValidation } = require('../middleware/validation');

// @route   GET /api/meetings
// @desc    Get all meetings with optional filters
// @access  Public
router.get('/', getMeetings);

// @route   GET /api/meetings/today
// @desc    Get today's meetings
// @access  Public
router.get('/today', getTodayMeetings);

// @route   GET /api/meetings/upcoming
// @desc    Get upcoming meetings
// @access  Public
router.get('/upcoming', getUpcomingMeetings);

// @route   GET /api/meetings/stats
// @desc    Get meeting statistics
// @access  Public
router.get('/stats', getMeetingStats);

// @route   GET /api/meetings/:id
// @desc    Get single meeting
// @access  Public
router.get('/:id', getMeeting);

// @route   POST /api/meetings
// @desc    Create new meeting
// @access  Public
router.post('/', meetingValidation, createMeeting);

// @route   PUT /api/meetings/:id
// @desc    Update meeting
// @access  Public
router.put('/:id', meetingValidation, updateMeeting);

// @route   DELETE /api/meetings/:id
// @desc    Delete meeting
// @access  Public
router.delete('/:id', deleteMeeting);

module.exports = router;
