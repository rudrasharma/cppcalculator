import { GoogleGenerativeAI } from "@google/generative-ai";

export const POST = async ({ request, locals }) => {
  try {
    const { message, context } = await request.json();

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
    const systemInstruction = `You are LoonieFi's Tax Hero, an expert Canadian financial analyst.
      Your goal is to help users understand their 2026 income tax and take-home pay.
      
      Current App Context: ${JSON.stringify(context || {})}
      
      When a user interacts:
      1. If they describe a scenario: Call 'update_tax_calculator' with extracted values.
      2. If they ask a general question: DO NOT call 'update_tax_calculator'. Simply answer in the text response.
      3. ALWAYS provide a 'strategy_insight' in the tool call if calling it.
      
      FINANCIAL GUARDRAILS (STRICT):
      - RRSP Limit: Maximum allowed RRSP contribution is 18% of gross income, capped at $32,490. If a user asks for more, cap it at this limit and mention it in the insight.
      - Employer Match: Cap match percentage at 10%.
      - Province: Must be 2-letter code (ON, BC, AB, QC, NS, NB, MB, SK, PE, NL).
      
      CRITICAL RULES:
      - NEVER guess or assume a user's income or province for general questions.
      - Map full province names to codes (e.g., "Ontario" -> "ON").
      - Strategy Insight: Provide a 1-2 sentence high-value financial observation.
      
      Be concise, helpful, and professional.`;

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
                employerMatchPercent: { type: "NUMBER", description: "Employer RRSP match percentage (0-10)" },
                strategy_insight: { type: "STRING", description: "A 1-2 sentence financial insight for the user based on their data." }
              },
            },
          },
        ],
      },
    ];

    // Fallback logic: 3.5 (Agentic) -> 1.5-8b (Fast/Lite) -> 1.5 (Stable)
    const modelsToTry = ["gemini-3.5-flash", "gemini-1.5-flash-8b-latest", "gemini-1.5-flash-latest"];

    const tryRequest = async (modelIndex = 0, retryCount = 2, delay = 2000) => {
      const modelName = modelsToTry[modelIndex];
      try {
        const model = genAI.getGenerativeModel({ model: modelName, systemInstruction });
        const chat = model.startChat({
          tools,
          toolConfig: { functionCallingConfig: { mode: "AUTO" } },
        });

        const result = await chat.sendMessage(message);
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
      console.error("AI Tax Final Fallback Failure:", finalErr);
      // RECOVERY: If all models fail, return a helpful text-only guidance so the UI doesn't break
      return new Response(JSON.stringify({ 
        text: "The AI is currently receiving high traffic. You can manually adjust the sliders below to see your results immediately, or try again in a few seconds.",
        toolData: null 
      }), { status: 200, headers: { "Content-Type": "application/json" } });
    }

    
    // Extract Function Calls
    const functionCalls = response.functionCalls();
    let toolData = null;
    
    if (functionCalls && functionCalls.length > 0) {
      toolData = functionCalls[0].args;
    }

    // Fallback: If no function call was made but there's text, we still return the text
    const text = response.text();

    return new Response(JSON.stringify({ 
      text: text,
      toolData: toolData 
    }), { 
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
