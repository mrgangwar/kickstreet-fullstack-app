const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');

dotenv.config();

const admin = {
  name: 'Kick Street Admin',
  email: 'admin@kickstreet.app',
  phone: '9999999999',
  password: 'Admin@12345',
  role: 'admin'
};

const createAdmin = async () => {
  await connectDB();

  const existing = await User.findOne({ email: admin.email }).select('+password');

  if (existing) {
    existing.name = admin.name;
    existing.phone = admin.phone;
    existing.password = admin.password;
    existing.role = admin.role;
    await existing.save();
    console.log('Admin account updated.');
  } else {
    await User.create(admin);
    console.log('Admin account created.');
  }

  console.log(`Email: ${admin.email}`);
  console.log(`Password: ${admin.password}`);
  process.exit(0);
};

createAdmin().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
