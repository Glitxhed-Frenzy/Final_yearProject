// controllers/adminController.js
const User = require('../models/User');
const Activity = require('../models/Activity');
const EmissionFactor = require('../models/EmissionFactor');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await Activity.deleteMany({ user: req.params.id });
    
    await user.deleteOne();

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

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalActivities = await Activity.countDocuments();
    
    const activities = await Activity.find();
    const totalEmissions = activities.reduce((sum, act) => sum + (act.totalEmissions || 0), 0);
    
    const recentActivities = await Activity.find()
      .sort('-date')
      .limit(10)
      .populate('user', 'name email');

    const categoryTotals = {
      transport: 0,
      electricity: 0,
      waste: 0,
      food: 0
    };

    activities.forEach(activity => {
      if (activity.categoryTotals) {
        if (activity.categoryTotals.transport) {
          categoryTotals.transport += activity.categoryTotals.transport;
        }
        if (activity.categoryTotals.electricity) {
          categoryTotals.electricity += activity.categoryTotals.electricity;
        }
        if (activity.categoryTotals.waste) {
          categoryTotals.waste += activity.categoryTotals.waste;
        }
        if (activity.categoryTotals.food) {
          categoryTotals.food += activity.categoryTotals.food;
        }
      }
    });

    Object.keys(categoryTotals).forEach(key => {
      categoryTotals[key] = Math.round(categoryTotals[key] * 100) / 100;
    });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalActivities,
        totalEmissions: Math.round(totalEmissions * 100) / 100,
        averagePerActivity: totalActivities > 0 ? Math.round((totalEmissions / totalActivities) * 100) / 100 : 0,
        categoryTotals,
        recentActivities
      }
    });
  } catch (error) {
    console.error('Error in getAdminStats:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getEmissionFactors = async (req, res) => {
  try {
    const factors = await EmissionFactor.find();
    res.status(200).json({
      success: true,
      data: factors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.createEmissionFactor = async (req, res) => {
  try {
    req.body.updatedBy = req.user.id;
    const factor = await EmissionFactor.create(req.body);
    
    res.status(201).json({
      success: true,
      data: factor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateEmissionFactor = async (req, res) => {
  try {
    req.body.lastUpdated = Date.now();
    req.body.updatedBy = req.user.id;
    
    const factor = await EmissionFactor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!factor) {
      return res.status(404).json({
        success: false,
        message: 'Emission factor not found'
      });
    }

    res.status(200).json({
      success: true,
      data: factor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteEmissionFactor = async (req, res) => {
  try {
    const factor = await EmissionFactor.findById(req.params.id);

    if (!factor) {
      return res.status(404).json({
        success: false,
        message: 'Emission factor not found'
      });
    }

    await factor.deleteOne();

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