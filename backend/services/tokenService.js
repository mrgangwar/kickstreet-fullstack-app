const jwt = require('jsonwebtoken');

const signToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is missing. Add it to backend/.env');
  }

  if (!user) {
    throw new Error('User object is undefined in signToken');
  }

  if (!user._id) {
    console.log('User received in signToken:', user);
    throw new Error('User _id is missing in signToken');
  }

  return jwt.sign(
    {
      id: user._id.toString(),
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );
};

module.exports = { signToken };