const chat = document.getElementById("chat");
const prompt = document.getElementById("prompt");

async function sendMessage() {
  const message = prompt.value.trim();
  if (!message) return;

  // 1. User Message ကို visual ပေါ်ပြခြင်း
  chat.innerHTML += `
    <div class="message user">
      👤 ${message}
    </div>
  `;

  prompt.value = "";
  chat.scrollTop = chat.scrollHeight;

  // 2. Loading ပြသခြင်း
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
    // 3. Vercel API ကို လှမ်းခေါ်ခြင်း (body မှာ prompt လို့ ပို့ထားပါတယ်)
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt: message })
    });

    const data = await response.json();

    // Loading ကို ဖြုတ်ခြင်း
    document.getElementById("loading")?.remove();

    // 4. API က ပြန်ပေးတဲ့ အဖြေကို ယူပြီး visual အဖြစ် ထည့်သွင်းခြင်း
    chat.innerHTML += `
      <div class="message ai">
        🤖 ${renderMarkdown(data.reply || data.error || "အဖြေမရပါ။")}
      </div>
    `;

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

// Enter Key စနစ်
prompt.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Voice Input စနစ်
function startVoice() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("ဒီ Browser က Voice Input ကို မထောက်ပံ့ပါ။");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.start();

  recognition.onresult = (event) => {
    prompt.value = event.results[0][0].transcript;
  };

  recognition.onerror = (event) => {
    alert("Voice Error: " + event.error);
  };
}

