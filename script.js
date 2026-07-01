const chat = document.getElementById("chat");
const prompt = document.getElementById("prompt");

// Markdown Render
function renderMarkdown(text) {
  marked.setOptions({
    breaks: true,
    gfm: true
  });

  const html = marked.parse(text);

  setTimeout(() => {
    document.querySelectorAll("pre code").forEach((block) => {
      hljs.highlightElement(block);
    });

    document.querySelectorAll("pre").forEach((pre) => {
      if (pre.querySelector(".copy-btn")) return;

      const btn = document.createElement("button");
      btn.className = "copy-btn";
      btn.innerText = "📋 Copy";

      btn.onclick = async () => {
        const code = pre.querySelector("code");
        if (!code) return;

        await navigator.clipboard.writeText(code.innerText);
        btn.innerText = "✅ Copied";

        setTimeout(() => {
          btn.innerText = "📋 Copy";
        }, 2000);
      };

      pre.style.position = "relative";
      pre.appendChild(btn);
    });
  }, 0);

  return html;
}

// Send Message
async function sendMessage() {
  const message = prompt.value.trim();

  if (!message) return;

  chat.innerHTML += `
    <div class="message user">
      👤 ${message}
    </div>
  `;

  prompt.value = "";
  chat.scrollTop = chat.scrollHeight;

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
      body: JSON.stringify({
        prompt: message
      })
    });

    const data = await response.json();

    document.getElementById("loading")?.remove();

    const aiBox = document.createElement("div");
    aiBox.className = "message ai";
    aiBox.innerHTML =
      "🤖 " + renderMarkdown(data.reply || data.error || "အဖြေမရပါ။");

    chat.appendChild(aiBox);

    localStorage.setItem("chatHistory", chat.innerHTML);

    chat.scrollTop = chat.scrollHeight;

  } catch (err) {

    document.getElementById("loading")?.remove();

    chat.innerHTML += `
      <div class="message ai">
        ❌ ${err.message}
      </div>
    `;

    chat.scrollTop = chat.scrollHeight;
  }
}

// Chat History
window.onload = () => {
  const history = localStorage.getItem("chatHistory");

  if (history) {
    chat.innerHTML = history;

    document.querySelectorAll("pre code").forEach((block) => {
      hljs.highlightElement(block);
    });
  }
};

// Enter Key
prompt.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Voice Input
function startVoice() {

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("ဒီ Browser က Voice Input ကို မထောက်ပံ့ပါ။");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = "en-US";
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    prompt.value = event.results[0][0].transcript;
  };

  recognition.onerror = (event) => {
    alert("Voice Error: " + event.error);
  };

  recognition.start();
}