const express = require('express');
const Collaboration = require('../models/Collaboration');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all collaborations
router.get('/', async (req, res) => {
  try {
    const { category, budget, location } = req.query;
    let filter = { status: 'open' };
    
    if (category) filter.category = category;
    if (location) filter['requirements.location'] = new RegExp(location, 'i');

    const collaborations = await Collaboration.find(filter)
      .populate('brand', 'profile.name profile.avatar brandProfile.companyName')
      .sort({ createdAt: -1 });

    res.json(collaborations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create collaboration
router.post('/', auth, async (req, res) => {
  try {
    const collaboration = new Collaboration({
      ...req.body,
      brand: req.userId
    });

    await collaboration.save();
    await collaboration.populate('brand', 'profile.name brandProfile.companyName');

    res.status(201).json(collaboration);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Apply to collaboration
router.post('/:id/apply', auth, async (req, res) => {
  try {
    const { message, proposedRate } = req.body;
    
    const collaboration = await Collaboration.findById(req.params.id);
    if (!collaboration) {
      return res.status(404).json({ message: 'Collaboration not found' });
    }

    // Check if already applied
    const existingApplication = collaboration.applications.find(
      app => app.creator.toString() === req.userId
    );
    
    if (existingApplication) {
      return res.status(400).json({ message: 'Already applied to this collaboration' });
    }

    collaboration.applications.push({
      creator: req.userId,
      message,
      proposedRate
    });

    await collaboration.save();
    res.json({ message: 'Application submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;