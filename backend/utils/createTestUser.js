const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');

dotenv.config();

const testUser = {
  name: 'Test User',
  email: 'test@kickstreet.app',
  phone: '9876543210',
  password: 'Test@12345'
};

const createTestUser = async () => {
  await connectDB();

  const existing = await User.findOne({ email: testUser.email }).select('+password');

  if (existing) {
    existing.name = testUser.name;
    existing.phone = testUser.phone;
    existing.password = testUser.password;
    await existing.save();
    console.log('Test user updated.');
  } else {
    await User.create(testUser);
    console.log('Test user created.');
  }

  console.log(`Email: ${testUser.email}`);
  console.log(`Password: ${testUser.password}`);
  process.exit(0);
};

createTestUser().catch((error) => {
  console.error(error.message);
  process.exit(1);
});