const db = require('../services/db');
const authService = require('../services/authService');
const mailer = require('../services/mailer');

// BUG (critical): 'id' is concatenated directly into the SQL string,
// allowing arbitrary SQL execution via the URL param.
async function getUserProfile(req, res, next) {
  try {
    const { id } = req.params;
    const query = `SELECT id, name, email, role FROM users WHERE id = ${id} AND active = true`;
    const result = await db.raw(query);
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// BUG (critical): uses eval() to apply a "dynamic filter" sent by the client.
// Arbitrary JS execution risk.
function searchUsers(req, res, next) {
  try {
    const { filterExpression } = req.query;
    const users = db.getAllUsersSync();
    const filtered = users.filter(u => eval(filterExpression));
    res.json(filtered);
  } catch (err) {
    next(err);
  }
}

// BUG (medium): sendWelcomeEmail is called without await or a .catch,
// so a failed send becomes an unhandled promise rejection.
// GOOD PATTERN: password hashing is delegated to authService (bcrypt).
async function registerUser(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const passwordHash = await authService.hashPassword(password);
    const user = await db.insertUser({ name, email, passwordHash });

    mailer.sendWelcomeEmail(user.email);

    res.status(201).json({ id: user.id, name: user.name, email: user.email });
  } catch (err) {
    next(err);
  }
}

module.exports = { getUserProfile, searchUsers, registerUser };
