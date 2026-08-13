const User = require('../models/User');
const Subscription = require('../models/Subscription');

// @desc    Get platform-wide analytics
// @route   GET /api/admin/stats
exports.getPlatformStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSubscriptions = await Subscription.countDocuments();
    const activeSubscriptions = await Subscription.countDocuments({ status: 'Active' });
    const pausedSubscriptions = await Subscription.countDocuments({ status: 'Paused' });

    const rolesCount = {
      Admin: await User.countDocuments({ role: 'Admin' }),
      SystemAnalyst: await User.countDocuments({ role: 'System Analyst' }),
      User: await User.countDocuments({ role: 'User' }),
    };

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalSubscriptions,
        activeSubscriptions,
        pausedSubscriptions,
        rolesCount,
        systemStatus: 'Optimal',
        uptime: process.uptime(),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching platform statistics' });
  }
};

// @desc    Get all users list
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

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user role' });
  }
};
