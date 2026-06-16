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
    
    const systemInstruction = `You are LoonieFi's Retirement Hero, a leading expert on the Canada Pension Plan (CPP), Old Age Security (OAS), and GIS.
      Your goal is to help users model their retirement income by extracting their birth date, retirement age, and earnings history.
      
      Current App Context: ${JSON.stringify(context || {})}
      
      When a user interacts:
      1. If they describe a scenario: Call 'update_retirement_calculator' with extracted values.
      2. If they ask a general question: DO NOT call the tool. Answer in text.
      3. ALWAYS provide a 'strategy_insight' in the tool call.
      
      FINANCIAL GUARDRAILS (STRICT):
      - Retirement Age: Must be between 60 and 70.
      - Years in Canada: Max 40. OAS requires 10 years min to qualify.
      - Earnings years: CPP calculations are based on years from age 18 to 65+.
      
      CRITICAL REASONING FOR EARNINGS:
      - "I want to stop working at [AGE]": Find the year user turns [AGE] (birthYear + AGE) and set all subsequent years until age 65 to 0 in the 'earningsUpdate' object.
      - "I didn't work from [AGE1] to [AGE2]": Set all years in that range to 0.
      - "I make [AMOUNT]": Set 'avgSalaryInput' to [AMOUNT].
      
      Strategy Insight: Provide 1-2 sentences on how their choices (like stopping work early or deferring to 70) impact their monthly 'Grand Total'.
      
      Be professional, analytical, and highly accurate.`;

    const tools = [
      {
        functionDeclarations: [
          {
            name: "update_retirement_calculator",
            description: "Updates retirement profile and earnings history.",
            parameters: {
              type: "OBJECT",
              properties: {
                dob: { type: "STRING", description: "ISO Date (YYYY-MM-DD)" },
                retirementAge: { type: "NUMBER" },
                yearsInCanada: { type: "NUMBER" },
                isMarried: { type: "BOOLEAN" },
                avgSalaryInput: { type: "NUMBER" },
                spouseIncome: { type: "NUMBER" },
                childCount: { type: "NUMBER" },
                earningsUpdate: { 
                  type: "OBJECT", 
                  description: "A map of YYYY strings to numeric earnings values for specific years." 
                },
                strategy_insight: { type: "STRING" }
              },
            },
          },
        ],
      },
    ];

    const modelsToTry = ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-2.5-flash"];

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
      console.error("AI Retirement Final Fallback Failure:", finalErr);
      return new Response(JSON.stringify({ 
        text: "The Retirement AI is currently busy. You can manually adjust your profile and earnings below, or try again in a moment.",
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
    console.error("Gemini Retirement API Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
