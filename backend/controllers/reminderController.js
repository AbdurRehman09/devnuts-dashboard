const Reminder = require('../models/Reminder');
const { validationResult } = require('express-validator');

// Get all reminders
const getReminders = async (req, res) => {
  try {
    const { status, category, date, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.reminderDate = { $gte: startDate, $lt: endDate };
    }

    const reminders = await Reminder.find(filter)
      .sort({ reminderDate: 1, reminderTime: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Reminder.countDocuments(filter);

    res.json({
      reminders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching reminders:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single reminder
const getReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);
    
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    res.json(reminder);
  } catch (error) {
    console.error('Error fetching reminder:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new reminder
const createReminder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const reminder = new Reminder(req.body);
    const savedReminder = await reminder.save();
    
    res.status(201).json(savedReminder);
  } catch (error) {
    console.error('Error creating reminder:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update reminder
const updateReminder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const reminder = await Reminder.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    res.json(reminder);
  } catch (error) {
    console.error('Error updating reminder:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete reminder
const deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findByIdAndDelete(req.params.id);

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    res.json({ message: 'Reminder deleted successfully' });
  } catch (error) {
    console.error('Error deleting reminder:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get upcoming reminders
const getUpcomingReminders = async (req, res) => {
  try {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const upcomingReminders = await Reminder.find({
      reminderDate: { $gte: today, $lte: nextWeek },
      status: 'pending'
    }).sort({ reminderDate: 1, reminderTime: 1 });

    res.json(upcomingReminders);
  } catch (error) {
    console.error('Error fetching upcoming reminders:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get reminder statistics
const getReminderStats = async (req, res) => {
  try {
    const stats = await Reminder.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalReminders = await Reminder.countDocuments();
    const todayReminders = await Reminder.countDocuments({
      reminderDate: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lt: new Date(new Date().setHours(23, 59, 59, 999))
      }
    });

    res.json({
      statusBreakdown: stats,
      totalReminders,
      todayReminders
    });
  } catch (error) {
    console.error('Error fetching reminder stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getReminders,
  getReminder,
  createReminder,
  updateReminder,
  deleteReminder,
  getUpcomingReminders,
  getReminderStats
};
