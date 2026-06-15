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
    
    const systemInstruction = `You are LoonieFi's RESP Hero, an expert on Canadian Registered Education Savings Plans and government grants.
      Your goal is to help users estimate their education savings growth based on their contributions, children's ages, and available grants (CESG, CLB, BCTESG, QESI).
      
      Current App Context: ${JSON.stringify(context || {})}
      
      When a user interacts:
      1. If they describe a savings scenario (e.g., "I have a 2 year old and want to save $200 a month"): Call 'update_resp_calculator' with extracted values.
      2. If they ask a general question: DO NOT call 'update_resp_calculator'. Simply answer in the text response.
      3. ALWAYS provide a 'strategy_insight' in the tool call if calling it.
      
      FINANCIAL GUARDRAILS (STRICT):
      - Max Beneficiaries: Limit extraction to a maximum of 4 children.
      - Child Age: RESP contributions and grants typically apply until age 17.
      - Contribution Limit: $50,000 lifetime per child.
      - CESG Grant: 20% match up to $500/year (or $1,000 with catch-up room).
      - Province: use 2-letter codes (ON, BC, AB, QC, NS, NB, MB, SK, PE, NL).
      
      CRITICAL RULES:
      - 'beneficiaries' array must contain objects with 'age' (number) and 'name' (string).
      - If they mention "low income" or "CLB", set 'clbEligible' to true.
      - Strategy Insight: provide a 1-2 sentence tip about the CESG grant match, the Canada Learning Bond, or provincial-specific grants like BCTESG or QESI.
      
      Be professional and accurate.`;

    const tools = [
      {
        functionDeclarations: [
          {
            name: "update_resp_calculator",
            description: "Updates the RESP calculator with user data.",
            parameters: {
              type: "OBJECT",
              properties: {
                currentBalance: { type: "NUMBER" },
                annualReturn: { type: "NUMBER" },
                province: { type: "STRING" },
                clbEligible: { type: "BOOLEAN" },
                contributionAmount: { type: "NUMBER" },
                contributionFrequency: { type: "STRING", enum: ["Weekly", "Monthly", "Yearly"] },
                beneficiaries: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      age: { type: "NUMBER" },
                      name: { type: "STRING" }
                    }
                  }
                },
                strategy_insight: { type: "STRING" }
              },
            },
          },
        ],
      },
    ];

    // Fallback logic chain: 3.5 (Frontier) -> 3.1-lite (High Availability) -> 2.5 (Stable)
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
      console.error("AI RESP Final Fallback Failure:", finalErr);
      return new Response(JSON.stringify({ 
        text: "The RESP AI is currently busy. You can manually adjust the sliders below, or try again in a moment.",
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
    console.error("Gemini RESP API Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
