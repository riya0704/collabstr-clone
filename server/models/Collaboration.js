const mongoose = require('mongoose');

const collaborationSchema = new mongoose.Schema({
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  budget: {
    min: Number,
    max: Number
  },
  requirements: {
    followers: {
      min: Number,
      platform: String
    },
    location: String,
    age: {
      min: Number,
      max: Number
    }
  },
  deliverables: [String],
  deadline: Date,
  status: {
    type: String,
    enum: ['open', 'in_progress', 'completed', 'cancelled'],
    default: 'open'
  },
  applications: [{
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: String,
    proposedRate: Number,
    appliedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Collaboration', collaborationSchema);