export const parseMscaData = (text) => {
    const data = {};
    let error = null;

    if (!text || !text.trim()) {
        return { error: "Please paste your data first.", data: null };
    }

    try {
        // 1. Normalize the text: 
        //    - Remove commas (so $68,500 becomes $68500)
        //    - Replace " M " or " S " badges with spaces to avoid confusion
        const cleanText = text.replace(/,/g, '').replace(/\s[MSBE]\s/g, ' ');

        // 2. Regex to find valid rows
        //    Pattern: 
        //    - (19|20)\d{2}  : Finds a year (1900-2099)
        //    - (?=\s*\$)     : LOOKAHEAD (Crucial Fix): Must be followed by a space or $ symbol immediately.
        //                      This ignores "Aug 1987" because it's not followed by a $.
        const yearRegex = /(19|20)\d{2}(?=\s*\$)/g;
        
        // Find all starting indices of valid years
        let match;
        const yearMatches = [];
        while ((match = yearRegex.exec(cleanText)) !== null) {
            yearMatches.push({ year: parseInt(match[0]), index: match.index });
        }

        if (yearMatches.length === 0) {
            return { error: "No valid earnings rows found. Ensure you copied the entire table.", data: null };
        }

        // 3. Process each year block
        yearMatches.forEach((current, i) => {
            const next = yearMatches[i + 1];
            // Extract the substring for this row (from this year to the next year)
            const rowText = cleanText.substring(current.index, next ? next.index : undefined);

            // Find all money values in this row (e.g., $143.82, $4072.00)
            const moneyRegex = /\$(\d+)(\.\d{2})?/g;
            const amounts = [];
            let moneyMatch;
            while ((moneyMatch = moneyRegex.exec(rowText)) !== null) {
                // Parse float from the captured group
                amounts.push(parseFloat(moneyMatch[1] + (moneyMatch[2] || "")));
            }

            if (amounts.length > 0) {
                // HEURISTIC: The "Pensionable Earnings" is always the largest dollar value in the row.
                // Contributions are small (~5%), Earnings are large (~100%).
                const pensionableEarnings = Math.max(...amounts);
                
                // Safety check: Ignore absurdly low numbers (e.g. $0 rows unless explicit)
                // or super high errors. 
                if (pensionableEarnings >= 0 && pensionableEarnings < 1000000) {
                    data[current.year] = Math.round(pensionableEarnings);
                }
            }
        });

        return { error: null, data };

    } catch (err) {
        console.error("Parse Error:", err);
        return { error: "Failed to parse data structure. Please try again.", data: null };
    }
};