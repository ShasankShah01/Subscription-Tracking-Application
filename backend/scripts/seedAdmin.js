const User = require('../models/User');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
  try {
    const adminEmail = 'shasankshah.25.mca@iite.indusuni.ac.in';
    const existingAdmin = await User.findOne({
      $or: [{ email: adminEmail }, { name: 'Shasank Shah' }]
    });

    if (existingAdmin) {
      console.log(`[Seed] Master Admin account already exists (${existingAdmin.email} - Role: ${existingAdmin.role})`);
      return;
    }

    const rawPassword = 'Shasank0110';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(rawPassword, salt);

    const adminUser = await User.create({
      name: 'Shasank Shah',
      email: adminEmail,
      password: hashedPassword,
      country: 'India',
      preferredCurrency: 'INR',
      role: 'Admin',
    });

    console.log(`[Seed] Successfully seeded Master Admin account: Name: "${adminUser.name}", Email: "${adminUser.email}", Role: "${adminUser.role}"`);
  } catch (error) {
    console.error('[Seed] Admin seeding error:', error.message);
  }
};

module.exports = seedAdmin;

if (require.main === module) {
  const mongoose = require('mongoose');
  require('dotenv').config();
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/subscription_tracker';

  mongoose.connect(mongoURI).then(async () => {
    await seedAdmin();
    mongoose.connection.close();
  });
}
