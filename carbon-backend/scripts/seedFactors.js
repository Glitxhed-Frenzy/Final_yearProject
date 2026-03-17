// scripts/seedFactors.js
const mongoose = require('mongoose');
const EmissionFactor = require('../models/EmissionFactor');
require('dotenv').config();

// Simple factors - only what we need for basic questions
const factors = [
  // TRANSPORT
  {
    activityId: 'car_miles',
    category: 'transport',
    name: 'Car Travel',
    factor: 0.41,
    unit: 'kg CO₂ per mile',
    source: 'EPA'
  },
  {
    activityId: 'bus_miles',
    category: 'transport',
    name: 'Bus Travel',
    factor: 0.18,
    unit: 'kg CO₂ per mile',
    source: 'EPA'
  },
  {
    activityId: 'train_miles',
    category: 'transport',
    name: 'Train Travel',
    factor: 0.12,
    unit: 'kg CO₂ per mile',
    source: 'EPA'
  },
  {
    activityId: 'plane_miles',
    category: 'transport',
    name: 'Air Travel',
    factor: 0.53,
    unit: 'kg CO₂ per mile',
    source: 'ICAO'
  },

  // HOME ENERGY
  {
    activityId: 'electricity_kwh',
    category: 'home',
    name: 'Electricity Usage',
    factor: 0.85,
    unit: 'kg CO₂ per kWh',
    source: 'EIA'
  },
  {
    activityId: 'ac_days',
    category: 'home',
    name: 'Air Conditioner',
    factor: 3.2,
    unit: 'kg CO₂ per day',
    source: 'EPA'
  },
  {
    activityId: 'heat_days',
    category: 'home',
    name: 'Heating',
    factor: 4.5,
    unit: 'kg CO₂ per day',
    source: 'EPA'
  },

  // ELECTRONICS
  {
    activityId: 'laptop_hours',
    category: 'electronics',
    name: 'Laptop Usage',
    factor: 0.02,
    unit: 'kg CO₂ per hour',
    source: 'Berkeley Lab'
  },
  {
    activityId: 'tv_hours',
    category: 'electronics',
    name: 'Television',
    factor: 0.04,
    unit: 'kg CO₂ per hour',
    source: 'EPA'
  },

  // WATER
  {
    activityId: 'showers_per_week',
    category: 'water',
    name: 'Showers',
    factor: 0.6,
    unit: 'kg CO₂ per shower',
    source: 'Water Research'
  },
  {
    activityId: 'laundry_per_month',
    category: 'water',
    name: 'Laundry',
    factor: 0.8,
    unit: 'kg CO₂ per load',
    source: 'EPA'
  },

  // FOOD
  {
    activityId: 'chicken_servings',
    category: 'food',
    name: 'Chicken',
    factor: 6.9,
    unit: 'kg CO₂ per serving',
    source: 'FAO'
  },
  {
    activityId: 'vegetarian_meals',
    category: 'food',
    name: 'Vegetarian Meal',
    factor: 2.0,
    unit: 'kg CO₂ per meal',
    source: 'FAO'
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    await EmissionFactor.deleteMany({});
    console.log('🧹 Cleared existing factors');

    await EmissionFactor.insertMany(factors);
    console.log(`✅ Inserted ${factors.length} emission factors`);

    console.log('\n📊 Summary:');
    console.log(`Transport: 4 factors`);
    console.log(`Home Energy: 3 factors`);
    console.log(`Electronics: 2 factors`);
    console.log(`Water: 2 factors`);
    console.log(`Food: 2 factors`);
    console.log(`TOTAL: ${factors.length} factors`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedDatabase();