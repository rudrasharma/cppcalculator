export const prerender = false; // Ensure this runs on the server, not at build time

export async function GET() {
    try {
        // 1. Fetch Official Data from Bank of Canada (Valet API)
        // Series V80691335 = Chartered Bank 5-Year Conventional Mortgage (Posted Rate)
        // Series V80691311 = Chartered Bank Prime Rate
        const url = "https://www.bankofcanada.ca/valet/observations/V80691335,V80691311/json?recent=1";
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Bank of Canada API failed');
        }

        const data = await response.json();
        
        // 2. Extract the raw numbers (most recent observation)
        const observation = data.observations[data.observations.length - 1];
        const postedRate = parseFloat(observation.V80691335.v);
        const primeRate = parseFloat(observation.V80691311.v);

        // 3. Calculate "Street Rates" (The Discounted Market Rates)
        // Fixed: Typically ~2.10% below the Posted Rate
        // Variable: Typically Prime - 0.90% to 1.00%
        const estimatedFixed = (postedRate - 2.10).toFixed(2);
        const estimatedVariable = (primeRate - 1.00).toFixed(2);

        return new Response(JSON.stringify({
            fixed5Year: parseFloat(estimatedFixed),
            variable5Year: parseFloat(estimatedVariable),
            primeRate: primeRate,
            postedRate: postedRate,
            effectiveDate: observation.d,
            source: "Bank of Canada (Valet API)"
        }), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });

    } catch (error) {
        console.error("Rate Fetch Error:", error);
        
        // Fallback to Jan 2026 constants if API fails
        return new Response(JSON.stringify({
            fixed5Year: 3.99,
            variable5Year: 3.45,
            primeRate: 4.45,
            postedRate: 6.09,
            source: "Fallback Data"
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    }
}