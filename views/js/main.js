document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menu-btn");
  const navLinks = document.getElementById("nav-links");
  const menuBtnIcon = menuBtn?.querySelector("i");
  const chatToggle = document.getElementById('chatbot-icon');
  const chatWindow = document.getElementById('chatbot-sidebar');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');
  const chatLoading = document.getElementById('chat-loading');

  if (menuBtn && navLinks && menuBtnIcon) {
    menuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("open");
      const isOpen = navLinks.classList.contains("open");
      menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
    });

    navLinks.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuBtnIcon.setAttribute("class", "ri-menu-line");
    });
  }

  if (chatToggle && chatWindow) {
    chatToggle.addEventListener('click', () => {
      chatWindow.classList.toggle('show');
    });
  }

  if (chatInput && chatMessages && chatLoading) {
    chatInput.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter') {
        const userMessage = chatInput.value.trim();
        if (!userMessage) return;

        addMessage('user', userMessage);
        chatInput.value = '';
        chatLoading.style.display = 'block';

        const response = await fetch('/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userMessage })
        });

        const data = await response.json();
        chatLoading.style.display = 'none';
        addMessage('bot', data.reply);
      }
    });
  }

  function addMessage(sender, text) {
    const msg = document.createElement('div');
    msg.classList.add('message', sender);

    const avatar = document.createElement('img');
    avatar.classList.add('avatar');
    avatar.src = sender === 'bot' 
      ? 'https://cdn-icons-png.flaticon.com/512/4712/4712100.png'
      : 'https://cdn-icons-png.flaticon.com/512/847/847969.png';

    const bubble = document.createElement('div');
    bubble.classList.add('text');
    bubble.textContent = text;

    if (sender === 'bot') msg.appendChild(avatar);
    msg.appendChild(bubble);
    if (sender === 'user') msg.appendChild(avatar);

    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Scroll reveal
  const scrollRevealOption = {
    origin: "bottom",
    distance: "50px",
    duration: 1000,
  };

  ScrollReveal().reveal(".header__image img", {
    ...scrollRevealOption,
    origin: "right",
  });
  ScrollReveal().reveal(".header__content p", {
    ...scrollRevealOption,
    delay: 500,
  });
  ScrollReveal().reveal(".header__content h1", {
    ...scrollRevealOption,
    delay: 1000,
  });
  ScrollReveal().reveal(".header__btns", {
    ...scrollRevealOption,
    delay: 1500,
  });

  ScrollReveal().reveal(".destination__card", {
    ...scrollRevealOption,
    interval: 500,
  });

  ScrollReveal().reveal(".showcase__image img", {
    ...scrollRevealOption,
    origin: "left",
  });
  ScrollReveal().reveal(".showcase__content h4", {
    ...scrollRevealOption,
    delay: 500,
  });
  ScrollReveal().reveal(".showcase__content p", {
    ...scrollRevealOption,
    delay: 1000,
  });
  ScrollReveal().reveal(".showcase__btn", {
    ...scrollRevealOption,
    delay: 1500,
  });

  ScrollReveal().reveal(".banner__card", {
    ...scrollRevealOption,
    interval: 500,
  });

  ScrollReveal().reveal(".discover__card", {
    ...scrollRevealOption,
    interval: 500,
  });

  const swiper = new Swiper(".swiper", {
    slidesPerView: 3,
    spaceBetween: 20,
    loop: true,
  });

  window.BookTrip = function () {
    window.location.href = "destinations.html";
  };
});