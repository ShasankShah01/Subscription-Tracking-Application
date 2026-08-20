const Subscription = require('../models/Subscription');

// @desc    Get all subscriptions for logged in user
// @route   GET /api/subscriptions
exports.getSubscriptions = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const subscriptions = await Subscription.find({ user: userId }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: subscriptions.length,
      subscriptions,
    });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ error: error.message, message: 'Error fetching subscriptions' });
  }
};

// @desc    Create new subscription
// @route   POST /api/subscriptions
exports.createSubscription = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    console.log("Saving subscription for user:", userId, req.body);

    const {
      serviceName,
      name,
      category,
      cost,
      price,
      currency,
      billingCycle,
      cycle,
      nextRenewalDate,
      renewal,
      status,
    } = req.body;

    const resolvedName = (serviceName || name || '').trim();
    let numericCost = cost !== undefined ? Number(cost) : (parseFloat(String(price || '0').replace(/[^0-9.]/g, '')) || 0);

    const resolvedDate = nextRenewalDate || renewal || new Date();

    if (!resolvedName) {
      return res.status(400).json({ error: 'Service name is required', message: 'Service name is required' });
    }

    if (isNaN(numericCost)) {
      return res.status(400).json({ error: 'Valid cost is required', message: 'Valid cost is required' });
    }

    const subscription = new Subscription({
      user: userId,
      serviceName: resolvedName,
      category: category || 'Entertainment',
      cost: numericCost,
      currency: currency || req.user?.preferredCurrency || 'USD',
      billingCycle: billingCycle || cycle || 'Monthly',
      nextRenewalDate: new Date(resolvedDate),
      status: status || 'Active',
    });

    const savedSubscription = await subscription.save();
    console.log("Subscription saved successfully with ID:", savedSubscription._id);

    res.status(201).json({ success: true, subscription: savedSubscription });
  } catch (error) {
    console.error("Database save error:", error);
    res.status(500).json({ error: error.message, message: error.message || 'Error creating subscription' });
  }
};

// @desc    Update subscription (e.g. toggle status, edit details)
// @route   PUT /api/subscriptions/:id
exports.updateSubscription = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    let subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found', message: 'Subscription not found' });
    }

    if (subscription.user.toString() !== String(userId) && req.user?.role !== 'Admin') {
      return res.status(401).json({ error: 'Not authorized', message: 'Not authorized to update this subscription' });
    }

    const updates = { ...req.body };
    if (updates.name && !updates.serviceName) updates.serviceName = updates.name;
    if (updates.price !== undefined && updates.cost === undefined) {
      updates.cost = parseFloat(String(updates.price).replace(/[^0-9.]/g, '')) || 0;
    }
    if (updates.cycle && !updates.billingCycle) updates.billingCycle = updates.cycle;
    if (updates.renewal && !updates.nextRenewalDate) updates.nextRenewalDate = updates.renewal;

    subscription = await Subscription.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, subscription });
  } catch (error) {
    console.error("Database update error:", error);
    res.status(500).json({ error: error.message, message: error.message || 'Error updating subscription' });
  }
};

// @desc    Delete subscription
// @route   DELETE /api/subscriptions/:id
exports.deleteSubscription = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found', message: 'Subscription not found' });
    }

    if (subscription.user.toString() !== String(userId) && req.user?.role !== 'Admin') {
      return res.status(401).json({ error: 'Not authorized', message: 'Not authorized to delete this subscription' });
    }

    await subscription.deleteOne();
    res.status(200).json({ success: true, message: 'Subscription deleted successfully' });
  } catch (error) {
    console.error("Database delete error:", error);
    res.status(500).json({ error: error.message, message: error.message || 'Error deleting subscription' });
  }
};
