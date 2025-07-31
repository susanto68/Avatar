const { readFileSync } = require('fs');
const { join } = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load once at cold start from the project root api/ folder
let SYSTEM_PROMPT;
try {
  SYSTEM_PROMPT = readFileSync(
    join(process.cwd(), 'api', 'system_prompt.txt'),
    'utf8'
  ).trim();
} catch (error) {
  console.error('Error loading system prompt:', error);
  SYSTEM_PROMPT = "You are Susanto Ganguly, known as Sir Ganguly, a supportive computer teacher.";
}

const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'No message provided' });
  }

  // Check if Gemini API key is available
  if (!process.env.GEMINI_API_KEY) {
    // Provide a mock response for testing
    const mockResponses = [
      "Hello! I'm Sir Ganguly. Welcome to my AI Avatar experiment! I'm here to help you learn computer science.",
      "Great question! I'm currently in test mode. I can help you with programming concepts, algorithms, and computer science topics.",
      "I'm here to help with computer science questions! Feel free to ask me about Java, Python, algorithms, or any programming topic.",
      "Welcome to the AI Avatar experiment! I'm Sir Ganguly, your computer science teacher. What would you like to learn today?",
      "Excellent! I'm ready to help you with computer science. Ask me about programming languages, data structures, or any tech topic!",
      "Hello there! I'm Sir Ganguly. I specialize in teaching computer science and programming. What's on your mind today?"
    ];
    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    return res.status(200).json({ reply: randomResponse });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `${SYSTEM_PROMPT}\n\nUser: ${message.trim()}\n\nSir Ganguly:`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ reply: text.trim() });
  } catch (err) {
    console.error('Gemini API error:', err);
    res.status(500).json({ error: 'AI service error' });
  }
});

module.exports = router;