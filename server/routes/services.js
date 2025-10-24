const express = require('express');
const mongoose = require('mongoose');
const Service = require('../models/Service');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all services with filters and pagination
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      category, 
      minPrice, 
      maxPrice, 
      search, 
      sortBy = 'createdAt',
      sortOrder = 'desc',
      deliveryTime,
      rating
    } = req.query;

    const skip = (page - 1) * limit;
    let filter = { isActive: true };

    // Apply filters
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Price filter (using basic tier)
    if (minPrice || maxPrice) {
      filter['pricing.basic.price'] = {};
      if (minPrice) filter['pricing.basic.price'].$gte = parseInt(minPrice);
      if (maxPrice) filter['pricing.basic.price'].$lte = parseInt(maxPrice);
    }

    // Delivery time filter
    if (deliveryTime) {
      filter['pricing.basic.deliveryTime'] = { $lte: parseInt(deliveryTime) };
    }

    // Rating filter
    if (rating) {
      filter['stats.rating'] = { $gte: parseFloat(rating) };
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const services = await Service.find(filter)
      .populate('creator', 'profile.name profile.avatar isVerified creatorProfile.categories')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Service.countDocuments(filter);

    res.json({
      services,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get service by ID or slug
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    
    let service;
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      service = await Service.findById(identifier);
    } else {
      service = await Service.findOne({ 'seo.slug': identifier });
    }

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Increment view count
    service.stats.views += 1;
    await service.save();

    await service.populate('creator', 'profile.name profile.avatar profile.location isVerified creatorProfile');

    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new service (creators only)
router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user.userType !== 'creator') {
      return res.status(403).json({ message: 'Only creators can create services' });
    }

    const service = new Service({
      ...req.body,
      creator: req.userId
    });

    await service.save();
    await service.populate('creator', 'profile.name profile.avatar');

    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update service
router.put('/:id', auth, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (service.creator.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this service' });
    }

    Object.assign(service, req.body);
    await service.save();

    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete service
router.delete('/:id', auth, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (service.creator.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this service' });
    }

    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get creator's services
router.get('/creator/:creatorId', async (req, res) => {
  try {
    const { creatorId } = req.params;
    const { page = 1, limit = 12 } = req.query;
    const skip = (page - 1) * limit;

    const services = await Service.find({ 
      creator: creatorId, 
      isActive: true 
    })
    .populate('creator', 'profile.name profile.avatar isVerified')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

    const total = await Service.countDocuments({ 
      creator: creatorId, 
      isActive: true 
    });

    res.json({
      services,
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

module.exports = router;