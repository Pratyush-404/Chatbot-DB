document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const loginForm = document.getElementById('loginForm');
  const chatInterface = document.getElementById('chatInterface');
  const chatBox = document.getElementById('chatBox');
  const userMessage = document.getElementById('userMessage');
  const sendMessageButton = document.getElementById('sendMessageButton');

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        alert('User registered successfully');
      } else {
        alert('Error registering user');
      }
    } catch (error) {
      console.error('Error registering user:', error);
    }
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        alert('Login successful');
        loginForm.style.display = 'none';
        chatInterface.style.display = 'block';
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  });

  sendMessageButton.addEventListener('click', async () => {
    const message = userMessage.value;
    if (message.trim() === '') return;

    try {
      const response = await fetch('/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (response.ok) {
        const data = await response.json();
        displayMessage(`You: ${message}`);
        displayMessage(`Bot: ${data.bot_response}`);
        userMessage.value = '';
      } else {
        alert('Error sending message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  function displayMessage(text) {
    const p = document.createElement('p');
    p.textContent = text;
    chatBox.appendChild(p);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
});
