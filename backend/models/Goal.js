const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  targetValue: {
    type: Number,
    required: true,
    min: 0
  },
  currentValue: {
    type: Number,
    default: 0,
    min: 0
  },
  unit: {
    type: String,
    default: 'units' // e.g., 'tasks', 'hours', 'projects', etc.
  },
  category: {
    type: String,
    enum: ['personal', 'work', 'health', 'learning', 'financial', 'other'],
    default: 'work'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused', 'cancelled'],
    default: 'active'
  },
  startDate: {
    type: Date,
    required: true
  },
  targetDate: {
    type: Date,
    required: true
  },
  completedDate: {
    type: Date
  },
  color: {
    type: String,
    default: '#10b981' // hex color for visualization
  },
  tags: [String],
  milestones: [{
    title: String,
    targetValue: Number,
    achievedDate: Date,
    isAchieved: {
      type: Boolean,
      default: false
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

goalSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for calculating progress percentage
goalSchema.virtual('progress').get(function() {
  if (this.targetValue === 0) return 0;
  return Math.min(Math.round((this.currentValue / this.targetValue) * 100), 100);
});

// Virtual for checking if goal is overdue
goalSchema.virtual('isOverdue').get(function() {
  if (this.status === 'completed') return false;
  return new Date() > this.targetDate;
});

module.exports = mongoose.model('Goal', goalSchema);
