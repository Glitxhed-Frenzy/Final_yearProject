// routes/auth.js
const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateDetails,
  updatePassword,
  verifyAndResetPassword  // Make sure this is spelled correctly
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateEmailDomain } = require('../middleware/validateEmail');

router.post('/register', validateEmailDomain, register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);

// This line is causing the error - make sure verifyAndResetPassword exists
router.post('/verify-and-reset', verifyAndResetPassword);

module.exports = router;