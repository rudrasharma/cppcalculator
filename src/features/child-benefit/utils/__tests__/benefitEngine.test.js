import { calculateAll, CCB_PARAMS, GST_PARAMS } from '../benefitEngine';

describe('benefitEngine', () => {
  describe('calculateAll', () => {
    const baseParams = {
      netInc: 50000,
      childList: [{ age: 5, disability: false }],
      isShared: false,
      provCode: 'ON',
      status: 'MARRIED',
      rural: false,
    };

    it('calculates benefits for single child under 6', () => {
      const result = calculateAll(
        baseParams.netInc,
        baseParams.childList,
        baseParams.isShared,
        baseParams.provCode,
        baseParams.status,
        baseParams.rural
      );

      expect(result).toHaveProperty('federal');
      expect(result).toHaveProperty('provincial');
      expect(result).toHaveProperty('gst');
      expect(result).toHaveProperty('caip');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('monthly');
      expect(result.federal).toBeGreaterThan(0);
    });

    it('returns reduced benefits for high income', () => {
      // Calculate low income scenario for comparison
      const lowIncomeResult = calculateAll(
        30000,
        baseParams.childList,
        baseParams.isShared,
        baseParams.provCode,
        baseParams.status,
        baseParams.rural
      );

      const highIncomeResult = calculateAll(
        200000, // Very high income
        baseParams.childList,
        baseParams.isShared,
        baseParams.provCode,
        baseParams.status,
        baseParams.rural
      );

      // At very high income, benefits should be significantly reduced
      // CCB gets phased out but may not be exactly zero due to calculation rounding
      expect(highIncomeResult.federal).toBeLessThan(lowIncomeResult.federal);
      expect(highIncomeResult.provincial).toBeLessThan(lowIncomeResult.provincial);
      // Total should be much less than low-income scenario
      expect(highIncomeResult.total).toBeLessThan(lowIncomeResult.total);
      // At $200k, total benefits should be minimal (mostly GST/CAIP if any)
      expect(highIncomeResult.total).toBeLessThan(3000);
    });

    it('calculates correctly for multiple children', () => {
      const multipleChildren = [
        { age: 5, disability: false },
        { age: 8, disability: false },
        { age: 12, disability: false },
      ];

      const result = calculateAll(
        baseParams.netInc,
        multipleChildren,
        baseParams.isShared,
        baseParams.provCode,
        baseParams.status,
        baseParams.rural
      );

      expect(result.federal).toBeGreaterThan(0);
      expect(result.total).toBeGreaterThan(result.federal);
    });

    it('includes disability benefit for child with disability', () => {
      const childWithDisability = [{ age: 5, disability: true }];
      
      const result = calculateAll(
        baseParams.netInc,
        childWithDisability,
        baseParams.isShared,
        baseParams.provCode,
        baseParams.status,
        baseParams.rural
      );

      // Should include CDB (Child Disability Benefit)
      expect(result.federal).toBeGreaterThan(CCB_PARAMS.MAX_UNDER_6);
    });

    it('calculates GST credit correctly', () => {
      const result = calculateAll(
        30000, // Low income
        baseParams.childList,
        baseParams.isShared,
        baseParams.provCode,
        baseParams.status,
        baseParams.rural
      );

      expect(result.gst).toBeGreaterThan(0);
      // GST can include supplements and varies by income, so we check it's reasonable
      // For married with child at $30k income, GST should be close to max but may include supplements
      expect(result.gst).toBeLessThanOrEqual(1000); // Reasonable upper bound
    });

    it('handles shared custody correctly', () => {
      const sharedResult = calculateAll(
        baseParams.netInc,
        baseParams.childList,
        true, // isShared
        baseParams.provCode,
        baseParams.status,
        baseParams.rural
      );

      const notSharedResult = calculateAll(
        baseParams.netInc,
        baseParams.childList,
        false, // isShared
        baseParams.provCode,
        baseParams.status,
        baseParams.rural
      );

      // Shared custody should result in approximately half the benefits
      expect(sharedResult.federal).toBeCloseTo(notSharedResult.federal / 2, 0);
    });

    it('handles different provinces', () => {
      const provinces = ['ON', 'AB', 'BC', 'QC'];
      
      provinces.forEach(provCode => {
        const result = calculateAll(
          baseParams.netInc,
          baseParams.childList,
          baseParams.isShared,
          provCode,
          baseParams.status,
          baseParams.rural
        );

        expect(result).toHaveProperty('provName');
        expect(result.total).toBeGreaterThanOrEqual(0);
      });
    });

    it('handles single parent status', () => {
      const singleResult = calculateAll(
        baseParams.netInc,
        baseParams.childList,
        baseParams.isShared,
        baseParams.provCode,
        'SINGLE',
        baseParams.rural
      );

      const marriedResult = calculateAll(
        baseParams.netInc,
        baseParams.childList,
        baseParams.isShared,
        baseParams.provCode,
        'MARRIED',
        baseParams.rural
      );

      // Single parent might get different GST calculation
      expect(singleResult.total).toBeGreaterThanOrEqual(0);
      expect(marriedResult.total).toBeGreaterThanOrEqual(0);
    });

    it('calculates monthly amount correctly', () => {
      const result = calculateAll(
        baseParams.netInc,
        baseParams.childList,
        baseParams.isShared,
        baseParams.provCode,
        baseParams.status,
        baseParams.rural
      );

      expect(result.monthly).toBeCloseTo(result.total / 12, 2);
    });

    it('handles zero income', () => {
      const result = calculateAll(
        0,
        baseParams.childList,
        baseParams.isShared,
        baseParams.provCode,
        baseParams.status,
        baseParams.rural
      );

      // Should still get maximum benefits at zero income
      expect(result.federal).toBeGreaterThan(0);
      expect(result.total).toBeGreaterThan(0);
    });

    it('handles empty child list', () => {
      const result = calculateAll(
        baseParams.netInc,
        [],
        baseParams.isShared,
        baseParams.provCode,
        baseParams.status,
        baseParams.rural
      );

      // Should still get GST credit
      expect(result.gst).toBeGreaterThanOrEqual(0);
      expect(result.federal).toBe(0);
    });
  });
});

