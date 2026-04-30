import pg from 'pg';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: 'postgresql://postgres:1234@localhost:5432/marketplace_db'
});

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL error:', err);
});

export const query = (text, params = []) => pool.query(text, params);