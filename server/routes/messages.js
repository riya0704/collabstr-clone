const express = require('express');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user's conversations
router.get('/conversations', auth, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.userId,
      isArchived: false
    })
    .populate('participants', 'profile.name profile.avatar userType')
    .populate('lastMessage')
    .populate('order', 'orderNumber status')
    .populate('service', 'title')
    .sort({ lastActivity: -1 });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get conversation messages
router.get('/conversations/:conversationId', auth, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    if (!conversation.participants.includes(req.userId)) {
      return res.status(403).json({ message: 'Not authorized to view this conversation' });
    }

    const messages = await Message.find({ 
      conversation: conversationId,
      isDeleted: false 
    })
    .populate('sender', 'profile.name profile.avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

    // Mark messages as read
    await Message.updateMany(
      { 
        conversation: conversationId, 
        recipient: req.userId, 
        isRead: false 
      },
      { 
        isRead: true, 
        readAt: new Date() 
      }
    );

    // Update unread count
    conversation.unreadCount.set(req.userId, 0);
    await conversation.save();

    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Send message
router.post('/conversations/:conversationId/messages', auth, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content, messageType = 'text', attachments = [] } = req.body;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    if (!conversation.participants.includes(req.userId)) {
      return res.status(403).json({ message: 'Not authorized to send messages in this conversation' });
    }

    const recipient = conversation.participants.find(p => p.toString() !== req.userId);

    const message = new Message({
      conversation: conversationId,
      sender: req.userId,
      recipient: recipient,
      content,
      messageType,
      attachments
    });

    await message.save();
    await message.populate('sender', 'profile.name profile.avatar');

    // Update conversation
    conversation.lastMessage = message._id;
    conversation.lastActivity = new Date();
    
    // Update unread count for recipient
    const currentUnread = conversation.unreadCount.get(recipient.toString()) || 0;
    conversation.unreadCount.set(recipient.toString(), currentUnread + 1);
    
    await conversation.save();

    // Emit real-time message (handled by socket.io)
    req.io.to(`user_${recipient}`).emit('new_message', {
      conversationId,
      message: {
        _id: message._id,
        content: message.content,
        sender: message.sender,
        createdAt: message.createdAt,
        messageType: message.messageType,
        attachments: message.attachments
      }
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new conversation
router.post('/conversations', auth, async (req, res) => {
  try {
    const { recipientId, serviceId, orderId } = req.body;

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [req.userId, recipientId] }
    });

    if (conversation) {
      return res.json(conversation);
    }

    conversation = new Conversation({
      participants: [req.userId, recipientId],
      service: serviceId,
      order: orderId
    });

    await conversation.save();
    await conversation.populate('participants', 'profile.name profile.avatar userType');

    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Mark conversation as archived
router.patch('/conversations/:conversationId/archive', auth, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId);
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    if (!conversation.participants.includes(req.userId)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    conversation.isArchived = true;
    await conversation.save();

    res.json({ message: 'Conversation archived' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;