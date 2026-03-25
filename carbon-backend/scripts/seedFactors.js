// scripts/seedFactors.js
const mongoose = require('mongoose');
const EmissionFactor = require('../models/EmissionFactor');
require('dotenv').config();

const factors = [
  // ========== TRANSPORT ==========
  // Car - Type + Fuel combinations (kg CO₂ per km)
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
  
  // Bus
  { activityId: 'bus_km', category: 'transport', name: 'Bus Travel', factor: 0.11, unit: 'kg CO₂ per km', source: '2026 Updated Data' },
  
  // Train
  { activityId: 'train_local', category: 'transport', name: 'Local Train (Mumbai Suburban)', factor: 0.025, unit: 'kg CO₂ per km', source: '2026 Indian Railways Data' },
  { activityId: 'train_express', category: 'transport', name: 'Express/Mail Train (Long Distance)', factor: 0.062, unit: 'kg CO₂ per km', source: '2026 Indian Railways Data' },
  
  // Plane
  { activityId: 'plane_km', category: 'transport', name: 'Air Travel', factor: 0.33, unit: 'kg CO₂ per km', source: 'ICAO 2026' },

  // ========== ELECTRICITY ==========
  { activityId: 'electricity_kwh', category: 'electricity', name: 'Electricity Consumption', factor: 0.85, unit: 'kg CO₂ per kWh', source: 'EIA 2026' },
  { activityId: 'ac_hours', category: 'electricity', name: 'Air Conditioner Usage', factor: 2.0, unit: 'kg CO₂ per hour/day', source: 'EPA 2026' },
  { activityId: 'heater_hours', category: 'electricity', name: 'Heater Usage', factor: 2.8, unit: 'kg CO₂ per hour/day', source: 'EPA 2026' },
  { activityId: 'laptop_hours', category: 'electricity', name: 'Laptop/Desktop Usage', factor: 0.012, unit: 'kg CO₂ per hour', source: 'Berkeley Lab 2026' },
  { activityId: 'tv_hours', category: 'electricity', name: 'Television', factor: 0.025, unit: 'kg CO₂ per hour', source: 'EPA 2026' },

  // ========== WASTE ==========
  { activityId: 'food_waste_kg', category: 'waste', name: 'Food Waste', factor: 0.5, unit: 'kg CO₂ per kg/week', source: 'EPA 2026' },
  { activityId: 'plastic_waste_kg', category: 'waste', name: 'Plastic Waste', factor: 3.0, unit: 'kg CO₂ per kg/week', source: '2026 Research Data' },
  { activityId: 'paper_waste_kg', category: 'waste', name: 'Paper/Cardboard Waste', factor: 0.8, unit: 'kg CO₂ per kg/week', source: 'EPA 2026' },
  { activityId: 'metal_waste_kg', category: 'waste', name: 'Metal Waste', factor: 2.5, unit: 'kg CO₂ per kg/month', source: '2026 Research Data' },
  { activityId: 'ewaste_kg', category: 'waste', name: 'Electronic Waste', factor: 15.0, unit: 'kg CO₂ per kg/year', source: 'UNEP 2026' },

  // ========== FOOD ==========
  { activityId: 'chicken_servings', category: 'food', name: 'Chicken', factor: 6.9, unit: 'kg CO₂ per serving', source: 'FAO 2026' },
  { activityId: 'fish_servings', category: 'food', name: 'Fish', factor: 3.5, unit: 'kg CO₂ per serving', source: 'FAO 2026' },
  { activityId: 'dairy_servings', category: 'food', name: 'Dairy (Milk, Cheese, Yogurt)', factor: 2.5, unit: 'kg CO₂ per serving', source: 'FAO 2026' },
  { activityId: 'vegetarian_meals', category: 'food', name: 'Vegetarian Meal', factor: 2.0, unit: 'kg CO₂ per meal', source: 'FAO 2026' }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    // Clear existing factors
    await EmissionFactor.deleteMany({});
    console.log('🧹 Cleared existing factors');

    // Insert new factors
    await EmissionFactor.insertMany(factors);
    console.log(`✅ Inserted ${factors.length} emission factors`);

    console.log('\n📊 Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚗 TRANSPORT:');
    console.log(`   - Car variants: 14 factors`);
    console.log(`   - Bus: 1 factor`);
    console.log(`   - Train: 2 factors`);
    console.log(`   - Plane: 1 factor`);
    console.log(`   Total Transport: 18 factors`);
    console.log('');
    console.log('⚡ ELECTRICITY:');
    console.log(`   - 5 factors (kWh, AC, Heater, Laptop, TV)`);
    console.log('');
    console.log('🗑️ WASTE:');
    console.log(`   - 5 factors (Food, Plastic, Paper, Metal, E-waste)`);
    console.log('');
    console.log('🍎 FOOD:');
    console.log(`   - 4 factors (Chicken, Fish, Dairy, Vegetarian)`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📊 TOTAL: ${factors.length} emission factors`);

    // Display all factors with categories
    console.log('\n📋 Detailed List:');
    const grouped = {};
    factors.forEach(f => {
      if (!grouped[f.category]) grouped[f.category] = [];
      grouped[f.category].push(f);
    });
    
    Object.keys(grouped).forEach(cat => {
      console.log(`\n${cat.toUpperCase()}:`);
      grouped[cat].forEach(f => {
        console.log(`   - ${f.name}: ${f.factor} ${f.unit}`);
      });
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();