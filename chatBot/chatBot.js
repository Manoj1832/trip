document.addEventListener("DOMContentLoaded", () => {
  const chatPopup = document.getElementById('chatPopup');
  const chatBox = document.getElementById('chatBox');
  const userInput = document.getElementById('userInput');
  const sendBtn = document.getElementById('sendBtn');
  const toggleBtn = document.getElementById('chat-toggle-btn');
  const themeToggle = document.getElementById('theme-toggle');

  let inactivityTimeout;  // <-- Move here, before the function

  function resetInactivityTimer() {
    clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(() => {
      chatPopup.classList.remove('show');
    }, 120000);
  }

  toggleBtn.addEventListener('click', () => {
    chatPopup.classList.toggle('show');
    resetInactivityTimer();
  });

// Send button functionality
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

// Theme toggle
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  themeToggle.innerHTML = document.body.classList.contains('dark')
    ? '<i class="fas fa-sun"></i>'
    : '<i class="fas fa-moon"></i>';
});

// Welcome message on load
window.addEventListener('DOMContentLoaded', () => {
  const welcomeMsg = document.createElement('div');
  welcomeMsg.className = 'message bot';
  welcomeMsg.innerText = "Hi there! I'm TripTrekker bot 🤖. How can I help you today?";
  chatBox.appendChild(welcomeMsg);
  resetInactivityTimer();
});

// Send message function
async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  const userMessage = document.createElement('div');
  userMessage.className = 'message user';
  userMessage.innerText = message;
  chatBox.appendChild(userMessage);
  userInput.value = '';
  chatBox.scrollTop = chatBox.scrollHeight;
  resetInactivityTimer();

  try {
    const response = await fetch('http://localhost:5000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    const botMessage = document.createElement('div');
    botMessage.className = 'message bot';
    botMessage.innerText = data.response;
    chatBox.appendChild(botMessage);
  } catch (error) {
    const errorMsg = document.createElement('div');
    errorMsg.className = 'message bot';
    errorMsg.innerText = "Sorry, I couldn't get a response. Try again.";
    chatBox.appendChild(errorMsg);
  }

  chatBox.scrollTop = chatBox.scrollHeight;
}

function resetInactivityTimer() {
    clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(() => {
      chatPopup.classList.remove('show');
    }, 120000);
  }

  // initialize bot welcome message
  const welcomeMsg = document.createElement('div');
  welcomeMsg.className = 'message bot';
  welcomeMsg.innerText = "Hi there! I'm TripTrekker bot 🤖. How can I help you today?";
  chatBox.appendChild(welcomeMsg);
  resetInactivityTimer();
});