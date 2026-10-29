const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from server directory or root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const connectionUri = process.env.MYSQL_ADDON_URI || process.env.DATABASE_URL;
const dbName = process.env.MYSQL_ADDON_DB || process.env.DB_NAME || 'student_db';

const baseConfig = {
  host: process.env.MYSQL_ADDON_HOST || process.env.DB_HOST || 'localhost',
  user: process.env.MYSQL_ADDON_USER || process.env.DB_USER || 'root',
  password: process.env.MYSQL_ADDON_PASSWORD || process.env.DB_PASSWORD || '',
  port: Number(process.env.MYSQL_ADDON_PORT || process.env.DB_PORT) || 3306,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
};

const poolConfig = connectionUri
  ? {
      uri: connectionUri,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    }
  : {
      ...baseConfig,
      database: dbName,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    };

const pool = mysql.createPool(poolConfig);

// Initialize database and tables automatically if not exists
async function initializeDatabase() {
  try {
    // If using individual parameters without predefined cloud URI, ensure database exists
    if (!connectionUri) {
      try {
        const rootConn = await mysql.createConnection(baseConfig);
        await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
        await rootConn.end();
      } catch (err) {
        // Continue if user does not have CREATE DATABASE permissions (common on cloud shared DBs)
      }
    }

    const connection = await pool.getConnection();
    console.log(' Connected to MySQL database successfully.');

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        roll_number VARCHAR(50) NOT NULL UNIQUE,
        course VARCHAR(100) NOT NULL,
        department VARCHAR(100) NOT NULL,
        phone VARCHAR(20) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;

    await connection.query(createTableQuery);
    console.log(' Verified "students" table exists.');
    connection.release();
  } catch (error) {
    console.error(' MySQL Database connection / initialization warning:', error.message);
    console.error('👉 Make sure your MySQL server is running and database configuration in .env is correct.');
  }
}

module.exports = {
  pool,
  initializeDatabase,
};
