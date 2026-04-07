const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Diperlukan untuk Neon
  }
});

pool.on('error', (err) => {
  console.error('Pool error:', err);
});

module.exports = pool;