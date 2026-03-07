import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash", // ✅ stable model
});

/**
 * Supported message formats:
 * { role: "user", content: "Hello" }
 * { role: "user", text: "Hello" }
 */
export async function generateAIResponse(messages = []) {
  try {
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error("No chat messages provided to Gemini");
    }

    // ✅ Normalize messages (IMPORTANT FIX)
    const geminiMessages = messages
      .map((msg) => {
        const text = msg?.content || msg?.text; // ✅ SUPPORT BOTH
        if (!text) return null;

        return {
          role: msg.role === "assistant" || msg.role === "ai"
            ? "model"
            : "user",
          parts: [{ text }],
        };
      })
      .filter(Boolean); // remove nulls

    if (geminiMessages.length === 0) {
      throw new Error("No valid messages after conversion");
    }

    // Last message → prompt
    const lastMessage = geminiMessages[geminiMessages.length - 1];
    const history = geminiMessages.slice(0, -1);

    const chat = model.startChat({ history });

    const result = await chat.sendMessage(lastMessage.parts[0].text);

    return result.response.text();
  } catch (error) {
    console.error("Gemini AI Error:", error.message);
    throw error;
  }
}
