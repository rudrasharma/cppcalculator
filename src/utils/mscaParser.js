// src/utils/mscaParser.js
import { getYMPE, getYAMPE } from './constants';

export const parseMscaData = (text) => {
    if (!text.trim()) return { error: "Empty input", data: null };

    try {
        // 1. Sanitize
        let cleanText = text
            .replace(/[$,]/g, '')
            .replace(/(\d)(19\d{2}|20\d{2})/g, '$1 $2');

        const newEarnings = {};
        let count = 0;

        // 2. Tokenize
        const rows = cleanText.split(/(?=\b(?:19|20)\d{2}\b)/);

        rows.forEach(row => {
            const lowerRow = row.toLowerCase();
            // Skip headers/footers
            if (lowerRow.includes("date modified") || lowerRow.includes("contribution rate")) return;

            const yearMatch = row.match(/\b(19|20)\d{2}\b/);
            if (!yearMatch) return;

            const year = parseInt(yearMatch[0]);
            const nums = row.match(/(\d+(\.\d+)?)/g);

            if (nums) {
                const candidates = nums
                    .map(Number)
                    .filter(n => n !== year && n < 200000); // Filter years & unrealistic numbers

                if (candidates.length > 0) {
                    let val = Math.max(...candidates);

                    // Handle "M" (Max contribution) marker
                    if (row.toUpperCase().includes('M')) {
                        const ympe = getYMPE(year);
                        const yampe = getYAMPE(year);
                        const limit = year >= 2024 ? yampe : ympe;
                        // Only auto-max if the parsed value looks weird (too low) or close to max
                        if (val < 1000 || val > (limit * 0.9)) {
                            val = limit;
                        }
                    }
                    if (val > 0) {
                        newEarnings[year] = Math.round(val);
                        count++;
                    }
                }
            }
        });

        if (count === 0) return { error: "No valid rows found", data: null };
        return { error: null, data: newEarnings, count };

    } catch (e) {
        return { error: "Parser crash", data: null };
    }
};