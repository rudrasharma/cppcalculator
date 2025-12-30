// src/pages/api/chat.js
export const POST = async ({ request, locals }) => {
  try {
    const { messages, context } = await request.json();

    // 1. Load API Key (Switched to GROQ)
    let apiKey = import.meta.env.GROQ_API_KEY;
    if (!apiKey && locals && locals.runtime && locals.runtime.env) {
      apiKey = locals.runtime.env.GROQ_API_KEY;
    }
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing GROQ_API_KEY" }), { status: 500 });
    }

    // 2. Define Brains (Prompts & Tools in OpenAI Format)
    // Groq/OpenAI use a slightly different structure for tools than Gemini
    const PROMPTS_AND_TOOLS = {
      "parental-leave": {
        system_instruction: (context) => `
          You are LoonieFi's expert on Canadian Maternity & Parental Leave.
          Context: ${JSON.stringify(context)}
          
          RULES:
          - Parent 1 (annual_income) = Birth Parent (Mother). Parent 2 = Partner.
          - If user gives data, CALL 'update_parental_calculator'.
          - ALWAYS output a friendly text summary explaining what you changed.
        `,
        tools: [{
          type: "function",
          function: {
            name: "update_parental_calculator",
            description: "Updates parental leave settings",
            parameters: {
              type: "object",
              properties: {
                province: { type: "string", enum: ["ON", "BC", "AB", "QC", "NS", "NB", "MB", "SK", "PE", "NL", "OTHER"] },
                annual_income: { type: "number" },
                partner_income: { type: "number" },
                has_partner: { type: "boolean" },
                plan_type: { type: "string", enum: ["STANDARD", "EXTENDED"] }
              },
              required: []
            }
          }
        }]
      },
      "household": {
        system_instruction: (context) => `
          You are LoonieFi's expert on Canadian Household Benefits (CCB, GST).
          Context: ${JSON.stringify(context)}.
          
          RULES:
          - Province: Map names to codes (Manitoba -> MB).
          - Children: If user lists ages, use them.
          
          BEHAVIOR:
          - If data is given, CALL 'update_household_calculator'.
          - ALWAYS provide a text response. If you update the form, say "I've updated your household..."
          - If asked a question (e.g. "What is the max CCB?"), answer it.
        `,
        tools: [{
          type: "function",
          function: {
            name: "update_household_calculator",
            description: "Updates household benefit settings",
            parameters: {
              type: "object",
              properties: {
                province: { type: "string", enum: ["ON", "BC", "AB", "QC", "NS", "NB", "MB", "SK", "PE", "NL", "YT", "NT", "NU"] },
                marital_status: { type: "string", enum: ["MARRIED", "COMMON_LAW", "SINGLE", "SEPARATED", "DIVORCED", "WIDOWED"] },
                income: { type: "number" },
                shared_custody: { type: "boolean" },
                is_rural: { type: "boolean" },
                children: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: { age: { type: "number" }, disability: { type: "boolean" } },
                    required: ["age"]
                  }
                }
              },
              required: []
            }
          }
        }]
      }
    };

    // 3. Select Config based on Page
    const page = context?.page || "parental-leave"; 
    const config = PROMPTS_AND_TOOLS[page] || PROMPTS_AND_TOOLS["parental-leave"];

    // 4. Prepare Messages (Inject System Prompt)
    const systemMessage = {
      role: "system",
      content: config.system_instruction(context)
    };
    
    // Ensure we don't duplicate system messages if the frontend sends them
    const conversation = [systemMessage, ...messages.filter(m => m.role !== "system")];

    // 5. Call Groq (OpenAI Compatible Endpoint)
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", // High speed, free tier friendly
        messages: conversation,
        tools: config.tools,
        tool_choice: "auto", // Let the model decide to call tool or talk
        temperature: 0.7,
        max_tokens: 1024
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    // 6. Return Data (Groq response is already in the correct format)
    // We just pass it through directly to the frontend
    return new Response(JSON.stringify(data), { status: 200 });

  } catch (error) {
    console.error("Backend Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};