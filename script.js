async function askAI() {
  const prompt = document.getElementById("prompt").value;
  const result = document.getElementById("result");

  if (!prompt) {
    result.innerHTML = "ကျေးဇူးပြု၍ မေးခွန်းရိုက်ထည့်ပါ။";
    return;
  }

  result.innerHTML = "⏳ AI စဉ်းစားနေပါတယ်...";

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();
    result.innerHTML = data.reply || data.error;
  } catch (err) {
    result.innerHTML = "❌ Error: " + err.message;
  }
}
