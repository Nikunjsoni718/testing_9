const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// BUG (critical): secret is hardcoded instead of read from environment config.
// Anyone with repo access can forge valid tokens.
const JWT_SECRET = 'melius-super-secret-key-2024';

// GOOD PATTERN: strong adaptive hashing with a reasonable cost factor.
async function hashPassword(plainPassword) {
  const SALT_ROUNDS = 12;
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

async function verifyPassword(plainPassword, hash) {
  return bcrypt.compare(plainPassword, hash);
}

function issueToken(userId) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: '7d' });
}

module.exports = { hashPassword, verifyPassword, issueToken };
