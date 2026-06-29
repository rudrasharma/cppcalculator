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
                nonRegBookValue: 250000, // 50% capital gains to trigger tax drag
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
        const inflationFactor = Math.pow(1 + params.inflation, 65 - params.startAge);
        expect(year65.incomes.cpp).toBeCloseTo(12000 * inflationFactor, 2);
        expect(year65.incomes.oas).toBeCloseTo(8000 * inflationFactor, 2);
    });

    it('simulates an accumulation phase before retirement correctly', () => {
        const params = {
            currentAge: 50,
            startAge: 60, // Retiring in 10 years
            endAge: 90,
            targetIncome: 60000,
            inflation: 0.02,
            returnRate: 0.05,
            balances: {
                tfsa: 100000,
                rrsp: 100000,
                nonReg: 0,
                lira: 0
            },
            contributions: {
                tfsa: 5000,
                rrsp: 10000,
                nonReg: 0
            },
            pension: { amount: 0, startAge: 65 },
            cpp: { amount: 12000, startAge: 65 },
            oas: { amount: 8000, startAge: 65 },
            drawdownOrder: ['nonReg', 'rrsp', 'lira', 'tfsa'],
            province: 'ON'
        };

        const result = calculateRetirementDrawdown(params);
        
        // Accumulation phase
        const year50 = result.history[0];
        expect(year50.age).toBe(50);
        expect(year50.targetIncome).toBe(0); // No target income during accumulation
        expect(year50.incomes.tfsa).toBe(0); // No withdrawals
        expect(year50.incomes.rrsp).toBe(0); 

        // Year 51 balances should reflect 1 year of growth + contribution
        // (100k + 5k) * 1.05 = 110,250
        const year51 = result.history[1];
        expect(year51.balances.tfsa).toBe(110250);
        
        // (100k + 10k) * 1.05 = 115,500
        expect(year51.balances.rrsp).toBe(115500);

        // Decumulation phase
        const year60 = result.history.find(h => h.age === 60);
        // Target income should be inflated from age 50 to 60 (10 years)
        const inflationFactor = Math.pow(1 + params.inflation, 10);
        expect(year60.targetIncome).toBeCloseTo(60000 * inflationFactor, 2);
    });
});
