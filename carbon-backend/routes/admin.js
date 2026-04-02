// routes/admin.js
const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  deleteUser,
  updateUserRole,
  getAdminStats,
  getEmissionFactors,
  createEmissionFactor,
  updateEmissionFactor,
  deleteEmissionFactor
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const { validateAdminEmailDomain } = require('../middleware/validateEmail');

// Apply admin email validation to login (though login is handled in auth controller)
// We'll add a special admin login route
router.post('/login', validateAdminEmailDomain, async (req, res) => {
  // This will be handled by the auth controller but with admin validation
  const { login } = require('../controllers/authController');
  return login(req, res);
});

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// User management
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/role', updateUserRole);

// Stats
router.get('/stats', getAdminStats);

// Emission factors
router.route('/emission-factors')
  .get(getEmissionFactors)
  .post(createEmissionFactor);

router.route('/emission-factors/:id')
  .put(updateEmissionFactor)
  .delete(deleteEmissionFactor);

module.exports = router;