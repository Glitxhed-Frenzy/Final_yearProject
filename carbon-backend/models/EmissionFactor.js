// models/EmissionFactor.js
const mongoose = require('mongoose');

const emissionFactorSchema = new mongoose.Schema({
  activityId: {
    type: String,
    required: true,
    unique: true,
    enum: [
      // Transport - Car
      'car_hatchback_petrol', 'car_hatchback_diesel',
      'car_sedan_petrol', 'car_sedan_diesel', 'car_sedan_hybrid', 'car_sedan_electric',
      'car_suv_petrol', 'car_suv_diesel', 'car_suv_hybrid', 'car_suv_electric',
      'car_muv_petrol', 'car_muv_diesel', 'car_muv_hybrid', 'car_muv_electric',
      // Transport - Bus, Train, Plane
      'bus_km', 'train_local', 'train_express', 'plane_km',
      // Electricity
      'electricity_kwh', 'ac_hours', 'heater_hours', 'laptop_hours', 'tv_hours',
      // Waste
      'food_waste_kg', 'plastic_waste_kg', 'paper_waste_kg', 'metal_waste_kg', 'ewaste_kg',
      // Food
      'chicken_servings', 'fish_servings', 'dairy_servings', 'vegetarian_meals'
    ]
  },
  category: {
    type: String,
    required: true,
    enum: ['transport', 'electricity', 'waste', 'food']
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