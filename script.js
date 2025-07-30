fetch('/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ message: 'Who is Krishna?' })
})
  .then(res => res.json())
  .then(data => {
    console.log('AI says:', data.reply);
    // You can display this in your avatar or speech
  })
  .catch(err => console.error('Fetch error:', err));
