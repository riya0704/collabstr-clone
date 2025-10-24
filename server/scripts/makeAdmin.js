const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const makeUserAdmin = async (email) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/collabstr');
    console.log('Connected to MongoDB');

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.log(`User with email ${email} not found`);
      process.exit(1);
    }

    // Make user admin
    user.isAdmin = true;
    await user.save();

    console.log(`✅ User ${user.profile.name || user.email} is now an admin!`);
    process.exit(0);
  } catch (error) {
    console.error('Error making user admin:', error);
    process.exit(1);
  }
};

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.log('Usage: node makeAdmin.js <email>');
  console.log('Example: node makeAdmin.js admin@example.com');
  process.exit(1);
}

makeUserAdmin(email);