import { calculateFutureValue, calculateRate, calculateDuration, generateGrowthSeries } from '../cagrEngine';

describe('cagrEngine', () => {
  describe('calculateFutureValue', () => {
    it('calculates correct FV for simple lump sum (10% over 10 years)', () => {
      // 1000 * (1.1^10) = 2593.74
      const result = calculateFutureValue(1000, 10, 10, 0, 'Yearly');
      expect(result).toBeCloseTo(2593.74, 1);
    });

    it('calculates correct FV with monthly contributions', () => {
      // $1000 start, $100/mo, 10% rate, 5 years
      // Using standard financial math
      const result = calculateFutureValue(1000, 10, 5, 100, 'Monthly');
      // ~1000*(1.00833^60) + 100*((1.00833^60 - 1)/0.00833)
      expect(result).toBeCloseTo(9391.07, -1);
    });

    it('handles inflation-adjusted (real) growth', () => {
      // 10% nominal, 3% inflation = ~6.8% real rate
      const result = calculateFutureValue(1000, 10, 10, 0, 'Yearly', 3);
      // 1000 * (1.06796^10) = 1930.43
      expect(result).toBeCloseTo(1930.43, 0);
    });
  });

  describe('calculateRate', () => {
    it('correctly solves for CAGR', () => {
      // 1000 to 2000 in 7.2 years at ~10%
      const rate = calculateRate(1000, 2000, 7.2, 0, 'Yearly');
      expect(rate).toBeCloseTo(10, 0);
    });

    it('solves for rate with periodic contributions', () => {
      const rate = calculateRate(0, 10000, 5, 125, 'Monthly');
      // $125/mo for 60 months = $7500 principal. $2500 interest.
      // Rate is roughly 11.5%
      expect(rate).toBeCloseTo(11.5, 0);
    });
  });

  describe('calculateDuration', () => {
    it('solves for time to reach a goal', () => {
      // How long to double money at 7%? (Rule of 72 says ~10.3 years)
      const years = calculateDuration(1000, 2000, 7, 0, 'Yearly');
      expect(years).toBeCloseTo(10.24, 1);
    });
  });

  describe('generateGrowthSeries', () => {
    it('returns one data point per year plus start year', () => {
      const series = generateGrowthSeries(1000, 10, 5, 100, 'Monthly');
      expect(series.length).toBe(6); // 0, 1, 2, 3, 4, 5
      expect(series[0].balance).toBe(1000);
      expect(series[5].balance).toBeGreaterThan(1000);
    });
  });
});
