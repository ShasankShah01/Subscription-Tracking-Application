const User = require('../models/User');
const Subscription = require('../models/Subscription');

// @desc    Get platform-wide analytics including Global MRR and Top Service
// @route   GET /api/admin/stats
exports.getPlatformStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSubscriptions = await Subscription.countDocuments();
    const activeSubscriptions = await Subscription.countDocuments({ status: 'Active' });
    const pausedSubscriptions = await Subscription.countDocuments({ status: 'Paused' });
    const suspendedUsers = await User.countDocuments({ isSuspended: true });

    const rolesCount = {
      Admin: await User.countDocuments({ role: 'Admin' }),
      SystemAnalyst: await User.countDocuments({ role: 'System Analyst' }),
      User: await User.countDocuments({ role: 'User' }),
    };

    // --- Global MRR Calculation ---
    // Sum all active subscription costs (normalize yearly → monthly)
    const allActiveSubs = await Subscription.find({ status: 'Active' });
    const globalMRR = allActiveSubs.reduce((acc, sub) => {
      const monthlyCost = sub.billingCycle === 'Yearly' ? sub.cost / 12 : sub.cost;
      return acc + monthlyCost;
    }, 0);

    // --- Top Tracked Service ---
    const topServiceResult = await Subscription.aggregate([
      { $group: { _id: '$serviceName', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);
    const topService = topServiceResult.length > 0
      ? { name: topServiceResult[0]._id, count: topServiceResult[0].count }
      : { name: 'N/A', count: 0 };

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalSubscriptions,
        activeSubscriptions,
        pausedSubscriptions,
        suspendedUsers,
        rolesCount,
        globalMRR: parseFloat(globalMRR.toFixed(2)),
        topService,
        systemStatus: 'Optimal',
        uptime: process.uptime(),
      },
    });
  } catch (error) {
    console.error('Error fetching platform statistics:', error.message);
    res.status(500).json({ message: 'Error fetching platform statistics' });
  }
};

// @desc    Get all users list (including suspension status)
// @route   GET /api/admin/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users list' });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!['User', 'System Analyst', 'Admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user role' });
  }
};

// @desc    Toggle account suspension for a user
// @route   PUT /api/admin/users/:id/suspend
// @access  Admin Only
exports.toggleSuspendUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.email.toLowerCase() === 'shasankshah.25.mca@iite.indusuni.ac.in') {
      return res.status(403).json({ message: 'Cannot suspend the master admin account' });
    }

    user.isSuspended = !user.isSuspended;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Account ${user.isSuspended ? 'suspended' : 'reinstated'} successfully`,
      isSuspended: user.isSuspended,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error toggling user suspension' });
  }
};

// @desc    Force password reset flag for a user (mocked — would trigger an email in production)
// @route   PUT /api/admin/users/:id/force-reset
// @access  Admin Only
exports.forcePasswordReset = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.passwordResetRequested = true;
    await user.save();

    // In production this would trigger a password reset email via nodemailer/SendGrid.
    console.log(`[Admin] Force password reset flagged for: ${user.email}`);

    res.status(200).json({
      success: true,
      message: `Password reset email sent to ${user.email} (simulated)`,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error forcing password reset' });
  }
};

// @desc    Get all subscriptions belonging to a specific user
// @route   GET /api/admin/users/:id/subscriptions
// @access  Admin Only
exports.getUserSubscriptions = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const subscriptions = await Subscription.find({ user: req.params.id }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, user, subscriptions });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user subscriptions' });
  }
};

// @desc    Delete user and their subscriptions
// @route   DELETE /api/admin/users/:id
// @access  Admin Only
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.email.toLowerCase() === 'shasankshah.25.mca@iite.indusuni.ac.in') {
      return res.status(403).json({ message: 'Cannot delete the master admin account' });
    }

    await Subscription.deleteMany({ user: req.params.id });
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'User and their data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
};
