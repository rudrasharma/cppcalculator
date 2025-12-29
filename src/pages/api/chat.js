// src/pages/api/chat.js
export const POST = async ({ request, locals }) => {
  try {
    const { messages, context } = await request.json();

    // 1. Load API Key (Universal for Local & Cloudflare)
    let apiKey = import.meta.env.GOOGLE_API_KEY;
    if (!apiKey && locals && locals.runtime && locals.runtime.env) {
      apiKey = locals.runtime.env.GOOGLE_API_KEY;
    }
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing GOOGLE_API_KEY" }), { status: 500 });
    }

    // --- ADAPTER START: Convert OpenAI Request -> Native Gemini Request ---
    
    // A. Convert Messages to Gemini Format
    const contents = messages
      .filter(m => m.role !== 'system') // System prompt is handled separately below
      .map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

    // B. System Prompt (The Brains)
    // This tells the AI how to behave: Click buttons for data, speak text for questions.
    const systemInstruction = {
      parts: [{ text: `
        You are LoonieFi's friendly expert on Canadian Maternity & Parental Leave (EI) and finances.
        
        Current User Context: ${JSON.stringify(context)}
        
        YOUR TWO MODES:
        
        1. ACTION MODE (Data Entry):
           - If the user provides specific numbers (e.g., "I make $80k", "Switch to Extended", "I live in BC"), you MUST CALL the 'update_parental_calculator' tool.
           - Do not just say you updated it; actually execute the tool call.
           
        2. ADVISOR MODE (Q&A):
           - If the user asks a question (e.g., "What is the max benefit?", "How does the clawback work?", "Explain the difference"), answer it clearly.
           - Keep answers short, friendly, and Canadian.
           - Use the user's current context (income/province) to make the answer specific if possible.
           
        If the user does BOTH (e.g., "Set income to 50k and tell me the max"), call the tool first.
      `}]
    };

    // C. Define Tools (Native Gemini Format)
    const tools = [{
      function_declarations: [{
        name: "update_parental_calculator",
        description: "Updates the parental leave calculator inputs based on user data.",
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
    }];

    // --- CALL GOOGLE API ---
    // Using the standard model. If this fails, try 'gemini-1.5-flash-001' or 'gemini-2.0-flash-exp'
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        tools,
        system_instruction: systemInstruction,
        generation_config: { temperature: 0.7 }
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error("Gemini API Error:", JSON.stringify(data.error, null, 2));
      throw new Error(data.error.message);
    }

    // --- ADAPTER END: Convert Gemini Response -> Standard OpenAI Response ---
    
    const candidate = data.candidates?.[0];
    const part = candidate?.content?.parts?.[0];
    let openAIMessage = { role: "assistant", content: null };

    // Case A: Tool Call (AI wants to update the form)
    if (part?.functionCall) {
      openAIMessage.tool_calls = [{
        id: "call_" + Math.random().toString(36).substr(2, 9),
        type: "function",
        function: {
          name: part.functionCall.name,
          // Gemini returns an object, OpenAI expects a JSON string. We stringify it.
          arguments: JSON.stringify(part.functionCall.args) 
        }
      }];
    } 
    // Case B: Text Response (AI is answering a question)
    else if (part?.text) {
      openAIMessage.content = part.text;
    }

    const openAIResponse = {
      id: "chatcmpl-adapter-" + Date.now(),
      object: "chat.completion",
      created: Date.now(),
      model: "gemini-2.5-flash",
      choices: [{
        index: 0,
        message: openAIMessage,
        finish_reason: "stop"
      }]
    };

    return new Response(JSON.stringify(openAIResponse), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Backend Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};