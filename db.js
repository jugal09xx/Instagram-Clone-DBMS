require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: process.env.PG_PASSWORD,
  database: "social_media_app",
  host: "localhost",
  port: 5432
})

module.exports = pool;