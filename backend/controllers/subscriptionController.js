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

// @desc    Get real aggregation analytics for logged in user
// @route   GET /api/subscriptions/analytics
exports.getAnalytics = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const mongoose = require('mongoose');
    const userObjectId = new mongoose.Types.ObjectId(String(userId));

    // 1. Overall & Status Aggregation
    const statusAggregation = await Subscription.aggregate([
      { $match: { user: userObjectId } },
      {
        $project: {
          serviceName: 1,
          category: 1,
          cost: 1,
          currency: 1,
          billingCycle: 1,
          status: 1,
          nextRenewalDate: 1,
          monthlyCost: {
            $cond: [
              { $eq: ['$billingCycle', 'Yearly'] },
              { $divide: ['$cost', 12] },
              '$cost',
            ],
          },
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalMonthlySpend: { $sum: '$monthlyCost' },
        },
      },
    ]);

    // 2. Category Breakdown Aggregation (Active & Trial)
    const categoryAggregation = await Subscription.aggregate([
      {
        $match: {
          user: userObjectId,
          status: { $in: ['Active', 'Trial', 'Upcoming'] },
        },
      },
      {
        $project: {
          category: 1,
          monthlyCost: {
            $cond: [
              { $eq: ['$billingCycle', 'Yearly'] },
              { $divide: ['$cost', 12] },
              '$cost',
            ],
          },
        },
      },
      {
        $group: {
          _id: '$category',
          totalMonthlySpend: { $sum: '$monthlyCost' },
          count: { $sum: 1 },
        },
      },
      { $sort: { totalMonthlySpend: -1 } },
    ]);

    // 3. Raw user subscriptions for frontend dynamic conversions & 6-month projection
    const userSubscriptions = await Subscription.find({ user: userObjectId }).sort({ nextRenewalDate: 1 });

    let activeMonthlySpend = 0;
    let pausedMonthlySavings = 0;
    let activeCount = 0;
    let pausedCount = 0;
    let trialCount = 0;

    statusAggregation.forEach(group => {
      if (group._id === 'Active' || group._id === 'Upcoming') {
        activeMonthlySpend += group.totalMonthlySpend;
        activeCount += group.count;
      } else if (group._id === 'Trial') {
        activeMonthlySpend += group.totalMonthlySpend;
        trialCount += group.count;
      } else if (group._id === 'Paused') {
        pausedMonthlySavings += group.totalMonthlySpend;
        pausedCount += group.count;
      }
    });

    const projectedAnnualCost = activeMonthlySpend * 12;

    const categoryBreakdown = categoryAggregation.map(cat => ({
      name: cat._id || 'General',
      value: Number(cat.totalMonthlySpend.toFixed(2)),
      count: cat.count,
    }));

    res.status(200).json({
      success: true,
      analytics: {
        totalMonthlySpend: Number(activeMonthlySpend.toFixed(2)),
        projectedAnnualCost: Number(projectedAnnualCost.toFixed(2)),
        pausedMonthlySavings: Number(pausedMonthlySavings.toFixed(2)),
        activeCount,
        trialCount,
        pausedCount,
        totalCount: userSubscriptions.length,
        categoryBreakdown,
        statusBreakdown: statusAggregation,
        subscriptions: userSubscriptions,
      },
    });
  } catch (error) {
    console.error('Analytics aggregation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error generating analytics',
    });
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

