fetch('/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ message: transcript })
})
.then(response => response.json())
.then(data => {
  responseElement.innerText = data.reply;
})
.catch(error => {
  console.error('Fetch error:', error); // <== Add this line
  responseElement.innerText = 'Sorry, I could not reach the server.';
});
