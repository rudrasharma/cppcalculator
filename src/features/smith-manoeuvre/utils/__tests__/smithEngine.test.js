import { calculateSmithManoeuvre } from '../smithEngine';

describe('Smith Manoeuvre Engine', () => {
    const defaultInputs = {
        homeValue: 1000000,
        mortgageBalance: 500000,
        mortgageRate: 0.05,
        helocRate: 0.06,
        marginalTaxRate: 0.40,
        expectedReturn: 0.07,
        amortizationYears: 25
    };

    test('standardMortgageBalance reaches exactly 0 at the end of amortization', () => {
        const results = calculateSmithManoeuvre(defaultInputs);
        const lastMonth = results[results.length - 1];
        
        expect(results.length).toBe(300);
        expect(lastMonth.standardMortgageBalance).toBeCloseTo(0, 2);
    });

    test('smithHelocBalance does not exceed the original mortgageBalance', () => {
        const results = calculateSmithManoeuvre(defaultInputs);
        
        results.forEach(monthData => {
            // In a standard re-advance, HELOC balance grows as principal is paid.
            // It should never exceed the total principal paid, which caps at the starting mortgage balance.
            expect(monthData.smithHelocBalance).toBeLessThanOrEqual(defaultInputs.mortgageBalance + 0.01);
        });

        const lastMonth = results[results.length - 1];
        expect(lastMonth.smithHelocBalance).toBeCloseTo(defaultInputs.mortgageBalance, 2);
    });

    test('taxRefundAccumulated correctly applies marginal tax rate to annual HELOC interest', () => {
        const results = calculateSmithManoeuvre(defaultInputs);
        
        // Let's check year 2 (months 13-24)
        // HELOC interest is paid monthly on the current balance.
        // The engine resets yearlyHelocInterestPaid every 12 months.
        
        const year1End = results[11]; // Month 12
        const year2End = results[23]; // Month 24
        
        // Manual verification logic for year 1
        let manualInterestYear1 = 0;
        const monthlyHelocRate = defaultInputs.helocRate / 12;
        
        // Calculate interest paid manually for months 1-12
        // Month 1: balance is 0 initially, grows by principal of month 1.
        // Interest is calculated on balance BEFORE this month's growth or engine uses current?
        // Looking at engine: const helocInterest = currentHelocBalance * monthlyHelocRate; 
        // Then currentHelocBalance += principalComponent;
        // So interest is on the PREVIOUS month's ending balance.
        
        let currentBal = 0;
        for (let i = 0; i < 12; i++) {
            manualInterestYear1 += currentBal * monthlyHelocRate;
            // The engine adds principal AFTER interest calculation in the loop
            // Month 1 principal is in results[0].smithHelocBalance (which is previousBal + principal)
            const principalPaidThisMonth = i === 0 ? results[i].smithHelocBalance : results[i].smithHelocBalance - results[i-1].smithHelocBalance;
            currentBal += principalPaidThisMonth;
        }

        const expectedRefund = manualInterestYear1 * defaultInputs.marginalTaxRate;
        expect(year1End.taxRefundAccumulated).toBeCloseTo(expectedRefund, 2);
    });

    test('smithNetWorth shows the expected advantage over standardNetWorth over time', () => {
        const results = calculateSmithManoeuvre(defaultInputs);
        const lastMonth = results[results.length - 1];
        
        // Given expectedReturn (7%) > helocRate (6%) and tax deductibility,
        // Smith Net Worth should be higher than standard net worth.
        expect(lastMonth.smithNetWorth).toBeGreaterThan(lastMonth.standardNetWorth);
    });
});
