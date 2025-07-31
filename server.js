const express = require('express');
const path = require('path');
require('dotenv').config({ path: './api/.env' });
const chatRouter = require('./api/chat');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files (like index.html, script.js, style.css)
app.use(express.static(path.join(__dirname)));

// Use chat API route
app.use('/api/chat', chatRouter);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📁 Serving files from: ${__dirname}`);
  console.log(`🤖 AI Avatar ready!`);
});
