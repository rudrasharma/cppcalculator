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
    
    const systemInstruction = `You are LoonieFi's Child Benefit Hero, an expert on Canadian government benefits (CCB, GST, CAIP).
      Your goal is to help users estimate their monthly and annual child benefit payments based on their household income and children's ages.
      
      Current App Context: ${JSON.stringify(context || {})}
      
      When a user interacts:
      1. If they describe a family scenario (e.g., "We make 80k and have a 2 year old"): Call 'update_ccb_calculator' with extracted values.
      2. If they ask a general question: DO NOT call 'update_ccb_calculator'. Simply answer in the text response.
      3. ALWAYS provide a 'strategy_insight' in the tool call if calling it.
      
      FINANCIAL GUARDRAILS (STRICT):
      - Max Children: Limit extraction to a maximum of 10 children.
      - Child Age: CCB only applies to children under 18. If a child is 18+, do not include them in 'children' array and mention this in the insight.
      - Marital Status: must be 'MARRIED' or 'SINGLE'.
      - Province: use 2-letter codes (ON, BC, AB, QC, NS, NB, MB, SK, PE, NL).
      
      CRITICAL RULES:
      - 'children' array must contain objects with 'age' (number) and 'disability' (boolean).
      - If they mention "disability tax credit" or "disabled child", set disability to true for that child.
      - Strategy Insight: provide a concise 1-2 sentence tip about how income affects CCB or mention provincial-specific credits.
      
      Be professional and accurate.`;

    const tools = [
      {
        functionDeclarations: [
          {
            name: "update_ccb_calculator",
            description: "Updates the child benefit calculator with family data.",
            parameters: {
              type: "OBJECT",
              properties: {
                grossAfni: { type: "NUMBER", description: "Annual Adjusted Family Net Income (AFNI)" },
                province: { type: "STRING" },
                maritalStatus: { type: "STRING", enum: ["MARRIED", "SINGLE"] },
                sharedCustody: { type: "BOOLEAN" },
                isRural: { type: "BOOLEAN" },
                children: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      age: { type: "NUMBER" },
                      disability: { type: "BOOLEAN" }
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
      console.error("AI CCB Final Fallback Failure:", finalErr);
      return new Response(JSON.stringify({ 
        text: "The Child Benefit AI is currently busy. You can manually adjust the sliders below, or try again in a moment.",
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
    console.error("Gemini CCB API Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
