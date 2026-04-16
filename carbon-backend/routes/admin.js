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

router.post('/login', validateAdminEmailDomain, async (req, res) => {
  const { login } = require('../controllers/authController');
  return login(req, res);
});

router.use(protect);
router.use(authorize('admin'));

router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/role', updateUserRole);

router.get('/stats', getAdminStats);

router.route('/emission-factors')
  .get(getEmissionFactors)
  .post(createEmissionFactor);

router.route('/emission-factors/:id')
  .put(updateEmissionFactor)
  .delete(deleteEmissionFactor);

module.exports = router;