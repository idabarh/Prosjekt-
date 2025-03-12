import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Render krever SSL
});

pool.connect()
  .then(() => console.log(" Tilkoblet PostgreSQL"))
  .catch(err => console.error(" Feil ved tilkobling:", err));

  pool.query("SELECT NOW()", (err, res) => {
    if (err) {
      console.error("Database connection test failed:", err);
    } else {
      console.log("Database connection successful, time:", res.rows[0]);
    }
  });
  

export default pool;
