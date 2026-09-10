const express = require('express');
const router = express.Router();
const {
  register, login, logout,
  getMe, updateMe,
  forgotPassword, resetPassword,
  updatePassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);

// Password reset flow (public — no auth token required)
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Change password (private — requires active session)
router.put('/update-password', protect, updatePassword);

module.exports = router;

