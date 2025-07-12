const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const cloudinary = require('../config/cloudinary');

const router = express.Router();

// Get all items with filters
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT i.*, u.username as owner_username, u.avatar_url as owner_avatar
      FROM items i
      JOIN users u ON i.owner_id = u.id
      WHERE i.is_available = true
    `;
    const params = [];
    let paramCount = 0;

    if (category) {
      paramCount++;
      query += ` AND i.category = $${paramCount}`;
      params.push(category);
    }

    if (search) {
      paramCount++;
      query += ` AND (i.title ILIKE $${paramCount} OR i.description ILIKE $${paramCount} OR i.brand ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY i.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    
    res.json({
      items: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: result.rows.length
      }
    });
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get featured items
router.get('/featured', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT i.*, u.username as owner_username, u.avatar_url as owner_avatar
      FROM items i
      JOIN users u ON i.owner_id = u.id
      WHERE i.is_featured = true AND i.is_available = true
      ORDER BY i.created_at DESC
      LIMIT 10
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get featured items error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single item
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT i.*, u.username as owner_username, u.avatar_url as owner_avatar, u.points as owner_points
      FROM items i
      JOIN users u ON i.owner_id = u.id
      WHERE i.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new item
router.post('/', auth, [
  body('title').notEmpty().trim(),
  body('category').isIn(['tops', 'bottoms', 'dresses', 'outerwear', 'shoes', 'accessories', 'bags', 'other']),
  body('condition').isIn(['new', 'like_new', 'good', 'fair', 'poor']),
  body('price_points').isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      description,
      category,
      condition,
      size,
      brand,
      color,
      material,
      price_points
    } = req.body;

    const result = await pool.query(`
      INSERT INTO items (title, description, category, condition, size, brand, color, material, price_points, owner_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [title, description, category, condition, size, brand, color, material, price_points, req.user.id]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update item
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      category,
      condition,
      size,
      brand,
      color,
      material,
      price_points,
      is_available
    } = req.body;

    // Check if user owns the item
    const itemCheck = await pool.query(
      'SELECT owner_id FROM items WHERE id = $1',
      [id]
    );

    if (itemCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (itemCheck.rows[0].owner_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const result = await pool.query(`
      UPDATE items 
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          category = COALESCE($3, category),
          condition = COALESCE($4, condition),
          size = COALESCE($5, size),
          brand = COALESCE($6, brand),
          color = COALESCE($7, color),
          material = COALESCE($8, material),
          price_points = COALESCE($9, price_points),
          is_available = COALESCE($10, is_available),
          updated_at = NOW()
      WHERE id = $11
      RETURNING *
    `, [title, description, category, condition, size, brand, color, material, price_points, is_available, id]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete item
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user owns the item
    const itemCheck = await pool.query(
      'SELECT owner_id FROM items WHERE id = $1',
      [id]
    );

    if (itemCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (itemCheck.rows[0].owner_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await pool.query('DELETE FROM items WHERE id = $1', [id]);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Upload item image
router.post('/:id/images', auth, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Check if user owns the item
    const itemCheck = await pool.query(
      'SELECT owner_id FROM items WHERE id = $1',
      [id]
    );

    if (itemCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (itemCheck.rows[0].owner_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'rewear-items',
      transformation: [
        { width: 800, height: 800, crop: 'fill' }
      ]
    });

    // Update item with image URL
    const currentImages = await pool.query(
      'SELECT image_urls FROM items WHERE id = $1',
      [id]
    );

    let imageUrls = [];
    if (currentImages.rows[0].image_urls) {
      imageUrls = JSON.parse(currentImages.rows[0].image_urls);
    }
    imageUrls.push(result.secure_url);

    await pool.query(
      'UPDATE items SET image_urls = $1 WHERE id = $2',
      [JSON.stringify(imageUrls), id]
    );

    res.json({ image_url: result.secure_url });
  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 