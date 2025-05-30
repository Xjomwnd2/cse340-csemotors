const { Pool } = require("pg");
require("dotenv").config();

let pool;

if (process.env.NODE_ENV === "development") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Removed the SSL setting — local DB doesn't need it
  });

const pool = new Pool({
  user: 'cse340',
  host: 'localhost', // Or your database host
  database: 'your_database_name',
  password: 'YOUR_INCORRECT_PASSWORD', // <--- CHECK THIS!
  port: 5432, // Default PostgreSQL port
});

// ... rest of your database connection code

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

