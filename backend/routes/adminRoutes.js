const express = require('express');
const router = express.Router();
const { getPlatformStats, getAllUsers, updateUserRole } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');

router.use(protect);
router.use(authorize('Admin', 'System Analyst'));

router.get('/stats', getPlatformStats);
router.get('/users', getAllUsers);
router.put('/users/:id/role', authorize('Admin'), updateUserRole);

module.exports = router;
