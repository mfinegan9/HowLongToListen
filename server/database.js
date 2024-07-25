const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: 'postgres',
  host: 'localhost', //changed from 'db'
  database: 'spotify_project',
  password: 'Monkeybusiness',
  port: '5432',
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
