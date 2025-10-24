const express = require('express');
const mongoose = require('mongoose');
const Analytics = require('../models/Analytics');
const Order = require('../models/Order');
const Service = require('../models/Service');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user analytics dashboard
router.get('/dashboard', auth, async (req, res) => {
  try {
    const { period = 'monthly', startDate, endDate } = req.query;
    const user = await User.findById(req.userId);
    
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else {
      // Default to last 30 days
      dateFilter.createdAt = {
        $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      };
    }

    let analytics = {};

    if (user.userType === 'creator') {
      analytics = await getCreatorAnalytics(req.userId, dateFilter, period);
    } else if (user.userType === 'brand') {
      analytics = await getBrandAnalytics(req.userId, dateFilter, period);
    }

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get revenue analytics
router.get('/revenue', auth, async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;
    const user = await User.findById(req.userId);

    if (user.userType !== 'creator') {
      return res.status(403).json({ message: 'Only creators can view revenue analytics' });
    }

    const revenueData = await Order.aggregate([
      {
        $match: {
          creator: new mongoose.Types.ObjectId(req.userId),
          status: 'completed'
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            ...(period === 'daily' && { day: { $dayOfMonth: '$createdAt' } })
          },
          totalRevenue: { $sum: '$pricing.creatorEarnings' },
          orderCount: { $sum: 1 },
          averageOrderValue: { $avg: '$pricing.creatorEarnings' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    // Get top performing services
    const topServices = await Order.aggregate([
      {
        $match: {
          creator: new mongoose.Types.ObjectId(req.userId),
          status: 'completed'
        }
      },
      {
        $group: {
          _id: '$service',
          revenue: { $sum: '$pricing.creatorEarnings' },
          orders: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'services',
          localField: '_id',
          foreignField: '_id',
          as: 'serviceInfo'
        }
      },
      {
        $unwind: '$serviceInfo'
      },
      {
        $project: {
          title: '$serviceInfo.title',
          revenue: 1,
          orders: 1
        }
      },
      {
        $sort: { revenue: -1 }
      },
      {
        $limit: 5
      }
    ]);

    res.json({
      revenueData,
      topServices,
      summary: {
        totalRevenue: revenueData.reduce((sum, item) => sum + item.totalRevenue, 0),
        totalOrders: revenueData.reduce((sum, item) => sum + item.orderCount, 0),
        averageOrderValue: revenueData.length > 0 
          ? revenueData.reduce((sum, item) => sum + item.averageOrderValue, 0) / revenueData.length 
          : 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get performance metrics
router.get('/performance', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (user.userType === 'creator') {
      const services = await Service.find({ creator: req.userId });
      const orders = await Order.find({ creator: req.userId });
      
      const metrics = {
        totalServices: services.length,
        activeServices: services.filter(s => s.isActive).length,
        totalOrders: orders.length,
        completedOrders: orders.filter(o => o.status === 'completed').length,
        averageRating: services.reduce((sum, s) => sum + s.stats.rating, 0) / services.length || 0,
        totalViews: services.reduce((sum, s) => sum + s.stats.views, 0),
        conversionRate: services.length > 0 
          ? (orders.length / services.reduce((sum, s) => sum + s.stats.views, 0)) * 100 
          : 0,
        responseTime: await getAverageResponseTime(req.userId)
      };

      res.json(metrics);
    } else {
      // Brand metrics
      const orders = await Order.find({ brand: req.userId });
      const completedOrders = orders.filter(o => o.status === 'completed');
      
      const metrics = {
        totalOrders: orders.length,
        completedOrders: completedOrders.length,
        totalSpent: completedOrders.reduce((sum, o) => sum + o.pricing.amount, 0),
        averageOrderValue: completedOrders.length > 0 
          ? completedOrders.reduce((sum, o) => sum + o.pricing.amount, 0) / completedOrders.length 
          : 0,
        successRate: orders.length > 0 ? (completedOrders.length / orders.length) * 100 : 0
      };

      res.json(metrics);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Helper functions
async function getCreatorAnalytics(userId, dateFilter, period) {
  const orders = await Order.find({
    creator: userId,
    ...dateFilter
  });

  const services = await Service.find({ creator: userId });
  
  const completedOrders = orders.filter(o => o.status === 'completed');
  const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.pricing?.creatorEarnings || 0), 0);
  
  return {
    overview: {
      totalRevenue,
      totalOrders: orders.length,
      completedOrders: completedOrders.length,
      activeServices: services.filter(s => s.isActive).length,
      averageRating: services.reduce((sum, s) => sum + s.stats.rating, 0) / services.length || 0
    },
    chartData: await getChartData(userId, 'creator', period),
    topServices: services
      .sort((a, b) => b.stats.orders - a.stats.orders)
      .slice(0, 5)
      .map(s => ({
        name: s.title,
        orders: s.stats.orders,
        revenue: completedOrders
          .filter(o => o.service.toString() === s._id.toString())
          .reduce((sum, o) => sum + (o.pricing?.creatorEarnings || 0), 0)
      }))
  };
}

async function getBrandAnalytics(userId, dateFilter, period) {
  const orders = await Order.find({
    brand: userId,
    ...dateFilter
  });

  const completedOrders = orders.filter(o => o.status === 'completed');
  const totalSpent = completedOrders.reduce((sum, o) => sum + (o.pricing?.amount || 0), 0);

  return {
    overview: {
      totalSpent,
      totalOrders: orders.length,
      completedOrders: completedOrders.length,
      averageOrderValue: completedOrders.length > 0 ? totalSpent / completedOrders.length : 0,
      successRate: orders.length > 0 ? (completedOrders.length / orders.length) * 100 : 0
    },
    chartData: await getChartData(userId, 'brand', period),
    topCategories: await getTopCategories(userId)
  };
}

async function getChartData(userId, userType, period) {
  const matchField = userType === 'creator' ? 'creator' : 'brand';
  
  const groupBy = period === 'daily' 
    ? { year: { $year: '$createdAt' }, month: { $month: '$createdAt' }, day: { $dayOfMonth: '$createdAt' } }
    : { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } };

  return await Order.aggregate([
    {
      $match: {
        [matchField]: new mongoose.Types.ObjectId(userId),
        status: 'completed'
      }
    },
    {
      $group: {
        _id: groupBy,
        value: { $sum: userType === 'creator' ? '$pricing.creatorEarnings' : '$pricing.amount' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
    }
  ]);
}

async function getTopCategories(userId) {
  return await Order.aggregate([
    {
      $match: {
        brand: new mongoose.Types.ObjectId(userId),
        status: 'completed'
      }
    },
    {
      $lookup: {
        from: 'services',
        localField: 'service',
        foreignField: '_id',
        as: 'serviceInfo'
      }
    },
    {
      $unwind: '$serviceInfo'
    },
    {
      $group: {
        _id: '$serviceInfo.category',
        spent: { $sum: '$pricing.amount' },
        orders: { $sum: 1 }
      }
    },
    {
      $sort: { spent: -1 }
    },
    {
      $limit: 5
    }
  ]);
}

async function getAverageResponseTime(userId) {
  // This would calculate average response time from messages
  // Simplified implementation
  return 2.5; // hours
}

module.exports = router;