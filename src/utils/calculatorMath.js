// src/utils/calculatorMath.js
import { TAX_YEAR_CONFIG } from '../config/taxYears.js';
import { getYMPE, getYAMPE, GIS_PARAMS, CURRENT_YEAR } from './constants.js';

/**
 * CORE CCB MATH
 */
export const calculateCCB = (netInc = 0, childList = [], familyStatus = 'MARRIED', provCode = 'ON') => {
    const { CCB: ccbConfig } = TAX_YEAR_CONFIG;
    const totalChildren = childList.length;

    // 1. Federal CCB Base
    let fedMax = 0;
    childList.forEach(c => {
        if (c.age < 6) fedMax += ccbConfig.MAX_UNDER_6;
        else if (c.age < 18) fedMax += ccbConfig.MAX_6_TO_17;
    });

    // 2. Phase out (Clawback)
    const PHASE_OUT = {
        1: { t1: 0.07, t2: 0.032 },
        2: { t1: 0.135, t2: 0.057 },
        3: { t1: 0.19, t2: 0.08 },
        4: { t1: 0.23, t2: 0.095 }
    };

    let fedReduction = 0;
    if (totalChildren > 0) {
        const rateKey = Math.min(totalChildren, 4);
        const { t1, t2 } = PHASE_OUT[rateKey];
        
        if (netInc > ccbConfig.THRESHOLD_2) {
            fedReduction = ((ccbConfig.THRESHOLD_2 - ccbConfig.THRESHOLD_1) * t1) + 
                          ((netInc - ccbConfig.THRESHOLD_2) * t2);
        } else if (netInc > ccbConfig.THRESHOLD_1) {
            fedReduction = (netInc - ccbConfig.THRESHOLD_1) * t1;
        }
    }

    const federalNet = Math.max(0, fedMax - fedReduction);
    return {
        annual: federalNet,
        monthly: federalNet / 12
    };
};

/**
 * CORE EI / PARENTAL LEAVE MATH
 */
export const calculateEI = (salary, planType = 'STANDARD', province = 'ON') => {
    const { EI: eiConfig } = TAX_YEAR_CONFIG;
    
    const isQuebec = province === 'QC';
    const insurableCap = isQuebec ? eiConfig.QC_MIE : eiConfig.MIE;
    const insurableEarnings = Math.min(salary, insurableCap);
    
    const rate = planType === 'EXTENDED' ? eiConfig.EXT_RATE : eiConfig.STD_RATE;
    const maxWeekly = planType === 'EXTENDED' ? eiConfig.MAX_WEEKLY_EXT : eiConfig.MAX_WEEKLY_BENEFIT;
    
    let weeklyBenefit = (insurableEarnings * rate) / 52;
    weeklyBenefit = Math.min(weeklyBenefit, maxWeekly);
    
    return {
        weekly: Math.round(weeklyBenefit),
        insurableEarnings
    };
};

/**
 * CORE CPP MATH
 * Isolated from useRetirementMath hook
 */
export const calculateRetirementPensions = ({
    earnings, birthYear, retirementAge, yearsInCanada, otherIncome = 0,
    isMarried = false, spouseIncome = 0, children = []
}) => {
    const { CPP: cppConfig, OAS: oasConfig } = TAX_YEAR_CONFIG;
    const startYear = birthYear + 18;
    const endYear = birthYear + retirementAge;

    // 1. Generate Year Data
    const initialYears = [];
    for (let y = startYear; y < endYear; y++) initialYears.push(y);

    const yearData = initialYears.map(year => {
        const ympe = getYMPE(year);
        const yampe = getYAMPE(year);
        const rawIncome = parseFloat(earnings[year] || 0);
        const tier1Income = Math.min(rawIncome, ympe); 
        const ratio = tier1Income / ympe;
        const isEnhancedYear = year >= 2019;
        const tier2Income = Math.max(0, Math.min(rawIncome, yampe) - ympe);
        
        return { year, ratio, isEnhancedYear, tier1Income, tier2Income, ympe, yampe };
    });

    // 2. CPP Dropout (Simplified for Core Math) - 17% general dropout
    const sortedByRatio = [...yearData].sort((a, b) => a.ratio - b.ratio);
    const monthsToDrop = Math.floor(yearData.length * 12 * 0.17);
    const retainedYears = sortedByRatio.slice(Math.floor(monthsToDrop / 12));
    
    const avgRatio = retainedYears.length > 0 
        ? retainedYears.reduce((sum, y) => sum + y.ratio, 0) / retainedYears.length 
        : 0;
        
    const baseBenefit = cppConfig.MAX_MONTHLY_BENEFIT * avgRatio;

    // 3. Enhanced CPP
    let enhancedTier1Total = 0, enhancedTier2Total = 0;
    const currentYMPE = getYMPE(CURRENT_YEAR);
    
    yearData.forEach(d => {
        if (d.isEnhancedYear) {
            enhancedTier1Total += (d.tier1Income / d.ympe) * (0.0833 / 40) * currentYMPE;
            if (d.year >= 2024) {
                const spread = d.yampe - d.ympe;
                if (spread > 0) {
                    const currentSpread = currentYMPE * 0.14;
                    enhancedTier2Total += (d.tier2Income / spread) * (0.3333 / 40) * currentSpread;
                }
            }
        }
    });

    const enhancedBenefit = (enhancedTier1Total / 12) + (enhancedTier2Total / 12);
    const baseCppAt65 = baseBenefit + enhancedBenefit;

    // 4. CPP Age Adjustment
    const monthsDiff = (retirementAge - 65) * 12;
    let cppAdjustmentPercent = 0;
    if (monthsDiff < 0) cppAdjustmentPercent = monthsDiff * 0.6;
    else if (monthsDiff > 0) cppAdjustmentPercent = Math.min(monthsDiff, 60) * 0.7;
    
    const finalCPP = baseCppAt65 * (1 + (cppAdjustmentPercent / 100));

    // 5. OAS
    const validYears = Math.min(Math.max(0, yearsInCanada), 40);
    const baseOASAt65 = oasConfig.MAX_MONTHLY * (validYears / 40);
    let oasGross = 0;
    if (retirementAge >= 65) {
        const oasMonthsDeferred = Math.min((retirementAge - 65) * 12, 60);
        oasGross = baseOASAt65 * (1 + (oasMonthsDeferred * 0.6 / 100));
    }

    // 6. Clawback
    const totalNetWorldIncome = (parseFloat(otherIncome) || 0) + (finalCPP * 12) + (oasGross * 12);
    let oasClawbackMonthly = 0;
    if (retirementAge >= 65 && totalNetWorldIncome > oasConfig.CLAWBACK_THRESHOLD) {
        oasClawbackMonthly = ((totalNetWorldIncome - oasConfig.CLAWBACK_THRESHOLD) * 0.15) / 12;
    }
    const finalOAS = Math.max(0, oasGross - oasClawbackMonthly);

    return {
        cpp: finalCPP,
        oas: finalOAS,
        baseBenefit,
        enhancedBenefit,
        total: finalCPP + finalOAS
    };
};
