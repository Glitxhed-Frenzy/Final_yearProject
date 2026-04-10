// routes/leaderboard.js
const express = require('express');
const router = express.Router();
const {
  getLeaderboard,
  refreshLeaderboard
} = require('../controllers/leaderboardController');
const { protect, authorize } = require('../middleware/auth');

// All leaderboard routes are protected (require login)
router.use(protect);

// Get leaderboard (current month)
router.get('/', getLeaderboard);

// Refresh leaderboard manually (admin only)
router.post('/refresh', authorize('admin'), refreshLeaderboard);

module.exports = router;