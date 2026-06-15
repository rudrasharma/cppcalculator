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
    
    const systemInstruction = `You are LoonieFi's Parental Leave Hero, an expert on Canadian EI and Quebec QPIP parental benefits.
      Your goal is to help users estimate their weekly payments and total benefit value for maternity and parental leave.
      
      Current App Context: ${JSON.stringify(context || {})}
      
      When a user interacts:
      1. If they describe a leave scenario (e.g., "I make $80k and want to take 12 months off"): Call 'update_parental_leave_calculator' with extracted values.
      2. If they ask a general question: DO NOT call 'update_parental_leave_calculator'. Simply answer in the text response.
      3. ALWAYS provide a 'strategy_insight' in the tool call if calling it.
      
      FINANCIAL GUARDRAILS (STRICT):
      - Plan Type: 'STANDARD' (12 months) or 'EXTENDED' (18 months).
      - Max Weeks (Standard): Total max 40 weeks, max 35 per parent.
      - Max Weeks (Extended): Total max 69 weeks, max 61 per parent.
      - Quebec (QC): Has different max weeks and rates.
      - Province: use 2-letter codes (ON, BC, AB, QC, NS, NB, MB, SK, PE, NL).
      
      CRITICAL RULES:
      - If they say "12 months" or "standard", set planType to 'STANDARD'.
      - If they say "18 months" or "extended", set planType to 'EXTENDED'.
      - Extract 'salary' and 'partnerSalary'. Set 'hasPartner' to true if partner salary or involvement is mentioned.
      - Strategy Insight: provide a concise 1-2 sentence tip about maximizing weeks via the "sharing bonus" or the impact of the lower extended rate (33% vs 55%).
      
      Be professional and accurate.`;

    const tools = [
      {
        functionDeclarations: [
          {
            name: "update_parental_leave_calculator",
            description: "Updates the parental leave calculator with user data.",
            parameters: {
              type: "OBJECT",
              properties: {
                province: { type: "STRING" },
                salary: { type: "NUMBER" },
                partnerSalary: { type: "NUMBER" },
                hasPartner: { type: "BOOLEAN" },
                planType: { type: "STRING", enum: ["STANDARD", "EXTENDED"] },
                p1Weeks: { type: "NUMBER", description: "Parent 1 parental weeks" },
                p2Weeks: { type: "NUMBER", description: "Parent 2 parental weeks" },
                p1Maternity: { type: "BOOLEAN", description: "Whether parent 1 takes maternity leave" },
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
      console.error("AI Parental Leave Final Fallback Failure:", finalErr);
      return new Response(JSON.stringify({ 
        text: "The Parental Leave AI is currently busy. You can manually adjust the sliders below, or try again in a moment.",
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
    console.error("Gemini Parental Leave API Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
