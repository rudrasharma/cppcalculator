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
 * @param {number} inputs.capitalGainsRate - Annual price appreciation (e.g. 0.05)
 * @param {number} inputs.dividendYield - Annual dividend yield (e.g. 0.02)
 * @param {number} inputs.dividendTaxRate - Tax rate on dividends (e.g. 0.15)
 * @param {boolean} inputs.reinvestDividends - Whether to reinvest net dividends
 * @param {number} inputs.amortizationYears - Total years (e.g. 25)
 * @param {number} inputs.initialHelocLumpSum - Initial investment from HELOC (default 0)
 * @param {number} inputs.readvanceTolerance - % of principal re-advanced (0.0 to 1.0, default 1.0)
 * @param {boolean} inputs.reinvestTaxRefund - Whether to reinvest annual tax refunds (default true)
 * @param {boolean} inputs.capitalizeInterest - Whether to borrow from HELOC to pay HELOC interest (default true)
 */
export const calculateSmithManoeuvre = ({
    homeValue,
    mortgageBalance,
    mortgageRate,
    helocRate,
    marginalTaxRate,
    capitalGainsRate = 0.05,
    dividendYield = 0.02,
    dividendTaxRate = 0.15,
    reinvestDividends = true,
    amortizationYears = 25,
    initialHelocLumpSum = 0,
    readvanceTolerance = 1.0,
    reinvestTaxRefund = true,
    capitalizeInterest = true
}) => {
    const totalMonths = amortizationYears * 12;
    const data = [];

    // Canadian Mortgage Math: Semi-annual compounding
    // Periodic Interest Rate = (1 + r/2)^(2/12) - 1
    const monthlyMortgageRate = Math.pow(1 + mortgageRate / 2, 2 / 12) - 1;
    
    // Standard Annuity Payment Formula
    const monthlyPayment = mortgageBalance * 
        (monthlyMortgageRate / (1 - Math.pow(1 + monthlyMortgageRate, -totalMonths)));

    // HELOC compounding (usually monthly)
    const monthlyHelocRate = helocRate / 12;

    // OSFI Limits (Canadian Standards)
    const MAX_TOTAL_LTV = 0.80; // Total Borrowing (Mortgage + HELOC)
    const MAX_HELOC_LTV = 0.65; // Pure HELOC cap

    let currentMortgageBalance = mortgageBalance;

    // Month 0 initialization - Subject to Caps
    const initialTotalRoom = (homeValue * MAX_TOTAL_LTV) - currentMortgageBalance;
    const initialHelocRoom = (homeValue * MAX_HELOC_LTV);
    const safeInitialLumpSum = Math.max(0, Math.min(initialHelocLumpSum, initialTotalRoom, initialHelocRoom));

    let currentHelocBalance = safeInitialLumpSum;
    let currentInvestmentBalance = safeInitialLumpSum;
    
    let yearlyHelocInterestPaid = 0;
    let lastYearlyRefund = 0;
    let cumulativePocketedCash = 0;
    let yearlyNetDividends = 0;
    let cumulativeOutOfPocketInterest = 0;
    let yearlyOutOfPocketInterest = 0;

    for (let month = 1; month <= totalMonths; month++) {
        let currentMonthTaxRefund = 0;

        // 1. Mortgage Step
        const interestComponent = currentMortgageBalance * monthlyMortgageRate;
        const principalComponent = Math.min(currentMortgageBalance, monthlyPayment - interestComponent);
        currentMortgageBalance -= principalComponent;

        // 2. Smith Step: Interest Capitalization with LTV Caps
        const monthlyHelocInterest = currentHelocBalance * monthlyHelocRate;
        const totalDebt = currentMortgageBalance + currentHelocBalance;
        
        // Can we capitalize this month's interest?
        // Must be below 80% total LTV AND below 65% pure HELOC LTV
        const hasTotalRoom = (totalDebt + monthlyHelocInterest) <= (homeValue * MAX_TOTAL_LTV);
        const hasHelocRoom = (currentHelocBalance + monthlyHelocInterest) <= (homeValue * MAX_HELOC_LTV);

        if (capitalizeInterest && hasTotalRoom && hasHelocRoom) {
            currentHelocBalance += monthlyHelocInterest;
        } else {
            // If capitalization is OFF OR we hit a cap, pay out of pocket
            cumulativeOutOfPocketInterest += monthlyHelocInterest;
            yearlyOutOfPocketInterest += monthlyHelocInterest;
        }
        
        yearlyHelocInterestPaid += monthlyHelocInterest;

        // 3. Investment Growth: Capital Gains
        currentInvestmentBalance *= (1 + capitalGainsRate / 12);

        // 4. Dividends
        const monthlyDividend = currentInvestmentBalance * (dividendYield / 12);
        const netMonthlyDividend = monthlyDividend * (1 - dividendTaxRate);
        yearlyNetDividends += netMonthlyDividend;

        if (reinvestDividends) {
            currentInvestmentBalance += netMonthlyDividend;
        } else {
            cumulativePocketedCash += netMonthlyDividend;
        }

        // 5. Smith Step: Re-advance the principal based on tolerance & Caps
        const theoreticalReadvance = principalComponent * readvanceTolerance;
        
        // Check room again for re-advance
        const roomTotal = (homeValue * MAX_TOTAL_LTV) - (currentMortgageBalance + currentHelocBalance);
        const roomHeloc = (homeValue * MAX_HELOC_LTV) - currentHelocBalance;
        const actualReadvance = Math.max(0, Math.min(theoreticalReadvance, roomTotal, roomHeloc));

        currentHelocBalance += actualReadvance;
        currentInvestmentBalance += actualReadvance;

        // 6. Tax Refund logic (Annual Reinvestment)
        if (month % 12 === 0) {
            currentMonthTaxRefund = yearlyHelocInterestPaid * marginalTaxRate;
            if (reinvestTaxRefund) {
                currentInvestmentBalance += currentMonthTaxRefund;
            }
            lastYearlyRefund = currentMonthTaxRefund;
            yearlyHelocInterestPaid = 0; // Reset for next year
        }

        // 7. Net Worth Calculations
        // Note: smithNetWorth is penalized by cumulativeOutOfPocketInterest if capitalization is OFF
        const standardNetWorth = homeValue - currentMortgageBalance;
        const smithNetWorth = homeValue - currentMortgageBalance - currentHelocBalance + currentInvestmentBalance + cumulativePocketedCash - cumulativeOutOfPocketInterest;

        data.push({
            month,
            standardMortgageBalance: Math.max(0, currentMortgageBalance),
            smithMortgageBalance: Math.max(0, currentMortgageBalance),
            smithHelocBalance: currentHelocBalance,
            smithInvestmentBalance: currentInvestmentBalance,
            taxRefundAccumulated: lastYearlyRefund,
            annualTaxRefund: currentMonthTaxRefund,
            yearlyNetDividends,
            cumulativePocketedCash,
            yearlyOutOfPocketInterest,
            cumulativeOutOfPocketInterest,
            standardNetWorth,
            smithNetWorth
        });

        if (month % 12 === 0) {
            yearlyNetDividends = 0; // Reset for next year
            yearlyOutOfPocketInterest = 0;
        }
    }

    return data;
};
