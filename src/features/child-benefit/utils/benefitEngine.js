// src/features/child-benefit/utils/benefitEngine.js
import { CCB_PARAMS, CDB_PARAMS, GST_PARAMS, PROV_PARAMS } from './constants.js';

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
