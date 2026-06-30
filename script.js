async function askAI() {
  const promptInput = document.getElementById("prompt");
  const result = document.getElementById("result");

  const prompt = promptInput.value.trim();
  if (!prompt) return;

  result.innerHTML += `<div><b>🧑 သင်:</b> ${prompt}</div>`;
  promptInput.value = "";

  const aiReply = data.reply || data.error;

result.innerHTML += `<div id="ai-message"><b>🤖 AI:</b> <span id="typing"></span></div><hr>`;

const typing = document.getElementById("typing");
let i = 0;

const timer = setInterval(() => {
  typing.textContent += aiReply.charAt(i);
  i++;

  result.scrollTop = result.scrollHeight;

  if (i >= aiReply.length) {
    clearInterval(timer);
    localStorage.setItem("chatHistory", result.innerHTML);
  }
}, 20);

  result.scrollTop = result.scrollHeight;

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();

    const loading = document.getElementById("loading");
    if (loading) loading.remove();

    result.innerHTML += `<div><b>🤖 AI:</b> ${data.reply || data.error}</div><hr>`;

    localStorage.setItem("chatHistory", result.innerHTML);

  } catch (err) {
    const loading = document.getElementById("loading");
    if (loading) loading.remove();

    result.innerHTML += `<div>❌ ${err.message}</div>`;
  }

  result.scrollTop = result.scrollHeight;
}

function clearChat() {
  const result = document.getElementById("result");
  result.innerHTML = "";
  localStorage.removeItem("chatHistory");
}

window.onload = function () {
  const history = localStorage.getItem("chatHistory");
  if (history) {
    document.getElementById("result").innerHTML = history;
  }
};

document.getElementById("prompt").addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    askAI();
  }
});