const express = require('express');
const router = express.Router();
const { getAllItems, getItemById, addItem, updateItem, deleteItem } = require('../controller/menuController');
const { protect, adminOnly } = require('../middleware/auth');

// Public routes
router.get('/', getAllItems);
router.get('/:id', getItemById);

// Admin-only routes
router.post('/', protect, adminOnly, addItem);
router.put('/:id', protect, adminOnly, updateItem);
router.delete('/:id', protect, adminOnly, deleteItem);

module.exports = router;
