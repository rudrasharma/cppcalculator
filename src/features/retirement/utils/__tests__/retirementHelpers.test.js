import { applyAverageSalary, calculateDisplayValues, calculateComparisonMessage } from '../retirementHelpers';

describe('retirementHelpers', () => {
  describe('applyAverageSalary', () => {
    it('applies salary with age factors for early years', () => {
      const birthYear = 1990;
      const years = [2010, 2025]; // 2010 (age 20), 2025 (age 35)
      const earnings = {};
      
      const result = applyAverageSalary(earnings, 60000, years, birthYear);
      
      // Age 20 should have 0.3 factor
      expect(result[2010]).toBeLessThan(result[2025]);
    });
  });

  describe('calculateDisplayValues', () => {
    const mockResults = {
      grandTotal: 3000,
      cpp: { total: 1200 },
      oas: { total: 800 },
      gis: { total: 1000 }
    };

    it('applies inflation correctly (Future Dollars)', () => {
      // 2.5% inflation over ~10 years is approx 1.28 factor
      const birthYear = 1980;
      const retirementAge = 65; // Retiring in 19 year (2026 - 1980 = 46. 65 - 46 = 19)
      
      const values = calculateDisplayValues(mockResults, true, false, retirementAge, birthYear);
      expect(values.displayTotal).toBeGreaterThan(mockResults.grandTotal);
      expect(values.inflationFactor).toBeGreaterThan(1);
    });

    it('applies tax factor (Net Income)', () => {
      const values = calculateDisplayValues(mockResults, false, true, 65, 1980, 0.20);
      expect(values.displayTotal).toBe(mockResults.grandTotal * 0.80);
      expect(values.taxFactor).toBe(0.80);
    });
  });

  describe('calculateComparisonMessage', () => {
    it('finds crossover age correctly', () => {
      const currentBreakeven = [
        { age: 65, Selected: 1000 },
        { age: 70, Selected: 10000 },
        { age: 75, Selected: 25000 },
        { age: 80, Selected: 45000 }
      ];
      const snapshotBreakeven = [
        { age: 65, Selected: 2000 },
        { age: 70, Selected: 11000 },
        { age: 75, Selected: 22000 },
        { age: 80, Selected: 35000 }
      ];
      const snapshot = { age: 60 };

      const result = calculateComparisonMessage(snapshot, 65, currentBreakeven, snapshotBreakeven);
      
      // At age 75, current (25k) > snapshot (22k). Crossover should be 75.
      expect(result.foundCrossover).toBe(75);
      expect(result.hasCrossover).toBe(true);
    });
  });
});
