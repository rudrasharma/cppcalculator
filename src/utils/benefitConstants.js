/**
 * Benefit calculation constants
 * Separated for better maintainability
 */

// ==========================================
//              CCB PARAMETERS (2025/2026)
// ==========================================
export const CCB_PARAMS = {
    MAX_UNDER_6: 7997, 
    MAX_6_TO_17: 6748, 
    THRESHOLD_1: 37487,
    THRESHOLD_2: 81222,
    PHASE_OUT: {
        1: { t1: 0.07, t2: 0.032 },
        2: { t1: 0.135, t2: 0.057 },
        3: { t1: 0.19, t2: 0.08 },
        4: { t1: 0.23, t2: 0.095 }
    }
};

export const CDB_PARAMS = { 
    MAX_AMOUNT: 3411, 
    THRESHOLD: 81222 
};

export const GST_PARAMS = {
    ADULT_AMOUNT: 366, 
    CHILD_AMOUNT: 192, 
    SUPPLEMENT_MAX: 192,
    SUPPLEMENT_THRESHOLD: 11856, 
    THRESHOLD: 46582, 
    REDUCTION_RATE: 0.05
};

// ==========================================
//              PROVINCIAL PARAMETERS
// ==========================================
export const PROV_PARAMS = {
    ON: { 
        NAME: "Ontario Child & Trillium", 
        OCB: { MAX: 1803, THRESHOLD: 26343, RATE: 0.08 },
        OSTC: { MAX: 371, THRESHOLD_SINGLE: 28506, THRESHOLD_FAM: 35632, RATE: 0.04 },
        CAIP: { ADULT: 140, SPOUSE: 70, CHILD: 35 } 
    },
    AB: { 
        NAME: "Alberta Child & Family", 
        BASE: { AMOUNTS: [1499, 749, 749, 749], THRESHOLD: 27565, RATES: [0.0312, 0.0935, 0.1559, 0.2183] },
        WORKING: { AMOUNTS: [767, 698, 418, 138], THRESHOLD: 2760, CAP: 46191, RATE_IN: 0.15, RATE_OUT: 0.15 }, 
        CAIP: { ADULT: 225, SPOUSE: 112.5, CHILD: 56.25 } 
    },
    BC: { 
        NAME: "BC Family Benefit", 
        AMOUNTS: [2188, 1375, 1125], 
        THRESHOLD: 35902, 
        REDUCTION_RATE: 0.04, 
        CAIP: null 
    },
    QC: {
        NAME: "Family Allowance",
        FAM_ALLOW: { MAX: 3006, SINGLE_SUPP: 1055, THRESHOLD_COUPLE: 59369, THRESHOLD_SINGLE: 43280, RATE: 0.04 },
        CAIP: null 
    },
    SK: { NAME: "Saskatchewan Child Benefit", CAIP: { ADULT: 188, SPOUSE: 94, CHILD: 47 } },
    MB: { NAME: "Manitoba Child Benefit", CAIP: { ADULT: 150, SPOUSE: 75, CHILD: 37.5 } },
    NS: { NAME: "Nova Scotia Child Benefit", CAIP: { ADULT: 103, SPOUSE: 51.5, CHILD: 25.75 } },
    NB: { NAME: "New Brunswick Child Tax", CAIP: { ADULT: 95, SPOUSE: 47.5, CHILD: 23.75 } },
    NL: { NAME: "Newfoundland Child Benefit", CAIP: { ADULT: 164, SPOUSE: 82, CHILD: 41 } },
    PE: { NAME: "PEI Child Benefit", CAIP: { ADULT: 110, SPOUSE: 55, CHILD: 27.5 } },
    OTHER: { NAME: "Provincial Benefit", CAIP: null }
};

// ==========================================
//              EI/PARENTAL LEAVE (2025)
// ==========================================
export const EI_2025 = {
    MAX_INSURABLE: 66600,
    QC_MAX_INSURABLE: 98000, 
    STD_RATE: 0.55,
    EXT_RATE: 0.33,
    MAX_WEEKLY_STD: 705, 
    MAX_WEEKLY_EXT: 423, 
    STD_INDIVIDUAL_MAX: 35,
    STD_COMBINED_MAX: 40,
    EXT_INDIVIDUAL_MAX: 61,
    EXT_COMBINED_MAX: 69,
};

