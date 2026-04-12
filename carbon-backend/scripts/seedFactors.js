// scripts/seedFactors.js
const mongoose = require('mongoose');
const EmissionFactor = require('../models/EmissionFactor');
require('dotenv').config();

const factors = [
  { activityId: 'car_hatchback_petrol', category: 'transport', name: 'Hatchback - Petrol', factor: 0.124, unit: 'kg CO₂ per km', source: '2026 Updated Data' },
  { activityId: 'car_hatchback_diesel', category: 'transport', name: 'Hatchback - Diesel', factor: 0.106, unit: 'kg CO₂ per km', source: '2026 Updated Data' },
  { activityId: 'car_sedan_petrol', category: 'transport', name: 'Sedan - Petrol', factor: 0.162, unit: 'kg CO₂ per km', source: '2026 Updated Data' },
  { activityId: 'car_sedan_diesel', category: 'transport', name: 'Sedan - Diesel', factor: 0.143, unit: 'kg CO₂ per km', source: '2026 Updated Data' },
  { activityId: 'car_sedan_hybrid', category: 'transport', name: 'Sedan - Hybrid', factor: 0.099, unit: 'kg CO₂ per km', source: '2026 Updated Data' },
  { activityId: 'car_sedan_electric', category: 'transport', name: 'Sedan - Electric', factor: 0.062, unit: 'kg CO₂ per km', source: '2026 Updated Data' },
  { activityId: 'car_suv_petrol', category: 'transport', name: 'SUV - Petrol', factor: 0.217, unit: 'kg CO₂ per km', source: '2026 Updated Data' },
  { activityId: 'car_suv_diesel', category: 'transport', name: 'SUV - Diesel', factor: 0.193, unit: 'kg CO₂ per km', source: '2026 Updated Data' },
  { activityId: 'car_suv_hybrid', category: 'transport', name: 'SUV - Hybrid', factor: 0.137, unit: 'kg CO₂ per km', source: '2026 Updated Data' },
  { activityId: 'car_suv_electric', category: 'transport', name: 'SUV - Electric', factor: 0.087, unit: 'kg CO₂ per km', source: '2026 Updated Data' },
  { activityId: 'car_muv_petrol', category: 'transport', name: 'MUV/MPV - Petrol', factor: 0.199, unit: 'kg CO₂ per km', source: '2026 Updated Data' },
  { activityId: 'car_muv_diesel', category: 'transport', name: 'MUV/MPV - Diesel', factor: 0.174, unit: 'kg CO₂ per km', source: '2026 Updated Data' },
  { activityId: 'car_muv_hybrid', category: 'transport', name: 'MUV/MPV - Hybrid', factor: 0.124, unit: 'kg CO₂ per km', source: '2026 Updated Data' },
  { activityId: 'car_muv_electric', category: 'transport', name: 'MUV/MPV - Electric', factor: 0.081, unit: 'kg CO₂ per km', source: '2026 Updated Data' },
  
  { activityId: 'bus_km', category: 'transport', name: 'Bus Travel', factor: 0.11, unit: 'kg CO₂ per km', source: '2026 Updated Data' },
  
  { activityId: 'train_local', category: 'transport', name: 'Local Train', factor: 0.025, unit: 'kg CO₂ per km', source: '2026 Indian Railways Data' },
  { activityId: 'train_express', category: 'transport', name: 'Express/Mail Train', factor: 0.062, unit: 'kg CO₂ per km', source: '2026 Indian Railways Data' },
  
  { activityId: 'plane_km', category: 'transport', name: 'Air Travel', factor: 0.33, unit: 'kg CO₂ per km', source: 'ICAO 2026' },

  { activityId: 'ac_hours', category: 'electricity', name: 'Air Conditioner Usage', factor: 2.0, unit: 'kg CO₂ per hour', source: 'EPA 2026' },
  { activityId: 'heater_hours', category: 'electricity', name: 'Heater Usage', factor: 2.8, unit: 'kg CO₂ per hour', source: 'EPA 2026' },
  { activityId: 'laptop_hours', category: 'electricity', name: 'Laptop/Desktop Usage', factor: 0.012, unit: 'kg CO₂ per hour', source: 'Berkeley Lab 2026' },
  { activityId: 'tv_hours', category: 'electricity', name: 'Television', factor: 0.025, unit: 'kg CO₂ per hour', source: 'EPA 2026' },

  { activityId: 'food_waste_kg', category: 'waste', name: 'Food Waste', factor: 0.071, unit: 'kg CO₂ per kg/day', source: 'EPA 2026' },
  { activityId: 'plastic_waste_kg', category: 'waste', name: 'Plastic Waste', factor: 0.43, unit: 'kg CO₂ per kg/day', source: '2026 Research Data' },
  { activityId: 'paper_waste_kg', category: 'waste', name: 'Paper/Cardboard Waste', factor: 0.114, unit: 'kg CO₂ per kg/day', source: 'EPA 2026' },

  { activityId: 'chicken_servings', category: 'food', name: 'Chicken', factor: 0.986, unit: 'kg CO₂ per serving/day', source: 'FAO 2026' },
  { activityId: 'fish_servings', category: 'food', name: 'Fish', factor: 0.5, unit: 'kg CO₂ per serving/day', source: 'FAO 2026' },
  { activityId: 'dairy_servings', category: 'food', name: 'Dairy', factor: 0.357, unit: 'kg CO₂ per serving/day', source: 'FAO 2026' },
  { activityId: 'vegetarian_meals', category: 'food', name: 'Vegetarian Meal', factor: 0.286, unit: 'kg CO₂ per meal/day', source: 'FAO 2026' }
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
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚗 TRANSPORT (per km):');
    console.log(`   - Car variants: 14 factors`);
    console.log(`   - Bus: 1 factor`);
    console.log(`   - Train: 2 factors`);
    console.log(`   - Plane: 1 factor`);
    console.log(`   Total Transport: 18 factors`);
    console.log('');
    console.log('⚡ ELECTRICITY (per hour):');
    console.log(`   - AC: 2.0 kg CO₂ per hour`);
    console.log(`   - Heater: 2.8 kg CO₂ per hour`);
    console.log(`   - Laptop: 0.012 kg CO₂ per hour`);
    console.log(`   - TV: 0.025 kg CO₂ per hour`);
    console.log('');
    console.log('🗑️ WASTE (per day):');
    console.log(`   - Food Waste: 0.071 kg CO₂ per kg/day`);
    console.log(`   - Plastic Waste: 0.43 kg CO₂ per kg/day`);
    console.log(`   - Paper Waste: 0.114 kg CO₂ per kg/day`);
    console.log('');
    console.log('🍎 FOOD (per day):');
    console.log(`   - Chicken: 0.986 kg CO₂ per serving/day`);
    console.log(`   - Fish: 0.5 kg CO₂ per serving/day`);
    console.log(`   - Dairy: 0.357 kg CO₂ per serving/day`);
    console.log(`   - Vegetarian: 0.286 kg CO₂ per meal/day`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📊 TOTAL: ${factors.length} emission factors`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();