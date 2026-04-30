import { app } from './app.js';
import { env } from './config/env.js';
import { pool } from './db/pool.js';

const start = async () => {
  try {
    await pool.query('SELECT 1');
    app.listen(env.port, () => {
      console.log(`Server started on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.log("Bazinga")
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
