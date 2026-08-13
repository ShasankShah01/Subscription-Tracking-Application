const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  serviceName: {
    type: String,
    required: [true, 'Please add a service name'],
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Entertainment', 'Infrastructure', 'Design', 'AI Tools', 'Music', 'Fitness', 'Utilities', 'Other'],
    default: 'Entertainment',
  },
  cost: {
    type: Number,
    required: [true, 'Please add a cost amount'],
  },
  currency: {
    type: String,
    default: 'INR',
  },
  billingCycle: {
    type: String,
    enum: ['Monthly', 'Yearly'],
    default: 'Monthly',
  },
  nextRenewalDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Paused', 'Flagged'],
    default: 'Active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
