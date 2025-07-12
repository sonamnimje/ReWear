const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user's exchanges
router.get('/my-exchanges', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT e.*, i.title as item_title, i.image_urls as item_images,
             u1.username as offering_username, u2.username as requesting_username
      FROM exchanges e
      JOIN items i ON e.item_id = i.id
      JOIN users u1 ON e.offering_user_id = u1.id
      JOIN users u2 ON e.requesting_user_id = u2.id
      WHERE e.offering_user_id = $1 OR e.requesting_user_id = $1
      ORDER BY e.created_at DESC
    `, [req.user.id]);

    res.json(result.rows);
  } catch (error) {
    console.error('Get exchanges error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create exchange request
router.post('/', auth, [
  body('item_id').isInt(),
  body('exchange_type').isIn(['direct_swap', 'points_exchange']),
  body('message').optional().trim(),
  body('points_exchanged').optional().isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { item_id, exchange_type, message, points_exchanged } = req.body;

    // Check if item exists and is available
    const itemResult = await pool.query(
      'SELECT * FROM items WHERE id = $1 AND is_available = true',
      [item_id]
    );

    if (itemResult.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found or not available' });
    }

    const item = itemResult.rows[0];

    // Check if user is not trying to exchange their own item
    if (item.owner_id === req.user.id) {
      return res.status(400).json({ error: 'Cannot exchange your own item' });
    }

    // Check if points exchange is valid
    if (exchange_type === 'points_exchange') {
      if (!points_exchanged || points_exchanged < item.price_points) {
        return res.status(400).json({ 
          error: `Insufficient points. Item requires ${item.price_points} points.` 
        });
      }

      // Check if user has enough points
      const userResult = await pool.query(
        'SELECT points FROM users WHERE id = $1',
        [req.user.id]
      );

      if (userResult.rows[0].points < points_exchanged) {
        return res.status(400).json({ error: 'Insufficient points' });
      }
    }

    // Check if exchange already exists
    const existingExchange = await pool.query(
      'SELECT * FROM exchanges WHERE item_id = $1 AND requesting_user_id = $2 AND status = $3',
      [item_id, req.user.id, 'pending']
    );

    if (existingExchange.rows.length > 0) {
      return res.status(400).json({ error: 'Exchange request already exists' });
    }

    // Create exchange
    const result = await pool.query(`
      INSERT INTO exchanges (item_id, offering_user_id, requesting_user_id, exchange_type, message, points_exchanged)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [item_id, item.owner_id, req.user.id, exchange_type, message, points_exchanged || 0]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create exchange error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Accept exchange
router.put('/:id/accept', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Get exchange details
    const exchangeResult = await pool.query(`
      SELECT e.*, i.owner_id, i.price_points
      FROM exchanges e
      JOIN items i ON e.item_id = i.id
      WHERE e.id = $1
    `, [id]);

    if (exchangeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Exchange not found' });
    }

    const exchange = exchangeResult.rows[0];

    // Check if user owns the item
    if (exchange.owner_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Check if exchange is pending
    if (exchange.status !== 'pending') {
      return res.status(400).json({ error: 'Exchange is not pending' });
    }

    // Update exchange status
    await pool.query(
      'UPDATE exchanges SET status = $1 WHERE id = $2',
      ['accepted', id]
    );

    // Handle points exchange
    if (exchange.exchange_type === 'points_exchange') {
      // Transfer points from requesting user to offering user
      await pool.query(
        'UPDATE users SET points = points - $1 WHERE id = $2',
        [exchange.points_exchanged, exchange.requesting_user_id]
      );

      await pool.query(
        'UPDATE users SET points = points + $1 WHERE id = $2',
        [exchange.points_exchanged, exchange.offering_user_id]
      );
    }

    // Mark item as unavailable
    await pool.query(
      'UPDATE items SET is_available = false WHERE id = $1',
      [exchange.item_id]
    );

    res.json({ message: 'Exchange accepted successfully' });
  } catch (error) {
    console.error('Accept exchange error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reject exchange
router.put('/:id/reject', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Get exchange details
    const exchangeResult = await pool.query(`
      SELECT e.*, i.owner_id
      FROM exchanges e
      JOIN items i ON e.item_id = i.id
      WHERE e.id = $1
    `, [id]);

    if (exchangeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Exchange not found' });
    }

    const exchange = exchangeResult.rows[0];

    // Check if user owns the item
    if (exchange.owner_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Update exchange status
    await pool.query(
      'UPDATE exchanges SET status = $1 WHERE id = $2',
      ['rejected', id]
    );

    res.json({ message: 'Exchange rejected successfully' });
  } catch (error) {
    console.error('Reject exchange error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Complete exchange
router.put('/:id/complete', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Get exchange details
    const exchangeResult = await pool.query(`
      SELECT e.*, i.owner_id
      FROM exchanges e
      JOIN items i ON e.item_id = i.id
      WHERE e.id = $1
    `, [id]);

    if (exchangeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Exchange not found' });
    }

    const exchange = exchangeResult.rows[0];

    // Check if user is involved in the exchange
    if (exchange.offering_user_id !== req.user.id && exchange.requesting_user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Update exchange status
    await pool.query(
      'UPDATE exchanges SET status = $1 WHERE id = $2',
      ['completed', id]
    );

    res.json({ message: 'Exchange completed successfully' });
  } catch (error) {
    console.error('Complete exchange error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Cancel exchange
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Get exchange details
    const exchangeResult = await pool.query(`
      SELECT e.*, i.owner_id
      FROM exchanges e
      JOIN items i ON e.item_id = i.id
      WHERE e.id = $1
    `, [id]);

    if (exchangeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Exchange not found' });
    }

    const exchange = exchangeResult.rows[0];

    // Check if user is involved in the exchange
    if (exchange.offering_user_id !== req.user.id && exchange.requesting_user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Update exchange status
    await pool.query(
      'UPDATE exchanges SET status = $1 WHERE id = $2',
      ['cancelled', id]
    );

    res.json({ message: 'Exchange cancelled successfully' });
  } catch (error) {
    console.error('Cancel exchange error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 