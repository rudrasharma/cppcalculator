// src/utils/compression.js

/**
 * Compresses the earnings object into a URL-safe string.
 * Format: [Base36 Offset][Stream of Base36 values]
 * * @param {Object} earningsObj - { 2020: 50000, 2021: 55000 }
 * @param {number} birthYear - User's birth year
 * @returns {string} - Compressed string (e.g. "a1f2g...")
 */
export const compressEarnings = (earningsObj, birthYear) => {
    const years = Object.keys(earningsObj).map(Number).sort((a,b) => a-b);
    if (years.length === 0) return '';

    const startAge18 = birthYear + 18;
    const firstDataYear = years[0];
    
    // Calculate offset from age 18.
    // Example: If user turned 18 in 2000, but data starts in 2005, offset is 5.
    const offset = Math.max(0, firstDataYear - startAge18);
    
    // Header is the offset in Base36 (0-9, a-z)
    const header = offset.toString(36); 

    const lastYear = years[years.length - 1];
    let stream = "";
    
    for (let y = firstDataYear; y <= lastYear; y++) {
        let val = earningsObj[y] || 0;
        
        // Cap value to save space (max possible CPP earnings is rarely > $130k currently)
        if (val > 129500) val = 129500;
        
        // Compression: Divide by 100 to remove cents/precision, convert to Base36
        // This reduces "55000" -> "550" -> "fa" (2 chars)
        let compressed = Math.floor(val / 100).toString(36);
        
        // Pad to ensure every year is exactly 2 characters
        if (compressed.length < 2) compressed = '0' + compressed; 
        
        stream += compressed;
    }
    
    return header + stream; 
};

/**
 * Decompresses the URL string back into an earnings object.
 * * @param {string} str - The compressed string from URL
 * @param {number} birthYear - User's birth year needed to reconstruct years
 * @returns {Object} - { 2020: 50000, ... }
 */
export const decompressEarnings = (str, birthYear) => {
    if (!str || str.length < 3) return {};
    
    const startAge18 = birthYear + 18;
    
    // 1. Extract offset (first char)
    const offsetChar = str.charAt(0);
    const offset = parseInt(offsetChar, 36);
    
    const startYear = startAge18 + offset;
    const dataString = str.slice(1);
    const result = {};
    
    // 2. Parse 2-char chunks
    for (let i = 0; i < dataString.length; i += 2) {
        const chunk = dataString.substr(i, 2);
        const val = parseInt(chunk, 36);
        
        if (val > 0) {
            // Reconstruct: Multiply by 100 to get back to dollars
            result[startYear + (i / 2)] = val * 100;
        }
    }
    return result;
};