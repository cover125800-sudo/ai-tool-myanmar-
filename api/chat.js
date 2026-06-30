// api/chat.js (Backend API သီးသန့်ကုဒ်)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST method သာ လက်ခံပါသည်' });
  }

  try {
    const { userMessage } = req.body;

    if (!userMessage) {
      return res.status(400).json({ error: 'Message payload မပါရှိပါ' });
    }

    // 💡 ဒီနေရာမှာ သင့်ရဲ့ မူလ AI Prompt/Key ကို ထည့်သွင်းနိုင်ပါတယ်
    // အခု လောလောဆယ် စမ်းသပ်ဖို့ Mock Text ပြန်ပေးထားတာပါ
    const aiReplyText = `AI မှ တုံ့ပြန်ချက်: ${userMessage}`;
    const currentTime = new Date().toLocaleTimeString();

    // Frontend ဘက်က UI မှာ သုံးဖို့အတွက် data ကို JSON နဲ့ပဲ ပြန်ပို့ရပါမယ်
    return res.status(200).json({ 
      aiReplyText: aiReplyText, 
      currentTime: currentTime 
    });

  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
