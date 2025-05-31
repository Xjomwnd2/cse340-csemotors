const { Pool } = require("pg");
require("dotenv").config();


let pool;

if (process.env.NODE_ENV === "development") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Removed the SSL setting — local DB doesn't need it
  });

const pool = new Pool({
    user: process.env.DB_USER || 'cse340',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'cse340m_obu5',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
  });

  // For debugging queries during development
  module.exports = {
    async query(text, params) {
      try {
        const res = await pool.query(text, params);
        console.log("executed query", { text });
        return res;
      } catch (error) {
        console.error("error in query", { text });
        throw error;
      }
    },
  };
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // ✅ Use SSL only in production (like on Render or Heroku)
    },
  });

  module.exports = pool;
}

