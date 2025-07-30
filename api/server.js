import express from 'express';
import cors from 'cors';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';

// Load system prompt
const SYSTEM_PROMPT = readFileSync(
  join(__dirname, 'system_prompt.txt'),
  'utf8'
).trim();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the parent directory (where index.html is)
app.use(express.static(join(__dirname, '..')));

// Chat API endpoint
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'No message provided' });
  }

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${SYSTEM_PROMPT}\n\nUser: ${message.trim()}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        }
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'AI service error');
    }

    const reply = data.candidates[0].content.parts[0].text;
    res.status(200).json({ reply: reply.trim() });
    
  } catch (err) {
    console.error('Chat API error:', err);
    res.status(500).json({ error: 'AI service error: ' + err.message });
  }
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '..', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📁 Serving files from: ${join(__dirname, '..')}`);
  console.log(`🤖 AI Avatar ready!`);
});
