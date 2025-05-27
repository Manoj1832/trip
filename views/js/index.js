// ========== Modal Utility Functions ==========
function showLogin() {
  const loginModal = document.getElementById("loginModal");
  if (loginModal) loginModal.style.display = "block";
}

function closeLoginModal() {
  const loginModal = document.getElementById("loginModal");
  if (loginModal) loginModal.style.display = "none";
}

function showSignup() {
  closeLoginModal();
  const signupModal = document.getElementById("signupModal");
  if (signupModal) signupModal.style.display = "block";
}

function closeSignupModal() {
  const signupModal = document.getElementById("signupModal");
  if (signupModal) signupModal.style.display = "none";
}

// ========== Main ==========

document.addEventListener("DOMContentLoaded", () => {
  // ========== Theme Toggle ==========
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      const icon = themeToggle.querySelector("i");
      icon.classList.toggle("fa-sun");
      icon.classList.toggle("fa-moon");
    });
  }

  // ========== Swiper ==========
  if (typeof Swiper !== "undefined") {
    new Swiper(".mySwiper", {
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
    });
  }

  // ========== ScrollReveal ==========
  if (typeof ScrollReveal !== "undefined") {
    ScrollReveal().reveal(".section h2, .hero h1, .hero p, .hero a", {
      delay: 100,
      distance: "30px",
      duration: 800,
      easing: "ease-in-out",
      origin: "bottom",
      reset: false,
    });
  }

  // ========== User Session ==========
  let userSession = JSON.parse(localStorage.getItem("tripUser")) || null;

  // ========== Signup Form ==========
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("signupName").value;
      const email = document.getElementById("signupEmail").value;
      const password = document.getElementById("signupPassword").value;

      try {
        const res = await fetch("http://localhost:5000/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();
        if (res.ok) {
          alert("Signup successful! Please login.");
          closeSignupModal();
          showLogin();
        } else {
          alert(data.message);
        }
      } catch (err) {
        console.error("Signup Error:", err);
        alert("Signup failed. Please try again.");
      }
    });
  }

  // ========== Login Form ==========
  const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    localStorage.setItem('email',email);
    const password = document.getElementById("loginPassword").value;

    // Define your admin credentials here
    const adminEmail = "admin@gmail.com";     // Replace with actual admin email
    const adminPassword = "admin123";           // Replace with actual admin password

    // Check admin credentials first
    if (email === adminEmail && password === adminPassword) {
      alert("Admin login successful!");
      // You can also store admin info in localStorage if needed
      localStorage.setItem("tripUser", JSON.stringify({ name: "Admin", email, isAdmin: true }));
      window.location.href = "admin.html";
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Login successful!");
        userSession = data.user;
        localStorage.setItem("tripUser", JSON.stringify(data.user));
        closeLoginModal();
        window.location.reload(); // Optional: reload to refresh state
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Login Error:", err);
      alert("Login failed. Please try again.");
    }
  });
}


  // ========== Page Guard ==========
  const protectedLinks = document.querySelectorAll("a[href*='flight'], a[href*='train'], a[href*='bus'], a[href*='packages']");
  protectedLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      if (!userSession) {
        e.preventDefault();
        showLogin();
      }
    });
  });

  // ========== Display user info ==========
  if (userSession) {
    console.log(`Logged in as ${userSession.name}`);
    const userDisplay = document.getElementById("userNameDisplay");
    if (userDisplay) {
      userDisplay.innerText = `Welcome, ${userSession.name}`;
    }
  }

  // ========== Chatbot ==========
  const chatPopup = document.getElementById('chatPopup');
  const chatBox = document.getElementById('chatBox');
  const userInput = document.getElementById('userInput');
  const sendBtn = document.getElementById('sendBtn');
  const toggleBtn = document.getElementById('chat-toggle-btn');

  let inactivityTimeout;

  function resetInactivityTimer() {
    clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(() => {
      if (chatPopup) chatPopup.classList.remove('show');
    }, 120000); // 2 minutes
  }

  if (toggleBtn && chatPopup) {
    toggleBtn.addEventListener('click', () => {
      chatPopup.classList.toggle('show');
      resetInactivityTimer();
    });
  }

  if (sendBtn && userInput) {
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  }

  if (chatBox) {
    const welcomeMsg = document.createElement('div');
    welcomeMsg.className = 'message bot';
    welcomeMsg.innerText = "Hi there! I'm TripTrekker bot 🤖. How can I help you today?";
    chatBox.appendChild(welcomeMsg);
    resetInactivityTimer();
  }

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

  // ========== Logout ==========
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('tripUser');
      alert('You have been logged out.');
      window.location.href = 'index.html';
    });
  }
});
