const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ─────────────────────────────────────────────────────────────
// Constants — read from environment, never hardcoded in source
// ─────────────────────────────────────────────────────────────
const MASTER_ADMIN_EMAIL    = (process.env.MASTER_ADMIN_EMAIL    || '').toLowerCase();
const MASTER_ADMIN_PASSWORD =  process.env.MASTER_ADMIN_PASSWORD || '';


// Password Regex: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

// Helper to determine preferred currency based on country selection
const getCurrencyByCountry = (country) => {
  const c = (country || '').toLowerCase().trim();
  if (c.includes('india')) return 'INR';
  if (c.includes('united states') || c.includes('usa') || c.includes('us')) return 'USD';
  if (c.includes('united kingdom') || c.includes('uk') || c.includes('england')) return 'GBP';
  if (c.includes('germany') || c.includes('france') || c.includes('spain') || c.includes('italy') || c.includes('europe')) return 'EUR';
  if (c.includes('canada')) return 'CAD';
  if (c.includes('australia')) return 'AUD';
  if (c.includes('japan')) return 'JPY';
  return 'USD';
};

// Helper to generate JWT token and send HttpOnly cookie
const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'start_secret_key_2026',
    { expiresIn: '30d' }
  );

  const cookieOptions = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  };

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        country: user.country,
        preferredCurrency: user.preferredCurrency,
        role: user.role,
      },
    });
};

// ─────────────────────────────────────────────────────────────
// @desc    Register new user
// @route   POST /api/auth/register
// ─────────────────────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const { name, email, password, country } = req.body;

    if (!name || !email || !password || !country) {
      return res.status(400).json({ message: 'Please provide all required fields including Country' });
    }

    // Strict: check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email address' });
    }

    // Strict Password Validation (bypass for master admin only)
    const isMasterAdmin = email.toLowerCase() === MASTER_ADMIN_EMAIL;
    const bypassPassword = isMasterAdmin && password === MASTER_ADMIN_PASSWORD;

    if (!bypassPassword && !PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.'
      });
    }

    // Auto-detect currency by country
    const preferredCurrency = getCurrencyByCountry(country);

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      country,
      preferredCurrency,
      // Strictly enforce Admin role for master admin email
      role: isMasterAdmin ? 'Admin' : 'User',
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message || 'Server error during registration' });
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Login user
// @route   POST /api/auth/login
// ─────────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const emailLower = email.toLowerCase();

    // ── ADMIN FAILSAFE: Auto-create Admin account if it doesn't exist ──────────
    if (emailLower === MASTER_ADMIN_EMAIL) {
      let adminUser = await User.findOne({ email: emailLower });

      if (!adminUser) {
        // Admin doesn't exist in DB — auto-create them now
        console.log('[AUTH] Master admin not found — auto-creating account...');
        const isCorrectMasterPassword = password === MASTER_ADMIN_PASSWORD;
        if (!isCorrectMasterPassword) {
          return res.status(401).json({ message: 'Invalid credentials for admin account' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        adminUser = await User.create({
          name: 'Shasank Shah',
          email: emailLower,
          password: hashedPassword,
          country: 'India',
          preferredCurrency: 'INR',
          role: 'Admin',
        });

        console.log('[AUTH] Master admin account auto-created successfully.');
        return sendTokenResponse(adminUser, 201, res);
      }

      // Admin exists — verify password and enforce role
      const isMatch = await bcrypt.compare(password, adminUser.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Strictly enforce Admin role (in case it was downgraded in DB)
      if (adminUser.role !== 'Admin') {
        adminUser.role = 'Admin';
        await adminUser.save();
      }

      return sendTokenResponse(adminUser, 200, res);
    }
    // ── END ADMIN FAILSAFE ──────────────────────────────────────────────────────

    // Standard user login
    const user = await User.findOne({ email: emailLower });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // RBAC override: ensure correct roles by name/email patterns
    const nameLower = user.name.toLowerCase();
    if (nameLower === 'shasank' || nameLower === 'shasank shah') {
      if (user.role !== 'Admin') {
        user.role = 'Admin';
        await user.save();
      }
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Logout user / Clear cookie
// @route   POST /api/auth/logout
// ─────────────────────────────────────────────────────────────
exports.logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ success: true, message: 'User logged out successfully' });
};

// ─────────────────────────────────────────────────────────────
// @desc    Get current user profile
// @route   GET /api/auth/me
// ─────────────────────────────────────────────────────────────
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching user profile' });
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Update current user profile (name, country, preferredCurrency)
// @route   PUT /api/auth/me
// ─────────────────────────────────────────────────────────────
exports.updateMe = async (req, res) => {
  try {
    const { name, country, preferredCurrency } = req.body;

    const updateFields = {};
    if (name && name.trim()) updateFields.name = name.trim();
    if (country && country.trim()) {
      updateFields.country = country.trim();
      // Auto-recalculate currency unless explicitly provided
      if (!preferredCurrency) {
        updateFields.preferredCurrency = getCurrencyByCountry(country);
      }
    }
    if (preferredCurrency) updateFields.preferredCurrency = preferredCurrency;

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: 'No valid fields provided for update' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Request a password reset link (generates a 30-min signed token)
// @route   POST /api/auth/forgot-password
// ─────────────────────────────────────────────────────────────
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Please provide an email address' });

    const user = await User.findOne({ email: email.toLowerCase() });
    // Always respond 200 to prevent user enumeration attacks
    if (!user) {
      return res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });
    }

    // Generate a short-lived (30 min) signed reset token
    const resetToken = jwt.sign(
      { id: user._id, purpose: 'password_reset' },
      process.env.JWT_SECRET || 'start_secret_key_2026',
      { expiresIn: '30m' }
    );

    // In production: send `resetToken` via email (nodemailer / SendGrid)
    // For now, return it directly so the frontend can use it in development
    console.log(`[AUTH] Password reset token for ${user.email}: ${resetToken}`);

    res.status(200).json({
      message: 'If that email exists, a reset link has been sent.',
      // Remove `resetToken` from response body in production (send via email only)
      resetToken,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error during password reset request' });
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Consume a reset token and update the user's password
// @route   POST /api/auth/reset-password
// ─────────────────────────────────────────────────────────────
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    // Verify and decode — jwt.verify throws if expired or tampered
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'start_secret_key_2026');
    } catch (err) {
      const msg = err.name === 'TokenExpiredError'
        ? 'Password reset link has expired (30 min limit). Please request a new one.'
        : 'Invalid or tampered reset token.';
      return res.status(401).json({ message: msg });
    }

    if (decoded.purpose !== 'password_reset') {
      return res.status(401).json({ message: 'Invalid reset token purpose.' });
    }

    if (!PASSWORD_REGEX.test(newPassword)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.',
      });
    }

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.passwordResetRequested = false;
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully. Please log in.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error during password reset' });
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Change password for authenticated user
// @route   PUT /api/auth/update-password
// @access  Private (requires valid session cookie)
// ─────────────────────────────────────────────────────────────
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required.' });
    }

    // Fetch user WITH password field (normally excluded by select('-password'))
    const user = await User.findById(req.user.id).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found.' });

    // Verify the current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect current password.' });
    }

    // Reject if new password is the same as the current one
    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
      return res.status(400).json({ message: 'New password must be different from your current password.' });
    }

    // Enforce password strength policy
    if (!PASSWORD_REGEX.test(newPassword)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters and include 1 uppercase, 1 lowercase, 1 number, and 1 special character.',
      });
    }

    // Hash and persist the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ message: 'Server error while updating password.' });
  }
};
