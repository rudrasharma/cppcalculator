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
    
    const systemInstruction = `You are LoonieFi's Mortgage Hero, a Canadian real estate and lending expert.
      Your goal is to help users calculate mortgage payments and understand the impact of down payments, rates, and prepayments.
      
      Current App Context: ${JSON.stringify(context || {})}
      
      When a user interacts:
      1. If they describe a scenario: Call 'update_mortgage_calculator' with extracted values.
      2. If they ask a general question: DO NOT call 'update_mortgage_calculator'. Simply answer in the text response.
      3. ALWAYS provide a 'strategy_insight' in the tool call if calling it.
      
      FINANCIAL GUARDRAILS (STRICT):
      - CMHC Rule: If down payment is less than 20%, maximum amortization is 25 years.
      - Term Constraint: Mortgage term (termYears) cannot be greater than amortization (amortizationYears).
      - Min Down Payment: Canadian rule is 5% for first 500k, 10% for next 500k. If user asks for less, set it to the minimum and explain in the insight.
      - Payment Mutual Exclusivity: IF A USER SETS A TOTAL PAYMENT AMOUNT: Set 'customPayment' to that amount and set 'prepayments.monthlyIncrease' to 0. NEVER set both for the same intent.
      
      CRITICAL RULES:
      - paymentFrequency: must be 'monthly', 'semi-monthly', 'bi-weekly', 'accelerated-bi-weekly', 'weekly', 'accelerated-weekly'.
      - calculationMode: 'purchase' (default) or 'renewal'.
      - Strategy Insight: provide a concise 1-2 sentence high-value financial tip.
      
      Be professional and accurate.`;

    const tools = [
      {
        functionDeclarations: [
          {
            name: "update_mortgage_calculator",
            description: "Updates mortgage calculator settings.",
            parameters: {
              type: "OBJECT",
              properties: {
                calculationMode: { type: "STRING", enum: ["purchase", "renewal"] },
                homePrice: { type: "NUMBER" },
                downPayment: { type: "NUMBER" },
                downPaymentType: { type: "STRING", enum: ["dollar", "percent"] },
                annualRate: { type: "NUMBER" },
                amortizationYears: { type: "NUMBER" },
                termYears: { type: "NUMBER" },
                paymentFrequency: { type: "STRING", enum: ["monthly", "semi-monthly", "bi-weekly", "accelerated-bi-weekly", "weekly", "accelerated-weekly"] },
                compounding: { type: "STRING", enum: ["semi-annual", "monthly"] },
                customPayment: { type: "NUMBER" },
                province: { type: "STRING" },
                isToronto: { type: "BOOLEAN" },
                isFirstTimeBuyer: { type: "BOOLEAN" },
                showStressTest: { type: "BOOLEAN" },
                propertyTaxes: { type: "NUMBER" },
                heating: { type: "NUMBER" },
                condoFees: { type: "NUMBER" },
                prepayments: {
                  type: "OBJECT",
                  properties: {
                    monthlyIncrease: { type: "NUMBER" }
                  }
                },
                strategy_insight: { type: "STRING" }
              },
            },
          },
        ],
      },
    ];

    // Fallback logic
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
          console.warn(`Gemini Mortgage ${modelName} Busy/Limit (${err.status}). Retrying in ${delay}ms...`);
          await new Promise(r => setTimeout(r, delay));
          return tryRequest(modelIndex, retryCount - 1, delay * 2);
        }
        if (modelIndex < modelsToTry.length - 1) {
          console.warn(`Mortgage switching to fallback: ${modelsToTry[modelIndex + 1]}`);
          return tryRequest(modelIndex + 1, 2, 2000);
        }
        throw err;
      }
    };

    let response;
    try {
      response = await tryRequest();
    } catch (finalErr) {
      console.error("AI Mortgage Final Fallback Failure:", finalErr);
      return new Response(JSON.stringify({ 
        text: "The Mortgage AI is currently busy. You can manually adjust the sliders below to see your savings instantly, or try again in a moment.",
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
    console.error("Gemini Mortgage API Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
