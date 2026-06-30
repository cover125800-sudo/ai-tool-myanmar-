async function askAI() {
  const prompt = document.getElementById("prompt").value;
  const result = document.getElementById("result");

  if (!prompt) return;

  result.innerHTML += `<div><b>🧑 သင်:</b> ${prompt}</div>`;
  document.getElementById("prompt").value = "";

  result.innerHTML += `<div id="loading">🤖 AI စဉ်းစားနေပါတယ်...</div>`;

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();

    document.getElementById("loading").remove();

    result.innerHTML += `<div><b>🤖 AI:</b> ${data.reply || data.error}</div><hr>`;
  } catch (err) {
    document.getElementById("loading").remove();
    result.innerHTML += `<div>❌ ${err.message}</div>`;
  }

  result.scrollTop = result.scrollHeight;
}

function clearChat() {
  document.getElementById("chat").innerHTML = "";
  localStorage.removeItem("chatHistory");
}