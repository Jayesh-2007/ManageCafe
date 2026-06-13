const mysql = require('mysql2/promise');

const requiredDbEnv = ['DB_HOST', 'DB_USER', 'DB_NAME'];
const missingDbEnv = requiredDbEnv.filter((key) => !process.env[key]);

if (missingDbEnv.length > 0) {
  console.warn(
    `Warning: Missing database environment variables: ${missingDbEnv.join(', ')}. ` +
      'The server will start, but database queries may fail until these are configured.'
  );
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

module.exports = pool;
