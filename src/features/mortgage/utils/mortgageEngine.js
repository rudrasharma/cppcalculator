import { LENDERS } from '../data/lenderData';

export const calculateBreakAnalysis = (
    balance, 
    currentRate, 
    newRate, 
    monthsRemaining, 
    lenderKey = 'OTHER_BIG', 
    mortgageType = 'FIXED'
) => {
    // 1. Calculate Standard "Total Remaining Interest" (The Baseline)
    const monthlyInterestCurrent = (balance * (currentRate / 100)) / 12;
    const totalRemainingInterest = monthlyInterestCurrent * monthsRemaining;

    // 2. Calculate 3 Months Interest (Standard Floor)
    const penalty3Months = totalRemainingInterest * (3 / monthsRemaining);

    // Helpers
    const calculateMonthlySavings = (bal, oldR, newR) => {
        const oldInt = (bal * (oldR/100)) / 12;
        const newInt = (bal * (newR/100)) / 12;
        return oldInt - newInt;
    };

    const calculateSavings = (bal, oldR, newR, months) => {
        const monthlyDiff = calculateMonthlySavings(bal, oldR, newR);
        return monthlyDiff * months;
    };

    // 3. Handle Variable Rate Logic
    if (mortgageType === 'VARIABLE') {
        return {
            penalty3Months,
            penaltyIRD: 0,
            actualPenalty: penalty3Months,
            isIRD: false,
            totalInterestSavings: calculateSavings(balance, currentRate, newRate, monthsRemaining),
            monthlySavings: calculateMonthlySavings(balance, currentRate, newRate),
            netBenefit: calculateSavings(balance, currentRate, newRate, monthsRemaining) - penalty3Months,
            lenderName: LENDERS[lenderKey]?.label || "Lender",
            totalRemainingInterest, 
            calculationDetails: {
                type: '3_MONTHS',
                balance,
                currentRate,
                months: 3
            }
        };
    }

    // 4. Handle Fixed Rate IRD Logic
    const lender = LENDERS[lenderKey] || LENDERS.OTHER_BIG;
    
    // --- THE FIX: Decoupling "New Rate" from "Comparison Rate" ---
    // The "New Rate" determines your SAVINGS.
    // The "Comparison Rate" determines your PENALTY.
    
    let comparisonRate = newRate; 

    // For Big Banks, the Comparison Rate is often HIGHER than the competitive "New Rate"
    // because it is derived from (Posted Rate - Discount).
    // We estimate this by adding a conservative buffer if it's a Big Bank.
    // This reduces the penalty gap, creating a realistic Net Benefit.
    if (lender.type === 'BIG_BANK') {
        // We assume the Bank's comparison rate is ~0.50% - 1.00% worse (higher) than the aggressive market rate you found.
        // We use a safe 0.75% buffer to model the "Posted Rate" inefficiency.
        comparisonRate = Math.min(currentRate, newRate + 0.75);
    }

    // Effective Differential Calculation (Current - Comparison)
    const rateGap = Math.max(0, currentRate - comparisonRate);
    
    // IRD Formula: Balance * Differential * (Months / 12)
    const penaltyIRD = balance * (rateGap / 100) * (monthsRemaining / 12);

    // 5. Determine Actual Penalty
    const isIRD = penaltyIRD > penalty3Months;
    const actualPenalty = Math.max(penalty3Months, penaltyIRD);
    const savings = calculateSavings(balance, currentRate, newRate, monthsRemaining);

    return {
        penalty3Months,
        penaltyIRD,
        actualPenalty,
        isIRD,
        totalInterestSavings: savings,
        monthlySavings: calculateMonthlySavings(balance, currentRate, newRate),
        netBenefit: savings - actualPenalty,
        lenderName: lender.label,
        totalRemainingInterest,
        calculationDetails: isIRD ? {
            type: 'IRD',
            balance,
            currentRate,
            newRate,
            comparisonRate, // Export for UI transparency
            effectiveDifferential: rateGap,
            monthsRemaining
        } : {
            type: '3_MONTHS',
            balance,
            currentRate,
            months: 3
        }
    };
};