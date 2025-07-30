// api/chat.js
import { readFileSync } from 'fs';
import { join } from 'path';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';

// Read system prompt once
const SYSTEM_PROMPT = readFileSync(
  join(process.cwd(), 'api', 'system_prompt.txt'),
  'utf8'
).trim();
//-------------------------------------------
  export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: req.body.prompt }] }],
      }),
    }
  );
  const result = await response.json();
  res.status(200).json(result);
}
//---------------------------------------------------------------
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'No message provided' });
  }

  try {
    const geminiRes = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
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
          maxOutputTokens: 1000
        }
      })
    });

    const data = await geminiRes.json();

    if (!geminiRes.ok) {
      throw new Error(data.error?.message || 'AI error');
    }

    const reply = data.candidates[0]?.content?.parts?.[0]?.text || 'No reply generated.';
    res.status(200).json({ reply: reply.trim() });

  } catch (err) {
    console.error('Gemini API error:', err);
    res.status(500).json({ error: 'AI service error' });
  }
}
