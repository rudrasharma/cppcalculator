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
        reinvestDividends: true,
        amortizationYears: 25,
        initialHelocLumpSum: 0,
        readvanceTolerance: 1.0,
        reinvestTaxRefund: true
    };

    test('standardMortgageBalance reaches exactly 0 at the end of amortization', () => {
        const results = calculateSmithManoeuvre(defaultInputs);
        const lastMonth = results[results.length - 1];
        
        expect(results.length).toBe(300);
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

    test('reinvestTaxRefund parameter correctly affects the investment balance', () => {
        const withReinvest = calculateSmithManoeuvre({ ...defaultInputs, reinvestTaxRefund: true });
        const withoutReinvest = calculateSmithManoeuvre({ ...defaultInputs, reinvestTaxRefund: false });

        const withReinvestBal = withReinvest[withReinvest.length - 1].smithInvestmentBalance;
        const withoutReinvestBal = withoutReinvest[withoutReinvest.length - 1].smithInvestmentBalance;

        expect(withReinvestBal).toBeGreaterThan(withoutReinvestBal);
    });

    test('reinvestDividends parameter affects cumulativePocketedCash and investmentBalance', () => {
        const withReinvest = calculateSmithManoeuvre({ ...defaultInputs, reinvestDividends: true });
        const withoutReinvest = calculateSmithManoeuvre({ ...defaultInputs, reinvestDividends: false });

        const lastWith = withReinvest[withReinvest.length - 1];
        const lastWithout = withoutReinvest[withoutReinvest.length - 1];

        // When reinvesting, investment balance should be higher
        expect(lastWith.smithInvestmentBalance).toBeGreaterThan(lastWithout.smithInvestmentBalance);
        
        // When NOT reinvesting, pocketed cash should be accumulated
        expect(lastWithout.cumulativePocketedCash).toBeGreaterThan(0);
        expect(lastWith.cumulativePocketedCash).toBe(0);
    });

    test('initialHelocLumpSum correctly initializes balances', () => {
        const val = 50000;
        const results = calculateSmithManoeuvre({
            ...defaultInputs,
            initialHelocLumpSum: val
        });

        // First month should have at least the initial lump sum + some principal re-advance
        expect(results[0].smithHelocBalance).toBeGreaterThan(val);
        expect(results[0].smithInvestmentBalance).toBeGreaterThan(val);
    });
});
