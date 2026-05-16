import { calculateSmithManoeuvre } from '../smithEngine';

describe('Smith Manoeuvre Engine', () => {
    const defaultInputs = {
        homeValue: 1000000,
        mortgageBalance: 500000,
        mortgageRate: 0.05,
        helocRate: 0.06,
        marginalTaxRate: 0.40,
        capitalGainsRate: 0.05,
        dividendYield: 0.02,
        dividendTaxRate: 0.15,
        dividendAllocation: 'portfolio',
        amortizationYears: 25,
        initialHelocLumpSum: 0,
        readvanceTolerance: 1.0,
        taxRefundAllocation: 'portfolio'
    };

    test('standardMortgageBalance reaches exactly 0 at the end of amortization', () => {
        const results = calculateSmithManoeuvre(defaultInputs);
        const lastMonth = results[results.length - 1];
        
        // Includes Month 0, so length is (years * 12) + 1
        expect(results.length).toBe(301);
        expect(lastMonth.standardMortgageBalance).toBeCloseTo(0, 2);
    });

    test('smithHelocBalance grows higher than mortgageBalance due to interest capitalization', () => {
        const results = calculateSmithManoeuvre(defaultInputs);
        const lastMonth = results[results.length - 1];
        
        // With interest capitalization, the HELOC debt will eventually exceed the original mortgage principal
        expect(lastMonth.smithHelocBalance).toBeGreaterThan(defaultInputs.mortgageBalance);
    });

    test('readvanceTolerance of 0.5 borrows exactly half the principal when interest is ignored', () => {
        const results = calculateSmithManoeuvre({
            ...defaultInputs,
            helocRate: 0, // Set to 0 to ignore capitalization for this test
            readvanceTolerance: 0.5
        });

        const lastMonth = results[results.length - 1];
        // Without interest, HELOC should be exactly half of total principal paid
        expect(lastMonth.smithHelocBalance).toBeCloseTo(defaultInputs.mortgageBalance * 0.5, 2);
    });

    test('marginalTaxRate affects the final smithNetWorth (Feedback Loop Check)', () => {
        const lowTaxResults = calculateSmithManoeuvre({ ...defaultInputs, marginalTaxRate: 0.20 });
        const highTaxResults = calculateSmithManoeuvre({ ...defaultInputs, marginalTaxRate: 0.50 });

        const lowTaxNetWorth = lowTaxResults[lowTaxResults.length - 1].smithNetWorth;
        const highTaxNetWorth = highTaxResults[highTaxResults.length - 1].smithNetWorth;

        // Higher tax rate = higher refund = higher net worth (due to reinvestment)
        expect(highTaxNetWorth).toBeGreaterThan(lowTaxNetWorth);
    });

    test('taxRefundAllocation parameter correctly affects the investment balance', () => {
        const withReinvest = calculateSmithManoeuvre({ ...defaultInputs, taxRefundAllocation: 'portfolio' });
        const withoutReinvest = calculateSmithManoeuvre({ ...defaultInputs, taxRefundAllocation: 'none' });

        const withReinvestBal = withReinvest[withReinvest.length - 1].smithInvestmentBalance;
        const withoutReinvestBal = withoutReinvest[withoutReinvest.length - 1].smithInvestmentBalance;

        expect(withReinvestBal).toBeGreaterThan(withoutReinvestBal);
    });

    test('dividendAllocation parameter affects cumulativePocketedCash and investmentBalance', () => {
        const withReinvest = calculateSmithManoeuvre({ ...defaultInputs, dividendAllocation: 'portfolio' });
        const withoutReinvest = calculateSmithManoeuvre({ ...defaultInputs, dividendAllocation: 'none' });

        const lastWith = withReinvest[withReinvest.length - 1];
        const lastWithout = withoutReinvest[withoutReinvest.length - 1];

        // When reinvesting, investment balance should be higher
        expect(lastWith.smithInvestmentBalance).toBeGreaterThan(lastWithout.smithInvestmentBalance);
        
        // When NOT reinvesting, pocketed cash should be accumulated
        expect(lastWithout.cumulativePocketedCash).toBeGreaterThan(0);
        expect(lastWith.cumulativePocketedCash).toBe(0);
    });

    test('initialHelocLumpSum correctly initializes balances at Month 0', () => {
        const val = 50000;
        const results = calculateSmithManoeuvre({
            ...defaultInputs,
            initialHelocLumpSum: val
        });

        // Month 0 should reflect exactly the initial lump sum (within OSFI caps)
        expect(results[0].month).toBe(0);
        expect(results[0].smithHelocBalance).toBe(val);
        expect(results[0].smithInvestmentBalance).toBe(val);
        
        // Month 1 should then show growth/re-advances
        expect(results[1].smithHelocBalance).toBeGreaterThan(val);
    });

    test('enforces OSFI 80% LTV and 65% HELOC caps', () => {
        const results = calculateSmithManoeuvre({
            ...defaultInputs,
            homeValue: 1000000,
            mortgageBalance: 500000,
            initialHelocLumpSum: 400000 // Total 900k (90%) -> Should cap at 80% (300k lump sum)
        });

        expect(results[0].smithHelocBalance).toBe(300000); // 500k mortgage + 300k HELOC = 800k (80%)
        
        // Throughout the strategy, HELOC should never exceed 650k (65% of 1M)
        const maxHeloc = Math.max(...results.map(r => r.smithHelocBalance));
        expect(maxHeloc).toBeLessThanOrEqual(650000);
    });

    test('mortgage allocation accelerator collapses mortgage faster than portfolio allocation', () => {
        const portfolioStrategy = calculateSmithManoeuvre({ ...defaultInputs, taxRefundAllocation: 'portfolio' });
        const acceleratorStrategy = calculateSmithManoeuvre({ ...defaultInputs, taxRefundAllocation: 'mortgage' });

        // Find first month mortgage is 0 for accelerator
        const accFinishMonth = acceleratorStrategy.findIndex(r => r.standardMortgageBalance <= 1);
        const portFinishMonth = portfolioStrategy.findIndex(r => r.standardMortgageBalance <= 1);

        // Accelerator should finish significantly earlier
        expect(accFinishMonth).toBeLessThan(portFinishMonth);
        expect(accFinishMonth).toBeGreaterThan(0);
    });
});
