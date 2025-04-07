
import { GoogleGenAI } from "@google/genai";

class Gemini {

  constructor(prompt) {
    this.prompt = prompt;
    this.ai = new GoogleGenAI({ apiKey: "AIzaSyAS1hfnvjXRHxWGaEgNlfuMt_ahAQwB5U8" });
    this.chat = null;
  }
  
  addChat () {
    return this.chat = this.ai.chats.create({
      model: "gemini-2.0-flash",
      history: [
        {
          role: "user",
          parts: [{ text: this.prompt }],
        },
        {
          role: "model",
          parts: [{ text: "ok ' i'm ready" }],
        },
      ],
    });

  }

  async getGeminiAnswer (chat, msg) {
    let response = await chat.sendMessage({
    message: msg,
    });
    return response.text;
}

  

}


export default Gemini;
