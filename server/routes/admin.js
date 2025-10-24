const express = require('express');
const User = require('../models/User');
const Collaboration = require('../models/Collaboration');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// Admin Dashboard Stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCreators = await User.countDocuments({ userType: 'creator' });
    const totalBrands = await User.countDocuments({ userType: 'brand' });
    const totalCollaborations = await Collaboration.countDocuments();
    const activeCollaborations = await Collaboration.countDocuments({ status: 'open' });
    const completedCollaborations = await Collaboration.countDocuments({ status: 'completed' });

    // Monthly user growth
    const currentDate = new Date();
    const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: lastMonth }
    });

    // Revenue calculation (mock for now)
    const totalRevenue = totalCollaborations * 50; // Assuming $50 average commission

    res.json({
      totalUsers,
      totalCreators,
      totalBrands,
      totalCollaborations,
      activeCollaborations,
      completedCollaborations,
      newUsersThisMonth,
      totalRevenue,
      userGrowthRate: ((newUsersThisMonth / totalUsers) * 100).toFixed(1)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all users with pagination and filters
router.get('/users', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, userType, isVerified } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};
    
    if (search) {
      filter.$or = [
        { 'profile.name': { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (userType) filter.userType = userType;
    if (isVerified !== undefined) filter.isVerified = isVerified === 'true';

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user details
router.get('/users/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's collaborations
    const collaborations = await Collaboration.find({
      $or: [
        { brand: req.params.id },
        { creator: req.params.id }
      ]
    }).populate('brand creator', 'profile.name email');

    res.json({ user, collaborations });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user
router.put('/users/:id', adminAuth, async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete user
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Also delete user's collaborations
    await Collaboration.deleteMany({
      $or: [
        { brand: req.params.id },
        { creator: req.params.id }
      ]
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all collaborations with pagination and filters
router.get('/collaborations', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, category } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) filter.status = status;
    if (category) filter.category = category;

    const collaborations = await Collaboration.find(filter)
      .populate('brand', 'profile.name email brandProfile.companyName')
      .populate('creator', 'profile.name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Collaboration.countDocuments(filter);

    res.json({
      collaborations,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update collaboration status
router.put('/collaborations/:id', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const collaboration = await Collaboration.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('brand creator', 'profile.name email');

    if (!collaboration) {
      return res.status(404).json({ message: 'Collaboration not found' });
    }

    res.json(collaboration);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete collaboration
router.delete('/collaborations/:id', adminAuth, async (req, res) => {
  try {
    const collaboration = await Collaboration.findByIdAndDelete(req.params.id);
    if (!collaboration) {
      return res.status(404).json({ message: 'Collaboration not found' });
    }

    res.json({ message: 'Collaboration deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Analytics data for charts
router.get('/analytics', adminAuth, async (req, res) => {
  try {
    // User registration over time (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Collaboration status distribution
    const collaborationStats = await Collaboration.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Category distribution
    const categoryStats = await Collaboration.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.json({
      userGrowth,
      collaborationStats,
      categoryStats
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Platform settings endpoints
router.get('/settings', adminAuth, async (req, res) => {
  try {
    // In a real app, these would be stored in database
    // For now, return default settings
    const settings = {
      siteName: 'Collabstr',
      siteDescription: 'Connect creators with brands for amazing collaborations',
      contactEmail: 'contact@collabstr.com',
      supportEmail: 'support@collabstr.com',
      commissionRate: 10,
      minWithdrawal: 50,
      maxFileSize: 10,
      allowedFileTypes: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov'],
      emailNotifications: true,
      maintenanceMode: false,
      registrationEnabled: true,
      verificationRequired: false
    };
    
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/settings', adminAuth, async (req, res) => {
  try {
    // In a real app, these would be saved to database
    // For now, just return the received settings
    const settings = req.body;
    
    // Here you would validate and save settings to database
    // await Settings.findOneAndUpdate({}, settings, { upsert: true });
    
    res.json({ message: 'Settings updated successfully', settings });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;