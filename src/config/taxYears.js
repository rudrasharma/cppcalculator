// src/config/taxYears.js

/**
 * 2026 Centralized Financial Constants
 * Source: CRA / Service Canada
 */
export const TAX_YEAR_CONFIG = {
  CURRENT_APP_YEAR: "2026",
  
  // Canada Pension Plan (CPP)
  CPP: {
    YMPE: 74600,         // First Earnings Ceiling
    YAMPE: 85000,        // Second Earnings Ceiling
    RATE: 0.0595,        // Employee/Employer Rate (Base + First Enhancement)
    RATE_CPP2: 0.04,     // Second Enhancement Rate
    BASIC_EXEMPTION: 3500,
    MAX_MONTHLY_BENEFIT: 1421.45 // Estimated (1.0414 * 1364.60 approx)
  },

  // Employment Insurance (EI) / Parental Leave
  EI: {
    MIE: 68900,          // Maximum Insurable Earnings (2026 Official)
    RATE: 0.0163,        // Employee rate (outside Quebec)
    MAX_WEEKLY_BEN_STD: 729, // Official 2026 (68900 * 0.55 / 52)
    STD_RATE: 0.55,
    EXT_RATE: 0.33,
    MAX_WEEKLY_BEN_EXT: 437, // Official 2026 (68900 * 0.33 / 52)
    QC_MIE: 101000,      // QPIP Maximum
  },

  // Federal Income Tax
  FEDERAL_TAX: {
    BPA: 16452,           // Basic Personal Amount
    BRACKETS: [
      { threshold: 58523, rate: 0.15 },
      { threshold: 117045, rate: 0.205 },
      { threshold: 181440, rate: 0.26 },
      { threshold: 258482, rate: 0.29 },
      { threshold: Infinity, rate: 0.33 }
    ]
  },

  // Old Age Security (OAS)
  OAS: {
    MAX_MONTHLY: 758.20, // Estimated
    CLAWBACK_THRESHOLD: 97500,
    GIS_SINGLE_MAX: 1114.05,
    GIS_COUPLE_MAX: 682.04
  },

  // Canada Child Benefit (CCB) - July 2026 to June 2027
  CCB: {
    MAX_UNDER_6: 8157,
    MAX_6_TO_17: 6883,
    THRESHOLD_1: 38237,
    THRESHOLD_2: 83658
  }
};
