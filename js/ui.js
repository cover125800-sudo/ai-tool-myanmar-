// UI Functions

function scrollToBottom() {
  const chat = document.getElementById("chat");
  chat.scrollTop = chat.scrollHeight;
}

function showLoading() {
  const chat = document.getElementById("chat");

  chat.innerHTML += `
    <div class="message ai" id="loading">
      <div class="loading">
        <span class="spinner"></span>
        <span>🤖 AI စဉ်းစားနေပါတယ်...</span>
      </div>
    </div>
  `;

  scrollToBottom();
}

function hideLoading() {
  const loading = document.getElementById("loading");
  if (loading) {
    loading.remove();
  }
}

function addUserMessage(message) {
  const chat = document.getElementById("chat");

  chat.innerHTML += `
    <div class="message user">
      👤 ${message}
    </div>
  `;

  scrollToBottom();
}

function addAIMessage(message) {
  const chat = document.getElementById("chat");

  chat.innerHTML += `
    <div class="message ai">
      🤖 ${message}
    </div>
  `;

  scrollToBottom();
}