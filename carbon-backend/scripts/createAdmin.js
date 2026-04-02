// scripts/createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com'];

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('📧 Admin Account Setup');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  Admin email must be from: Gmail, Yahoo, or Outlook\n');

    // Get admin email from user input
    const adminEmail = await new Promise((resolve) => {
      rl.question('Enter admin email: ', resolve);
    });

    // Validate email domain
    const domain = adminEmail.split('@')[1]?.toLowerCase();
    if (!allowedDomains.includes(domain)) {
      console.error('\n❌ Error: Admin email must be from Gmail, Yahoo, or Outlook');
      console.log('   Allowed domains: gmail.com, yahoo.com, outlook.com\n');
      rl.close();
      process.exit(1);
    }

    // Get admin password
    const adminPassword = await new Promise((resolve) => {
      rl.question('Enter admin password (min 6 characters): ', resolve);
    });

    if (adminPassword.length < 6) {
      console.error('\n❌ Error: Password must be at least 6 characters\n');
      rl.close();
      process.exit(1);
    }

    // Get admin name
    const adminName = await new Promise((resolve) => {
      rl.question('Enter admin name (default: Admin User): ', (answer) => {
        resolve(answer || 'Admin User');
      });
    });

    // Delete any existing admin with this email
    await User.deleteOne({ email: adminEmail });
    console.log(`\n🗑️  Deleted existing admin: ${adminEmail}`);

    // Create new admin
    const admin = new User({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'admin'
    });

    await admin.save();
    
    console.log('\n✅ Admin created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`👤 Name: ${adminName}`);
    console.log(`🔑 Password: ${adminPassword}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  Keep these credentials secure!');
    
    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    rl.close();
    process.exit(1);
  }
}

createAdmin();