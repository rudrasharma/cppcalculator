import { TAX_YEAR_CONFIG } from '../../../config/taxYears.js';

const { FEDERAL_TAX, PROVINCIAL_TAX, CPP, EI } = TAX_YEAR_CONFIG;

/**
 * Calculate tax based on progressive brackets
 */
const calculateProgressiveTax = (income, brackets) => {
    let tax = 0;
    let prevThreshold = 0;

    for (const bracket of brackets) {
        if (income > prevThreshold) {
            const taxableInBracket = Math.min(income, bracket.threshold) - prevThreshold;
            tax += taxableInBracket * bracket.rate;
            prevThreshold = bracket.threshold;
        } else {
            break;
        }
    }
    return tax;
};

/**
 * Calculate Federal Tax
 */
export const calculateFederalTax = (taxableIncome, grossIncome) => {
    // 1. Base Tax from brackets
    const baseTax = calculateProgressiveTax(taxableIncome, FEDERAL_TAX.BRACKETS);

    // 2. Federal BPA (Basic Personal Amount)
    // Phased out for net income between BPA_MAX_THRESHOLD and BPA_PHASE_OUT_MAX
    let bpa = FEDERAL_TAX.BPA;
    if (grossIncome > FEDERAL_TAX.BPA_MAX_THRESHOLD) {
        const excess = Math.min(grossIncome, FEDERAL_TAX.BPA_PHASE_OUT_MAX) - FEDERAL_TAX.BPA_MAX_THRESHOLD;
        const phaseOutRange = FEDERAL_TAX.BPA_PHASE_OUT_MAX - FEDERAL_TAX.BPA_MAX_THRESHOLD;
        const reduction = excess / phaseOutRange * (FEDERAL_TAX.BPA - 14398); // 14398 is the minimum BPA for high earners in 2026 estimate
        bpa = FEDERAL_TAX.BPA - reduction;
    }

    const bpaCredit = bpa * 0.15; // Federal credit is always at the lowest bracket rate
    
    // Total federal tax cannot be negative
    return Math.max(0, baseTax - bpaCredit);
};

/**
 * Calculate Provincial Tax
 */
export const calculateProvincialTax = (taxableIncome, provinceCode) => {
    const config = PROVINCIAL_TAX[provinceCode];
    if (!config) return 0;

    // 1. Base Provincial Tax
    let provTax = calculateProgressiveTax(taxableIncome, config.BRACKETS);

    // 2. Provincial BPA Credit
    const bpaCredit = config.BPA * config.BRACKETS[0].rate;
    provTax = Math.max(0, provTax - bpaCredit);

    // 3. Ontario Surtax
    if (provinceCode === 'ON' && config.SURTAX) {
        let surtax = 0;
        if (provTax > config.SURTAX[1].threshold) {
            surtax += (provTax - config.SURTAX[1].threshold) * config.SURTAX[1].rate;
            surtax += (config.SURTAX[1].threshold - config.SURTAX[0].threshold) * config.SURTAX[0].rate;
        } else if (provTax > config.SURTAX[0].threshold) {
            surtax += (provTax - config.SURTAX[0].threshold) * config.SURTAX[0].rate;
        }
        provTax += surtax;
    }

    return provTax;
};

/**
 * Calculate CPP and EI
 */
export const calculatePayrollDeductions = (grossIncome) => {
    // 1. CPP
    // Base + First Enhancement (CPP1)
    const cpp1Insurable = Math.min(Math.max(0, grossIncome - CPP.BASIC_EXEMPTION), CPP.YMPE - CPP.BASIC_EXEMPTION);
    const cpp1 = cpp1Insurable * CPP.RATE;

    // Second Enhancement (CPP2)
    const cpp2Insurable = Math.max(0, Math.min(grossIncome, CPP.YAMPE) - CPP.YMPE);
    const cpp2 = cpp2Insurable * CPP.RATE_CPP2;

    // 2. EI
    const eiInsurable = Math.min(grossIncome, EI.MIE);
    const ei = eiInsurable * EI.RATE;

    return {
        cpp: cpp1 + cpp2,
        ei: ei
    };
};

/**
 * Main calculation stitcher
 */
export const calculateTakeHome = (grossIncome, rrspContribution, provinceCode, employerMatchPercent = 0) => {
    // Total RRSP contribution (User $ + Employer %) reduces taxable income
    const employerMatchAmount = grossIncome * (employerMatchPercent / 100);
    const totalRRSP = rrspContribution + employerMatchAmount;
    const taxableIncome = Math.max(0, grossIncome - totalRRSP);
    
    let fedTax = calculateFederalTax(taxableIncome, grossIncome);
    const provTax = calculateProvincialTax(taxableIncome, provinceCode);
    const { cpp, ei } = calculatePayrollDeductions(grossIncome);

    // Quebec Abatement
    if (provinceCode === 'QC') {
        fedTax = fedTax * (1 - PROVINCIAL_TAX.QC.ABATEMENT);
    }

    const totalTax = fedTax + provTax;
    const netIncome = grossIncome - totalTax - cpp - ei;

    // Calculate Monthly Schedule to handle CPP/EI "cliff"
    const monthlySchedule = [];
    let cumulativeCPP = 0;
    let cumulativeEI = 0;
    let cumulativeGross = 0;
    
    const monthlyGross = grossIncome / 12;
    const monthlyFedTax = fedTax / 12;
    const monthlyProvTax = provTax / 12;

    for (let i = 0; i < 12; i++) {
        // 1. Calculate CPP for this month (Gross based)
        let monthCPP = 0;
        if (cumulativeCPP < cpp) {
            // Period CPP calculation: (Period Gross - (Exemption / 12)) * Rate
            // We transition from CPP1 (5.95%) to CPP2 (4%) at YMPE ($74,600)
            const periodExemption = CPP.BASIC_EXEMPTION / 12;
            
            if (cumulativeGross + monthlyGross <= CPP.YMPE) {
                // Entirely in CPP1 range
                monthCPP = Math.max(0, monthlyGross - periodExemption) * CPP.RATE;
            } else if (cumulativeGross >= CPP.YMPE) {
                // Entirely in CPP2 range (or above YAMPE)
                monthCPP = monthlyGross * CPP.RATE_CPP2;
            } else {
                // Straddles YMPE
                const inCPP1 = CPP.YMPE - cumulativeGross;
                const inCPP2 = monthlyGross - inCPP1;
                monthCPP = (Math.max(0, inCPP1 - periodExemption) * CPP.RATE) + (inCPP2 * CPP.RATE_CPP2);
            }
            
            // Cap at annual total
            monthCPP = Math.min(monthCPP, cpp - cumulativeCPP);
            cumulativeCPP += monthCPP;
        }

        // 2. Calculate EI for this month (Gross based)
        let monthEI = 0;
        if (cumulativeEI < ei) {
            monthEI = monthlyGross * EI.RATE;
            monthEI = Math.min(monthEI, ei - cumulativeEI);
            cumulativeEI += monthEI;
        }

        monthlySchedule.push({
            month: i,
            gross: monthlyGross,
            fedTax: monthlyFedTax,
            provTax: monthlyProvTax,
            cpp: monthCPP,
            ei: monthEI,
            net: monthlyGross - monthlyFedTax - monthlyProvTax - monthCPP - monthEI
        });

        cumulativeGross += monthlyGross;
    }

    return {
        annual: {
            gross: grossIncome,
            taxable: taxableIncome,
            federalTax: fedTax,
            provincialTax: provTax,
            cpp: cpp,
            ei: ei,
            totalTax: totalTax,
            net: netIncome,
            employerMatchAmount
        },
        monthly: {
            gross: grossIncome / 12,
            federalTax: fedTax / 12,
            provincialTax: provTax / 12,
            cpp: cpp / 12,
            ei: ei / 12,
            net: netIncome / 12
        },
        biWeekly: {
            gross: grossIncome / 26,
            federalTax: fedTax / 26,
            provincialTax: provTax / 26,
            cpp: cpp / 26,
            ei: ei / 26,
            net: netIncome / 26
        },
        semiMonthly: {
            gross: grossIncome / 24,
            federalTax: fedTax / 24,
            provincialTax: provTax / 24,
            cpp: cpp / 24,
            ei: ei / 24,
            net: netIncome / 24
        },
        schedule: monthlySchedule
    };
};
