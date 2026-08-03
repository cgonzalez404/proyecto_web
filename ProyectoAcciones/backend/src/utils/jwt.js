const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');

const signToken = (payload) => {
  return jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
};

const verifyToken = (token) => {
  return jwt.verify(token, jwtSecret);
};

module.exports = {
  signToken,
  verifyToken,
};
