import { GoogleGenerativeAI } from "@google/generative-ai";

function getInstructionsAndTools(calculatorId, context, globalMemory) {
  let systemInstruction = "";
  let tools = [];

  // Common rules appended to all instructions
  const commonInstructions = `
    GENERAL INSTRUCTIONS:
    - Keep text answers extremely concise, structured, and friendly. Use short paragraphs or lists. Perfect for mobile reading.
    - ALWAYS explain any changes you made in the text response (e.g. "I've updated your home price to $800,000 and province to ON.").
    - NEVER guess or assume missing values. Ask for clarification if required.
    - Map full province names to codes (e.g. "Ontario" -> "ON", "British Columbia" -> "BC").
    - Only call the update tool when there are updates to apply.`;

  switch(calculatorId) {
    case 'cagr':
      systemInstruction = `You are LoonieFi's CAGR Hero, an investment and compound interest expert.
        Your goal is to help users calculate annual growth rates, future values, and time horizons for their investments.
        
        Current Page Context (CAGR Calculator): ${JSON.stringify(context || {})}
        Global User Profile: ${JSON.stringify(globalMemory || {})}
        
        When a user interacts:
        1. If they describe an investment scenario (e.g., "If I turn 10k into 50k in 10 years, what's my return?"): Call 'update_cagr_calculator' with extracted values.
        2. If they ask a general question: DO NOT call 'update_cagr_calculator'. Simply answer in the text response.
        
        FINANCIAL GUARDRAILS (STRICT):
        - Mode: 'RATE', 'FUTURE', 'START', or 'TIME'. Select based on what the user is looking for.
        - Max Years: 100.
        - Frequency: 'Daily', 'Weekly', 'Monthly', or 'Yearly'.
        - All monetary values and rates must be positive.
        
        CRITICAL RULES:
        - If user asks for a return %, switch mode to 'RATE'.
        - If user asks for a final amount, switch mode to 'FUTURE'.
        - If user asks how long it will take, switch mode to 'TIME'.
        
        ${commonInstructions}`;

      tools = [{
        functionDeclarations: [{
          name: "update_cagr_calculator",
          description: "Updates the CAGR calculator with investment data.",
          parameters: {
            type: "OBJECT",
            properties: {
              mode: { type: "STRING", enum: ["RATE", "FUTURE", "START", "TIME"] },
              startValue: { type: "NUMBER" },
              endValue: { type: "NUMBER" },
              years: { type: "NUMBER" },
              rate: { type: "NUMBER" },
              hasContribution: { type: "BOOLEAN" },
              contribution: { type: "NUMBER" },
              frequency: { type: "STRING", enum: ["Daily", "Weekly", "Monthly", "Yearly"] },
              useInflation: { type: "BOOLEAN" },
              inflationRate: { type: "NUMBER" }
            }
          }
        }]
      }];
      break;

    case 'ccb':
    case 'child-benefit':
      systemInstruction = `You are LoonieFi's Child Benefit Hero, an expert on Canadian family benefits.
        Your goal is to help users estimate their Canada Child Benefit (CCB) and other provincial/federal family payments.
        
        Current Page Context (Child Benefit Calculator): ${JSON.stringify(context || {})}
        Global User Profile: ${JSON.stringify(globalMemory || {})}
        
        When a user interacts:
        1. If they describe their family situation (e.g., "I have two kids, ages 3 and 7, and our income is $75k"): Call 'update_ccb_calculator' with extracted values.
        2. If they ask a general question: DO NOT call 'update_ccb_calculator'. Simply answer in the text response.
        
        FINANCIAL GUARDRAILS (STRICT):
        - If they mention "disability tax credit" or "disabled child", set disability to true for that child.
        - Province: Must be 2-letter code.
        - Marital status: 'MARRIED' or 'SINGLE'.
        
        ${commonInstructions}`;

      tools = [{
        functionDeclarations: [{
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
              }
            }
          }
        }]
      }];
      break;

    case 'mortgage':
      systemInstruction = `You are LoonieFi's Mortgage Hero, an expert on Canadian real estate and home financing.
        Your goal is to help users calculate their mortgage payments, land transfer taxes, CMHC insurance premiums, and optimal prepayment schedules.
        
        Current Page Context (Mortgage Calculator): ${JSON.stringify(context || {})}
        Global User Profile: ${JSON.stringify(globalMemory || {})}
        
        When a user interacts:
        1. If they describe a purchase or renewal (e.g., "Buying a $800k house with 20% down at 4.2% rate"): Call 'update_mortgage_calculator' with extracted values.
        2. If they ask a general question: DO NOT call 'update_mortgage_calculator'. Simply answer in the text response.
        
        ${commonInstructions}`;

      tools = [{
        functionDeclarations: [{
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
              }
            }
          }
        }]
      }];
      break;

    case 'parental':
    case 'parental-leave':
      systemInstruction = `You are LoonieFi's Parental Leave Hero, an expert on Canadian EI maternity and parental benefits.
        Your goal is to help parents estimate their weekly leave payments, benefit durations, and partner-sharing options.
        
        Current Page Context (Parental Leave Calculator): ${JSON.stringify(context || {})}
        Global User Profile: ${JSON.stringify(globalMemory || {})}
        
        When a user interacts:
        1. If they describe their parental leave scenario (e.g. "I make $80k in ON and my partner makes $50k"): Call 'update_parental_leave_calculator' with extracted values.
        2. If they ask a general question: DO NOT call 'update_parental_leave_calculator'. Simply answer in the text response.
        
        FINANCIAL GUARDRAILS (STRICT):
        - PlanType: 'STANDARD' (up to 40 weeks total) or 'EXTENDED' (up to 69 weeks total).
        - Province: Must be 2-letter code.
        
        ${commonInstructions}`;

      tools = [{
        functionDeclarations: [{
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
              p1Weeks: { type: "NUMBER" },
              p2Weeks: { type: "NUMBER" },
              p1Maternity: { type: "BOOLEAN" }
            }
          }
        }]
      }];
      break;

    case 'resp':
      systemInstruction = `You are LoonieFi's RESP Hero, an expert on Canadian education savings and government grants.
        Your goal is to help parents optimize their Registered Education Savings Plan (RESP) to maximize Canada Education Savings Grants (CESG) and Canada Learning Bonds (CLB).
        
        Current Page Context (RESP Calculator): ${JSON.stringify(context || {})}
        Global User Profile: ${JSON.stringify(globalMemory || {})}
        
        When a user interacts:
        1. If they describe their children and savings plan (e.g. "I have a 3 year old child and put $200 a month in RESP"): Call 'update_resp_calculator' with extracted values.
        2. If they ask a general question: DO NOT call 'update_resp_calculator'. Simply answer in the text response.
        
        ${commonInstructions}`;

      tools = [{
        functionDeclarations: [{
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
              }
            }
          }
        }]
      }];
      break;

    case 'retirement':
    case 'cpp-oas':
      systemInstruction = `You are LoonieFi's Retirement Hero, an expert on Canadian retirement income, CPP pension calculations, and OAS benefits.
        Your goal is to help users estimate their future retirement cash flows and pension calculations.
        
        Current Page Context (Retirement Calculator): ${JSON.stringify(context || {})}
        Global User Profile: ${JSON.stringify(globalMemory || {})}
        
        When a user interacts:
        1. If they describe their retirement timeline and profile (e.g. "I'm 40, make $90k, and want to retire at 65"): Call 'update_retirement_calculator' with extracted values.
        2. If they ask a general question: DO NOT call 'update_retirement_calculator'. Simply answer in the text response.
        
        ${commonInstructions}`;

      tools = [{
        functionDeclarations: [{
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
              childCount: { type: "NUMBER" }
            }
          }
        }]
      }];
      break;

    case 'smith':
    case 'smith-manoeuvre':
      systemInstruction = `You are LoonieFi's Smith Manoeuvre Hero, an expert on Canadian tax-deductible investment borrowing.
        Your goal is to help users understand how the Smith Manoeuvre works, modeling the conversion of their mortgage into a tax-deductible investment loan.
        
        Current Page Context (Smith Manoeuvre Calculator): ${JSON.stringify(context || {})}
        Global User Profile: ${JSON.stringify(globalMemory || {})}
        
        When a user interacts:
        1. If they model their Smith Manoeuvre scenario (e.g. "I have a $500k home and $300k mortgage at 5%"): Call 'update_smith_calculator' with extracted values.
        2. If they ask a general question: DO NOT call 'update_smith_calculator'. Simply answer in the text response.
        
        ${commonInstructions}`;

      tools = [{
        functionDeclarations: [{
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
              dividendAllocation: { type: "STRING", enum: ["portfolio", "mortgage", "none"] }
            }
          }
        }]
      }];
      break;

    case 'tax':
    default:
      systemInstruction = `You are LoonieFi's Copilot, an expert Canadian personal finance and tax assistant.
        Your goal is to guide the user in optimizing their income taxes and financial setup.
        
        Current Page Context (Income Tax Calculator): ${JSON.stringify(context || {})}
        Global User Profile Memory: ${JSON.stringify(globalMemory || {})}
        
        When a user interacts:
        1. If they describe a new scenario (e.g. "I make $90k", "What if I put $5k in RRSP", "Change my province to BC"): Call 'update_tax_calculator' with extracted values.
        2. If they ask a general question: Do NOT call 'update_tax_calculator'. Simply reply in the text response.
        
        FINANCIAL GUARDRAILS (STRICT):
        - RRSP Limit: Max allowed RRSP contribution is 18% of gross income, capped at $32,490.
        - Employer Match: Cap match percentage at 10%.
        - Province: Must be 2-letter code.
        
        ${commonInstructions}`;

      tools = [{
        functionDeclarations: [{
          name: "update_tax_calculator",
          description: "Updates the tax calculator form with values extracted from user input.",
          parameters: {
            type: "OBJECT",
            properties: {
              grossIncome: { type: "NUMBER", description: "Annual gross income in CAD" },
              province: { type: "STRING", description: "2-letter province code (e.g., ON, BC, AB, QC)" },
              rrspContribution: { type: "NUMBER", description: "Annual RRSP contribution in CAD" },
              employerMatchPercent: { type: "NUMBER", description: "Employer RRSP match percentage (0-10)" }
            }
          }
        }]
      }];
      break;
  }

  return { systemInstruction, tools };
}

export const POST = async ({ request, locals }) => {
  try {
    const { messages, context, globalMemory } = await request.json();

    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: "No messages provided." }), { status: 400 });
    }

    // 1. LOAD API KEY
    let apiKey = import.meta.env.GEMINI_API_KEY;
    if (!apiKey && locals && locals.runtime && locals.runtime.env) {
      apiKey = locals.runtime.env.GEMINI_API_KEY;
    }

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing GEMINI_API_KEY. Please set it in your environment." }), { status: 500 });
    }

    // 2. INITIALIZE GEMINI AND INSTRUCTIONS
    const genAI = new GoogleGenerativeAI(apiKey);
    const calculatorId = context?.calculatorId || 'tax';
    const { systemInstruction, tools } = getInstructionsAndTools(calculatorId, context, globalMemory);

    // Format historical messages for Gemini SDK (role: 'user' or 'model')
    const formattedHistory = messages.slice(0, -1).map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content || '' }]
    })).filter((msg, idx, arr) => {
      const firstUserIdx = arr.findIndex(m => m.role === 'user');
      return firstUserIdx !== -1 && idx >= firstUserIdx;
    });

    const lastMessage = messages[messages.length - 1];

    // Fallback logic: 3.5 (Frontier) -> 3.1-lite (High Availability) -> 2.5 (Stable)
    const modelsToTry = ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-2.5-flash"];

    const tryRequest = async (modelIndex = 0, retryCount = 2, delay = 2000) => {
      const modelName = modelsToTry[modelIndex];
      try {
        const model = genAI.getGenerativeModel({ model: modelName, systemInstruction });
        const chat = model.startChat({
          history: formattedHistory,
          tools,
          toolConfig: { functionCallingConfig: { mode: "AUTO" } },
        });

        const result = await chat.sendMessage(lastMessage.content);
        return await result.response;
      } catch (err) {
        // If it's a 503 (Busy), 429 (Rate Limit), or 404 (wrong name)
        if ((err.status === 503 || err.status === 429) && retryCount > 0) {
          console.warn(`Gemini ${modelName} Busy/Limit (${err.status}). Retrying in ${delay}ms...`);
          await new Promise(r => setTimeout(r, delay));
          return tryRequest(modelIndex, retryCount - 1, delay * 2);
        }

        // Try the next model in the chain
        if (modelIndex < modelsToTry.length - 1) {
          console.warn(`Switching from ${modelName} due to ${err.status}. Trying ${modelsToTry[modelIndex+1]}`);
          return tryRequest(modelIndex + 1, 2, 1000);
        }

        throw err;
      }
    };

    let response;
    try {
      response = await tryRequest();
    } catch (finalErr) {
      console.error("AI Chat Final Fallback Failure:", finalErr);
      return new Response(JSON.stringify({ 
        text: "The AI is currently experiencing high traffic. Please try sending your message again in a few seconds.",
        toolData: null 
      }), { status: 200, headers: { "Content-Type": "application/json" } });
    }

    // Extract Function Calls
    const functionCalls = response.functionCalls();
    let toolData = null;
    
    if (functionCalls && functionCalls.length > 0) {
      toolData = functionCalls[0].args;
    }

    const text = response.text();

    return new Response(JSON.stringify({ 
      text: text,
      toolData: toolData 
    }), { 
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Gemini Chat API Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
