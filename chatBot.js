document.getElementById('sendBtn').addEventListener('click', async () => {
  const userInput = document.getElementById('userInput').value;
  if (!userInput) return;

  // Display user's message
  const chatBox = document.getElementById('chatBox');
  const userMessage = document.createElement('div');
  userMessage.className = 'message user';
  userMessage.innerText = userInput;
  chatBox.appendChild(userMessage);

  // Clear input
  document.getElementById('userInput').value = '';

  // Send to backend
  try {
    const res = await fetch('http://localhost:5000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userInput })
    });

    const data = await res.json();
    const botMessage = document.createElement('div');
    botMessage.className = 'message bot';
    botMessage.innerText = data.response;
    chatBox.appendChild(botMessage);
  } catch (error) {
    const errorMsg = document.createElement('div');
    errorMsg.className = 'message bot';
    errorMsg.innerText = "Error getting response.";
    chatBox.appendChild(errorMsg);
  }

  chatBox.scrollTop = chatBox.scrollHeight;
});

function toggleChat() {
  const chatPopup = document.getElementById('chatPopup');
  chatPopup.style.display = chatPopup.style.display === 'none' ? 'flex' : 'none';
}
