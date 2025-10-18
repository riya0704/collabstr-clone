const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  userType: {
    type: String,
    enum: ['creator', 'brand'],
    required: true
  },
  profile: {
    name: String,
    bio: String,
    avatar: String,
    location: String,
    website: String,
    socialMedia: {
      instagram: String,
      tiktok: String,
      youtube: String,
      twitter: String
    }
  },
  creatorProfile: {
    categories: [String],
    followers: {
      instagram: Number,
      tiktok: Number,
      youtube: Number,
      twitter: Number
    },
    rates: {
      post: Number,
      story: Number,
      reel: Number
    },
    portfolio: [String]
  },
  brandProfile: {
    companyName: String,
    industry: String,
    budget: {
      min: Number,
      max: Number
    },
    targetAudience: String
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);