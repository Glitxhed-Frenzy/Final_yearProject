// carbon-backend/scripts/seedFactors.js
const mongoose = require('mongoose');
const EmissionFactor = require('../models/EmissionFactor');
require('dotenv').config();

const factors = [
  // TRANSPORT
  {
    activityId: 'car_miles',
    category: 'transport',
    name: 'Car Travel',
    factor: 0.20,
    unit: 'kg CO₂ per mile',
    source: 'EPA',
    description: 'Average passenger vehicle'
  },
  {
    activityId: 'bus_miles',
    category: 'transport',
    name: 'Bus Travel',
    factor: 0.08,
    unit: 'kg CO₂ per mile',
    source: 'EPA',
    description: 'City bus'
  },
  {
    activityId: 'train_miles',
    category: 'transport',
    name: 'Train Travel',
    factor: 0.05,
    unit: 'kg CO₂ per mile',
    source: 'EPA',
    description: 'Commuter rail'
  },
  {
    activityId: 'plane_miles',
    category: 'transport',
    name: 'Air Travel',
    factor: 0.25,
    unit: 'kg CO₂ per mile',
    source: 'ICAO',
    description: 'Domestic flight'
  },

  // HOME ENERGY
  {
    activityId: 'electricity_kwh',
    category: 'home',
    name: 'Electricity Usage',
    factor: 0.82,
    unit: 'kg CO₂ per kWh',
    source: 'EIA',
    description: 'Grid electricity'
  },
  {
    activityId: 'ac_days',
    category: 'home',
    name: 'Air Conditioner',
    factor: 2.5,
    unit: 'kg CO₂ per day',
    source: 'EPA',
    description: 'Central AC running'
  },
  {
    activityId: 'heat_days',
    category: 'home',
    name: 'Heating',
    factor: 2.0,
    unit: 'kg CO₂ per day',
    source: 'EPA',
    description: 'Furnace running'
  },

  // ELECTRONICS
  {
    activityId: 'laptop_hours',
    category: 'electronics',
    name: 'Laptop Usage',
    factor: 0.05,
    unit: 'kg CO₂ per hour',
    source: 'Berkeley Lab',
    description: 'Laptop plugged in'
  },
  {
    activityId: 'tv_hours',
    category: 'electronics',
    name: 'Television',
    factor: 0.04,
    unit: 'kg CO₂ per hour',
    source: 'EPA',
    description: 'LED TV'
  },

  // WATER
  {
    activityId: 'showers_per_week',
    category: 'water',
    name: 'Showers',
    factor: 0.5,
    unit: 'kg CO₂ per shower',
    source: 'Water Research',
    description: '10-minute shower'
  },
  {
    activityId: 'laundry_per_month',
    category: 'water',
    name: 'Laundry',
    factor: 0.3,
    unit: 'kg CO₂ per load',
    source: 'EPA',
    description: 'Washing machine'
  },

  // FOOD
  {
    activityId: 'beef_servings',
    category: 'food',
    name: 'Beef',
    factor: 3.5,
    unit: 'kg CO₂ per serving',
    source: 'FAO',
    description: 'Beef consumption'
  },
  {
    activityId: 'chicken_servings',
    category: 'food',
    name: 'Chicken',
    factor: 1.2,
    unit: 'kg CO₂ per serving',
    source: 'FAO',
    description: 'Chicken consumption'
  },
  {
    activityId: 'vegetarian_meals',
    category: 'food',
    name: 'Vegetarian Meal',
    factor: 0.3,
    unit: 'kg CO₂ per meal',
    source: 'FAO',
    description: 'Plant-based meal'
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    // Clear existing factors
    await EmissionFactor.deleteMany({});
    console.log('🧹 Cleared existing factors');

    // Insert new factors
    await EmissionFactor.insertMany(factors);
    console.log(`✅ Inserted ${factors.length} emission factors`);

    // Show sample
    const sample = await EmissionFactor.findOne();
    console.log('📋 Sample factor:', sample);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedDatabase();