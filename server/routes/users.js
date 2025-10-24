const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all creators with advanced filters
router.get('/creators', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      category, 
      location, 
      minFollowers, 
      maxFollowers,
      platform,
      minRate,
      maxRate,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      verified,
      rating,
      responseTime,
      languages,
      availability
    } = req.query;

    const skip = (page - 1) * limit;
    let filter = { userType: 'creator' };

    // Verified filter
    if (verified === 'true') filter.isVerified = true;

    // Apply filters
    if (category) filter['creatorProfile.categories'] = { $in: [category] };
    if (location) filter['profile.location'] = { $regex: location, $options: 'i' };
    if (languages) filter['creatorProfile.languages'] = { $in: languages.split(',') };
    if (availability === 'available') filter['creatorProfile.isAvailable'] = true;
    
    if (search) {
      filter.$or = [
        { 'profile.name': { $regex: search, $options: 'i' } },
        { 'profile.bio': { $regex: search, $options: 'i' } },
        { 'creatorProfile.categories': { $in: [new RegExp(search, 'i')] } },
        { 'creatorProfile.specialties': { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Follower count filter
    if (minFollowers || maxFollowers) {
      const followerFilter = {};
      if (minFollowers) followerFilter.$gte = parseInt(minFollowers);
      if (maxFollowers) followerFilter.$lte = parseInt(maxFollowers);
      
      if (platform) {
        filter[`creatorProfile.followers.${platform}`] = followerFilter;
      } else {
        // Check across all platforms
        filter.$or = [
          { 'creatorProfile.followers.instagram': followerFilter },
          { 'creatorProfile.followers.youtube': followerFilter },
          { 'creatorProfile.followers.tiktok': followerFilter },
          { 'creatorProfile.followers.twitter': followerFilter }
        ];
      }
    }

    // Rate filter
    if (minRate || maxRate) {
      const rateFilter = {};
      if (minRate) rateFilter.$gte = parseInt(minRate);
      if (maxRate) rateFilter.$lte = parseInt(maxRate);
      filter['creatorProfile.rates.post'] = rateFilter;
    }

    // Rating filter
    if (rating) {
      filter['creatorProfile.rating'] = { $gte: parseFloat(rating) };
    }

    // Response time filter (in hours)
    if (responseTime) {
      filter['creatorProfile.averageResponseTime'] = { $lte: parseInt(responseTime) };
    }

    const sortOptions = {};
    if (sortBy === 'followers') {
      sortOptions['creatorProfile.followers.instagram'] = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'rating') {
      sortOptions['creatorProfile.rating'] = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'rate') {
      sortOptions['creatorProfile.rates.post'] = sortOrder === 'desc' ? -1 : 1;
    } else {
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    const creators = await User.find(filter)
      .select('-password')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    // Get aggregated stats
    const stats = await User.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$creatorProfile.rating' },
          avgFollowers: { $avg: '$creatorProfile.followers.instagram' },
          avgRate: { $avg: '$creatorProfile.rates.post' },
          totalVerified: { $sum: { $cond: ['$isVerified', 1, 0] } }
        }
      }
    ]);

    res.json({
      creators,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      stats: stats[0] || {},
      filters: {
        categories: await getUniqueCategories(),
        locations: await getUniqueLocations(),
        platforms: ['instagram', 'youtube', 'tiktok', 'twitter'],
        languages: await getUniqueLanguages()
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user profile
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update profile
router.put('/profile', auth, async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Helper functions for filters
async function getUniqueCategories() {
  const categories = await User.distinct('creatorProfile.categories', { userType: 'creator' });
  return categories.filter(Boolean);
}

async function getUniqueLocations() {
  const locations = await User.distinct('profile.location', { userType: 'creator' });
  return locations.filter(Boolean);
}

async function getUniqueLanguages() {
  const languages = await User.distinct('creatorProfile.languages', { userType: 'creator' });
  return languages.filter(Boolean);
}

module.exports = router;