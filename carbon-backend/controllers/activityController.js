// controllers/activityController.js
const Activity = require('../models/Activity');

// @desc    Create new activity
// @route   POST /api/activities
// @access  Private
exports.createActivity = async (req, res) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    // Calculate totals if not provided
    if (!req.body.totalEmissions && req.body.answers) {
      let total = 0;
      const categoryTotals = {};
      
      Object.keys(req.body.answers).forEach(key => {
        const answer = req.body.answers[key];
        total += answer.emission || 0;
        
        const category = answer.category;
        if (category) {
          categoryTotals[category] = (categoryTotals[category] || 0) + (answer.emission || 0);
        }
      });
      
      req.body.totalEmissions = total;
      req.body.categoryTotals = categoryTotals;
    }

    const activity = await Activity.create(req.body);

    res.status(201).json({
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