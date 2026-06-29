async function askAI() {
  const prompt = document.getElementById("prompt").value;
  const result = document.getElementById("result");

  if (!prompt) {
    result.innerHTML = "ကျေးဇူးပြု၍ မေးခွန်းရိုက်ထည့်ပါ။";
    return;
  }

  result.innerHTML = "⏳ AI စဉ်းစားနေပါတယ်...";

  // Groq API ကို နောက်တစ်ဆင့်မှာ ချိတ်မယ်
  result.innerHTML = "သင်ရေးထားသည်: " + prompt;
}
