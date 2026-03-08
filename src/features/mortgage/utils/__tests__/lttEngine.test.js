import { calculateLTT } from '../lttEngine';

describe('lttEngine', () => {
    test('calculates Ontario LTT correctly for $500k home', () => {
        // $55,000 * 0.5% = $275
        // ($250,000 - $55,000) * 1% = $1,950
        // ($400,000 - $250,000) * 1.5% = $2,250
        // ($500,000 - $400,000) * 2% = $2,000
        // Total = $6,475
        const result = calculateLTT(500000, 'ON');
        expect(result.provincialTax).toBe(6475);
        expect(result.totalTax).toBe(6475);
    });

    test('applies Ontario First-Time Buyer rebate correctly', () => {
        // Tax is $6,475, Rebate is $4,000, Total = $2,475
        const result = calculateLTT(500000, 'ON', false, true);
        expect(result.provincialTax).toBe(6475);
        expect(result.provincialRebate).toBe(4000);
        expect(result.totalTax).toBe(2475);
    });

    test('calculates Toronto LTT correctly for $500k home', () => {
        // ON LTT: $6,475
        // TO LTT: $6,475 (same tiers for this price range)
        // Total = $12,950
        const result = calculateLTT(500000, 'ON', true);
        expect(result.provincialTax).toBe(6475);
        expect(result.municipalTax).toBe(6475);
        expect(result.totalTax).toBe(12950);
    });

    test('applies Toronto First-Time Buyer rebate correctly', () => {
        // Provincial: $6,475 - $4,000 = $2,475
        // Municipal: $6,475 - $4,475 = $2,000
        // Total = $4,475
        const result = calculateLTT(500000, 'ON', true, true);
        expect(result.provincialRebate).toBe(4000);
        expect(result.municipalRebate).toBe(4475);
        expect(result.totalTax).toBe(4475);
    });

    test('calculates BC LTT correctly for $1.2M home', () => {
        // $200k * 1% = $2,000
        // ($1.2M - $200k) * 2% = $20,000
        // Total = $22,000
        const result = calculateLTT(1200000, 'BC');
        expect(result.provincialTax).toBe(22000);
    });

    test('calculates Alberta fees correctly', () => {
        // $50 + ($500,000 / 5,000) * 2 = $50 + 100 * 2 = $250
        const result = calculateLTT(500000, 'AB');
        expect(result.provincialTax).toBe(250);
    });

    test('calculates Quebec LTT correctly for $600k home', () => {
        // $58,900 * 0.5% = $294.50
        // ($294,600 - $58,900) * 1% = $2,357
        // ($600,000 - $294,600) * 1.5% = $4,581
        // Total = $7,232.50
        const result = calculateLTT(600000, 'QC');
        expect(result.provincialTax).toBeCloseTo(7232.5);
    });
});
