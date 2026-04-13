// controllers/leaderboardController.js
const Leaderboard = require('../models/Leaderboard');
const User = require('../models/User');
const Activity = require('../models/Activity');

const getCurrentMonth = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

const isUserEligibleForLeaderboard = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return false;
  
  const cutoffDate = new Date('2026-04-10'); // Change this to today's date
  
  if (new Date(user.createdAt) < cutoffDate) {
    console.log(`User ${user.name} joined before cutoff - automatically eligible`);
    return true;
  }
  
  const accountAge = Date.now() - new Date(user.createdAt).getTime();
  const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
  
  if (accountAge < oneWeekInMs) {
    console.log(`User ${user.name} is less than 7 days old (${Math.floor(accountAge / (24 * 60 * 60 * 1000))} days) - not eligible`);
    return false;
  }
  
  const activityCount = await Activity.countDocuments({ user: userId });
  if (activityCount === 0) {
    console.log(`User ${user.name} has no activities - not eligible`);
    return false;
  }
  
  return true;
};

exports.updateMonthlyLeaderboard = async () => {
  try {
    const month = getCurrentMonth();
    console.log(`📊 Updating leaderboard for ${month}...`);
    
    const users = await User.find({ role: 'user' });
    
    const [year, monthNum] = month.split('-');
    const startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(monthNum), 0, 23, 59, 59);
    
    const userEmissions = [];
    
    for (const user of users) {
      
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
    
    userEmissions.sort((a, b) => a.totalEmissions - b.totalEmissions);
    
    await Leaderboard.deleteMany({ month: month });
    
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
    
    console.log(`✅ Leaderboard updated for ${month}: ${userEmissions.length} users`);
    return { success: true, count: userEmissions.length };
    
  } catch (error) {
    console.error('Error updating leaderboard:', error);
    return { success: false, error: error.message };
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const month = getCurrentMonth();
    const limit = parseInt(req.query.limit) || 50;
    
    const leaderboardEntries = await Leaderboard.find({ month })
      .sort({ rank: 1 })
      .limit(limit)
      .populate('userId', 'name email createdAt');
    
    const validEntries = leaderboardEntries.filter(entry => entry.userId !== null);
    
    const leaderboard = validEntries.map(entry => ({
      rank: entry.rank,
      userId: entry.userId?._id || 'unknown',
      name: entry.userId?.name || 'Deleted User',
      email: entry.userId?.email || 'unknown@email.com',
      totalEmissions: entry.totalEmissions,
      avatar: entry.userId?.name?.charAt(0) || '?'
    }));
    
    const currentUserEntry = await Leaderboard.findOne({
      userId: req.user.id,
      month: month
    });
    
    res.status(200).json({
      success: true,
      data: {
        currentMonth: month,
        leaderboard: leaderboard,
        currentUser: {
          rank: currentUserEntry?.rank || null,
          emissions: currentUserEntry?.totalEmissions || 0
        },
        totalUsers: leaderboard.length
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