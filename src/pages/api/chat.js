// src/pages/api/chat.js
export const POST = async ({ request, locals }) => {
  try {
    const { messages, context } = await request.json();

    // 1. Load API Key
    let apiKey = import.meta.env.GOOGLE_API_KEY;
    if (!apiKey && locals && locals.runtime && locals.runtime.env) {
      apiKey = locals.runtime.env.GOOGLE_API_KEY;
    }
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing GOOGLE_API_KEY" }), { status: 500 });
    }

    // 2. Prepare Gemini Request
    const contents = messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

    // 3. Define Brains (Prompts & Tools)
    const PROMPTS_AND_TOOLS = {
      "parental-leave": {
        system_instruction: (context) => ({
          parts: [{ text: `
            You are LoonieFi's expert on Canadian Maternity & Parental Leave.
            Context: ${JSON.stringify(context)}
            
            RULES:
            - Parent 1 (annual_income) = Birth Parent (Mother). Parent 2 = Partner.
            - If user gives data, CALL 'update_parental_calculator'.
            - ALWAYS output a friendly text summary explaining what you changed.
          `}]
        }),
        tools: [{
          function_declarations: [{
            name: "update_parental_calculator",
            description: "Updates parental leave settings",
            parameters: {
              type: "OBJECT",
              properties: {
                province: { type: "STRING", enum: ["ON", "BC", "AB", "QC", "NS", "NB", "MB", "SK", "PE", "NL", "OTHER"] },
                annual_income: { type: "NUMBER" },
                partner_income: { type: "NUMBER" },
                has_partner: { type: "BOOLEAN" },
                plan_type: { type: "STRING", enum: ["STANDARD", "EXTENDED"] }
              },
              required: ["annual_income"] 
            }
          }]
        }]
      },
      "household": {
        system_instruction: (context) => ({
          parts: [{ text: `
            You are LoonieFi's expert on Canadian Household Benefits (CCB, GST).
            Context: ${JSON.stringify(context)}.
            
            RULES:
            - Province: Map names to codes (Manitoba -> MB).
            - Children: If user lists ages, use them.
            
            BEHAVIOR:
            - If data is given, CALL 'update_household_calculator'.
            - ALWAYS provide a text response. If you update the form, say "I've updated your household..."
            - If asked a question (e.g. "What is the max CCB?"), answer it.
          `}]
        }),
        tools: [{
          function_declarations: [{
            name: "update_household_calculator",
            description: "Updates household benefit settings",
            parameters: {
              type: "OBJECT",
              properties: {
                province: { type: "STRING", enum: ["ON", "BC", "AB", "QC", "NS", "NB", "MB", "SK", "PE", "NL", "YT", "NT", "NU"] },
                marital_status: { type: "STRING", enum: ["MARRIED", "COMMON_LAW", "SINGLE", "SEPARATED", "DIVORCED", "WIDOWED"] },
                income: { type: "NUMBER" },
                shared_custody: { type: "BOOLEAN" },
                is_rural: { type: "BOOLEAN" },
                children: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: { age: { type: "NUMBER" }, disability: { type: "BOOLEAN" } },
                    required: ["age"]
                  }
                }
              },
              required: ["province", "marital_status", "income"]
            }
          }]
        }]
      }
    };

    const page = context?.page || "parental-leave"; 
    const config = PROMPTS_AND_TOOLS[page] || PROMPTS_AND_TOOLS["parental-leave"];

    // 4. Call Gemini
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        tools: config.tools,
        system_instruction: config.system_instruction(context),
        generation_config: { temperature: 0.7 }
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    // 5. THE FIX: Allow BOTH Tool Call AND Text
    const candidate = data.candidates?.[0];
    const part = candidate?.content?.parts?.[0]; // Gemini often puts tool and text in separate parts, but let's check the first one or iterate.
    
    // Better Gemini Parsing: Look through ALL parts
    const parts = candidate?.content?.parts || [];
    let openAIMessage = { role: "assistant", content: null };

    parts.forEach(p => {
      if (p.functionCall) {
        openAIMessage.tool_calls = [{
          id: "call_" + Math.random().toString(36).substr(2, 9),
          type: "function",
          function: {
            name: p.functionCall.name,
            arguments: JSON.stringify(p.functionCall.args) 
          }
        }];
      }
      if (p.text) {
        openAIMessage.content = (openAIMessage.content || "") + p.text;
      }
    });

    return new Response(JSON.stringify({
      choices: [{ index: 0, message: openAIMessage, finish_reason: "stop" }]
    }), { status: 200 });

  } catch (error) {
    console.error("Backend Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};