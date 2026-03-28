// src/config/constants.js

/**
 * Centralized Application Year
 * All calculators and SEO templates should reference this constant
 */
export const CURRENT_APP_YEAR = "2026";

/**
 * Retirement (CPP/OAS) 2026 Maximums
 * Estimates based on ~2.5% indexation where final 2026 numbers are not yet legislated
 */
export const RETIREMENT_2026 = {
    MAX_BASE_CPP: 1398.71, // Estimate (2.5% increase from 2025: 1364.60 * 1.025)
    MAX_OAS: 745.86,       // Estimate (2.5% increase from 2025: 727.67 * 1.025)
    YMPE: 73100,           // From YMPE_DATA history in utils/constants.js
    YAMPE: 83334,          // 1.14 * YMPE
    OAS_CLAWBACK_THRESHOLD: 95790, // Estimate (1.025 * 93454)
};

/**
 * Employment Insurance (EI) / Parental Leave 2026
 * Rates and Maximums for Canada (excluding QC)
 */
export const EI_2026 = {
    MAX_INSURABLE: 68300,   // Estimate (approx 2.5% increase from 66600)
    QC_MAX_INSURABLE: 100450, // Estimate
    STD_RATE: 0.55,
    EXT_RATE: 0.33,
    MAX_WEEKLY_STD: 723,    // (68300 * 0.55) / 52
    MAX_WEEKLY_EXT: 434,    // (68300 * 0.33) / 52
    STD_INDIVIDUAL_MAX: 35,
    STD_COMBINED_MAX: 40,
    EXT_INDIVIDUAL_MAX: 61,
    EXT_COMBINED_MAX: 69,
};

/**
 * Canada Child Benefit (CCB) 2026-2027 Year
 * Based on July 2026 indexation
 */
export const CCB_2026 = {
    MAX_UNDER_6: 8197,     // Estimate (1.025 * 7997)
    MAX_6_TO_17: 6917,     // Estimate (1.025 * 6748)
    THRESHOLD_1: 38424,    // Estimate
    THRESHOLD_2: 83253,    // Estimate
};
