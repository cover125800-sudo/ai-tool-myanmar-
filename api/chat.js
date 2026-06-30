async function handleAIResponse(userMessage) {

    content: `
You are a helpful AI assistant inside a chat application.

Rules:
- Reply in the same language as the user.
- Keep answers clear, simple, and useful.
- If the user asks coding questions, give working examples.
- If the user is confused, explain step by step.
- Be friendly but not too long.
- Do not hallucinate or give false information.
`
            <div class="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-sm text-white">AI</div>
            <div class="bg-gray-800 p-4 rounded-2xl rounded-tl-none shadow-md border border-gray-700 flex items-center h-10 px-6">
                <div class="dot-flashing"></div>
            </div>
        </div>
    `;

    chatContainer.insertAdjacentHTML("beforeend", loadingHTML);
    scrollToBottom();

    try {

        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                prompt: userMessage
            })
        });

        const data = await response.json();

        document.getElementById("ai-loading")?.remove();

        if (!response.ok) {
            throw new Error(data.error || "API Error");
        }

        const currentTime = new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });

        const aiReplyText = data.reply;

        const aiMessageHTML = `
            <div class="flex items-start space-x-3 animate-fade-in">
                <div class="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-sm text-white">AI</div>
                <div class="flex flex-col items-start w-full max-w-xl">
                    <div class="bg-gray-800 text-gray-200 p-4 rounded-2xl rounded-tl-none shadow-md border border-gray-700 w-full">
                        <p class="text-sm leading-relaxed">${aiReplyText}</p>
                    </div>
                    <span class="text-xs text-gray-500 mt-1">${currentTime} 🕒</span>
                </div>
            </div>
        `;

        chatContainer.insertAdjacentHTML("beforeend", aiMessageHTML);
        scrollToBottom();

    } catch (error) {
        console.error(error);
        document.getElementById("ai-loading")?.remove();
    }
}