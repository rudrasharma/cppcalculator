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
        expect(year1.incomes.oas).toBe(8560);
        
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
        expect(year65.incomes.oas).toBeCloseTo(8560 * inflationFactor, 2);
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

    it('prorates OAS based on years in Canada', () => {
        const params = {
            startAge: 65,
            endAge: 70,
            targetIncome: 50000,
            inflation: 0.02,
            returnRate: 0.05,
            balances: { tfsa: 100000, rrsp: 0, nonReg: 0, lira: 0 },
            pension: { amount: 0, startAge: 65 },
            cpp: { amount: 0, startAge: 65 },
            oas: { amount: 8000, startAge: 65 },
            yearsInCanada: 20, // 20/40 = 50%
            drawdownOrder: ['tfsa'],
            province: 'ON'
        };

        const result = calculateRetirementDrawdown(params);
        
        const year65 = result.history[0];
        // Expect OAS to be exactly 50% of the base (8560 * 0.5 = 4280)
        expect(year65.incomes.oas).toBe(4280);
        
        // Test < 10 years (should be 0)
        const paramsNoOas = { ...params, yearsInCanada: 9 };
        const resultNoOas = calculateRetirementDrawdown(paramsNoOas);
        expect(resultNoOas.history[0].incomes.oas).toBe(0);
    });

    it('forces RRIF minimums and handles surplus cash', () => {
        const params = {
            startAge: 65,
            endAge: 75,
            targetIncome: 10000, // Very low target to force surplus
            inflation: 0.02,
            returnRate: 0.05,
            balances: { tfsa: 0, rrsp: 1000000, nonReg: 0, lira: 0 },
            pension: { amount: 0, startAge: 65 },
            cpp: { amount: 0, startAge: 65 },
            oas: { startAge: 65 },
            yearsInCanada: 0,
            drawdownOrder: ['rrsp'],
            province: 'ON'
        };

        const result = calculateRetirementDrawdown(params);
        
        // At age 72, mandatory minimum for 72 is 5.40%
        const year72 = result.history.find(h => h.age === 72);
        expect(year72).toBeDefined();
        
        const priorYearBalance = result.history.find(h => h.age === 71).balances.rrsp;
        const expectedMinimum = priorYearBalance * 0.0540;
        
        // The withdrawal from RRSP should be AT LEAST the expected minimum
        expect(year72.incomes.rrsp).toBeGreaterThanOrEqual(expectedMinimum);
        
        // Because target is only 10,000, a massive withdrawal of ~54,000 should result in a surplus.
        // The engine reinvests surplus into nonReg.
        expect(year72.balances.nonReg).toBeGreaterThan(0);
        expect(year72.shortfall).toBe(0);
    });

    it('calculates GIS for low-income seniors and dynamically adjusts during withdrawals', () => {
        const params = {
            startAge: 65,
            endAge: 65,
            targetIncome: 20000,
            inflation: 0.0,
            returnRate: 0.0,
            balances: { tfsa: 0, rrsp: 0, nonReg: 0, lira: 0 },
            pension: 0,
            cpp: 0,
            oas: 0 // Assume some nominal OAS or 0
        };

        // Case 1: No income, full GIS
        const result1 = calculateRetirementDrawdown(params);
        expect(result1.history[0].incomes.gis).toBeGreaterThan(13000); // Max single GIS is ~13,368

        // Case 2: 10,000 pension income, 50% clawback means GIS drops by 5,000
        const params2 = { ...params, pension: { amount: 10000, startAge: 65 } };
        const result2 = calculateRetirementDrawdown(params2);
        expect(result2.history[0].incomes.gis).toBeLessThan(result1.history[0].incomes.gis);
        expect(result1.history[0].incomes.gis - result2.history[0].incomes.gis).toBeCloseTo(5000, -2);
    });
});
