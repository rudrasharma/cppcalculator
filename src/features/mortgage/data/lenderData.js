export const LENDERS = {
    // --- BIG 5 BANKS (High Penalty Risk) ---
    RBC: { label: "RBC Royal Bank", type: "BIG_BANK", postedGap: 2.0, risk: "High Risk" },
    TD: { label: "TD Canada Trust", type: "BIG_BANK", postedGap: 1.85, risk: "High Risk" },
    SCOTIA: { label: "Scotiabank", type: "BIG_BANK", postedGap: 1.70, risk: "High Risk" },
    BMO: { label: "BMO Bank of Montreal", type: "BIG_BANK", postedGap: 1.80, risk: "High Risk" },
    CIBC: { label: "CIBC", type: "BIG_BANK", postedGap: 1.90, risk: "High Risk" },
    NATIONAL: { label: "National Bank", type: "BIG_BANK", postedGap: 1.80, risk: "High Risk" },
    HSBC: { label: "HSBC (RBC)", type: "BIG_BANK", postedGap: 2.0, risk: "High Risk" },

    // --- MONOLINE LENDERS (Fair Penalty / Low Risk) ---
    MCAP: { label: "MCAP", type: "MONOLINE", postedGap: 0, risk: "Fair Penalty" },
    FIRST_NATIONAL: { label: "First National", type: "MONOLINE", postedGap: 0, risk: "Fair Penalty" },
    RFA: { label: "RFA Mortgage", type: "MONOLINE", postedGap: 0, risk: "Fair Penalty" },
    CMLS: { label: "CMLS Financial", type: "MONOLINE", postedGap: 0, risk: "Fair Penalty" },
    MERIX: { label: "Merix Financial", type: "MONOLINE", postedGap: 0, risk: "Fair Penalty" },
    LENDWISE: { label: "Lendwise", type: "MONOLINE", postedGap: 0, risk: "Fair Penalty" },
    RADIUS: { label: "Radius Financial", type: "MONOLINE", postedGap: 0, risk: "Fair Penalty" },
    STREET: { label: "Street Capital (RFA)", type: "MONOLINE", postedGap: 0, risk: "Fair Penalty" },
    PARADIGM: { label: "Paradigm Quest", type: "MONOLINE", postedGap: 0, risk: "Fair Penalty" },
    
    // --- CREDIT UNIONS & OTHERS (Usually Fair, Mixed) ---
    DESJARDINS: { label: "Desjardins", type: "MONOLINE", postedGap: 0, risk: "Generally Fair" },
    MERIDIAN: { label: "Meridian Credit Union", type: "MONOLINE", postedGap: 0, risk: "Generally Fair" },
    COAST_CAPITAL: { label: "Coast Capital", type: "MONOLINE", postedGap: 0, risk: "Generally Fair" },
    VANCITY: { label: "Vancity", type: "MONOLINE", postedGap: 0, risk: "Generally Fair" },
    SIMPLII: { label: "Simplii (CIBC)", type: "BIG_BANK", postedGap: 1.90, risk: "High Risk" },
    TANGERINE: { label: "Tangerine (Scotiabank)", type: "MONOLINE", postedGap: 0, risk: "Fair Penalty" }, // Tangerine uses fair penalty usually
    MANULIFE: { label: "Manulife Bank", type: "BIG_BANK", postedGap: 1.5, risk: "Medium Risk" },
    ATB: { label: "ATB Financial", type: "BIG_BANK", postedGap: 1.5, risk: "Medium Risk" },

    // --- GENERICS ---
    OTHER_BIG: { label: "Other Big Bank", type: "BIG_BANK", postedGap: 1.8, risk: "High Risk" },
    OTHER_FAIR: { label: "Other Fair Lender", type: "MONOLINE", postedGap: 0, risk: "Fair Penalty" }
};

// Helper to get grouped options for the UI
export const getLenderOptions = () => {
    const groups = {
        "Big Banks (High Penalty Risk)": [],
        "Monoline Lenders (Fair Penalty)": [],
        "Credit Unions & Others": [],
        "Generic": []
    };

    Object.entries(LENDERS).forEach(([key, data]) => {
        const option = { label: data.label, value: key };
        
        if (["OTHER_BIG", "OTHER_FAIR"].includes(key)) {
            groups["Generic"].push(option);
        } else if (data.type === "BIG_BANK") {
            groups["Big Banks (High Penalty Risk)"].push(option);
        } else if (data.type === "MONOLINE" && ["DESJARDINS", "MERIDIAN", "COAST_CAPITAL", "VANCITY", "TANGERINE"].includes(key)) {
            groups["Credit Unions & Others"].push(option);
        } else {
            groups["Monoline Lenders (Fair Penalty)"].push(option);
        }
    });

    return Object.entries(groups).map(([label, options]) => ({ label, options }));
};