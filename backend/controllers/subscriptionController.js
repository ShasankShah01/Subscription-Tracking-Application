const Subscription = require('../models/Subscription');

// @desc    Get all subscriptions for logged in user
// @route   GET /api/subscriptions
exports.getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: subscriptions.length, subscriptions });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subscriptions' });
  }
};

// @desc    Create new subscription
// @route   POST /api/subscriptions
exports.createSubscription = async (req, res) => {
  try {
    const { serviceName, category, cost, currency, billingCycle, nextRenewalDate, status } = req.body;

    if (!serviceName || !cost || !nextRenewalDate) {
      return res.status(400).json({ message: 'Service name, cost, and next renewal date are required' });
    }

    const subscription = await Subscription.create({
      user: req.user.id,
      serviceName,
      category: category || 'Entertainment',
      cost: Number(cost),
      currency: currency || req.user.preferredCurrency || 'INR',
      billingCycle: billingCycle || 'Monthly',
      nextRenewalDate,
      status: status || 'Active',
    });

    res.status(201).json({ success: true, subscription });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error creating subscription' });
  }
};

// @desc    Update subscription (e.g. toggle status Pause/Resume)
// @route   PUT /api/subscriptions/:id
exports.updateSubscription = async (req, res) => {
  try {
    let subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    if (subscription.user.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(401).json({ message: 'Not authorized to update this subscription' });
    }

    subscription = await Subscription.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, subscription });
  } catch (error) {
    res.status(500).json({ message: 'Error updating subscription' });
  }
};

// @desc    Delete subscription
// @route   DELETE /api/subscriptions/:id
exports.deleteSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    if (subscription.user.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(401).json({ message: 'Not authorized to delete this subscription' });
    }

    await subscription.deleteOne();
    res.status(200).json({ success: true, message: 'Subscription deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting subscription' });
  }
};
