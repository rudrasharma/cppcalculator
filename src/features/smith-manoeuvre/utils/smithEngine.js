/**
 * Smith Manoeuvre Math Engine
 * Calculates the conversion of non-deductible mortgage debt into 
 * deductible investment debt.
 */

/**
 * calculateSmithManoeuvre
 * @param {Object} inputs
 * @param {number} inputs.homeValue
 * @param {number} inputs.mortgageBalance
 * @param {number} inputs.mortgageRate - Annual rate (e.g. 0.05 for 5%)
 * @param {number} inputs.helocRate - Annual rate (e.g. 0.06 for 6%)
 * @param {number} inputs.marginalTaxRate - Annual rate (e.g. 0.40 for 40%)
 * @param {number} inputs.expectedReturn - Annual rate (e.g. 0.07 for 7%)
 * @param {number} inputs.amortizationYears - Total years (e.g. 25)
 */
export const calculateSmithManoeuvre = ({
    homeValue,
    mortgageBalance,
    mortgageRate,
    helocRate,
    marginalTaxRate,
    expectedReturn,
    amortizationYears = 25
}) => {
    const totalMonths = amortizationYears * 12;
    const data = [];

    // Canadian Mortgage Math: Semi-annual compounding
    // Periodic Interest Rate = (1 + r/2)^(2/12) - 1
    const monthlyMortgageRate = Math.pow(1 + mortgageRate / 2, 2 / 12) - 1;
    
    // Standard Annuity Payment Formula
    const monthlyPayment = mortgageBalance * 
        (monthlyMortgageRate / (1 - Math.pow(1 + monthlyMortgageRate, -totalMonths)));

    // HELOC and Investment compounding (usually monthly)
    const monthlyHelocRate = helocRate / 12;
    const monthlyReturnRate = expectedReturn / 12;

    let currentMortgageBalance = mortgageBalance;
    let currentHelocBalance = 0;
    let currentInvestmentBalance = 0;
    let yearlyHelocInterestPaid = 0;
    let lastYearlyRefund = 0;

    for (let month = 1; month <= totalMonths; month++) {
        // 1. Mortgage Step
        const interestComponent = currentMortgageBalance * monthlyMortgageRate;
        const principalComponent = Math.min(currentMortgageBalance, monthlyPayment - interestComponent);
        currentMortgageBalance -= principalComponent;

        // 2. Smith Step: Re-advance the principal
        // In a standard SM, as you pay down principal, your HELOC limit increases
        const helocInterest = currentHelocBalance * monthlyHelocRate;
        yearlyHelocInterestPaid += helocInterest;
        
        // Investment grows by re-advanced principal + market growth
        // We assume the re-advanced principal is invested at the START of next month or end of this
        currentInvestmentBalance = (currentInvestmentBalance + principalComponent) * (1 + monthlyReturnRate);
        
        // HELOC balance grows by the principal re-borrowed
        currentHelocBalance += principalComponent;

        // 3. Tax Refund logic (Calculated/Accumulated annually)
        if (month % 12 === 0) {
            lastYearlyRefund = yearlyHelocInterestPaid * marginalTaxRate;
            yearlyHelocInterestPaid = 0; // Reset for next year
        }

        // 4. Net Worth Calculations
        const standardNetWorth = homeValue - currentMortgageBalance;
        const smithNetWorth = homeValue - currentMortgageBalance - currentHelocBalance + currentInvestmentBalance;

        data.push({
            month,
            standardMortgageBalance: Math.max(0, currentMortgageBalance),
            smithMortgageBalance: Math.max(0, currentMortgageBalance), // Matches standard per task
            smithHelocBalance: currentHelocBalance,
            smithInvestmentBalance: currentInvestmentBalance,
            taxRefundAccumulated: lastYearlyRefund,
            standardNetWorth,
            smithNetWorth
        });
    }

    return data;
};
