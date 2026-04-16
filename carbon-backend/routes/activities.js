// routes/activities.js
const express = require('express');
const router = express.Router();
const {
  createActivity,
  getActivities,
  getActivity,
  updateActivity,
  deleteActivity,
  getStats
} = require('../controllers/activityController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getActivities)
  .post(createActivity);

router.get('/stats', getStats);

router.route('/:id')
  .get(getActivity)
  .put(updateActivity)
  .delete(deleteActivity);

module.exports = router;