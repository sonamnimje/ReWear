const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Simple AI response function (placeholder for Llama 2 integration)
const generateAIResponse = async (message, userId) => {
  // This is a placeholder - in production, you'd integrate with Llama 2
  const responses = {
    greeting: [
      "Hello! I'm SmartChain AI, your sustainable fashion assistant. How can I help you today?",
      "Hi there! I'm here to help you with your ReWear experience. What would you like to know?",
      "Welcome to ReWear! I'm SmartChain AI, ready to assist you with clothing exchanges and sustainability tips."
    ],
    help: [
      "I can help you with:\n• Finding clothing items\n• Understanding the exchange process\n• Sustainability tips\n• Account management\nWhat would you like to know?",
      "Here's what I can assist you with:\n• Browse and search items\n• Learn about points system\n• Get sustainability advice\n• Manage your profile\nHow can I help?"
    ],
    exchange: [
      "To exchange items, you can either:\n1. Direct swap: Offer an item in return\n2. Points exchange: Use your earned points\nWhich method interests you?",
      "There are two ways to exchange:\n• Direct swaps with other users\n• Point-based purchases\nWould you like to learn more about either option?"
    ],
    points: [
      "You earn points by:\n• Listing items (10 points)\n• Completing exchanges (20 points)\n• Community contributions (5 points)\nYou can spend points on items you want!",
      "Points are earned through participation:\n• Adding items to the platform\n• Successful exchanges\n• Helping the community\nThey can be used to get items you want."
    ],
    sustainability: [
      "Great question! ReWear promotes sustainability by:\n• Reducing textile waste\n• Extending clothing lifecycle\n• Building conscious consumption habits\n• Creating a circular fashion economy",
      "Sustainability is at our core:\n• We keep clothes in circulation\n• Reduce environmental impact\n• Promote mindful consumption\n• Build eco-friendly communities"
    ],
    default: [
      "I'm here to help with your ReWear experience. Try asking about exchanges, points, sustainability, or how to get started!",
      "That's an interesting question! I can help with exchanges, points, sustainability tips, or general ReWear guidance. What would you like to know?"
    ]
  };

  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
  } else if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
    return responses.help[Math.floor(Math.random() * responses.help.length)];
  } else if (lowerMessage.includes('exchange') || lowerMessage.includes('swap') || lowerMessage.includes('trade')) {
    return responses.exchange[Math.floor(Math.random() * responses.exchange.length)];
  } else if (lowerMessage.includes('point') || lowerMessage.includes('earn') || lowerMessage.includes('spend')) {
    return responses.points[Math.floor(Math.random() * responses.points.length)];
  } else if (lowerMessage.includes('sustain') || lowerMessage.includes('environment') || lowerMessage.includes('eco')) {
    return responses.sustainability[Math.floor(Math.random() * responses.sustainability.length)];
  } else {
    return responses.default[Math.floor(Math.random() * responses.default.length)];
  }
};

// Send message to SmartChain AI
router.post('/send', auth, [
  body('message').notEmpty().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { message } = req.body;
    const userId = req.user.id;

    // Generate AI response
    const aiResponse = await generateAIResponse(message, userId);

    // Save chat message to database
    const result = await pool.query(`
      INSERT INTO chat_messages (user_id, message, response, is_ai_response)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [userId, message, aiResponse, true]);

    res.json({
      message: result.rows[0],
      response: aiResponse
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get chat history
router.get('/history', auth, async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    const result = await pool.query(`
      SELECT * FROM chat_messages 
      WHERE user_id = $1 
      ORDER BY created_at DESC 
      LIMIT $2
    `, [req.user.id, limit]);

    res.json(result.rows.reverse()); // Return in chronological order
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get AI suggestions based on user activity
router.get('/suggestions', auth, async (req, res) => {
  try {
    // Get user's recent activity
    const userStats = await pool.query(`
      SELECT 
        COUNT(DISTINCT i.id) as items_listed,
        COUNT(DISTINCT e.id) as exchanges_made,
        u.points
      FROM users u
      LEFT JOIN items i ON u.id = i.owner_id
      LEFT JOIN exchanges e ON (u.id = e.offering_user_id OR u.id = e.requesting_user_id)
      WHERE u.id = $1
      GROUP BY u.id, u.points
    `, [req.user.id]);

    const stats = userStats.rows[0] || { items_listed: 0, exchanges_made: 0, points: 0 };

    const suggestions = [];

    if (stats.items_listed === 0) {
      suggestions.push({
        type: 'action',
        title: 'List Your First Item',
        message: 'Start contributing to the community by listing an item you no longer need.',
        action: 'add-item'
      });
    }

    if (stats.exchanges_made === 0) {
      suggestions.push({
        type: 'info',
        title: 'How Exchanges Work',
        message: 'Learn about direct swaps and point-based exchanges to get started.',
        action: 'learn-exchanges'
      });
    }

    if (stats.points < 50) {
      suggestions.push({
        type: 'tip',
        title: 'Earn More Points',
        message: 'List items and complete exchanges to earn points for future purchases.',
        action: 'earn-points'
      });
    }

    suggestions.push({
      type: 'sustainability',
      title: 'Sustainability Impact',
      message: 'Every exchange helps reduce textile waste. You\'re making a difference!',
      action: 'sustainability-info'
    });

    res.json({ suggestions });
  } catch (error) {
    console.error('Get suggestions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 