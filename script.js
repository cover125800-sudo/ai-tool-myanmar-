const chat = document.getElementById("chat");
const prompt = document.getElementById("prompt");

async function sendMessage() {
  const message = prompt.value.trim();
  if (!message) return;

  // User Message
  chat.innerHTML += `
    <div class="message user">
      👤 ${message}
    </div>
  `;

  prompt.value = "";
  chat.scrollTop = chat.scrollHeight;

  // Loading
  chat.innerHTML += `
    <div class="message ai" id="loading">
      <div class="loading">
        <span class="spinner"></span>
        <span>🤖 AI စဉ်းစားနေပါတယ်...</span>
      </div>
    </div>
  `;

  chat.scrollTop = chat.scrollHeight;

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt: message })
    });

    const data = await response.json();

    document.getElementById("loading").remove();

    chat.innerHTML += `
      <div class="message ai">
        🤖 ${data.reply || data.error || "အဖြေမရပါ။"}
      </div>
    `;

    localStorage.setItem("chatHistory", chat.innerHTML);
    chat.scrollTop = chat.scrollHeight;

  } catch (err) {
    document.getElementById("loading").remove();

    chat.innerHTML += `
      <div class="message ai">
        ❌ ${err.message}
      </div>
    `;
  }
}

// Chat History
window.onload = () => {
  const history = localStorage.getItem("chatHistory");
  if (history) {
    chat.innerHTML = history;
  }
};

// Enter Key
prompt.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});