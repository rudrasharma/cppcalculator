// src/pages/api/chat.js
export const POST = async ({ request, locals }) => {
  try {
    const { messages, context } = await request.json();

    // ==========================================
    // 1. LOAD API KEY (GROQ)
    // ==========================================
    let apiKey = import.meta.env.GROQ_API_KEY;
    if (!apiKey && locals && locals.runtime && locals.runtime.env) {
      apiKey = locals.runtime.env.GROQ_API_KEY;
    }
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing GROQ_API_KEY" }), { status: 500 });
    }

    // ==========================================
    // 2. DEFINE BRAINS (Prompts & Tools)
    // ==========================================
    const currentYear = new Date().getFullYear();
    
    const PROMPTS_AND_TOOLS = {
      
      // --- RETIREMENT CALCULATOR (CPP/OAS) ---
      "cpp": {
        system_instruction: (context) => `
          You are LoonieFi's friendly expert on Canadian Retirement (CPP, OAS, GIS).
          Current Year: ${currentYear}
          
          YOUR GOALS:
          1. **Update Data**: If the user provides info, call 'update_retirement_calculator'.
          2. **Answer Questions**: Explain retirement concepts clearly.

          CRITICAL RULES FOR DATA:
          - **Age**: "I am 90" -> dob: "${currentYear - 90}-01-01".
          - **Retirement Age**: "Retired 30 years ago" (at age 60) -> retirementAge: 60.
          - **Earnings**: The 'earnings' object is STRICTLY for { "Year": Amount }. 
            - **NEVER** infer a table from "worked 30 years". 
            - If user says "Retired 30 years ago", ONLY update dates. Leave earnings empty.
            - If user describes complex raises (e.g. "2% for 30 years"), **IGNORE THE MATH**. Just use their current/final salary as 'avgSalaryInput'.

          EXAMPLES:
          User: "I am 90 and retired 30 years ago."
          Assistant: Call Tool { "dob": "${currentYear - 90}-01-01", "retirementAge": 60 } + "I've updated your age."
        `,
        tools: [{
          type: "function",
          function: {
            name: "update_retirement_calculator",
            description: "Updates form values.",
            parameters: {
              type: "object",
              properties: {
                retirementAge: { type: "number" },
                dob: { type: "string" },
                yearsInCanada: { type: "number" },
                avgSalaryInput: { type: "number" },
                isMarried: { type: "boolean" },
                spouseDob: { type: "string" },
                spouseIncome: { type: "number" },
                childCount: { type: "number" },
                earnings: { 
                  type: "object", 
                  description: "Dictionary of historical earnings. Key=Year (string), Value=Amount (number).",
                  additionalProperties: { type: "number" } 
                },
                action: { type: "string", enum: ["SHOW_RESULTS"] }
              },
              required: []
            }
          }
        }]
      },

      // --- PARENTAL LEAVE CALCULATOR ---
      "parental-leave": {
        system_instruction: (context) => `
          You are LoonieFi's expert on Canadian Maternity & Parental Leave.
          
          GOALS:
          1. **Update Form**: If the user provides income/province, call 'update_parental_calculator'.
          2. **Answer Questions**: Explain policies (Standard vs Extended, Quebec vs Federal).
          
          DATA RULES:
          - Map Province names to codes (e.g., Alberta -> AB).
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
                plan_type: { type: "string", enum: ["STANDARD", "EXTENDED"] },
                p1_weeks: { type: "number" },
                p2_weeks: { type: "number" }
              },
              required: []
            }
          }
        }]
      },

      // --- HOUSEHOLD BENEFITS CALCULATOR ---
      "household": {
        system_instruction: (context) => `
          You are LoonieFi's expert on Canadian Household Benefits (CCB, GST).
          
          GOALS:
          1. **Update Form**: If the user describes their family (kids, income), call 'update_household_calculator'.
          2. **Answer Questions**: Explain tax forms and benefits.
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

    // ==========================================
    // 3. SELECT CONFIG & PREPARE CONVERSATION
    // ==========================================
    const page = context?.page || "parental-leave"; 
    const config = PROMPTS_AND_TOOLS[page] || PROMPTS_AND_TOOLS["parental-leave"];

    const conversation = [
      { role: "system", content: config.system_instruction(context) },
      ...messages.filter(m => m.role !== "system")
    ];

    // ==========================================
    // 4. CALL GROQ API
    // ==========================================
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", 
        messages: conversation,
        tools: config.tools,
        tool_choice: "auto", 
        temperature: 0.6, // High enough to answer "What is T2201" creatively
        max_tokens: 1024
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("Groq API Error:", data.error);
      throw new Error(data.error.message);
    }

    // ==========================================
    // 5. RETURN RESPONSE
    // ==========================================
    return new Response(JSON.stringify(data), { status: 200 });

  } catch (error) {
    console.error("Backend Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};