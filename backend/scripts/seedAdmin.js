const User = require('../models/User');
const bcrypt = require('bcryptjs');

/**
 * Seeds the Master Admin account (shasankshah.25.mca@iite.indusuni.ac.in).
 * Also seeds a dev fallback admin (admin@starttracker.com) when running on
 * the in-memory database, so developers are never locked out.
 *
 * @param {{ usingFallback: boolean }} options
 */
const seedAdmin = async ({ usingFallback = false } = {}) => {
  // --- Seed 1: Master Admin ---
  try {
    const masterEmail = 'shasankshah.25.mca@iite.indusuni.ac.in';
    const existingMaster = await User.findOne({
      $or: [{ email: masterEmail }, { name: 'Shasank Shah' }],
    });

    if (existingMaster) {
      console.log(`[Seed] Master Admin already exists: ${existingMaster.email} (Role: ${existingMaster.role})`);
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Sh@$ank0110', salt);

      const adminUser = await User.create({
        name: 'Shasank Shah',
        email: masterEmail,
        password: hashedPassword,
        country: 'India',
        preferredCurrency: 'INR',
        role: 'Admin',
      });

      console.log(`[Seed] ✅ Master Admin seeded: "${adminUser.name}" <${adminUser.email}> [${adminUser.role}]`);
    }
  } catch (error) {
    console.error('[Seed] ❌ Master Admin seeding error:', error.message);
  }

  // --- Seed 2: Dev Fallback Admin (only when using in-memory DB) ---
  if (usingFallback) {
    try {
      const devEmail = 'admin@starttracker.com';
      const existingDev = await User.findOne({ email: devEmail });

      if (existingDev) {
        console.log(`[Seed] Dev fallback admin already exists: ${existingDev.email}`);
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Sh@$ank0110', salt);

        const devAdmin = await User.create({
          name: 'Dev Admin',
          email: devEmail,
          password: hashedPassword,
          country: 'India',
          preferredCurrency: 'INR',
          role: 'Admin',
        });

        console.log(`[Seed] ✅ Dev Fallback Admin seeded: "${devAdmin.name}" <${devAdmin.email}> [${devAdmin.role}]`);
        console.log(`[Seed]    → Login: admin@starttracker.com  |  Password: Sh@$ank0110`);
      }
    } catch (error) {
      console.error('[Seed] ❌ Dev Fallback Admin seeding error:', error.message);
    }
  }
};

module.exports = seedAdmin;

// --- CLI standalone run: node scripts/seedAdmin.js ---
if (require.main === module) {
  const mongoose = require('mongoose');
  require('dotenv').config();
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/subscription_tracker';

  mongoose.connect(mongoURI).then(async () => {
    await seedAdmin({ usingFallback: false });
    mongoose.connection.close();
  }).catch((err) => {
    console.error('[Seed CLI] Connection failed:', err.message);
    process.exit(1);
  });
}
