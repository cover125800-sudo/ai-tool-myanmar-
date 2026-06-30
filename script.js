async function askAI() {
  const promptInput = document.getElementById("prompt");
  const result = document.getElementById("result");

  const prompt = promptInput.value.trim();
  if (!prompt) return;

  result.innerHTML += `<div><b>🧑 သင်:</b> ${prompt}</div>`;
  promptInput.value = "";

  result.innerHTML += `
    <div id="loading" class="loading">
      <span class="spinner"></span>
      <span>🤖 AI စဉ်းစားနေပါတယ်...</span>
    </div>
  `;

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