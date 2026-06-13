const bcrypt = require('bcryptjs');
const db = require('../models/db');
const { generateToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');

async function register(req, res, next) {
  const { name, email, password } = req.body;

  try {
    const [existingUsers] = await db.query(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    if (existingUsers.length > 0) {
      return next(new AppError('Email is already registered', 409));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO users (name, email, password, role, status)
       VALUES (?, ?, ?, 'employee', 'active')`,
      [name, email, hashedPassword]
    );

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
    });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;

  try {
    const [users] = await db.query(
      `SELECT id, name, email, password, role, status
       FROM users
       WHERE email = ?
       LIMIT 1`,
      [email]
    );

    if (users.length === 0) {
      return next(new AppError('Invalid email or password', 401));
    }

    const user = users[0];
    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return next(new AppError('Invalid email or password', 401));
    }

    if (user.status === 'disabled') {
      return next(new AppError('User account is disabled', 403));
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  register,
  login,
};
