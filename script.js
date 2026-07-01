const chat = document.getElementById("chat");
function renderMarkdown(text) {
  marked.setOptions({
    breaks: true,
    gfm: true
  });

  const html = marked.parse(text);

  setTimeout(() => {
    document.querySelectorAll("pre code").forEach((block) => {
      document.querySelectorAll("pre").forEach((pre) => {
  if (!pre.querySelector(".copy-btn")) {
    const btn = document.createElement("button");
    btn.className = "copy-btn";
    btn.innerText = "📋 Copy";

    btn.onclick = () => {
      navigator.clipboard.writeText(pre.querySelector("code").innerText);
      btn.innerText = "✅ Copied";
      setTimeout(() => {
        btn.innerText = "📋 Copy";
      }, 2000);
    };

    pre.style.position = "relative";
    pre.appendChild(btn);
  }
});

document.querySelectorAll("pre code").forEach((block) => {
  hljs.highlightElement(block);
});
    });
  }, 0);

  return html;
}
const prompt = document.getElementById("prompt");

async function typeWriter(element, text, speed = 15) {
  element.innerHTML = "";

  for (let i = 0; i < text.length; i++) {
    element.innerHTML += text.charAt(i);
    chat.scrollTop = chat.scrollHeight;
    await new Promise(resolve => setTimeout(resolve, speed));
  }
}

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
     const aiBox = document.createElement("div");
aiBox.className = "message ai";
aiBox.innerHTML = "🤖 " + renderMarkdown(data.reply || data.error || "အဖြေမရပါ။");
chat.appendChild(aiBox);

    localStorage.setItem("chatHistory", chat.innerHTML);
    chat.scrollTop = chat.scrollHeight;

  } catch (err) {
    document.getElementById("loading")?.remove();
    const aiBox = document.createElement("div");
aiBox.className = "message ai";
chat.appendChild(aiBox);

await typeWriter(
  aiBox,
  data.reply || data.error || "အဖြေမရပါ။"
);
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

