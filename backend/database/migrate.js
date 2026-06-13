const fs = require('fs/promises');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const databaseName = process.env.DB_NAME;

async function readSqlFile(fileName) {
  return fs.readFile(path.join(__dirname, fileName), 'utf8');
}

async function runMigration() {
  if (!databaseName) {
    throw new Error('DB_NAME is required to run migrations.');
  }

  const connectionConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    port: Number(process.env.DB_PORT) || 3306,
    multipleStatements: true,
  };

  let connection;

  try {
    console.log('Connecting to MySQL...');
    connection = await mysql.createConnection(connectionConfig);

    console.log(`Creating database if needed: ${databaseName}`);
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${databaseName}\` ` +
        'CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci'
    );

    await connection.changeUser({ database: databaseName });

    console.log('Running schema.sql...');
    const schemaSql = await readSqlFile('schema.sql');
    await connection.query(schemaSql);

    console.log('Running seed.sql...');
    const seedSql = await readSqlFile('seed.sql');
    await connection.query(seedSql);

    console.log('Database migration completed successfully.');
  } catch (error) {
    console.error('Database migration failed.');
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    if (connection) {
      await connection.end();
      console.log('MySQL connection closed.');
    }
  }
}

runMigration();
