import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Render krever SSL
});

// Test tilkoblingen med async/await
async function testConnection() {
  try {
    await pool.connect();
    console.log("Tilkoblet PostgreSQL");

    // Kjøre en enkel query for å teste
    const res = await pool.query("SELECT NOW()");
    console.log("Database connection successful, time:", res.rows[0]);
  } catch (err) {
    console.error("Feil ved tilkobling:", err);
  }
}

// Kall funksjonen for å teste tilkoblingen
testConnection();

export default pool;
