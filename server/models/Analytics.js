const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['creator', 'brand'],
    required: true
  },
  period: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  metrics: {
    // Creator metrics
    profileViews: { type: Number, default: 0 },
    serviceViews: { type: Number, default: 0 },
    inquiries: { type: Number, default: 0 },
    ordersReceived: { type: Number, default: 0 },
    ordersCompleted: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    responseTime: { type: Number, default: 0 }, // in hours
    
    // Brand metrics
    searchesPerformed: { type: Number, default: 0 },
    creatorsViewed: { type: Number, default: 0 },
    messagessent: { type: Number, default: 0 },
    ordersPlaced: { type: Number, default: 0 },
    campaignsCreated: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    
    // Common metrics
    activeConversations: { type: Number, default: 0 },
    newFollowers: { type: Number, default: 0 }
  },
  breakdown: {
    // Revenue/spending by category
    categories: [{
      name: String,
      value: Number
    }],
    // Performance by service/campaign
    services: [{
      id: mongoose.Schema.Types.ObjectId,
      name: String,
      views: Number,
      orders: Number,
      revenue: Number
    }]
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
analyticsSchema.index({ user: 1, type: 1, period: 1, date: -1 });

module.exports = mongoose.model('Analytics', analyticsSchema);