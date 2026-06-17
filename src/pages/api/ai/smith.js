import { GoogleGenerativeAI } from "@google/generative-ai";

export const POST = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { message, context, globalMemory } = body;

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
    
    const systemInstruction = `You are LoonieFi's Smith Manoeuvre Hero, an expert on Canadian debt conversion strategies and tax-deductible interest.
      Your goal is to help users estimate the benefit of converting their mortgage into a tax-deductible investment loan.
      
      Current App Context: ${JSON.stringify(context || {})}
      Global User Profile: ${JSON.stringify(globalMemory || {})}
      
      When a user interacts:
      1. If they describe a financial scenario (e.g., "I have a $400k mortgage at 4% and make $120k"): Call 'update_smith_calculator' with extracted values.
      2. If they ask a general question: DO NOT call 'update_smith_calculator'. Simply answer in the text response.
      3. ALWAYS provide a 'strategy_insight' in the tool call if calling it.
      
      FINANCIAL GUARDRAILS (STRICT):
      - OSFI Limits: Max Total LTV (Mortgage + HELOC) is 80%. Max pure HELOC LTV is 65%.
      - Marginal Tax Rate: Use the user's marginal rate (e.g., 0.35 for 35%).
      - Allocation: 'portfolio', 'mortgage', or 'none'.
      - All interest rates and yields must be positive.
      
      CRITICAL RULES:
      - Map "tax bracket" or "income" to a 'marginalTaxRate' decimal (e.g., $100k income in ON is ~0.35).
      - If they mention "re-investing refunds", set taxRefundAllocation to 'portfolio'.
      - Strategy Insight: provide a concise 1-2 sentence tip about tax deductibility, debt-free timelines, or the importance of capitalization.
      
      Be professional and accurate.`;

    const tools = [
      {
        functionDeclarations: [
          {
            name: "update_smith_calculator",
            description: "Updates the Smith Manoeuvre calculator with mortgage and investment data.",
            parameters: {
              type: "OBJECT",
              properties: {
                homeValue: { type: "NUMBER" },
                mortgageBalance: { type: "NUMBER" },
                mortgageRate: { type: "NUMBER", description: "Annual mortgage rate (e.g. 0.05 for 5%)" },
                helocRate: { type: "NUMBER", description: "Annual HELOC rate (e.g. 0.06 for 6%)" },
                marginalTaxRate: { type: "NUMBER", description: "User's marginal tax rate (e.g. 0.43 for 43%)" },
                amortizationYears: { type: "NUMBER" },
                initialHelocLumpSum: { type: "NUMBER" },
                capitalizeInterest: { type: "BOOLEAN" },
                taxRefundAllocation: { type: "STRING", enum: ["portfolio", "mortgage", "none"] },
                dividendAllocation: { type: "STRING", enum: ["portfolio", "mortgage", "none"] },
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
      console.error("AI Smith Final Fallback Failure:", finalErr);
      return new Response(JSON.stringify({ 
        text: "The Smith Manoeuvre AI is currently busy. You can manually adjust the sliders below, or try again in a moment.",
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
    console.error("Gemini Smith API Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
