const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all creators
router.get('/creators', async (req, res) => {
  try {
    const { category, location, minFollowers } = req.query;
    
    let filter = { userType: 'creator' };
    
    if (category) {
      filter['creatorProfile.categories'] = { $in: [category] };
    }
    
    if (location) {
      filter['profile.location'] = new RegExp(location, 'i');
    }

    const creators = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(creators);
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

module.exports = router;