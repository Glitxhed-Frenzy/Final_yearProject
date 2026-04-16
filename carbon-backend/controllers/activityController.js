// controllers/activityController.js
const Activity = require('../models/Activity');
const EmissionFactor = require('../models/EmissionFactor');
const { updateMonthlyLeaderboard } = require('./leaderboardController');

let factorCache = null;
let lastCacheUpdate = null;
const CACHE_DURATION = 5 * 60 * 1000;
const loadFactorsFromDB = async () => {
  const now = Date.now();
  if (factorCache && (now - lastCacheUpdate) < CACHE_DURATION) {
    return factorCache;
  }
  
  const factors = await EmissionFactor.find();
  factorCache = {};
  
  factors.forEach(factor => {
    factorCache[factor.activityId] = factor.factor;
  });
  
  lastCacheUpdate = now;
  console.log('📦 Emission factors loaded from database:', Object.keys(factorCache).length);
  return factorCache;
};

const getFactor = async (activityId) => {
  const factors = await loadFactorsFromDB();
  return factors[activityId] || null;
};

const getCarFactorFromDB = async (carType, carFuel) => {
  const activityId = `car_${carType}_${carFuel}`;
  return await getFactor(activityId);
};

const getTrainFactorFromDB = async (trainType) => {
  const activityId = `train_${trainType}`;
  return await getFactor(activityId);
};

exports.createActivity = async (req, res) => {
  try {
    console.log('📥 Received:', JSON.stringify(req.body, null, 2));
    await loadFactorsFromDB();
    
    const rawData = req.body;
    const answers = {};
    const categoryTotals = { transport: 0, electricity: 0, waste: 0, food: 0 };
    let totalEmissions = 0;
    
    let selectedCarType = rawData.car_type;
    let selectedCarFuel = rawData.car_fuel;
    let selectedTrainType = rawData.train_type;
    
    for (const [activityId, value] of Object.entries(rawData)) {
      if (activityId === "car_type" || activityId === "car_fuel" || 
          activityId === "train_type" || activityId === "date") {
        continue;
      }
      
      let numValue = typeof value === 'string' ? parseFloat(value) : value;
      if (isNaN(numValue) || numValue <= 0) continue;
      
      if (activityId === "car_km" && selectedCarType && selectedCarFuel) {
        const factor = await getCarFactorFromDB(selectedCarType, selectedCarFuel);
        if (factor) {
          const emission = numValue * factor;
          answers.car_km = { 
            value: numValue, 
            emission: Math.round(emission * 100) / 100, 
            category: "transport", 
            factor: factor 
          };
          categoryTotals.transport += emission;
          totalEmissions += emission;
          console.log(`✅ Car: ${numValue} km × ${factor} = ${emission.toFixed(2)} kg CO₂`);
        }
        continue;
      }
      
      if (activityId === "train_km" && selectedTrainType) {
        const factor = await getTrainFactorFromDB(selectedTrainType);
        if (factor) {
          const emission = numValue * factor;
          answers.train_km = { 
            value: numValue, 
            emission: Math.round(emission * 100) / 100, 
            category: "transport", 
            factor: factor 
          };
          categoryTotals.transport += emission;
          totalEmissions += emission;
          console.log(`✅ Train: ${numValue} km × ${factor} = ${emission.toFixed(2)} kg CO₂`);
        }
        continue;
      }
      
      if (activityId === "bus_km") {
        const factor = await getFactor('bus_km');
        if (factor) {
          const emission = numValue * factor;
          answers.bus_km = { 
            value: numValue, 
            emission: Math.round(emission * 100) / 100, 
            category: "transport", 
            factor: factor 
          };
          categoryTotals.transport += emission;
          totalEmissions += emission;
          console.log(`✅ Bus: ${numValue} km × ${factor} = ${emission.toFixed(2)} kg CO₂`);
        }
        continue;
      }
      
      if (activityId === "plane_km") {
        const factor = await getFactor('plane_km');
        if (factor) {
          const emission = numValue * factor;
          answers.plane_km = { 
            value: numValue, 
            emission: Math.round(emission * 100) / 100, 
            category: "transport", 
            factor: factor 
          };
          categoryTotals.transport += emission;
          totalEmissions += emission;
          console.log(`✅ Plane: ${numValue} km × ${factor} = ${emission.toFixed(2)} kg CO₂`);
        }
        continue;
      }
      
      if (activityId === "ac_hours") {
        const factor = await getFactor('ac_hours');
        if (factor) {
          const emission = numValue * factor;
          answers.ac_hours = { 
            value: numValue, 
            emission: Math.round(emission * 100) / 100, 
            category: "electricity", 
            factor: factor 
          };
          categoryTotals.electricity += emission;
          totalEmissions += emission;
          console.log(`✅ AC: ${numValue} hours × ${factor} = ${emission.toFixed(2)} kg CO₂`);
        }
        continue;
      }
      
      if (activityId === "heater_hours") {
        const factor = await getFactor('heater_hours');
        if (factor) {
          const emission = numValue * factor;
          answers.heater_hours = { 
            value: numValue, 
            emission: Math.round(emission * 100) / 100, 
            category: "electricity", 
            factor: factor 
          };
          categoryTotals.electricity += emission;
          totalEmissions += emission;
          console.log(`✅ Heater: ${numValue} hours × ${factor} = ${emission.toFixed(2)} kg CO₂`);
        }
        continue;
      }
      
      if (activityId === "laptop_hours") {
        const factor = await getFactor('laptop_hours');
        if (factor) {
          const emission = numValue * factor;
          answers.laptop_hours = { 
            value: numValue, 
            emission: Math.round(emission * 100) / 100, 
            category: "electricity", 
            factor: factor 
          };
          categoryTotals.electricity += emission;
          totalEmissions += emission;
          console.log(`✅ Laptop: ${numValue} hours × ${factor} = ${emission.toFixed(2)} kg CO₂`);
        }
        continue;
      }
      
      if (activityId === "tv_hours") {
        const factor = await getFactor('tv_hours');
        if (factor) {
          const emission = numValue * factor;
          answers.tv_hours = { 
            value: numValue, 
            emission: Math.round(emission * 100) / 100, 
            category: "electricity", 
            factor: factor 
          };
          categoryTotals.electricity += emission;
          totalEmissions += emission;
          console.log(`✅ TV: ${numValue} hours × ${factor} = ${emission.toFixed(2)} kg CO₂`);
        }
        continue;
      }
      
      if (activityId === "food_waste_kg") {
        const factor = await getFactor('food_waste_kg');
        if (factor) {
          const emission = numValue * factor;
          answers.food_waste_kg = { 
            value: numValue, 
            emission: Math.round(emission * 100) / 100, 
            category: "waste", 
            factor: factor 
          };
          categoryTotals.waste += emission;
          totalEmissions += emission;
          console.log(`✅ Food Waste: ${numValue} kg × ${factor} = ${emission.toFixed(2)} kg CO₂`);
        }
        continue;
      }
      
      if (activityId === "plastic_waste_kg") {
        const factor = await getFactor('plastic_waste_kg');
        if (factor) {
          const emission = numValue * factor;
          answers.plastic_waste_kg = { 
            value: numValue, 
            emission: Math.round(emission * 100) / 100, 
            category: "waste", 
            factor: factor 
          };
          categoryTotals.waste += emission;
          totalEmissions += emission;
          console.log(`✅ Plastic Waste: ${numValue} kg × ${factor} = ${emission.toFixed(2)} kg CO₂`);
        }
        continue;
      }
      
      if (activityId === "paper_waste_kg") {
        const factor = await getFactor('paper_waste_kg');
        if (factor) {
          const emission = numValue * factor;
          answers.paper_waste_kg = { 
            value: numValue, 
            emission: Math.round(emission * 100) / 100, 
            category: "waste", 
            factor: factor 
          };
          categoryTotals.waste += emission;
          totalEmissions += emission;
          console.log(`✅ Paper Waste: ${numValue} kg × ${factor} = ${emission.toFixed(2)} kg CO₂`);
        }
        continue;
      }
      
      if (activityId === "chicken_servings") {
        const factor = await getFactor('chicken_servings');
        if (factor) {
          const emission = numValue * factor;
          answers.chicken_servings = { 
            value: numValue, 
            emission: Math.round(emission * 100) / 100, 
            category: "food", 
            factor: factor 
          };
          categoryTotals.food += emission;
          totalEmissions += emission;
          console.log(`✅ Chicken: ${numValue} servings × ${factor} = ${emission.toFixed(2)} kg CO₂`);
        }
        continue;
      }
    
      if (activityId === "dairy_servings") {
        const factor = await getFactor('dairy_servings');
        if (factor) {
          const emission = numValue * factor;
          answers.dairy_servings = { 
            value: numValue, 
            emission: Math.round(emission * 100) / 100, 
            category: "food", 
            factor: factor 
          };
          categoryTotals.food += emission;
          totalEmissions += emission;
          console.log(`✅ Dairy: ${numValue} servings × ${factor} = ${emission.toFixed(2)} kg CO₂`);
        }
        continue;
      }
      
      if (activityId === "vegetarian_meals") {
        const factor = await getFactor('vegetarian_meals');
        if (factor) {
          const emission = numValue * factor;
          answers.vegetarian_meals = { 
            value: numValue, 
            emission: Math.round(emission * 100) / 100, 
            category: "food", 
            factor: factor 
          };
          categoryTotals.food += emission;
          totalEmissions += emission;
          console.log(`✅ Vegetarian: ${numValue} meals × ${factor} = ${emission.toFixed(2)} kg CO₂`);
        }
        continue;
      }
    }
    
    if (selectedCarType && selectedCarFuel) {
      answers.car_selected = { type: selectedCarType, fuel: selectedCarFuel, category: "transport" };
    }
    if (selectedTrainType) {
      answers.train_selected = { type: selectedTrainType, category: "transport" };
    }
    
    totalEmissions = Math.round(totalEmissions * 100) / 100;
    Object.keys(categoryTotals).forEach(cat => {
      categoryTotals[cat] = Math.round(categoryTotals[cat] * 100) / 100;
    });
    
    console.log('📊 Final totals:', { totalEmissions, categoryTotals });
    
    const categoriesList = Object.keys(categoryTotals).filter(cat => categoryTotals[cat] > 0);
    
    const activity = await Activity.create({
      user: req.user.id,
      date: new Date(),
      answers: answers,
      categoryTotals: categoryTotals,
      totalEmissions: totalEmissions,
      categories: categoriesList
    });
    
    console.log('✅ Activity saved with ID:', activity._id);
    console.log('✅ Total emissions:', totalEmissions, 'kg CO₂');
    
    try {
      await updateMonthlyLeaderboard();
      console.log('✅ Leaderboard updated');
    } catch (err) {
      console.log('⚠️ Leaderboard update error:', err.message);
    }
    
    res.status(201).json({
      success: true,
      data: activity
    });
    
  } catch (error) {
    console.error('❌ Error creating activity:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user.id })
      .sort('-date');

    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    if (activity.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    res.status(200).json({
      success: true,
      data: activity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateActivity = async (req, res) => {
  try {
    let activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    if (activity.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    activity = await Activity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: activity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    if (activity.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    await activity.deleteOne();
    
    try {
      const { updateMonthlyLeaderboard } = require('./leaderboardController');
      await updateMonthlyLeaderboard();
      console.log('✅ Leaderboard updated after delete');
    } catch (err) {
      console.log('⚠️ Leaderboard update error:', err.message);
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getStats = async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user.id });

    const stats = {
      totalActivities: activities.length,
      totalEmissions: 0,
      averagePerActivity: 0,
      categoryTotals: {
        transport: 0,
        electricity: 0,
        waste: 0,
        food: 0
      },
      monthlyData: {}
    };

    activities.forEach(activity => {
      stats.totalEmissions += activity.totalEmissions || 0;

      if (activity.categoryTotals) {
        Object.entries(activity.categoryTotals).forEach(([category, value]) => {
          if (stats.categoryTotals.hasOwnProperty(category)) {
            stats.categoryTotals[category] = (stats.categoryTotals[category] || 0) + value;
          }
        });
      }

      const month = new Date(activity.date).toLocaleString('default', { month: 'short', year: 'numeric' });
      stats.monthlyData[month] = (stats.monthlyData[month] || 0) + (activity.totalEmissions || 0);
    });

    stats.averagePerActivity = activities.length > 0 
      ? stats.totalEmissions / activities.length 
      : 0;

    stats.totalEmissions = Math.round(stats.totalEmissions * 100) / 100;
    stats.averagePerActivity = Math.round(stats.averagePerActivity * 100) / 100;
    
    Object.keys(stats.categoryTotals).forEach(cat => {
      stats.categoryTotals[cat] = Math.round(stats.categoryTotals[cat] * 100) / 100;
    });

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};