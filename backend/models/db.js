const mysql = require('mysql2/promise');
const { logger } = require('../utils/logger');

const requiredDbEnv = ['DB_HOST', 'DB_USER', 'DB_NAME'];
const missingDbEnv = requiredDbEnv.filter((key) => !process.env[key]);

if (missingDbEnv.length > 0) {
  logger.warn('Missing database environment variables', {
    missingVariables: missingDbEnv,
    message:
      'The server will start, but database queries may fail until these are configured.',
  });
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

logger.info('Database pool initialized', {
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
});

pool.on('connection', (connection) => {
  logger.info('Database connection established', {
    threadId: connection.threadId,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
  });

  connection.on('error', (error) => {
    logger.error('Database connection error', {
      threadId: connection.threadId,
      message: error.message,
      stack: error.stack,
    });
  });
});

pool.on('enqueue', () => {
  logger.warn('Database connection request queued');
});

module.exports = pool;
