// controllers/activityController.js
const Activity = require('../models/Activity');
const EmissionFactor = require('../models/EmissionFactor'); // ADD THIS

// @desc    Create new activity (WITH BACKEND CALCULATION)
// @route   POST /api/activities
// @access  Private
exports.createActivity = async (req, res) => {
  try {
    // Get ALL emission factors from database
    const factors = await EmissionFactor.find();
    
    // Create a map for easy lookup (like a dictionary)
    const factorMap = {};
    factors.forEach(f => {
      factorMap[f.activityId] = {
        factor: f.factor,
        category: f.category
      };
    });
    
    // Get raw values from frontend (req.body contains raw numbers)
    const rawData = req.body;
    
    // Prepare answers object and calculate totals
    const answers = {};
    const categoryTotals = {
      transport: 0,
      home: 0,
      electronics: 0,
      water: 0,
      food: 0
    };
    
    let totalEmissions = 0;
    
    // Loop through each possible activity
    Object.keys(rawData).forEach(activityId => {
      const value = rawData[activityId];
      
      // Skip if no value or not a number
      if (!value || isNaN(value)) return;
      
      // Check if we have a factor for this activity
      if (factorMap[activityId]) {
        const { factor, category } = factorMap[activityId];
        
        // 🔢 CALCULATION HAPPENS HERE!
        const emission = parseFloat(value) * factor;
        
        // Store the answer with all details
        answers[activityId] = {
          value: parseFloat(value),
          emission: Math.round(emission * 100) / 100, // Round to 2 decimals
          category: category,
          factor: factor
        };
        
        // Add to category total
        if (categoryTotals.hasOwnProperty(category)) {
          categoryTotals[category] += emission;
        }
        
        // Add to grand total
        totalEmissions += emission;
      }
    });
    
    // Round totals to 2 decimal places
    totalEmissions = Math.round(totalEmissions * 100) / 100;
    Object.keys(categoryTotals).forEach(cat => {
      categoryTotals[cat] = Math.round(categoryTotals[cat] * 100) / 100;
    });
    
    // Filter out zero categories
    const nonZeroCategories = Object.keys(categoryTotals).filter(
      cat => categoryTotals[cat] > 0
    );
    
    // Create activity in database
    const activity = await Activity.create({
      user: req.user.id,
      date: new Date(),
      answers: answers,
      categoryTotals: categoryTotals,
      totalEmissions: totalEmissions,
      categories: nonZeroCategories
    });
    
    res.status(201).json({
      success: true,
      data: activity
    });
    
  } catch (error) {
    console.error('Error creating activity:', error);
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
      categoryTotals: {},
      monthlyData: {}
    };

    activities.forEach(activity => {
      // Total emissions
      stats.totalEmissions += activity.totalEmissions || 0;

      // Category totals
      if (activity.categoryTotals) {
        Object.entries(activity.categoryTotals).forEach(([category, value]) => {
          stats.categoryTotals[category] = (stats.categoryTotals[category] || 0) + value;
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
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};