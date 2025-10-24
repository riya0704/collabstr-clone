const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
  subcategory: String,
  pricing: {
    basic: {
      price: Number,
      description: String,
      deliveryTime: Number, // in days
      revisions: Number,
      features: [String]
    },
    standard: {
      price: Number,
      description: String,
      deliveryTime: Number,
      revisions: Number,
      features: [String]
    },
    premium: {
      price: Number,
      description: String,
      deliveryTime: Number,
      revisions: Number,
      features: [String]
    }
  },
  gallery: [String], // URLs to portfolio images/videos
  tags: [String],
  requirements: String,
  isActive: {
    type: Boolean,
    default: true
  },
  stats: {
    views: {
      type: Number,
      default: 0
    },
    orders: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 0
    },
    reviews: {
      type: Number,
      default: 0
    }
  },
  seo: {
    slug: String,
    metaTitle: String,
    metaDescription: String
  }
}, {
  timestamps: true
});

// Generate slug
serviceSchema.pre('save', function(next) {
  if (!this.seo.slug) {
    this.seo.slug = this.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Service', serviceSchema);