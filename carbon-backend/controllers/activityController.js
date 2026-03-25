// controllers/activityController.js
const Activity = require('../models/Activity');
const EmissionFactor = require('../models/EmissionFactor');

// Car factor map (type + fuel combination) - kg CO₂ per km
const carFactorMap = {
  // Hatchback
  hatchback_petrol: 0.124,
  hatchback_diesel: 0.106,
  // Sedan
  sedan_petrol: 0.162,
  sedan_diesel: 0.143,
  sedan_hybrid: 0.099,
  sedan_electric: 0.062,
  // SUV
  suv_petrol: 0.217,
  suv_diesel: 0.193,
  suv_hybrid: 0.137,
  suv_electric: 0.087,
  // MUV/MPV
  muv_petrol: 0.199,
  muv_diesel: 0.174,
  muv_hybrid: 0.124,
  muv_electric: 0.081
};

// Train factor map - kg CO₂ per km
const trainFactorMap = {
  local: 0.025,   // Mumbai Local Trains
  express: 0.062  // Express/Mail Trains
};

// Recycling rate multiplier
const recyclingMultiplierMap = {
  low: 1.0,
  medium: 0.7,
  high: 0.4,
  very_high: 0.2
};

// Food waste multiplier
const foodWasteMultiplierMap = {
  low: 1.0,
  medium: 1.15,
  high: 1.30
};

// Fallback factors for regular activities (in kg CO₂ per unit)
const fallbackFactors = {
  // Transport
  bus_km: 0.11,
  plane_km: 0.33,
  // Electricity
  electricity_kwh: 0.85,
  ac_hours: 2.0,
  heater_hours: 2.8,
  laptop_hours: 0.012,
  tv_hours: 0.025,
  // Waste
  food_waste_kg: 0.5,
  plastic_waste_kg: 3.0,
  paper_waste_kg: 0.8,
  metal_waste_kg: 2.5,
  ewaste_kg: 15.0,
  // Food
  chicken_servings: 6.9,
  fish_servings: 3.5,
  dairy_servings: 2.5,
  vegetarian_meals: 2.0
};

// @desc    Create new activity
// @route   POST /api/activities
// @access  Private
exports.createActivity = async (req, res) => {
  try {
    console.log('📥 Received data:', JSON.stringify(req.body, null, 2));
    
    // Get raw values from frontend
    const rawData = req.body;
    
    // Prepare answers object and calculate totals
    const answers = {};
    const categoryTotals = {
      transport: 0,
      electricity: 0,
      waste: 0,
      food: 0
    };
    
    let totalEmissions = 0;
    
    // Store selected options
    let selectedCarType = rawData.car_type;
    let selectedCarFuel = rawData.car_fuel;
    let selectedTrainType = rawData.train_type;
    let selectedFoodWaste = rawData.food_waste;
    let selectedRecyclingRate = rawData.recycling_rate;
    
    console.log('🚗 Car selections:', { selectedCarType, selectedCarFuel });
    console.log('🚂 Train selections:', { selectedTrainType });
    console.log('♻️ Recycling rate:', selectedRecyclingRate);
    console.log('🍽️ Food waste:', selectedFoodWaste);
    
    // Get multipliers
    const recyclingMultiplier = selectedRecyclingRate ? (recyclingMultiplierMap[selectedRecyclingRate] || 1.0) : 1.0;
    const foodWasteMultiplier = selectedFoodWaste ? (foodWasteMultiplierMap[selectedFoodWaste] || 1.0) : 1.0;
    
    console.log('📊 Multipliers:', { recyclingMultiplier, foodWasteMultiplier });
    
    // Process each activity
    Object.keys(rawData).forEach(activityId => {
      let value = rawData[activityId];
      
      // Skip metadata fields
      if (activityId === "car_type" || activityId === "car_fuel" || 
          activityId === "train_type" || activityId === "food_waste" || 
          activityId === "recycling_rate") {
        return;
      }
      
      // Convert string to number if needed
      if (typeof value === 'string') {
        value = parseFloat(value);
      }
      
      // Skip if no value or not a positive number
      if (isNaN(value) || value <= 0) return;
      
      console.log(`📊 Processing: ${activityId} = ${value}`);
      
      // ========== TRANSPORT ==========
      // Handle CAR KM
      if (activityId === "car_km" && selectedCarType && selectedCarFuel) {
        const key = `${selectedCarType}_${selectedCarFuel}`;
        const factor = carFactorMap[key];
        
        console.log(`🔍 Car factor lookup: ${key} = ${factor}`);
        
        if (factor) {
          const emission = value * factor;
          
          answers.car_km = {
            value: value,
            emission: Math.round(emission * 100) / 100,
            category: "transport",
            factor: factor,
            carType: selectedCarType,
            carFuel: selectedCarFuel
          };
          
          categoryTotals.transport += emission;
          totalEmissions += emission;
          
          console.log(`✅ Car emission: ${value} km × ${factor} = ${emission.toFixed(2)} kg CO₂`);
        }
        return;
      }
      
      // Handle TRAIN KM
      if (activityId === "train_km" && selectedTrainType) {
        const factor = trainFactorMap[selectedTrainType];
        
        console.log(`🔍 Train factor lookup: ${selectedTrainType} = ${factor}`);
        
        if (factor) {
          const emission = value * factor;
          
          answers.train_km = {
            value: value,
            emission: Math.round(emission * 100) / 100,
            category: "transport",
            factor: factor,
            trainType: selectedTrainType
          };
          
          categoryTotals.transport += emission;
          totalEmissions += emission;
          
          console.log(`✅ Train emission: ${value} km × ${factor} = ${emission.toFixed(2)} kg CO₂`);
        }
        return;
      }
      
      // Handle BUS KM
      if (activityId === "bus_km") {
        const factor = fallbackFactors.bus_km;
        const emission = value * factor;
        
        answers.bus_km = {
          value: value,
          emission: Math.round(emission * 100) / 100,
          category: "transport",
          factor: factor
        };
        
        categoryTotals.transport += emission;
        totalEmissions += emission;
        
        console.log(`✅ Bus emission: ${value} km × ${factor} = ${emission.toFixed(2)} kg CO₂`);
        return;
      }
      
      // Handle PLANE KM
      if (activityId === "plane_km") {
        const factor = fallbackFactors.plane_km;
        const emission = value * factor;
        
        answers.plane_km = {
          value: value,
          emission: Math.round(emission * 100) / 100,
          category: "transport",
          factor: factor
        };
        
        categoryTotals.transport += emission;
        totalEmissions += emission;
        
        console.log(`✅ Plane emission: ${value} km × ${factor} = ${emission.toFixed(2)} kg CO₂`);
        return;
      }
      
      // ========== ELECTRICITY ==========
      if (activityId === "electricity_kwh") {
        const factor = fallbackFactors.electricity_kwh;
        const emission = value * factor;
        
        answers.electricity_kwh = {
          value: value,
          emission: Math.round(emission * 100) / 100,
          category: "electricity",
          factor: factor
        };
        
        categoryTotals.electricity += emission;
        totalEmissions += emission;
        
        console.log(`✅ Electricity: ${value} kWh × ${factor} = ${emission.toFixed(2)} kg CO₂`);
        return;
      }
      
      if (activityId === "ac_hours") {
        const factor = fallbackFactors.ac_hours;
        const emission = value * factor;
        
        answers.ac_hours = {
          value: value,
          emission: Math.round(emission * 100) / 100,
          category: "electricity",
          factor: factor
        };
        
        categoryTotals.electricity += emission;
        totalEmissions += emission;
        
        console.log(`✅ AC: ${value} hours/day × ${factor} = ${emission.toFixed(2)} kg CO₂`);
        return;
      }
      
      if (activityId === "heater_hours") {
        const factor = fallbackFactors.heater_hours;
        const emission = value * factor;
        
        answers.heater_hours = {
          value: value,
          emission: Math.round(emission * 100) / 100,
          category: "electricity",
          factor: factor
        };
        
        categoryTotals.electricity += emission;
        totalEmissions += emission;
        
        console.log(`✅ Heater: ${value} hours/day × ${factor} = ${emission.toFixed(2)} kg CO₂`);
        return;
      }
      
      if (activityId === "laptop_hours") {
        const factor = fallbackFactors.laptop_hours;
        const emission = value * factor;
        
        answers.laptop_hours = {
          value: value,
          emission: Math.round(emission * 100) / 100,
          category: "electricity",
          factor: factor
        };
        
        categoryTotals.electricity += emission;
        totalEmissions += emission;
        
        console.log(`✅ Laptop: ${value} hours/day × ${factor} = ${emission.toFixed(2)} kg CO₂`);
        return;
      }
      
      if (activityId === "tv_hours") {
        const factor = fallbackFactors.tv_hours;
        const emission = value * factor;
        
        answers.tv_hours = {
          value: value,
          emission: Math.round(emission * 100) / 100,
          category: "electricity",
          factor: factor
        };
        
        categoryTotals.electricity += emission;
        totalEmissions += emission;
        
        console.log(`✅ TV: ${value} hours/day × ${factor} = ${emission.toFixed(2)} kg CO₂`);
        return;
      }
      
      // ========== WASTE ==========
      if (activityId === "food_waste_kg") {
        const factor = fallbackFactors.food_waste_kg;
        const emission = value * factor * recyclingMultiplier;
        
        answers.food_waste_kg = {
          value: value,
          emission: Math.round(emission * 100) / 100,
          category: "waste",
          factor: factor,
          recyclingMultiplier: recyclingMultiplier
        };
        
        categoryTotals.waste += emission;
        totalEmissions += emission;
        
        console.log(`✅ Food Waste: ${value} kg/week × ${factor} × ${recyclingMultiplier} = ${emission.toFixed(2)} kg CO₂`);
        return;
      }
      
      if (activityId === "plastic_waste_kg") {
        const factor = fallbackFactors.plastic_waste_kg;
        const emission = value * factor * recyclingMultiplier;
        
        answers.plastic_waste_kg = {
          value: value,
          emission: Math.round(emission * 100) / 100,
          category: "waste",
          factor: factor,
          recyclingMultiplier: recyclingMultiplier
        };
        
        categoryTotals.waste += emission;
        totalEmissions += emission;
        
        console.log(`✅ Plastic Waste: ${value} kg/week × ${factor} × ${recyclingMultiplier} = ${emission.toFixed(2)} kg CO₂`);
        return;
      }
      
      if (activityId === "paper_waste_kg") {
        const factor = fallbackFactors.paper_waste_kg;
        const emission = value * factor * recyclingMultiplier;
        
        answers.paper_waste_kg = {
          value: value,
          emission: Math.round(emission * 100) / 100,
          category: "waste",
          factor: factor,
          recyclingMultiplier: recyclingMultiplier
        };
        
        categoryTotals.waste += emission;
        totalEmissions += emission;
        
        console.log(`✅ Paper Waste: ${value} kg/week × ${factor} × ${recyclingMultiplier} = ${emission.toFixed(2)} kg CO₂`);
        return;
      }
      
      if (activityId === "metal_waste_kg") {
        const factor = fallbackFactors.metal_waste_kg;
        const emission = value * factor * recyclingMultiplier;
        
        answers.metal_waste_kg = {
          value: value,
          emission: Math.round(emission * 100) / 100,
          category: "waste",
          factor: factor,
          recyclingMultiplier: recyclingMultiplier
        };
        
        categoryTotals.waste += emission;
        totalEmissions += emission;
        
        console.log(`✅ Metal Waste: ${value} kg/month × ${factor} × ${recyclingMultiplier} = ${emission.toFixed(2)} kg CO₂`);
        return;
      }
      
      if (activityId === "ewaste_kg") {
        const factor = fallbackFactors.ewaste_kg;
        const emission = value * factor * recyclingMultiplier;
        
        answers.ewaste_kg = {
          value: value,
          emission: Math.round(emission * 100) / 100,
          category: "waste",
          factor: factor,
          recyclingMultiplier: recyclingMultiplier
        };
        
        categoryTotals.waste += emission;
        totalEmissions += emission;
        
        console.log(`✅ E-Waste: ${value} kg/year × ${factor} × ${recyclingMultiplier} = ${emission.toFixed(2)} kg CO₂`);
        return;
      }
      
      // ========== FOOD ==========
      if (activityId === "chicken_servings") {
        const factor = fallbackFactors.chicken_servings;
        const emission = value * factor * foodWasteMultiplier;
        
        answers.chicken_servings = {
          value: value,
          emission: Math.round(emission * 100) / 100,
          category: "food",
          factor: factor,
          foodWasteMultiplier: foodWasteMultiplier
        };
        
        categoryTotals.food += emission;
        totalEmissions += emission;
        
        console.log(`✅ Chicken: ${value} servings/week × ${factor} × ${foodWasteMultiplier} = ${emission.toFixed(2)} kg CO₂`);
        return;
      }
      
      if (activityId === "fish_servings") {
        const factor = fallbackFactors.fish_servings;
        const emission = value * factor * foodWasteMultiplier;
        
        answers.fish_servings = {
          value: value,
          emission: Math.round(emission * 100) / 100,
          category: "food",
          factor: factor,
          foodWasteMultiplier: foodWasteMultiplier
        };
        
        categoryTotals.food += emission;
        totalEmissions += emission;
        
        console.log(`✅ Fish: ${value} servings/week × ${factor} × ${foodWasteMultiplier} = ${emission.toFixed(2)} kg CO₂`);
        return;
      }
      
      if (activityId === "dairy_servings") {
        const factor = fallbackFactors.dairy_servings;
        const emission = value * factor * foodWasteMultiplier;
        
        answers.dairy_servings = {
          value: value,
          emission: Math.round(emission * 100) / 100,
          category: "food",
          factor: factor,
          foodWasteMultiplier: foodWasteMultiplier
        };
        
        categoryTotals.food += emission;
        totalEmissions += emission;
        
        console.log(`✅ Dairy: ${value} servings/week × ${factor} × ${foodWasteMultiplier} = ${emission.toFixed(2)} kg CO₂`);
        return;
      }
      
      if (activityId === "vegetarian_meals") {
        const factor = fallbackFactors.vegetarian_meals;
        const emission = value * factor * foodWasteMultiplier;
        
        answers.vegetarian_meals = {
          value: value,
          emission: Math.round(emission * 100) / 100,
          category: "food",
          factor: factor,
          foodWasteMultiplier: foodWasteMultiplier
        };
        
        categoryTotals.food += emission;
        totalEmissions += emission;
        
        console.log(`✅ Vegetarian: ${value} meals/week × ${factor} × ${foodWasteMultiplier} = ${emission.toFixed(2)} kg CO₂`);
        return;
      }
      
      // If no matching activity found
      console.log(`⚠️ Unknown activity ID: ${activityId}`);
    });
    
    // Store selected metadata for reference
    if (selectedCarType && selectedCarFuel) {
      answers.car_selected = {
        type: selectedCarType,
        fuel: selectedCarFuel,
        emission: 0,
        category: "transport"
      };
    }
    
    if (selectedTrainType) {
      answers.train_selected = {
        type: selectedTrainType,
        emission: 0,
        category: "transport"
      };
    }
    
    if (selectedFoodWaste) {
      answers.food_waste_selected = {
        level: selectedFoodWaste,
        multiplier: foodWasteMultiplier,
        emission: 0,
        category: "food"
      };
    }
    
    if (selectedRecyclingRate) {
      answers.recycling_rate_selected = {
        level: selectedRecyclingRate,
        multiplier: recyclingMultiplier,
        emission: 0,
        category: "waste"
      };
    }
    
    // Round totals
    totalEmissions = Math.round(totalEmissions * 100) / 100;
    Object.keys(categoryTotals).forEach(cat => {
      categoryTotals[cat] = Math.round(categoryTotals[cat] * 100) / 100;
    });
    
    console.log('📊 Final totals:', { totalEmissions, categoryTotals });
    
    // Create categories array
    const categoriesList = Object.keys(categoryTotals).filter(cat => categoryTotals[cat] > 0);
    
    // Create activity
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

// @desc    Get all activities for logged in user
// @route   GET /api/activities
// @access  Private
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

// @desc    Get single activity
// @route   GET /api/activities/:id
// @access  Private
exports.getActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    // Make sure user owns activity
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

// @desc    Update activity
// @route   PUT /api/activities/:id
// @access  Private
exports.updateActivity = async (req, res) => {
  try {
    let activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    // Make sure user owns activity
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

// @desc    Delete activity
// @route   DELETE /api/activities/:id
// @access  Private
exports.deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    // Make sure user owns activity
    if (activity.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    await activity.deleteOne();

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

// @desc    Get activity statistics
// @route   GET /api/activities/stats
// @access  Private
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
      // Total emissions
      stats.totalEmissions += activity.totalEmissions || 0;

      // Category totals
      if (activity.categoryTotals) {
        Object.entries(activity.categoryTotals).forEach(([category, value]) => {
          if (stats.categoryTotals.hasOwnProperty(category)) {
            stats.categoryTotals[category] = (stats.categoryTotals[category] || 0) + value;
          }
        });
      }

      // Monthly data
      const month = new Date(activity.date).toLocaleString('default', { month: 'short', year: 'numeric' });
      stats.monthlyData[month] = (stats.monthlyData[month] || 0) + (activity.totalEmissions || 0);
    });

    stats.averagePerActivity = activities.length > 0 
      ? stats.totalEmissions / activities.length 
      : 0;

    // Round to 2 decimals
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