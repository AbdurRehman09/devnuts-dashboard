const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  meetingDate: {
    type: Date,
    required: false,
    default: Date.now
  },
  startTime: {
    type: String,
    required: false,
    default: '09:00'
  },
  endTime: {
    type: String,
    required: false,
    default: '10:00'
  },
  duration: {
    type: Number, // in minutes
    required: false,
    default: 60 // Default 60 minutes
  },
  location: {
    type: String,
    trim: true
  },
  meetingType: {
    type: String,
    enum: ['in-person', 'video-call', 'phone-call'],
    default: 'in-person'
  },
  meetingLink: {
    type: String,
    trim: true
  },
  organizer: {
    type: String,
    required: false,
    default: 'Current User'
  },
  participants: [String], // Simple string array instead of embedded documents
  agenda: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

meetingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Meeting', meetingSchema);
