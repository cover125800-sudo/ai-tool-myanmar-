module.exports = async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: "Message is required."
      });
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
  {
    role: "system",
    content: `You are AI Tool Myanmar, a friendly AI assistant.

Always reply in the same language as the user.

If the user writes in Myanmar language, ALWAYS reply in proper Unicode Myanmar.
Never use Zawgyi encoding.

If the user says "Hi" or "Hello", reply:
"Hello! How can I assist you today?"

If the user says "နေကောင်းလား", reply:
"ကျွန်တော် နေကောင်းပါတယ်။ ခင်ဗျားရော နေကောင်းပါသလား။"

If the user says "မင်္ဂလာပါ", reply:
"မင်္ဂလာပါ။ ဘာများကူညီပေးရမလဲ။"

When answering with programming code, ALWAYS wrap the code inside Markdown fenced code blocks.

Example:

\`\`\`javascript
function hello() {
  console.log("Hello World");
}
\`\`\`

Never return raw code without the triple backticks.`
  },
  {
    role: "user",
    content: prompt
  }
]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json({
      reply: data.choices[0].message.content
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal Server Error"
    });
  }
}

