import { GoogleGenerativeAI } from "@google/generative-ai";

export const POST = async ({ request, locals }) => {
  try {
    const { messages, context, globalMemory } = await request.json();

    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: "No messages provided." }), { status: 400 });
    }

    // 1. LOAD API KEY
    let apiKey = import.meta.env.GEMINI_API_KEY;
    if (!apiKey && locals && locals.runtime && locals.runtime.env) {
      apiKey = locals.runtime.env.GEMINI_API_KEY;
    }

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing GEMINI_API_KEY. Please set it in your environment." }), { status: 500 });
    }

    // 2. INITIALIZE GEMINI
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // System Instruction and Tools are shared
    const systemInstruction = `You are LoonieFi's Copilot, an expert Canadian personal finance and tax assistant.
      Your goal is to guide the user in optimizing their income taxes and financial setup.
      
      Current Page Context (Income Tax Calculator): ${JSON.stringify(context || {})}
      Global User Profile Memory: ${JSON.stringify(globalMemory || {})}
      
      When a user interacts:
      1. If they describe a new scenario (e.g. "I make $90k", "What if I put $5k in RRSP", "Change my province to BC"):
         Call 'update_tax_calculator' with the updated variables.
      2. If they ask a general question (e.g. "Explain marginal tax rate", "What is the RRSP deduction limit?"):
         Do NOT call 'update_tax_calculator'. Simply reply in the text response.
      3. ALWAYS explain any changes you made in the text response (e.g. "I've updated your income to $90,000 and province to BC.").
      4. Keep text answers extremely concise, structured, and friendly. Use short paragraphs or lists. Perfect for mobile reading.
      
      FINANCIAL GUARDRAILS (STRICT):
      - RRSP Limit: Max allowed RRSP contribution is 18% of gross income, capped at $32,490. If they ask for more, cap it and explain it in the text.
      - Employer Match: Cap match percentage at 10%.
      - Province: Must be a 2-letter code (ON, BC, AB, QC, NS, NB, MB, SK, PE, NL).
      
      CRITICAL RULES:
      - NEVER guess or assume a user's income or province if not specified or already in context. Ask for clarification if required.
      - Map full province names to codes (e.g., "Ontario" -> "ON", "British Columbia" -> "BC").
      - Only call 'update_tax_calculator' when there are updates to apply.`;

    const tools = [
      {
        functionDeclarations: [
          {
            name: "update_tax_calculator",
            description: "Updates the tax calculator form with values extracted from user input.",
            parameters: {
              type: "OBJECT",
              properties: {
                grossIncome: { type: "NUMBER", description: "Annual gross income in CAD" },
                province: { type: "STRING", description: "2-letter province code (e.g., ON, BC, AB, QC)" },
                rrspContribution: { type: "NUMBER", description: "Annual RRSP contribution in CAD" },
                employerMatchPercent: { type: "NUMBER", description: "Employer RRSP match percentage (0-10)" }
              },
            },
          },
        ],
      },
    ];

    // Format historical messages for Gemini SDK (role: 'user' or 'model')
    const formattedHistory = messages.slice(0, -1).map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content || '' }]
    })).filter((msg, idx, arr) => {
      const firstUserIdx = arr.findIndex(m => m.role === 'user');
      return firstUserIdx !== -1 && idx >= firstUserIdx;
    });

    const lastMessage = messages[messages.length - 1];

    // Fallback logic: 3.5 (Frontier) -> 3.1-lite (High Availability) -> 2.5 (Stable)
    const modelsToTry = ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-2.5-flash"];

    const tryRequest = async (modelIndex = 0, retryCount = 2, delay = 2000) => {
      const modelName = modelsToTry[modelIndex];
      try {
        const model = genAI.getGenerativeModel({ model: modelName, systemInstruction });
        const chat = model.startChat({
          history: formattedHistory,
          tools,
          toolConfig: { functionCallingConfig: { mode: "AUTO" } },
        });

        const result = await chat.sendMessage(lastMessage.content);
        return await result.response;
      } catch (err) {
        // If it's a 503 (Busy), 429 (Rate Limit), or 404 (wrong name)
        if ((err.status === 503 || err.status === 429) && retryCount > 0) {
          console.warn(`Gemini ${modelName} Busy/Limit (${err.status}). Retrying in ${delay}ms...`);
          await new Promise(r => setTimeout(r, delay));
          return tryRequest(modelIndex, retryCount - 1, delay * 2);
        }

        // Try the next model in the chain
        if (modelIndex < modelsToTry.length - 1) {
          console.warn(`Switching from ${modelName} due to ${err.status}. Trying ${modelsToTry[modelIndex+1]}`);
          return tryRequest(modelIndex + 1, 2, 1000);
        }

        throw err;
      }
    };

    let response;
    try {
      response = await tryRequest();
    } catch (finalErr) {
      console.error("AI Chat Final Fallback Failure:", finalErr);
      return new Response(JSON.stringify({ 
        text: "The AI is currently experiencing high traffic. Please try sending your message again in a few seconds.",
        toolData: null 
      }), { status: 200, headers: { "Content-Type": "application/json" } });
    }

    // Extract Function Calls
    const functionCalls = response.functionCalls();
    let toolData = null;
    
    if (functionCalls && functionCalls.length > 0) {
      toolData = functionCalls[0].args;
    }

    const text = response.text();

    return new Response(JSON.stringify({ 
      text: text,
      toolData: toolData 
    }), { 
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Gemini Chat API Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
