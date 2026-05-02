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
    BPA_MAX_THRESHOLD: 181440,
    BPA_PHASE_OUT_MAX: 258482,
    BRACKETS: [
      { threshold: 58523, rate: 0.15 },
      { threshold: 117045, rate: 0.205 },
      { threshold: 181440, rate: 0.26 },
      { threshold: 258482, rate: 0.29 },
      { threshold: Infinity, rate: 0.33 }
    ]
  },

  // Provincial Tax Data (2026)
  PROVINCIAL_TAX: {
    ON: {
      NAME: "Ontario",
      BPA: 12630,
      BRACKETS: [
        { threshold: 53891, rate: 0.0505 },
        { threshold: 107785, rate: 0.0915 },
        { threshold: 150000, rate: 0.1116 },
        { threshold: 220000, rate: 0.1216 },
        { threshold: Infinity, rate: 0.1316 }
      ],
      SURTAX: [
        { threshold: 5818, rate: 0.20 },
        { threshold: 7446, rate: 0.36 }
      ]
    },
    BC: {
      NAME: "British Columbia",
      BPA: 13216,
      BRACKETS: [
        { threshold: 50363, rate: 0.0506 },
        { threshold: 100728, rate: 0.0770 },
        { threshold: 115648, rate: 0.1050 },
        { threshold: 140413, rate: 0.1229 },
        { threshold: 182759, rate: 0.1470 },
        { threshold: 258285, rate: 0.1680 },
        { threshold: Infinity, rate: 0.2050 }
      ]
    },
    AB: {
      NAME: "Alberta",
      BPA: 22769,
      BRACKETS: [
        { threshold: 154259, rate: 0.10 },
        { threshold: 185111, rate: 0.12 },
        { threshold: 246814, rate: 0.13 },
        { threshold: 370221, rate: 0.14 },
        { threshold: Infinity, rate: 0.15 }
      ]
    },
    QC: {
      NAME: "Quebec",
      BPA: 18952,
      BRACKETS: [
        { threshold: 54345, rate: 0.14 },
        { threshold: 108680, rate: 0.19 },
        { threshold: 132245, rate: 0.24 },
        { threshold: Infinity, rate: 0.2575 }
      ],
      ABATEMENT: 0.165 // Quebec Abatement on federal tax
    },
    NS: {
        NAME: "Nova Scotia",
        BPA: 11932,
        BRACKETS: [
          { threshold: 30995, rate: 0.0879 },
          { threshold: 61991, rate: 0.1495 },
          { threshold: 97417, rate: 0.1667 },
          { threshold: 160416, rate: 0.1750 },
          { threshold: Infinity, rate: 0.2100 }
        ]
    },
    MB: {
        NAME: "Manitoba",
        BPA: 15780,
        BRACKETS: [
          { threshold: 47000, rate: 0.108 },
          { threshold: 100000, rate: 0.1275 },
          { threshold: Infinity, rate: 0.174 }
        ]
    },
    SK: {
        NAME: "Saskatchewan",
        BPA: 20381,
        BRACKETS: [
          { threshold: 54532, rate: 0.105 },
          { threshold: 155805, rate: 0.125 },
          { threshold: Infinity, rate: 0.145 }
        ]
    },
    NB: {
        NAME: "New Brunswick",
        BPA: 14114,
        BRACKETS: [
          { threshold: 52333, rate: 0.094 },
          { threshold: 104666, rate: 0.14 },
          { threshold: 193861, rate: 0.16 },
          { threshold: Infinity, rate: 0.195 }
        ]
    },
    NL: {
        NAME: "Newfoundland and Labrador",
        BPA: 11067,
        BRACKETS: [
          { threshold: 44192, rate: 0.087 },
          { threshold: 88382, rate: 0.145 },
          { threshold: 157792, rate: 0.158 },
          { threshold: 220907, rate: 0.178 },
          { threshold: 288636, rate: 0.198 },
          { threshold: 577271, rate: 0.208 },
          { threshold: 1154541, rate: 0.213 },
          { threshold: Infinity, rate: 0.218 }
        ]
    },
    PE: {
        NAME: "Prince Edward Island",
        BPA: 15000,
        BRACKETS: [
          { threshold: 33928, rate: 0.095 },
          { threshold: 65820, rate: 0.1347 },
          { threshold: 106890, rate: 0.166 },
          { threshold: 200000, rate: 0.18 },
          { threshold: Infinity, rate: 0.20 }
        ]
    }
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
