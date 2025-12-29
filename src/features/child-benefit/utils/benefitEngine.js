// ==========================================
//              CONSTANTS (2025/2026 Benefit Year)
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

export const CDB_PARAMS = { MAX_AMOUNT: 3411, THRESHOLD: 81222 };

export const GST_PARAMS = {
    ADULT_AMOUNT: 366, CHILD_AMOUNT: 192, SUPPLEMENT_MAX: 192,
    SUPPLEMENT_THRESHOLD: 11856, THRESHOLD: 46582, REDUCTION_RATE: 0.05
};

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
        AMOUNTS: [2188, 1375, 1125], THRESHOLD: 35902, REDUCTION_RATE: 0.04, 
        // BC has its own carbon tax, but uses CAIP structure for federal. 
        // For simplicity using Fed rates or null if handled purely provincially. 
        // BC residents actually get 'Climate Action Tax Credit' via province, not Fed CAIP.
        // We will leave CAIP null for BC to avoid double counting if they get provincial credit separately.
        CAIP: null 
    },
    QC: {
        NAME: "Family Allowance",
        FAM_ALLOW: { MAX: 3006, SINGLE_SUPP: 1055, THRESHOLD_COUPLE: 59369, THRESHOLD_SINGLE: 43280, RATE: 0.04 },
        CAIP: null 
    },
    // ADDED: Missing CAIP Rates for other provinces (2024-2025 Base Rates)
    SK: { NAME: "Saskatchewan Child Benefit", CAIP: { ADULT: 188, SPOUSE: 94, CHILD: 47 } },
    MB: { NAME: "Manitoba Child Benefit", CAIP: { ADULT: 150, SPOUSE: 75, CHILD: 37.5 } },
    NS: { NAME: "Nova Scotia Child Benefit", CAIP: { ADULT: 103, SPOUSE: 51.5, CHILD: 25.75 } },
    NB: { NAME: "New Brunswick Child Tax", CAIP: { ADULT: 95, SPOUSE: 47.5, CHILD: 23.75 } },
    NL: { NAME: "Newfoundland Child Benefit", CAIP: { ADULT: 164, SPOUSE: 82, CHILD: 41 } },
    PE: { NAME: "PEI Child Benefit", CAIP: { ADULT: 110, SPOUSE: 55, CHILD: 27.5 } },
    
    OTHER: { NAME: "Provincial Benefit", CAIP: null }
};

// ==========================================
//              CALCULATION ENGINE
// ==========================================
export const calculateAll = (netInc = 0, childList = [], isShared = false, provCode = 'ON', status = 'MARRIED', rural = false) => {
    const totalChildren = childList.length;

    // 1. Federal CCB
    let fedMax = 0;
    childList.forEach(c => {
        if (c.age < 6) fedMax += CCB_PARAMS.MAX_UNDER_6;
        else if (c.age < 18) fedMax += CCB_PARAMS.MAX_6_TO_17;
        if (c.disability && c.age < 18) {
            let db = CDB_PARAMS.MAX_AMOUNT;
            if (netInc > CDB_PARAMS.THRESHOLD) db = Math.max(0, db - (netInc - CDB_PARAMS.THRESHOLD) * 0.02);
            fedMax += db;
        }
    });

    let fedReduction = 0;
    if (totalChildren > 0) {
        const rateKey = Math.min(totalChildren, 4);
        const rateData = CCB_PARAMS.PHASE_OUT[rateKey] || CCB_PARAMS.PHASE_OUT[4];
        const { t1, t2 } = rateData;
        if (netInc > CCB_PARAMS.THRESHOLD_2) fedReduction = ((CCB_PARAMS.THRESHOLD_2 - CCB_PARAMS.THRESHOLD_1) * t1) + ((netInc - CCB_PARAMS.THRESHOLD_2) * t2);
        else if (netInc > CCB_PARAMS.THRESHOLD_1) fedReduction = (netInc - CCB_PARAMS.THRESHOLD_1) * t1;
    }
    let federalNet = Math.max(0, fedMax - fedReduction);

    // 2. GST
    let gstAdd = (status === 'MARRIED') ? (GST_PARAMS.ADULT_AMOUNT + (totalChildren * GST_PARAMS.CHILD_AMOUNT)) : (totalChildren > 0 ? (GST_PARAMS.ADULT_AMOUNT + (totalChildren - 1) * GST_PARAMS.CHILD_AMOUNT) : Math.max(0, Math.min(GST_PARAMS.SUPPLEMENT_MAX, (netInc - GST_PARAMS.SUPPLEMENT_THRESHOLD) * 0.02)));
    let gstTotal = Math.max(0, (GST_PARAMS.ADULT_AMOUNT + gstAdd) - (netInc > GST_PARAMS.THRESHOLD ? (netInc - GST_PARAMS.THRESHOLD) * GST_PARAMS.REDUCTION_RATE : 0));

    // 3. Carbon (CAIP) - QC gets 0
    let caip = 0;
    if (provCode !== 'QC' && provCode !== 'BC') {
        const provData = PROV_PARAMS[provCode] || PROV_PARAMS['OTHER'];
        if (provData && provData.CAIP) {
            const rates = provData.CAIP;
            let quarterly = rates.ADULT + (status === 'MARRIED' ? rates.SPOUSE : 0) + (totalChildren * rates.CHILD);
            if (rural) quarterly *= 1.20;
            caip = quarterly * 4;
        }
    }

    // 4. Provincial Benefits
    let provNet = 0;
    let provName = PROV_PARAMS[provCode]?.NAME || "Provincial Support";

    if (provCode === 'ON') {
        if (totalChildren > 0) {
            const ocb = (PROV_PARAMS.ON.OCB.MAX * totalChildren);
            const ocbRed = netInc > PROV_PARAMS.ON.OCB.THRESHOLD ? (netInc - PROV_PARAMS.ON.OCB.THRESHOLD) * PROV_PARAMS.ON.OCB.RATE : 0;
            provNet += Math.max(0, ocb - ocbRed);
        }
        const ostcRate = PROV_PARAMS.ON.OSTC;
        let ostcMax = ostcRate.MAX; 
        if (status === 'MARRIED') ostcMax += ostcRate.MAX; 
        ostcMax += (totalChildren * ostcRate.MAX); 
        
        const ostcThreshold = (status === 'SINGLE' && totalChildren === 0) ? ostcRate.THRESHOLD_SINGLE : ostcRate.THRESHOLD_FAM;
        const ostcRed = netInc > ostcThreshold ? (netInc - ostcThreshold) * ostcRate.RATE : 0;
        provNet += Math.max(0, ostcMax - ostcRed);

    } else if (provCode === 'AB') {
        if (totalChildren > 0) {
            const p = PROV_PARAMS.AB;
            let baseMax = 0;
            p.BASE.AMOUNTS.forEach((amt, i) => { if(i < totalChildren) baseMax += amt; });
            const baseRate = p.BASE.RATES[Math.min(totalChildren, 4) - 1];
            const baseNet = Math.max(0, baseMax - (netInc > p.BASE.THRESHOLD ? (netInc - p.BASE.THRESHOLD) * baseRate : 0));

            let workingMax = 0;
            p.WORKING.AMOUNTS.forEach((amt, i) => { if(i < totalChildren) workingMax += amt; });
            
            let workingNet = 0;
            if (netInc > p.WORKING.THRESHOLD) {
                  let phasedIn = (netInc - p.WORKING.THRESHOLD) * p.WORKING.RATE_IN;
                  workingNet = Math.min(phasedIn, workingMax);
                  if (netInc > p.WORKING.CAP) {
                    const reduction = (netInc - p.WORKING.CAP) * p.WORKING.RATE_OUT;
                    workingNet = Math.max(0, workingNet - reduction);
                  }
            }
            provNet = baseNet + workingNet;
        }

    } else if (provCode === 'QC') {
        if (totalChildren > 0) {
            const q = PROV_PARAMS.QC.FAM_ALLOW;
            let qMax = (totalChildren * q.MAX);
            if (status === 'SINGLE') qMax += q.SINGLE_SUPP;

            const qThreshold = status === 'SINGLE' ? q.THRESHOLD_SINGLE : q.THRESHOLD_COUPLE;
            const qRed = netInc > qThreshold ? (netInc - qThreshold) * q.RATE : 0;
            provNet += Math.max(0, qMax - qRed);
        }

    } else if (provCode === 'BC') {
        if (totalChildren > 0) {
            const p = PROV_PARAMS.BC;
            let max = 0; p.AMOUNTS.forEach((amt, i) => { if(i < totalChildren) max += amt; });
            provNet = Math.max(0, max - (netInc > p.THRESHOLD ? (netInc - p.THRESHOLD) * p.REDUCTION_RATE : 0));
        }
    }

    if (isShared) { federalNet *= 0.5; provNet *= 0.5; }
    const total = federalNet + provNet + gstTotal + caip;
    return { federal: federalNet, provincial: provNet, gst: gstTotal, caip, total, monthly: total / 12, provName };
};

