const { Pool } = require('pg');
const { databaseUrl } = require('../config/env');

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: false,
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL');
});

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL client error', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
