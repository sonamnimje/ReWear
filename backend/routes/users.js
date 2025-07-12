const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const cloudinary = require('../config/cloudinary');

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, username, email, full_name, bio, avatar_url, points, created_at
      FROM users WHERE id = $1
    `, [req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, [
  body('full_name').optional().trim().escape(),
  body('bio').optional().trim().escape()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { full_name, bio } = req.body;

    const result = await pool.query(`
      UPDATE users 
      SET full_name = COALESCE($1, full_name),
          bio = COALESCE($2, bio),
          updated_at = NOW()
      WHERE id = $3
      RETURNING id, username, email, full_name, bio, avatar_url, points, created_at
    `, [full_name, bio, req.user.id]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Upload avatar
router.post('/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'rewear-avatars',
      transformation: [
        { width: 200, height: 200, crop: 'fill' }
      ]
    });

    // Update user avatar
    await pool.query(
      'UPDATE users SET avatar_url = $1 WHERE id = $2',
      [result.secure_url, req.user.id]
    );

    res.json({ avatar_url: result.secure_url });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.points,
        COUNT(DISTINCT i.id) as items_listed,
        COUNT(DISTINCT CASE WHEN i.is_available = true THEN i.id END) as active_items,
        COUNT(DISTINCT e.id) as total_exchanges,
        COUNT(DISTINCT CASE WHEN e.status = 'completed' THEN e.id END) as completed_exchanges,
        COUNT(DISTINCT CASE WHEN e.status = 'pending' THEN e.id END) as pending_exchanges
      FROM users u
      LEFT JOIN items i ON u.id = i.owner_id
      LEFT JOIN exchanges e ON (u.id = e.offering_user_id OR u.id = e.requesting_user_id)
      WHERE u.id = $1
      GROUP BY u.id, u.points
    `, [req.user.id]);

    const stats = result.rows[0] || {
      points: 0,
      items_listed: 0,
      active_items: 0,
      total_exchanges: 0,
      completed_exchanges: 0,
      pending_exchanges: 0
    };

    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's items
router.get('/my-items', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM items 
      WHERE owner_id = $1 
      ORDER BY created_at DESC
    `, [req.user.id]);

    res.json(result.rows);
  } catch (error) {
    console.error('Get my items error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user by username (public profile)
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;

    const result = await pool.query(`
      SELECT id, username, full_name, bio, avatar_url, created_at
      FROM users WHERE username = $1
    `, [username]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's public items
    const itemsResult = await pool.query(`
      SELECT id, title, category, condition, image_urls, created_at
      FROM items 
      WHERE owner_id = $1 AND is_available = true
      ORDER BY created_at DESC
      LIMIT 10
    `, [result.rows[0].id]);

    res.json({
      user: result.rows[0],
      items: itemsResult.rows
    });
  } catch (error) {
    console.error('Get user by username error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 