import { calculateAmortization, calculatePeriodicPayment, PAYMENT_FREQUENCIES, COMPOUNDING_PERIODS } from '../mortgageEngine';

describe('mortgageEngine', () => {
  const principal = 500000;
  const annualRate = 0.05;
  const amortizationYears = 25;

  describe('calculatePeriodicPayment', () => {
    it('calculates correct monthly payment for Canadian fixed rate (semi-annual compounding)', () => {
      const payment = calculatePeriodicPayment(
        principal,
        annualRate,
        amortizationYears,
        PAYMENT_FREQUENCIES.MONTHLY,
        COMPOUNDING_PERIODS.SEMI_ANNUAL
      );
      // Expected: ~$2908.02
      expect(payment).toBeCloseTo(2908.02, 1);
    });

    it('calculates correct accelerated bi-weekly payment', () => {
      const monthlyPayment = calculatePeriodicPayment(
        principal,
        annualRate,
        amortizationYears,
        PAYMENT_FREQUENCIES.MONTHLY,
        COMPOUNDING_PERIODS.SEMI_ANNUAL
      );
      const acceleratedBiWeekly = calculatePeriodicPayment(
        principal,
        annualRate,
        amortizationYears,
        PAYMENT_FREQUENCIES.ACCELERATED_BI_WEEKLY,
        COMPOUNDING_PERIODS.SEMI_ANNUAL
      );
      expect(acceleratedBiWeekly).toBeCloseTo(monthlyPayment / 2, 2);
    });
  });

  describe('calculateAmortization', () => {
    it('calculates correct total interest without prepayments', () => {
      const result = calculateAmortization({
        principal,
        annualRate,
        amortizationYears,
        paymentFrequency: PAYMENT_FREQUENCIES.MONTHLY,
        compounding: COMPOUNDING_PERIODS.SEMI_ANNUAL
      });

      // Total payments: 2908.02 * 300 = 872,406
      // Total interest: 872,406 - 500,000 = 372,406
      expect(result.totalInterest).toBeCloseTo(372406, -1);
      expect(result.yearsToPayOff).toBe(25);
    });

    it('reduces years to pay off with monthly increase', () => {
      const result = calculateAmortization({
        principal,
        annualRate,
        amortizationYears,
        paymentFrequency: PAYMENT_FREQUENCIES.MONTHLY,
        compounding: COMPOUNDING_PERIODS.SEMI_ANNUAL,
        prepayments: {
            monthlyIncrease: 500
        }
      });

      expect(result.yearsToPayOff).toBeLessThan(25);
      expect(result.savings.interest).toBeGreaterThan(0);
    });

    it('reduces years to pay off with lump sum', () => {
      const result = calculateAmortization({
        principal,
        annualRate,
        amortizationYears,
        paymentFrequency: PAYMENT_FREQUENCIES.MONTHLY,
        compounding: COMPOUNDING_PERIODS.SEMI_ANNUAL,
        startDate: "2026-01-01",
        lumpSums: [
            { amount: 50000, date: "2026-02-01" } // Month 1
        ]
      });

      expect(result.yearsToPayOff).toBeLessThan(25);
      expect(result.savings.interest).toBeGreaterThan(0);
    });

    it('handles multiple lump sums correctly', () => {
      const result = calculateAmortization({
        principal,
        annualRate,
        amortizationYears,
        paymentFrequency: PAYMENT_FREQUENCIES.MONTHLY,
        compounding: COMPOUNDING_PERIODS.SEMI_ANNUAL,
        startDate: "2026-01-01",
        lumpSums: [
            { amount: 5000, date: "2027-01-01" }, // Year 1
            { amount: 5000, date: "2028-01-01" }, // Year 2
            { amount: 5000, date: "2029-01-01" }  // Year 3
        ]
      });

      expect(result.yearsToPayOff).toBeLessThan(25);
      expect(result.schedule.length).toBeLessThan(25);
    });
  });
});
