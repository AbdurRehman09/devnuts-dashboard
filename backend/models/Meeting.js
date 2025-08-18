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
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
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
    required: true
  },
  participants: [{
    name: String,
    email: String,
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'maybe'],
      default: 'pending'
    }
  }],
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
