const mysql = require("mysql2/promise");

// Create MySQL connection pool
const pool = mysql.createPool({
  connectionLimit: 100, // Adjust according to your needs
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE,
});

module.exports = pool;