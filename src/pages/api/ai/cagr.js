import { GoogleGenerativeAI } from "@google/generative-ai";

export const POST = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { message, context } = body;

    // 1. LOAD API KEY
    let apiKey = import.meta.env.GEMINI_API_KEY;
    if (!apiKey && locals && locals.runtime && locals.runtime.env) {
      apiKey = locals.runtime.env.GEMINI_API_KEY;
    }

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing GEMINI_API_KEY" }), { status: 500 });
    }

    // 2. INITIALIZE GEMINI
    const genAI = new GoogleGenerativeAI(apiKey);
    
    const systemInstruction = `You are LoonieFi's CAGR Hero, an investment and compound interest expert.
      Your goal is to help users calculate annual growth rates, future values, and time horizons for their investments.
      
      Current App Context: ${JSON.stringify(context || {})}
      
      When a user interacts:
      1. If they describe an investment scenario (e.g., "If I turn 10k into 50k in 10 years, what's my return?"): Call 'update_cagr_calculator' with extracted values.
      2. If they ask a general question: DO NOT call 'update_cagr_calculator'. Simply answer in the text response.
      3. ALWAYS provide a 'strategy_insight' in the tool call if calling it.
      
      FINANCIAL GUARDRAILS (STRICT):
      - Mode: 'RATE', 'FUTURE', 'START', or 'TIME'. Select based on what the user is looking for.
      - Max Years: 100.
      - Frequency: 'Daily', 'Weekly', 'Monthly', or 'Yearly'.
      - All monetary values and rates must be positive.
      
      CRITICAL RULES:
      - If user asks for a return %, switch mode to 'RATE'.
      - If user asks for a final amount, switch mode to 'FUTURE'.
      - If user asks how long it will take, switch mode to 'TIME'.
      - Strategy Insight: provide a 1-2 sentence tip about the power of compound interest, the Rule of 72, or the impact of recurring contributions.
      
      Be professional and accurate.`;

    const tools = [
      {
        functionDeclarations: [
          {
            name: "update_cagr_calculator",
            description: "Updates the CAGR calculator with investment data.",
            parameters: {
              type: "OBJECT",
              properties: {
                mode: { type: "STRING", enum: ["RATE", "FUTURE", "START", "TIME"] },
                startValue: { type: "NUMBER" },
                endValue: { type: "NUMBER" },
                years: { type: "NUMBER" },
                rate: { type: "NUMBER" },
                hasContribution: { type: "BOOLEAN" },
                contribution: { type: "NUMBER" },
                frequency: { type: "STRING", enum: ["Daily", "Weekly", "Monthly", "Yearly"] },
                useInflation: { type: "BOOLEAN" },
                inflationRate: { type: "NUMBER" },
                strategy_insight: { type: "STRING" }
              },
            },
          },
        ],
      },
    ];

    // Fallback logic chain
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
        if ((err.status === 503 || err.status === 429) && retryCount > 0) {
          await new Promise(r => setTimeout(r, delay));
          return tryRequest(modelIndex, retryCount - 1, delay * 2);
        }
        if (modelIndex < modelsToTry.length - 1) {
          return tryRequest(modelIndex + 1, 2, 2000);
        }
        throw err;
      }
    };

    let response;
    try {
      response = await tryRequest();
    } catch (finalErr) {
      console.error("AI CAGR Final Fallback Failure:", finalErr);
      return new Response(JSON.stringify({ 
        text: "The CAGR AI is currently busy. You can manually adjust the values below, or try again in a moment.",
        toolData: null 
      }), { status: 200, headers: { "Content-Type": "application/json" } });
    }
    
    const functionCalls = response.functionCalls();
    let toolData = null;
    if (functionCalls && functionCalls.length > 0) {
      toolData = functionCalls[0].args;
    }

    return new Response(JSON.stringify({ 
      text: response.text(),
      toolData: toolData 
    }), { 
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Gemini CAGR API Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
