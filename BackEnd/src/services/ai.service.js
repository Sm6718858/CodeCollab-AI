const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
const detectLanguage = require("./detectLanguage");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const systemInstruction = `
🎯 You are a Senior Code Reviewer (10+ yrs exp).

Your reviews must be:
• Short, precise, professional  
• Only real issues (syntax, runtime, logic, major bugs)  
• Clear sections  
• Light emoji use  

📌 Format:

❌ Issues:
• If none: "No issues found ✅"

✅ Recommended Fix:
\`\`\`<language>
<fixed or same code>
\`\`\`

📤 Output:
<what the code would print / return>

💡 Improvements:
• If any, keep brief (readability / best-practice / performance)
• If none: "No improvements required"
`;

const generateContent = async (code) => {
  try {
    const text = code.trim();

    // ---------- CASE 1: AI Friend Mode ----------
    if (text.startsWith("@")) {
      const userMessage = text.slice(1).trim();

      const prompt = `
You are an AI best friend — smart, funny, supportive.

User: "${userMessage}"

Respond in:
• Friendly + impressive tone  
• Short paras  
• Useful but light  
• Emojis allowed  
`;

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      });

      return result.response.text();
    }

    // ---------- CASE 2: Code Review Mode ----------
    const language = detectLanguage(text);
    const prompt = `
${systemInstruction}

🛠 Language: ${language}

\`\`\`${language}
${text}
\`\`\`
`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    return result.response.text();

  } catch (err) {
    console.error("❌ AI Error:", err.message);
    return "⚠️ Unable to generate review. Try again.";
  }
};

module.exports = generateContent;
