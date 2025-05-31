const { Pool } = require("pg");
require("dotenv").config();

// Debug logging
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
console.log("DATABASE_URL starts with:", process.env.DATABASE_URL?.substring(0, 20));

let pool;

if (process.env.NODE_ENV === "development" || !process.env.DATABASE_URL) {
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