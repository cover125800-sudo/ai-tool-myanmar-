export default async function handler(req, res) {
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
              {
  role: "system",
  content: `You are a helpful AI assistant.

Reply in the same language as the user.

When answering with programming code, ALWAYS wrap the code inside Markdown fenced code blocks.

Example:

\`\`\`javascript
function hello() {
  console.log("Hello World");
}
\`\`\`

Never return raw code without the triple backticks.`
}
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

const systemMessage = {
  role: "system",
  content: `
You are an expert marketing copywriter AI.

Your job is to generate high-converting advertisement copy.

Always respond in this structure:

1. Hook (attention grabbing line)
2. Main Ad Copy (2-4 sentences)
3. Call To Action (CTA)
4. 3 Variations (short ad versions)

Rules:
- Be persuasive and sales focused
- Keep language simple and clear
- Match the platform style (Facebook, TikTok, Instagram)
- Do NOT add explanations outside the format
`
};