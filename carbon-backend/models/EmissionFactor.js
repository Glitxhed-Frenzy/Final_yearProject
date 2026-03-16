// carbon-backend/models/EmissionFactor.js
const mongoose = require('mongoose');

const emissionFactorSchema = new mongoose.Schema({
  activityId: {
    type: String,
    required: true,
    unique: true,  // No duplicates
    enum: [
      'car_miles', 'bus_miles', 'train_miles', 'plane_miles',
      'electricity_kwh', 'ac_days', 'heat_days',
      'laptop_hours', 'tv_hours',
      'showers_per_week', 'laundry_per_month',
      'beef_servings', 'chicken_servings', 'vegetarian_meals'
    ]
  },
  category: {
    type: String,
    required: true,
    enum: ['transport', 'home', 'electronics', 'water', 'food']
  },
  name: {
    type: String,
    required: true
  },
  factor: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  description: String,
  source: String,
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('EmissionFactor', emissionFactorSchema);