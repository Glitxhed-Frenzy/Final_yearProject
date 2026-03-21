// scripts/createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Delete any existing admin
    await User.deleteOne({ email: 'admin@example.com' });
    console.log('🗑️  Deleted existing admin');

    // Create new admin
    const admin = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });

    await admin.save();
    console.log('✅ Admin created successfully!');
    console.log('📧 Email: admin@example.com');
    console.log('🔑 Password: admin123');

    // Verify it works
    const checkUser = await User.findOne({ email: 'admin@example.com' }).select('+password');
    const isValid = await bcrypt.compare('admin123', checkUser.password);
    console.log('🔐 Password verification:', isValid ? '✅ OK' : '❌ FAILED');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createAdmin();