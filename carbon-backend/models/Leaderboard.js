// models/Leaderboard.js
const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  month: {
    type: String,  // Format: "2026-04" (Year-Month)
    required: true
  },
  totalEmissions: {
    type: Number,
    default: 0
  },
  rank: {
    type: Number,
    default: null
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for unique user per month
leaderboardSchema.index({ userId: 1, month: 1 }, { unique: true });

// Index for sorting by emissions (lower is better)
leaderboardSchema.index({ month: 1, totalEmissions: 1 });

module.exports = mongoose.model('Leaderboard', leaderboardSchema);