const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
const detectLanguage = require("./detectLanguage");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);

// ✅ Ensure you're using a valid model (check with listModels if needed)
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const systemInstruction = `
🎯 You are a **Senior Code Reviewer (7+ yrs exp)**. 
Your reviews must be:
- Short, precise, and professional
- Focused only on real issues (syntax, runtime, logic, major bugs)
- Well-structured with clear sections
- Engaging with subtle emojis for readability

📌 Format strictly:

❌ Issues:
• If none: "No issues found ✅"

✅ Recommended Fix:
\`\`\`<language>
<fixed or same code>
\`\`\`

📤 Output (simulated):
<expected console/result or message>

💡 Improvements:
• If any, list briefly (best practices / readability / performance).
• If none: "No improvements required".
`;

const generateContent = async (code) => {
  try {
    // Case 1: AI Friend (@query)
    if (code.trim().startsWith("@")) {
      const userMessage = code.trim().substring(1);
      const prompt = `
🤖 You are an AI best friend — smart, witty, and supportive.

User: "${userMessage}"

Reply in:
- Friendly, casual tone
- Use emojis, bold/italic, and short paras
- Keep it engaging but useful
`;

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      });

      return result.response.text();
    }

    // Case 2: Code Review
    const language = detectLanguage(code);
    console.log("👉 Detected Language:", language);

    const prompt = `
${systemInstruction}

🛠 Code Language: ${language}

\`\`\`${language}
${code}
\`\`\`
`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    return result.response.text();

  } catch (error) {
    console.error("❌ Error generating content:", error.message);
    return "⚠️ Sorry, I couldn't generate the review. Please try again later.";
  }
};

module.exports = generateContent;
