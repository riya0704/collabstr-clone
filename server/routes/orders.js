const express = require('express');
const Order = require('../models/Order');
const Service = require('../models/Service');
const User = require('../models/User');
const Conversation = require('../models/Conversation');
const auth = require('../middleware/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

// Create new order
router.post('/', auth, async (req, res) => {
  try {
    const { serviceId, packageType, customRequirements, deadline } = req.body;
    
    const service = await Service.findById(serviceId).populate('creator');
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const user = await User.findById(req.userId);
    if (user.userType !== 'brand') {
      return res.status(403).json({ message: 'Only brands can create orders' });
    }

    if (service.creator._id.toString() === req.userId) {
      return res.status(400).json({ message: 'Cannot order your own service' });
    }

    const packageDetails = service.pricing[packageType];
    if (!packageDetails) {
      return res.status(400).json({ message: 'Invalid package type' });
    }

    // Create Stripe PaymentIntent for escrow
    const paymentIntent = await stripe.paymentIntents.create({
      amount: packageDetails.price * 100, // Convert to cents
      currency: 'usd',
      metadata: {
        serviceId: serviceId,
        creatorId: service.creator._id.toString(),
        brandId: req.userId
      }
    });

    const order = new Order({
      brand: req.userId,
      creator: service.creator._id,
      service: serviceId,
      title: `${service.title} - ${packageType.charAt(0).toUpperCase() + packageType.slice(1)} Package`,
      description: packageDetails.description,
      amount: packageDetails.price,
      requirements: customRequirements || service.requirements,
      deadline: deadline || new Date(Date.now() + packageDetails.deliveryTime * 24 * 60 * 60 * 1000),
      payment: {
        stripePaymentIntentId: paymentIntent.id,
        status: 'pending'
      },
      timeline: {
        createdAt: new Date()
      }
    });

    await order.save();

    // Create or find conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [req.userId, service.creator._id] }
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [req.userId, service.creator._id],
        order: order._id,
        service: serviceId
      });
      await conversation.save();
    }

    await order.populate(['brand', 'creator', 'service']);

    res.status(201).json({
      order,
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let filter = {
      $or: [
        { brand: req.userId },
        { creator: req.userId }
      ]
    };

    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate('brand', 'profile.name profile.avatar brandProfile.companyName')
      .populate('creator', 'profile.name profile.avatar')
      .populate('service', 'title category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
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

// Get order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('brand', 'profile.name profile.avatar brandProfile.companyName')
      .populate('creator', 'profile.name profile.avatar')
      .populate('service', 'title category pricing');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is involved in this order
    if (order.brand._id.toString() !== req.userId && order.creator._id.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update order status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status, message } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check authorization based on status change
    const isCreator = order.creator.toString() === req.userId;
    const isBrand = order.brand.toString() === req.userId;

    if (!isCreator && !isBrand) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Status change rules
    const allowedTransitions = {
      pending: ['accepted', 'cancelled'], // Creator can accept/cancel
      accepted: ['in_progress'], // Creator starts work
      in_progress: ['delivered'], // Creator delivers
      delivered: ['completed', 'revision_requested'], // Brand approves or requests revision
      revision_requested: ['in_progress'], // Creator works on revision
      completed: [], // Final state
      cancelled: [], // Final state
      disputed: [] // Handled separately
    };

    if (!allowedTransitions[order.status].includes(status)) {
      return res.status(400).json({ message: 'Invalid status transition' });
    }

    // Authorization checks for specific actions
    if (status === 'accepted' && !isCreator) {
      return res.status(403).json({ message: 'Only creator can accept orders' });
    }
    if (status === 'completed' && !isBrand) {
      return res.status(403).json({ message: 'Only brand can mark as completed' });
    }
    if (status === 'revision_requested' && !isBrand) {
      return res.status(403).json({ message: 'Only brand can request revisions' });
    }

    order.status = status;

    // Update timeline
    switch (status) {
      case 'accepted':
        order.timeline.acceptedAt = new Date();
        order.payment.status = 'held';
        order.payment.heldAt = new Date();
        break;
      case 'in_progress':
        order.timeline.startedAt = new Date();
        break;
      case 'delivered':
        order.timeline.deliveredAt = new Date();
        break;
      case 'completed':
        order.timeline.completedAt = new Date();
        order.payment.status = 'released';
        order.payment.releasedAt = new Date();
        // Release payment to creator
        await releasePayment(order);
        break;
      case 'revision_requested':
        order.revisions.push({
          reason: message,
          requestedAt: new Date()
        });
        break;
    }

    await order.save();
    await order.populate(['brand', 'creator', 'service']);

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Upload deliverables
router.post('/:id/deliverables', auth, async (req, res) => {
  try {
    const { deliverables } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.creator.toString() !== req.userId) {
      return res.status(403).json({ message: 'Only creator can upload deliverables' });
    }

    order.deliverables = deliverables.map(d => ({
      ...d,
      uploadedAt: new Date()
    }));

    if (order.status === 'in_progress') {
      order.status = 'delivered';
      order.timeline.deliveredAt = new Date();
    }

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Release payment (internal function)
async function releasePayment(order) {
  try {
    // In a real implementation, you would transfer funds to the creator
    // This is a simplified version
    console.log(`Payment of $${order.amount} released to creator ${order.creator}`);
    
    // Update service stats
    await Service.findByIdAndUpdate(order.service, {
      $inc: { 'stats.orders': 1 }
    });
  } catch (error) {
    console.error('Error releasing payment:', error);
  }
}

module.exports = router;