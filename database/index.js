const { Pool } = require("pg");
require("dotenv").config();

let pool;

if (process.env.NODE_ENV === "development") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Removed the SSL setting — local DB doesn't need it
  });
} else {
  // Production configuration
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Use SSL only in production (like on Render or Heroku)
    },
  });
}

// Consistent export structure for both environments
module.exports = {
  async query(text, params) {
    try {
      const res = await pool.query(text, params);
      if (process.env.NODE_ENV === "development") {
        console.log("executed query", { text });
      }
      return res;
    } catch (error) {
      console.error("error in query", { text });
      throw error;
    }
  },
  // Also export the pool directly if needed elsewhere
  pool
};