const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  category: {
    type: String,
    enum: ['breakfast', 'lunch', 'snacks', 'beverages', 'desserts'],
    required: [true, 'Category is required'],
  },
  image: {
    type: String,
    default: '',
  },
  available: {
    type: Boolean,
    default: true,
  },
  preparationTime: {
    type: Number,
    default: 10, // in minutes
  },
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);
