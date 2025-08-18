const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Project = require('../models/Project');
const Meeting = require('../models/Meeting');
const Reminder = require('../models/Reminder');

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard analytics data
// @access  Public
router.get('/dashboard', async (req, res) => {
  try {
    // Get task analytics for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const taskAnalytics = await Task.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ["$status", "inprogress"] }, 1, 0] }
          },
          new: {
            $sum: { $cond: [{ $eq: ["$status", "new"] }, 1, 0] }
          },
          closed: {
            $sum: { $cond: [{ $eq: ["$status", "closed"] }, 1, 0] }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get overall statistics
    const taskStats = await Task.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const projectStats = await Project.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get goals data (projects with progress)
    const goalsData = await Project.find({
      status: { $in: ['active', 'planning'] }
    }).select('name progress status priority').limit(6);

    // Get today's meetings count
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const todayMeetings = await Meeting.countDocuments({
      meetingDate: { $gte: startOfDay, $lte: endOfDay }
    });

    // Get pending reminders count
    const pendingReminders = await Reminder.countDocuments({
      status: 'pending'
    });

    res.json({
      taskAnalytics,
      taskStats,
      projectStats,
      goalsData,
      todayMeetings,
      pendingReminders
    });
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/analytics/productivity
// @desc    Get productivity analytics
// @access  Public
router.get('/productivity', async (req, res) => {
  try {
    const { period = '7' } = req.query; // days
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(period));

    // Tasks completed per day
    const productivityData = await Task.aggregate([
      {
        $match: {
          status: 'completed',
          updatedAt: { $gte: daysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
          completedTasks: { $sum: 1 },
          totalProgress: { $sum: "$progress" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Average task completion time
    const completionTimes = await Task.aggregate([
      {
        $match: {
          status: 'completed',
          updatedAt: { $gte: daysAgo }
        }
      },
      {
        $project: {
          completionTime: {
            $divide: [
              { $subtract: ["$updatedAt", "$createdAt"] },
              1000 * 60 * 60 * 24 // Convert to days
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          avgCompletionTime: { $avg: "$completionTime" }
        }
      }
    ]);

    res.json({
      productivityData,
      averageCompletionTime: completionTimes[0]?.avgCompletionTime || 0
    });
  } catch (error) {
    console.error('Error fetching productivity analytics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
