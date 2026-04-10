// routes/leaderboard.js
const express = require('express');
const router = express.Router();
const {
  getLeaderboard
} = require('../controllers/leaderboardController');
const { protect } = require('../middleware/auth');

// All leaderboard routes are protected
router.use(protect);

// Get leaderboard (current month)
router.get('/', getLeaderboard);

module.exports = router;