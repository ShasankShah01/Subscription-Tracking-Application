const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Feedback = require('../models/Feedback');

/**
 * Purges sample, demo, placeholder, and test feedback records from MongoDB.
 * Preserves all genuine user feedback.
 */
const cleanSampleFeedback = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/subscription_tracker';

  try {
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB for feedback cleanup.');

    // Query targeting sample, demo, placeholder, and test entries
    const sampleQuery = {
      $or: [
        { name: { $regex: /sarah jenkins|fck user|\*\*\* user|alex morgan|alex morgen|^test|sample|mock|dummy/i } },
        { message: { $regex: /tracking subscriptions has never been easier|skibidi|gyatt|\*\*\*\*\*\*\*|push notifications for trial expiration/i } },
        { isSample: true },
        { isDemo: true },
        { mock: true },
      ],
    };

    const count = await Feedback.countDocuments(sampleQuery);
    console.log(`Found ${count} sample/test feedback entries.`);

    if (count > 0) {
      const result = await Feedback.deleteMany(sampleQuery);
      console.log(`🗑️ Successfully deleted ${result.deletedCount} sample/test feedback entries.`);
    } else {
      console.log('ℹ️ No sample feedback entries found matching deletion criteria.');
    }

    const remainingLiveCount = await Feedback.countDocuments({});
    console.log(`📊 Live/real feedback entries remaining in database: ${remainingLiveCount}`);

    await mongoose.connection.close();
    console.log('🔌 Database connection closed cleanly.');
  } catch (err) {
    console.error('❌ Error cleaning sample feedback:', err.message);
    process.exit(1);
  }
};

if (require.main === module) {
  cleanSampleFeedback();
}

module.exports = cleanSampleFeedback;
