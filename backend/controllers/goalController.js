const Goal = require('../models/Goal');
const { validationResult } = require('express-validator');

// Get all goals
const getGoals = async (req, res) => {
  try {
    const { status, category, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    const goals = await Goal.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Goal.countDocuments(filter);

    res.json({
      goals,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single goal
const getGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.json(goal);
  } catch (error) {
    console.error('Error fetching goal:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new goal
const createGoal = async (req, res) => {
  try {
    // Debug log
    console.log('Creating goal with data:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Goal validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const goal = new Goal(req.body);
    const savedGoal = await goal.save();
    
    res.status(201).json(savedGoal);
  } catch (error) {
    console.error('Error creating goal:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update goal
const updateGoal = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const goal = await Goal.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.json(goal);
  } catch (error) {
    console.error('Error updating goal:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update goal progress
const updateGoalProgress = async (req, res) => {
  try {
    const { currentValue } = req.body;
    
    const goal = await Goal.findById(req.params.id);
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    goal.currentValue = currentValue;
    
    // Check if goal is completed
    if (goal.currentValue >= goal.targetValue && goal.status !== 'completed') {
      goal.status = 'completed';
      goal.completedDate = new Date();
    }

    await goal.save();
    res.json(goal);
  } catch (error) {
    console.error('Error updating goal progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete goal
const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findByIdAndDelete(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Error deleting goal:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get goal statistics
const getGoalStats = async (req, res) => {
  try {
    const stats = await Goal.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalGoals = await Goal.countDocuments();
    const completedGoals = await Goal.countDocuments({ status: 'completed' });
    const activeGoals = await Goal.countDocuments({ status: 'active' });

    // Calculate average progress
    const avgProgress = await Goal.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: null,
          avgProgress: { 
            $avg: { 
              $multiply: [
                { $divide: ['$currentValue', '$targetValue'] }, 
                100
              ] 
            } 
          }
        }
      }
    ]);

    res.json({
      statusBreakdown: stats,
      totalGoals,
      completedGoals,
      activeGoals,
      averageProgress: avgProgress[0]?.avgProgress || 0
    });
  } catch (error) {
    console.error('Error fetching goal stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getGoals,
  getGoal,
  createGoal,
  updateGoal,
  updateGoalProgress,
  deleteGoal,
  getGoalStats
};
