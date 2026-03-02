// controllers/adminController.js
const User = require('../models/User');
const Activity = require('../models/Activity');
const EmissionFactor = require('../models/EmissionFactor');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
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

// @desc    Get single user
// @route   GET /api/admin/users/:id
// @access  Private/Admin
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

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete all user activities
    await Activity.deleteMany({ user: req.params.id });
    
    // Delete user
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

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
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

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
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
      home: 0,
      food: 0,
      purchases: 0,
      water: 0,
      electronics: 0
    };

    activities.forEach(activity => {
      if (activity.categoryTotals) {
        Object.entries(activity.categoryTotals).forEach(([category, value]) => {
          if (categoryTotals.hasOwnProperty(category)) {
            categoryTotals[category] += value;
          }
        });
      }
    });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalActivities,
        totalEmissions,
        averagePerActivity: totalActivities > 0 ? totalEmissions / totalActivities : 0,
        categoryTotals,
        recentActivities
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all emission factors
// @route   GET /api/admin/emission-factors
// @access  Private/Admin
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

// @desc    Create emission factor
// @route   POST /api/admin/emission-factors
// @access  Private/Admin
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

// @desc    Update emission factor
// @route   PUT /api/admin/emission-factors/:id
// @access  Private/Admin
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

// @desc    Delete emission factor
// @route   DELETE /api/admin/emission-factors/:id
// @access  Private/Admin
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