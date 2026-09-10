const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,  // Optimises dashboard queries filtered by logged-in user
    },
    serviceName: {
      type: String,
      required: [true, 'Please add a service name'],
      trim: true,
    },
    category: {
      type: String,
      required: true,
      default: 'Entertainment',
      trim: true,
    },
    cost: {
      type: Number,
      required: [true, 'Please add a cost amount'],
    },
    currency: {
      type: String,
      default: 'USD',
      trim: true,
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
      enum: ['Active', 'Paused', 'Flagged', 'Trial', 'Upcoming'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual alias for frontend compatibility
subscriptionSchema.virtual('name').get(function () {
  return this.serviceName;
});

subscriptionSchema.virtual('price').get(function () {
  return this.cost;
});

subscriptionSchema.virtual('cycle').get(function () {
  return this.billingCycle;
});

subscriptionSchema.virtual('renewal').get(function () {
  return this.nextRenewalDate;
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
