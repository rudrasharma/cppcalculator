// src/utils/__tests__/calculatorMath.test.js
import { calculateCCB, calculateEI, calculateRetirementPensions } from '../calculatorMath.js';
import { TAX_YEAR_CONFIG } from '../../config/taxYears.js';

describe('Calculator Math Utilities (2026 Config)', () => {

    /**
     * CPP UNIT TESTS
     */
    describe('CPP Calculation Logic', () => {
        const birthYear = 1970; // Age 56 in 2026
        const retirementAge = 65;
        const yearsInCanada = 40;

        test('User hitting exactly the first ceiling (YMPE: $74,600)', () => {
            // Mock earnings history where every year is exactly YMPE
            const earnings = {};
            for (let y = 1988; y < 2035; y++) {
                // Simplified: assuming they always hit max for that year's YMPE
                // We mainly care about the current year's interaction in the formula
                earnings[y] = 100000; // Well above YMPE to ensure ratio is 1.0
            }

            const results = calculateRetirementPensions({
                earnings, birthYear, retirementAge, yearsInCanada
            });

            // If ratio is 1.0, base benefit should be the MAX_MONTHLY_BENEFIT from config
            expect(results.baseBenefit).toBeCloseTo(TAX_YEAR_CONFIG.CPP.MAX_MONTHLY_BENEFIT, 1);
        });

        test('User exceeding the second ceiling (YAMPE: $85,000)', () => {
            const earnings = {};
            for (let y = 1988; y < 2035; y++) {
                earnings[y] = 150000; // Above YAMPE
            }

            const results = calculateRetirementPensions({
                earnings, birthYear, retirementAge, yearsInCanada
            });

            // Base benefit should still be capped by ratio 1.0
            expect(results.baseBenefit).toBeCloseTo(TAX_YEAR_CONFIG.CPP.MAX_MONTHLY_BENEFIT, 1);
            
            // Enhanced benefit should reflect Tier 2 contributions
            // Tier 2 started in 2024. For a user retiring in 2035, they have 11 years of Tier 2.
            expect(results.enhancedBenefit).toBeGreaterThan(0);
        });
    });

    /**
     * EI / MATERNITY UNIT TESTS
     */
    describe('EI / Maternity Calculation Logic', () => {
        test('User earning below Max Insurable Earnings ($50,000)', () => {
            const salary = 50000;
            const results = calculateEI(salary, 'STANDARD', 'ON');
            
            // Math: (50000 * 0.55) / 52 = 528.85 -> 529
            const expected = Math.round((50000 * TAX_YEAR_CONFIG.EI.STD_RATE) / 52);
            expect(results.weekly).toBe(expected);
            expect(results.weekly).toBeLessThan(TAX_YEAR_CONFIG.EI.MAX_WEEKLY_BEN_STD);
        });

        test('User hitting or exceeding MIE ($68,900)', () => {
            const salary = 80000; // Above 68,900
            const results = calculateEI(salary, 'STANDARD', 'ON');
            
            // Should cap exactly at $729 (from TAX_YEAR_CONFIG)
            expect(results.weekly).toBe(TAX_YEAR_CONFIG.EI.MAX_WEEKLY_BEN_STD);
            expect(results.insurableEarnings).toBe(TAX_YEAR_CONFIG.EI.MIE);
        });

        test('Extended leave calculation', () => {
            const salary = 70000;
            const results = calculateEI(salary, 'EXTENDED', 'ON');
            
            // Cap should be $437
            expect(results.weekly).toBe(TAX_YEAR_CONFIG.EI.MAX_WEEKLY_BEN_EXT);
        });
    });

    /**
     * CCB UNIT TESTS
     */
    describe('CCB Calculation Logic', () => {
        const childList = [
            { id: 1, age: 3 }, // Under 6
            { id: 2, age: 8 }  // 6 to 17
        ];

        test('Low-income family getting maximum benefit', () => {
            const netInc = 30000; // Below Threshold 1 ($38,612)
            const results = calculateCCB(netInc, childList, 'MARRIED', 'ON');
            
            const expectedMax = TAX_YEAR_CONFIG.CCB.MAX_UNDER_6 + TAX_YEAR_CONFIG.CCB.MAX_6_TO_17;
            expect(results.annual).toBe(expectedMax);
        });

        test('High-income family triggering clawback', () => {
            const netInc = 100000; // Above Threshold 2 ($83,658)
            const results = calculateCCB(netInc, childList, 'MARRIED', 'ON');
            
            const maxBenefit = TAX_YEAR_CONFIG.CCB.MAX_UNDER_6 + TAX_YEAR_CONFIG.CCB.MAX_6_TO_17;
            expect(results.annual).toBeLessThan(maxBenefit);
            expect(results.annual).toBeGreaterThan(0);
        });

        test('Extremely high income results in zero benefit', () => {
            const netInc = 500000;
            const results = calculateCCB(netInc, childList, 'MARRIED', 'ON');
            expect(results.annual).toBe(0);
        });
    });
});
