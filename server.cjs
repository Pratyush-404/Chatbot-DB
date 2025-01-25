require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const path = require('path');
const { Pool } = require('pg');
const fs = require('fs');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the client directory
app.use(express.static(path.join(__dirname, 'client')));

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Database connection
const cert = fs.readFileSync(process.env.SSL_CERT_PATH, 'utf-8');
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: true,
    ca: cert,
  },
});

// Define a route for the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/index.html'));
});

// User registration
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = 'INSERT INTO users (username, password) VALUES ($1, $2)';
  try {
    await pool.query(query, [username, hashedPassword]);
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'Registration failed.' });
  }
});

// User login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = $1';
  try {
    const result = await pool.query(query, [username]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    req.session.userId = user.id;
    res.status(200).json({ message: 'Login successful.' });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ error: 'Login failed.' });
  }
});

// Chatbot route
app.post('/chatbot', async (req, res) => {
  const { message } = req.body;
  try {
    const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        prompt: message,
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch chatbot response');
    }

    const data = await response.json();
    const bot_response = data.choices[0].text.trim();
    res.status(200).json({ bot_response });
  } catch (err) {
    console.error('Error fetching chatbot response:', err);
    res.status(500).json({ error: 'Failed to fetch chatbot response.' });
  }
});

// Store chat transcript
app.post('/chat', async (req, res) => {
  const { message } = req.body;
  if (!req.session.userId) {
    return res.status(403).json({ error: 'User not logged in.' });
  }

  try {
    const chatbotResponse = await fetch('http://localhost:3000/chatbot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!chatbotResponse.ok) {
      throw new Error('Failed to fetch chatbot response');
    }

    const chatbotData = await chatbotResponse.json();
    const bot_response = chatbotData.bot_response;

    const query = 'INSERT INTO transcripts (user_id, message, bot_response) VALUES ($1, $2, $3)';
    await pool.query(query, [req.session.userId, message, bot_response]);
    res.status(201).json({ message: 'Chat stored successfully.', bot_response });
  } catch (err) {
    console.error('Error storing chat:', err);
    res.status(500).json({ error: 'Failed to store chat.' });
  }
});

// Retrieve user transcripts
app.get('/transcripts', async (req, res) => {
  if (!req.session.userId) {
    return res.status(403).json({ error: 'User not logged in.' });
  }
  const query = 'SELECT * FROM transcripts WHERE user_id = $1';
  try {
    const result = await pool.query(query, [req.session.userId]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching transcripts:', err);
    res.status(500).json({ error: 'Failed to fetch transcripts.' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
