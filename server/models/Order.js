const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  package: {
    type: String,
    enum: ['basic', 'standard', 'premium'],
    required: true
  },
  pricing: {
    amount: {
      type: Number,
      required: true
    },
    platformFee: {
      type: Number,
      required: true
    },
    creatorEarnings: {
      type: Number,
      required: true
    }
  },
  status: {
    type: String,
    enum: [
      'pending_payment',
      'payment_confirmed',
      'in_progress',
      'delivered',
      'revision_requested',
      'completed',
      'cancelled',
      'disputed'
    ],
    default: 'pending_payment'
  },
  requirements: {
    type: String,
    required: true
  },
  deliverables: [{
    type: {
      type: String,
      enum: ['file', 'link', 'text']
    },
    content: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  revisions: [{
    requestedAt: Date,
    reason: String,
    response: String,
    respondedAt: Date
  }],
  timeline: {
    orderPlaced: Date,
    paymentConfirmed: Date,
    workStarted: Date,
    delivered: Date,
    completed: Date,
    deadline: Date
  },
  payment: {
    stripePaymentIntentId: String,
    stripeTransferId: String,
    escrowReleased: {
      type: Boolean,
      default: false
    },
    releasedAt: Date
  },
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation'
  },
  rating: {
    score: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String,
    reviewedAt: Date
  }
}, {
  timestamps: true
});

// Generate order number
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);