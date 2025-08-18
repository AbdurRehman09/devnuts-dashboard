const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['planning', 'active', 'on-hold', 'completed', 'cancelled'],
    default: 'planning'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  expectedEndDate: {
    type: Date
  },
  budget: {
    allocated: {
      type: Number,
      default: 0
    },
    spent: {
      type: Number,
      default: 0
    }
  },
  teamMembers: [{
    name: String,
    role: String,
    email: String,
    joinedDate: {
      type: Date,
      default: Date.now
    }
  }],
  projectManager: {
    type: String,
    required: true
  },
  client: {
    name: String,
    email: String,
    company: String
  },
  milestones: [{
    title: String,
    description: String,
    dueDate: Date,
    status: {
      type: String,
      enum: ['pending', 'completed', 'overdue'],
      default: 'pending'
    },
    completedDate: Date
  }],
  tags: [String],
  documents: [{
    name: String,
    url: String,
    uploadDate: {
      type: Date,
      default: Date.now
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

projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for calculating project health based on progress and timeline
projectSchema.virtual('health').get(function() {
  if (!this.expectedEndDate) return 'unknown';
  
  const now = new Date();
  const totalTime = this.expectedEndDate - this.startDate;
  const elapsedTime = now - this.startDate;
  const expectedProgress = (elapsedTime / totalTime) * 100;
  
  if (this.progress >= expectedProgress * 0.9) return 'good';
  if (this.progress >= expectedProgress * 0.7) return 'warning';
  return 'critical';
});

module.exports = mongoose.model('Project', projectSchema);
