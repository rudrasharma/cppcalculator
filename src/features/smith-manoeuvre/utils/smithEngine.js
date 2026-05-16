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
 * @param {string} inputs.dividendAllocation - 'portfolio', 'mortgage', or 'none' (default 'portfolio')
 * @param {number} inputs.amortizationYears - Total years (e.g. 25)
 * @param {number} inputs.initialHelocLumpSum - Initial investment from HELOC (default 0)
 * @param {number} inputs.readvanceTolerance - % of principal re-advanced (0.0 to 1.0, default 1.0)
 * @param {string} inputs.taxRefundAllocation - 'portfolio', 'mortgage', or 'none' (default 'portfolio')
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
    dividendAllocation = 'portfolio',
    amortizationYears = 25,
    initialHelocLumpSum = 0,
    readvanceTolerance = 1.0,
    taxRefundAllocation = 'portfolio',
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
    
    // Month 0: Starting State
    data.push({
        month: 0,
        standardMortgageBalance: mortgageBalance,
        smithMortgageBalance: mortgageBalance,
        smithHelocBalance: currentHelocBalance,
        smithInvestmentBalance: currentInvestmentBalance,
        taxRefundAccumulated: 0,
        annualTaxRefund: 0,
        yearlyNetDividends: 0,
        cumulativePocketedCash: 0,
        yearlyOutOfPocketInterest: 0,
        cumulativeOutOfPocketInterest: 0,
        standardNetWorth: homeValue - mortgageBalance,
        smithNetWorth: homeValue - mortgageBalance - currentHelocBalance + currentInvestmentBalance
    });

    let yearlyHelocInterestPaid = 0;
    let lastYearlyRefund = 0;
    let cumulativePocketedCash = 0;
    let yearlyNetDividends = 0;
    let cumulativeOutOfPocketInterest = 0;
    let yearlyOutOfPocketInterest = 0;

    for (let month = 1; month <= totalMonths; month++) {
        let currentMonthTaxRefund = 0;

        // 1. Mortgage Step: Base Payment
        const interestComponent = currentMortgageBalance * monthlyMortgageRate;
        let principalComponent = Math.min(currentMortgageBalance, monthlyPayment - interestComponent);
        
        // 1a. Dividend Accelerator: Apply net dividends to mortgage if target is 'mortgage'
        const monthlyDividend = currentInvestmentBalance * (dividendYield / 12);
        const netMonthlyDividend = monthlyDividend * (1 - dividendTaxRate);
        yearlyNetDividends += netMonthlyDividend;

        if (dividendAllocation === 'mortgage') {
            const extraPayment = Math.min(currentMortgageBalance - principalComponent, netMonthlyDividend);
            principalComponent += extraPayment;
        }

        // 1b. Tax Refund Accelerator: Apply refund to mortgage if target is 'mortgage'
        // Refund logic happens annually (Month 12)
        let appliedRefundToMortgage = 0;
        if (month % 12 === 0) {
            currentMonthTaxRefund = yearlyHelocInterestPaid * marginalTaxRate;
            if (taxRefundAllocation === 'mortgage') {
                appliedRefundToMortgage = Math.min(currentMortgageBalance - principalComponent, currentMonthTaxRefund);
                principalComponent += appliedRefundToMortgage;
            }
        }

        currentMortgageBalance -= principalComponent;

        // 2. Smith Step: Interest Capitalization with LTV Caps
        const monthlyHelocInterest = currentHelocBalance * monthlyHelocRate;
        const totalDebt = currentMortgageBalance + currentHelocBalance;
        
        // Can we capitalize this month's interest?
        const hasTotalRoom = (totalDebt + monthlyHelocInterest) <= (homeValue * MAX_TOTAL_LTV);
        const hasHelocRoom = (currentHelocBalance + monthlyHelocInterest) <= (homeValue * MAX_HELOC_LTV);

        if (capitalizeInterest && hasTotalRoom && hasHelocRoom) {
            currentHelocBalance += monthlyHelocInterest;
        } else {
            cumulativeOutOfPocketInterest += monthlyHelocInterest;
            yearlyOutOfPocketInterest += monthlyHelocInterest;
        }
        
        yearlyHelocInterestPaid += monthlyHelocInterest;

        // 3. Investment Growth: Capital Gains
        currentInvestmentBalance *= (1 + capitalGainsRate / 12);

        // 4. Portfolio Reinvestments
        if (dividendAllocation === 'portfolio') {
            currentInvestmentBalance += netMonthlyDividend;
        } else if (dividendAllocation === 'none') {
            cumulativePocketedCash += netMonthlyDividend;
        }

        if (month % 12 === 0) {
            if (taxRefundAllocation === 'portfolio') {
                currentInvestmentBalance += currentMonthTaxRefund;
            } else if (taxRefundAllocation === 'none') {
                cumulativePocketedCash += currentMonthTaxRefund;
            } else if (taxRefundAllocation === 'mortgage') {
                // If we couldn't apply the whole refund to the mortgage, invest the remainder
                const remainder = currentMonthTaxRefund - appliedRefundToMortgage;
                currentInvestmentBalance += remainder;
            }
            lastYearlyRefund = currentMonthTaxRefund;
            yearlyHelocInterestPaid = 0;
        }

        // 5. Smith Step: Re-advance the principal based on tolerance & Caps
        const theoreticalReadvance = principalComponent * readvanceTolerance;
        const roomTotal = (homeValue * MAX_TOTAL_LTV) - (currentMortgageBalance + currentHelocBalance);
        const roomHeloc = (homeValue * MAX_HELOC_LTV) - currentHelocBalance;
        const actualReadvance = Math.max(0, Math.min(theoreticalReadvance, roomTotal, roomHeloc));

        currentHelocBalance += actualReadvance;
        currentInvestmentBalance += actualReadvance;

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
