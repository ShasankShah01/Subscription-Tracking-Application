const express = require('express');
const router = express.Router();
const {
  getPlatformStats,
  getAllUsers,
  updateUserRole,
  toggleSuspendUser,
  forcePasswordReset,
  getUserSubscriptions,
  deleteUser,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');

// All admin routes require a valid JWT and at least Analyst-level access
router.use(protect);
router.use(authorize('Admin', 'System Analyst'));

// Read-only (Analyst + Admin)
router.get('/stats', getPlatformStats);
router.get('/users', getAllUsers);

// Admin-only mutations
router.put('/users/:id/role',         authorize('Admin'), updateUserRole);
router.put('/users/:id/suspend',      authorize('Admin'), toggleSuspendUser);
router.put('/users/:id/force-reset',  authorize('Admin'), forcePasswordReset);
router.get('/users/:id/subscriptions',authorize('Admin'), getUserSubscriptions);
router.delete('/users/:id',           authorize('Admin'), deleteUser);

module.exports = router;
