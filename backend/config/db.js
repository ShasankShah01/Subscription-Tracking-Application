const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

/**
 * Connects Mongoose to the primary MongoDB instance.
 * Falls back to an in-memory MongoDB server if the primary connection fails.
 *
 * @returns {{ usingFallback: boolean }} — lets server.js know which DB is active
 */
const connectDB = async () => {
  const primaryURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/subscription_tracker';

  // --- Attempt 1: Primary Database ---
  try {
    await mongoose.connect(primaryURI, {
      serverSelectionTimeoutMS: 4000, // Fail fast so the fallback kicks in quickly
    });
    console.log('✅ [DB] Connected to Primary Local MongoDB:', mongoose.connection.host);
    return { usingFallback: false };
  } catch (primaryError) {
    console.warn('⚠️  [DB] Primary MongoDB unreachable:', primaryError.message);
    console.warn('⚠️  [DB] Switching to In-Memory Fallback Database...');
  }

  // --- Attempt 2: In-Memory Fallback Database ---
  try {
    const memServer = await MongoMemoryServer.create();
    const fallbackURI = memServer.getUri();

    await mongoose.connect(fallbackURI);

    console.log('');
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║  ⚠️  FALLBACK IN-MEMORY DATABASE IS ACTIVE               ║');
    console.log('║  All data will be lost when the server shuts down.       ║');
    console.log('║  The seeder will create a dev Admin account automatically.║');
    console.log('╚══════════════════════════════════════════════════════════╝');
    console.log('');

    return { usingFallback: true };
  } catch (fallbackError) {
    console.error('❌ [DB] CRITICAL: Both primary and fallback databases failed!');
    console.error('❌ [DB] Fallback error:', fallbackError.message);
    process.exit(1); // Cannot run without any database — exit cleanly
  }
};

module.exports = connectDB;
