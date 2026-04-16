// routes/leaderboard.js
const express = require('express');
const router = express.Router();
const {
  getLeaderboard,
  refreshLeaderboard
} = require('../controllers/leaderboardController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', getLeaderboard);

router.post('/refresh', authorize('admin'), refreshLeaderboard);

module.exports = router;