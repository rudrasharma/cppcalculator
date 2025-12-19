// src/utils/constants.js

export const CURRENT_YEAR = new Date().getFullYear();

// ==========================================
//           2025 MAXIMUMS & LIMITS
// ==========================================
// Source: CRA / Service Canada 2025 Announcements
export const MAX_BASE_CPP_2025 = 1364.60;
export const MAX_OAS_2025 = 727.67; 
export const OAS_CLAWBACK_THRESHOLD_2025 = 93454;

// ==========================================
//               YMPE HISTORY
// ==========================================
// Year's Maximum Pensionable Earnings
export const YMPE_DATA = {
    // --- Future Projections (Estimated at ~2.5% growth) ---
    2030: 80600, 
    2029: 78700, 
    2028: 76800, 
    2027: 74900, 
    2026: 73100,
    
    // --- Confirmed Historical Data ---
    2025: 71300,
    2024: 68500,
    2023: 66600,
    2022: 64900,
    2021: 61600,
    2020: 58700,
    2019: 57400,
    2018: 55900,
    2017: 55300,
    2016: 54900,
    2015: 53600,
    2014: 52500,
    2013: 51100,
    2012: 50100,
    2011: 48300,
    2010: 47200,
    2009: 46300,
    2008: 44900,
    2007: 43700,
    2006: 42100,
    2005: 41100,
    2004: 40500,
    2003: 39900,
    2002: 39100,
    2001: 38300,
    2000: 37600,
    1999: 37400,
    1998: 36900,
    1997: 35800,
    1996: 35400,
    1995: 34900,
    1994: 34400,
    1993: 33400,
    1992: 32200,
    1991: 30500,
    1990: 28900,
    1989: 27700,
    1988: 26500,
    1987: 25900,
    1986: 25800,
    1985: 23400,
    1984: 20800,
    1983: 18500,
    1982: 16500,
    1981: 14700,
    1980: 13100,
    1979: 11700,
    1978: 10400,
    1977: 9300,
    1976: 8300,
    1975: 7400,
    1974: 6600,
    1973: 5900,
    1972: 5500,
    1971: 5400,
    1970: 5300,
    1969: 5200,
    1968: 5100,
    1967: 5000,
    1966: 5000 
};

// ==========================================
//           GIS PARAMETERS (2025)
// ==========================================
// Based on Jan-Mar 2025 Benefit Amounts
export const GIS_PARAMS = {
    SINGLE: { 
        max: 1086.88, 
        limit: 22056, 
        rate: 0.50 
    },
    MARRIED_SPOUSE_OAS: { 
        max: 665.41, 
        limit: 29136, 
        rate: 0.25 
    },
    MARRIED_SPOUSE_NO_OAS: { 
        max: 1086.88, 
        limit: 52848, 
        rate: 0.25 
    },
    MARRIED_SPOUSE_ALLOWANCE: { 
        max: 665.41, 
        limit: 40800, 
        rate: 0.25 
    }
};

// ==========================================
//             HELPER FUNCTIONS
// ==========================================

/**
 * Gets the YMPE for a specific year.
 * Handles historical lookup, future projection, and pre-1966 fallbacks.
 */
export const getYMPE = (year) => {
    // 1. Check Historical Data
    if (YMPE_DATA[year]) return YMPE_DATA[year];

    // 2. Future Projection (> 2030)
    // Assumes 2.5% annual growth for conservative estimation
    if (year > 2030) {
        return Math.round(80600 * Math.pow(1.025, year - 2030));
    }

    // 3. Pre-1966 Logic
    // CPP didn't exist, but for math safety we return the baseline
    if (year < 1966) {
        return 5000; 
    }
    
    return 5000; // Fallback
};

/**
 * Gets the YAMPE (Year's Additional Maximum Pensionable Earnings)
 * This is the "Second Ceiling" introduced in Phase 2 of the enhancement.
 */
export const getYAMPE = (year) => {
    // YAMPE did not exist before 2024
    if (year < 2024) return 0;

    // 2024 was the transition year (~107% of YMPE)
    if (year === 2024) return 73200;

    // 2025+ is fully phased in (~114% of YMPE)
    if (year === 2025) return 81200;

    // Future calculation: Fixed at ~1.14x the YMPE
    const ympe = getYMPE(year);
    return Math.round(ympe * 1.14);
};