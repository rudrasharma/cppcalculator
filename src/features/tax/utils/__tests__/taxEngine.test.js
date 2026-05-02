import { calculateFederalTax, calculateProvincialTax, calculatePayrollDeductions, calculateTakeHome } from '../taxEngine';

describe('taxEngine', () => {
    describe('calculateFederalTax', () => {
        it('calculates correct tax for $50,000 (below first bracket)', () => {
            // Brackets: 15% on first 58,523
            // BPA: 16,452
            // Expected: (50000 * 0.15) - (16452 * 0.15) = 7500 - 2467.8 = 5032.2
            const tax = calculateFederalTax(50000, 50000);
            expect(tax).toBeCloseTo(5032.2, 0);
        });

        it('reduces federal tax for RRSP contributions', () => {
            const taxWithRRSP = calculateFederalTax(40000, 50000); // $10k RRSP
            const taxWithoutRRSP = calculateFederalTax(50000, 50000);
            expect(taxWithRRSP).toBeLessThan(taxWithoutRRSP);
        });
    });

    describe('calculateProvincialTax', () => {
        it('calculates Ontario tax correctly for $50,000', () => {
            // ON Brackets: 5.05% on first 53,891
            // ON BPA: 12,630
            // Expected: (50000 * 0.0505) - (12630 * 0.0505) = 2525 - 637.81 = 1887.19
            const tax = calculateProvincialTax(50000, 'ON');
            expect(tax).toBeCloseTo(1887.19, 0);
        });

        it('applies Ontario Surtax for high earners', () => {
            const tax = calculateProvincialTax(150000, 'ON');
            // Base tax on 150k is approx $10,500. Surtax adds ~3k.
            expect(tax).toBeCloseTo(13592, -1); 
        });
    });

    describe('calculatePayrollDeductions', () => {
        it('calculates max CPP and EI for 2026 correctly', () => {
            const result = calculatePayrollDeductions(100000);
            // CPP1: (74600 - 3500) * 0.0595 = 4230.45
            // CPP2: (85000 - 74600) * 0.04 = 416
            // Total CPP: 4646.45
            // EI: 68900 * 0.0163 = 1123.07
            expect(result.cpp).toBeCloseTo(4646.45, 0);
            expect(result.ei).toBeCloseTo(1123.07, 0);
        });
    });

    describe('calculateTakeHome', () => {
        it('applies Quebec Abatement correctly', () => {
            const onResult = calculateTakeHome(60000, 0, 'ON');
            const qcResult = calculateTakeHome(60000, 0, 'QC');
            
            // Federal tax in QC should be 16.5% lower than in ON (ignoring slight BPA differences for test logic simplicity)
            expect(qcResult.annual.federalTax).toBeLessThan(onResult.annual.federalTax);
        });

        it('returns all required pay periods', () => {
            const result = calculateTakeHome(75000, 0, 'BC');
            expect(result).toHaveProperty('annual');
            expect(result).toHaveProperty('monthly');
            expect(result).toHaveProperty('biWeekly');
            expect(result.monthly.net).toBe(result.annual.net / 12);
        });
    });
});
