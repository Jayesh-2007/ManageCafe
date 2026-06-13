const jwt = require('jsonwebtoken');

const TOKEN_EXPIRATION = '7d';

function getJwtSecret() {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  return process.env.JWT_SECRET;
}

function generateToken(payload) {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: TOKEN_EXPIRATION,
  });
}

function verifyToken(token) {
  return jwt.verify(token, getJwtSecret());
}

module.exports = {
  generateToken,
  verifyToken,
};
