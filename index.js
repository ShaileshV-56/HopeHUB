// index.js
import express from 'express';
import pool from './db.js';

const app = express();
app.use(express.json());

// Simple test route
app.get('/', async (req, res) => {
  const result = await pool.query('SELECT NOW()');
  res.json({ server_time: result.rows[0].now });
});

// Example: Get all users
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
