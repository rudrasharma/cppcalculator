import { calculateRetirementDrawdown } from '../drawdownEngine';

describe('Retirement Drawdown Engine', () => {
    it('simulates a basic retirement with no shortfall', () => {
        const params = {
            startAge: 65,
            endAge: 90,
            targetIncome: 50000,
            inflation: 0.02,
            returnRate: 0.05,
            balances: {
                tfsa: 250000,
                rrsp: 500000,
                nonReg: 0,
                lira: 0
            },
            pension: { amount: 10000, startAge: 65 },
            cpp: { amount: 12000, startAge: 65 },
            oas: { amount: 8000, startAge: 65 },
            drawdownOrder: ['nonReg', 'rrsp', 'lira', 'tfsa'],
            province: 'ON'
        };

        const result = calculateRetirementDrawdown(params);
        expect(result.history.length).toBe(26); // 65 to 90 inclusive
        expect(result.isDepleted).toBe(false);
        expect(result.ageOfDepletion).toBeNull();
        
        // Year 1 expectations
        const year1 = result.history[0];
        expect(year1.age).toBe(65);
        expect(year1.incomes.pension).toBe(10000);
        expect(year1.incomes.cpp).toBe(12000);
        expect(year1.incomes.oas).toBe(8000);
        
        // Target is 50k. Base income is 30k. Tax on 30k in ON is roughly $3k.
        // So net is ~27k. Shortfall is ~23k.
        // It should pull from RRSP (next in order since nonReg is 0).
        expect(year1.incomes.rrsp).toBeGreaterThan(20000);
        expect(year1.shortfall).toBe(0);
    });

    it('simulates early retirement (FIRE) correctly', () => {
        const params = {
            startAge: 40, // Retiring at 40
            endAge: 90,
            targetIncome: 60000,
            inflation: 0.02,
            returnRate: 0.05,
            balances: {
                tfsa: 100000,
                rrsp: 500000,
                nonReg: 500000,
                lira: 0
            },
            pension: { amount: 0, startAge: 65 },
            cpp: { amount: 12000, startAge: 65 }, // CPP doesn't start until 65
            oas: { amount: 8000, startAge: 65 },  // OAS doesn't start until 65
            drawdownOrder: ['nonReg', 'rrsp', 'lira', 'tfsa'],
            province: 'ON'
        };

        const result = calculateRetirementDrawdown(params);
        
        const year40 = result.history[0];
        expect(year40.incomes.cpp).toBe(0);
        expect(year40.incomes.oas).toBe(0);
        expect(year40.incomes.nonReg).toBeGreaterThan(60000); // Has to fund entire target

        const year65 = result.history.find(h => h.age === 65);
        expect(year65.incomes.cpp).toBe(12000);
        expect(year65.incomes.oas).toBe(8000);
    });
});
