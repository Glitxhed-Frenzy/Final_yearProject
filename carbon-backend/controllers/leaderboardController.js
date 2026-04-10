// controllers/leaderboardController.js
const Leaderboard = require('../models/Leaderboard');
const User = require('../models/User');
const Activity = require('../models/Activity');

// Helper: Get current month in YYYY-MM format
const getCurrentMonth = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

// Helper: Check if user is eligible for leaderboard (at least 7 days old AND has activities)
const isUserEligibleForLeaderboard = async (userId) => {
  // Get user's account creation date
  const user = await User.findById(userId);
  if (!user) return false;
  
  const accountAge = Date.now() - new Date(user.createdAt).getTime();
  const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
  
  // User must be at least 7 days old
  if (accountAge < oneWeekInMs) {
    console.log(`User ${user.name} is less than 7 days old (${Math.floor(accountAge / (24 * 60 * 60 * 1000))} days) - not eligible`);
    return false;
  }
  
  // User must have at least one activity
  const activityCount = await Activity.countDocuments({ user: userId });
  if (activityCount === 0) {
    console.log(`User ${user.name} has no activities - not eligible`);
    return false;
  }
  
  return true;
};

// @desc    Calculate and update leaderboard for current month
// @access  Internal (called when activity is added)
exports.updateMonthlyLeaderboard = async () => {
  try {
    const month = getCurrentMonth();
    console.log(`📊 Updating leaderboard for ${month}...`);
    
    // Get all users
    const users = await User.find({ role: 'user' });
    
    // Calculate date range for current month
    const [year, monthNum] = month.split('-');
    const startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(monthNum), 0, 23, 59, 59);
    
    const userEmissions = [];
    
    for (const user of users) {
      // Check if user is eligible (account age >= 7 days AND has activities)
      const isEligible = await isUserEligibleForLeaderboard(user._id);
      if (!isEligible) continue;
      
      const activities = await Activity.find({
        user: user._id,
        date: { $gte: startDate, $lte: endDate }
      });
      
      let totalEmissions = 0;
      activities.forEach(activity => {
        totalEmissions += activity.totalEmissions || 0;
      });
      
      userEmissions.push({
        userId: user._id,
        totalEmissions: Math.round(totalEmissions * 100) / 100
      });
    }
    
    // Sort by emissions (LOWER is better - rank 1 has lowest emissions)
    userEmissions.sort((a, b) => a.totalEmissions - b.totalEmissions);
    
    // Clear existing leaderboard entries for this month
    await Leaderboard.deleteMany({ month: month });
    
    // Create new leaderboard entries
    for (let i = 0; i < userEmissions.length; i++) {
      const userEmission = userEmissions[i];
      const rank = i + 1;
      
      await Leaderboard.create({
        userId: userEmission.userId,
        month: month,
        totalEmissions: userEmission.totalEmissions,
        rank: rank,
        updatedAt: new Date()
      });
    }
    
    console.log(`✅ Leaderboard updated for ${month}: ${userEmissions.length} eligible users`);
    return { success: true, count: userEmissions.length };
    
  } catch (error) {
    console.error('Error updating leaderboard:', error);
    return { success: false, error: error.message };
  }
};

// @desc    Get current month leaderboard
// @route   GET /api/leaderboard
// @access  Private
exports.getLeaderboard = async (req, res) => {
  try {
    const month = getCurrentMonth();
    const limit = parseInt(req.query.limit) || 50;
    
    // Get leaderboard entries sorted by rank (1 is best/lowest emissions)
    const leaderboardEntries = await Leaderboard.find({ month })
      .sort({ rank: 1 })
      .limit(limit)
      .populate('userId', 'name email createdAt');
    
    // Filter out entries where userId is null (orphaned records)
    const validEntries = leaderboardEntries.filter(entry => entry.userId !== null);
    
    // Format leaderboard data
    const leaderboard = validEntries.map(entry => ({
      rank: entry.rank,
      userId: entry.userId?._id || 'unknown',
      name: entry.userId?.name || 'Deleted User',
      email: entry.userId?.email || 'unknown@email.com',
      totalEmissions: entry.totalEmissions,
      avatar: entry.userId?.name?.charAt(0) || '?'
    }));
    
    // Get current user's rank and emissions
    const currentUserEntry = await Leaderboard.findOne({
      userId: req.user.id,
      month: month
    });
    
    // Check if current user is eligible (for display message)
    const user = await User.findById(req.user.id);
    const accountAge = Date.now() - new Date(user.createdAt).getTime();
    const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
    const isAccountOldEnough = accountAge >= oneWeekInMs;
    const hasActivities = await Activity.countDocuments({ user: req.user.id }) > 0;
    
    res.status(200).json({
      success: true,
      data: {
        currentMonth: month,
        leaderboard: leaderboard,
        currentUser: {
          rank: currentUserEntry?.rank || null,
          emissions: currentUserEntry?.totalEmissions || 0,
          isEligible: isAccountOldEnough && hasActivities,
          accountAgeDays: Math.floor(accountAge / (24 * 60 * 60 * 1000)),
          hasActivities: hasActivities
        },
        totalUsers: leaderboard.length,
        eligibilityMessage: !isAccountOldEnough ? `You need to be active for 7 days to appear on leaderboard. (${Math.floor(accountAge / (24 * 60 * 60 * 1000))}/7 days)` : !hasActivities ? "Add your first activity to appear on leaderboard" : null
      }
    });
    
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Force refresh leaderboard (admin only)
// @route   POST /api/leaderboard/refresh
// @access  Private/Admin
exports.refreshLeaderboard = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }
    
    console.log('🔄 Manual leaderboard refresh triggered by admin:', req.user.email);
    const result = await exports.updateMonthlyLeaderboard();
    
    res.status(200).json({
      success: result.success,
      message: `Leaderboard refreshed successfully! ${result.count} users updated.`,
      count: result.count
    });
  } catch (error) {
    console.error('Error refreshing leaderboard:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};