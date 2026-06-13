const bcrypt = require('bcryptjs');
const db = require('../models/db');
const { generateToken } = require('../utils/jwt');

async function register(req, res) {
  const { name, email, password } = req.body;

  try {
    const [existingUsers] = await db.query(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email is already registered',
      });
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
    return res.status(500).json({
      success: false,
      message: 'Unable to register user',
    });
  }
}

async function login(req, res) {
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
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const user = users[0];
    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    if (user.status === 'disabled') {
      return res.status(403).json({
        success: false,
        message: 'User account is disabled',
      });
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
    const isConfigError = error.message === 'JWT_SECRET is not configured';

    return res.status(500).json({
      success: false,
      message: isConfigError ? error.message : 'Unable to login',
    });
  }
}

module.exports = {
  register,
  login,
};
