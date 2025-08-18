const Meeting = require('../models/Meeting');
const { validationResult } = require('express-validator');

// Get all meetings
const getMeetings = async (req, res) => {
  try {
    const { status, date, organizer, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (organizer) filter.organizer = new RegExp(organizer, 'i');
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.meetingDate = { $gte: startDate, $lt: endDate };
    }

    const meetings = await Meeting.find(filter)
      .populate('project', 'name')
      .sort({ meetingDate: 1, startTime: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Meeting.countDocuments(filter);

    res.json({
      meetings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching meetings:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single meeting
const getMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id).populate('project', 'name');
    
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    res.json(meeting);
  } catch (error) {
    console.error('Error fetching meeting:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new meeting
const createMeeting = async (req, res) => {
  try {
    // Debug log
    console.log('Creating meeting with data:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Meeting validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const meeting = new Meeting(req.body);
    const savedMeeting = await meeting.save();
    
    const populatedMeeting = await Meeting.findById(savedMeeting._id).populate('project', 'name');
    
    res.status(201).json(populatedMeeting);
  } catch (error) {
    console.error('Error creating meeting:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update meeting
const updateMeeting = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const meeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('project', 'name');

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    res.json(meeting);
  } catch (error) {
    console.error('Error updating meeting:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete meeting
const deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndDelete(req.params.id);

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    res.json({ message: 'Meeting deleted successfully' });
  } catch (error) {
    console.error('Error deleting meeting:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get today's meetings
const getTodayMeetings = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const meetings = await Meeting.find({
      meetingDate: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ['scheduled', 'ongoing'] }
    })
    .populate('project', 'name')
    .sort({ startTime: 1 });

    res.json(meetings);
  } catch (error) {
    console.error('Error fetching today\'s meetings:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get upcoming meetings
const getUpcomingMeetings = async (req, res) => {
  try {
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);

    const meetings = await Meeting.find({
      meetingDate: { $gte: now, $lte: nextWeek },
      status: 'scheduled'
    })
    .populate('project', 'name')
    .sort({ meetingDate: 1, startTime: 1 })
    .limit(10);

    res.json(meetings);
  } catch (error) {
    console.error('Error fetching upcoming meetings:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get meeting statistics
const getMeetingStats = async (req, res) => {
  try {
    const stats = await Meeting.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalMeetings = await Meeting.countDocuments();
    const todayMeetings = await Meeting.countDocuments({
      meetingDate: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lt: new Date(new Date().setHours(23, 59, 59, 999))
      }
    });

    res.json({
      statusBreakdown: stats,
      totalMeetings,
      todayMeetings
    });
  } catch (error) {
    console.error('Error fetching meeting stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getMeetings,
  getMeeting,
  createMeeting,
  updateMeeting,
  deleteMeeting,
  getTodayMeetings,
  getUpcomingMeetings,
  getMeetingStats
};
