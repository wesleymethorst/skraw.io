const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db');

const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  try {
    await pool.query(
      'INSERT INTO users (name, email, password, salt) VALUES (?, ?, ?, ?)',
      [name, email, hash, salt]
    );
    res.status(201).send('User registered');
  } catch (err) {
    console.error(err);
    res.status(500).send('Registration failed');
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE name = ?', [name]);
    if (rows.length === 0) return res.status(401).send('Name not found');

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(401).send('Wrong password');

    res.send({ message: 'Login success', userId: user.id });
  } catch (err) {
    console.error(err);
    res.status(500).send('Login failed');
  }
});

module.exports = router;
