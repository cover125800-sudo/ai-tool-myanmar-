import os
import logging
from http.server import BaseHTTPRequestHandler, HTTPServer
import threading
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
from google import genai

# ရိုးရိုး standard environment variables ကနေ Key တွေကို ဖတ်ခိုင်းခြင်း
TELEGRAM_TOKEN = os.environ.get("TELEGRAM_TOKEN")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)

# API Key ကို ဤနေရာတွင် တိုက်ရိုက် ထည့်သွင်းပေးခြင်း (စနစ်သစ်အတွက် သေချာစေရန်)
ai_client = genai.Client(api_key=GEMINI_API_KEY)

# Render Web Service ရဲ့ Port Error ကို ကျော်လွှားရန် Fake Web Server တစ်ခု ဆောက်ခြင်း
class HealthCheckHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"Bot is alive")

def run_health_server():
    port = int(os.environ.get("PORT", 10000))
    server = HTTPServer(('0.0.0.0', port), HealthCheckHandler)
    server.serve_forever()

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("မင်္ဂလာပါ။ @AIToolMyanmarBot မှ ကြိုဆိုပါတယ်။ သိလိုသမျှ မေးမြန်းနိုင်ပါပြီဗျာ။")

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_text = update.message.text
    chat_id = update.effective_chat.id
    
    # "typing" action ပြပေးခြင်း
    await context.bot.send_chat_action(chat_id=chat_id, action="typing")
    
    try:
        # စွမ်းဆောင်ရည်မြင့် မော်ဒယ်ကို အသုံးပြုခြင်း
        response = ai_client.models.generate_content(
            model='gemini-2.5-flash',
            contents=user_text,
        )
        await update.message.reply_text(response.text)
    except Exception as e:
        logging.error(f"Error: {e}")
        # Error အမှန်ကို Logs တွင် ကြည့်နိုင်ရန်နှင့် သုံးစွဲသူထံ အဆင်ပြေမည့် စာသားပြရန်
        await update.message.reply_text("ခေတ္တချို့ယွင်းနေလို့ နောက်တစ်ကြိမ် ပြန်ကြိုးစားပေးပါခင်ဗျာ။")

def main():
    # Web Server ကို နောက်ကွယ်တွင် သီးသန့် Run ထားခြင်း
    threading.Thread(target=run_health_server, daemon=True).start()

    application = Application.builder().token(TELEGRAM_TOKEN).build()
    application.add_handler(CommandHandler("start", start))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))
    print("Bot စတင်အလုပ်လုပ်နေပါပြီ...")
    application.run_polling()

if __name__ == '__main__':
    main()
