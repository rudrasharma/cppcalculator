import { GoogleGenerativeAI } from "@google/generative-ai";

export const prerender = false;

export async function POST({ request }) {
    try {
        const body = await request.json();
        const { image } = body;

        if (!image) {
            return new Response(JSON.stringify({ error: "Missing image data" }), { status: 400 });
        }

        // Initialize Gemini
        const apiKey = import.meta.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return new Response(JSON.stringify({ error: "Gemini API key is not configured on the server." }), { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        // Using gemini-1.5-flash for speed with multimodal tasks
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Parse base64 string
        // format: data:image/jpeg;base64,...
        const mimeType = image.match(/data:(.*?);base64/)[1];
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

        const prompt = `
        You are an expert financial analyst. Analyze the provided bank or credit card statement image.
        Extract all visible financial transactions. 
        Ignore any blurred, blacked-out, or censored regions—do not attempt to guess them.

        Format your response EXACTLY as a JSON object matching this schema:
        {
          "transactions": [
            {
              "date": "YYYY-MM-DD",
              "cleanName": "Standardized Merchant Name (e.g., 'Walmart' instead of 'WM SUPERCENTER #1234')",
              "amount": Number (positive for expenses, negative for income/refunds),
              "category": "String (e.g., 'Housing', 'Food & Groceries', 'Dining Out', 'Transportation', 'Utilities', 'Recreational', 'Income', 'Other')"
            }
          ],
          "insights": [
            "Provide 2-3 specific, actionable text insights on how the user could optimize their spending based on these exact transactions."
          ],
          "totals": {
            "income": Number,
            "expenses": Number (positive total of all expense amounts)
          }
        }

        Return ONLY raw JSON. No markdown formatting, no \`\`\`json block. Just the JSON object.
        `;

        const imagePart = {
            inlineData: {
                data: base64Data,
                mimeType
            }
        };

        const result = await model.generateContent([prompt, imagePart]);
        const responseText = result.response.text();
        
        // Clean up markdown if the AI mistakenly includes it
        const cleanJsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        
        try {
            const parsedData = JSON.parse(cleanJsonStr);
            return new Response(JSON.stringify(parsedData), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } catch (jsonErr) {
            console.error("Failed to parse Gemini JSON output:", responseText);
            return new Response(JSON.stringify({ error: "AI returned invalid data format." }), { status: 500 });
        }

    } catch (error) {
        console.error("Budget Analyzer Error:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
