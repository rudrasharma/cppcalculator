import { calculateFamilyRESP } from '../respEngine';

describe('respEngine', () => {
  const baseParams = {
    beneficiaries: [
      { id: 1, age: 5, name: 'Child A' }
    ],
    currentBalance: 5000,
    annualReturn: 5,
    province: 'Ontario',
    clbEligible: false,
    totalContributionAmount: 200,
    contributionFrequency: 'Monthly'
  };

  it('calculates standard 20% CESG grant correctly', () => {
    // $200/mo = $2400/year
    // 20% of $2400 = $480
    const result = calculateFamilyRESP(baseParams);
    const firstYear = result.yearlyBreakdown[0];
    
    expect(firstYear.contributions).toBe(2400);
    expect(firstYear.grants).toBe(480);
  });

  it('caps annual CESG at $500 (without catch-up)', () => {
    const highContribParams = {
        ...baseParams,
        currentBalance: 25000, // Large balance, implying past grants/contribs
        beneficiaries: [{ id: 1, age: 5, pastContributions: 20000 }],
        totalContributionAmount: 500 // $6000/year
    };
    const result = calculateFamilyRESP(highContribParams);
    const firstYear = result.yearlyBreakdown[0];
    
    expect(firstYear.contributions).toBe(6000);
    expect(firstYear.grants).toBe(500); // Capped at $500
  });

  it('handles CESG catch-up logic ($1000 max grant)', () => {
    // Start at age 5 with 0 past contributions means lots of catch-up room
    const catchupParams = {
        ...baseParams,
        currentBalance: 0,
        beneficiaries: [{ id: 1, age: 5, pastContributions: 0 }],
        totalContributionAmount: 500 // $6000/year
    };
    
    const result = calculateFamilyRESP(catchupParams);
    const firstYear = result.yearlyBreakdown[0];
    
    // 20% of $6000 is $1200, but capped at $1000 for catch-up
    expect(firstYear.grants).toBe(1000);
  });

  it('stops grants when lifetime $7,200 CESG limit is reached', () => {
    const nearLimitParams = {
        ...baseParams,
        currentBalance: 40000, 
        beneficiaries: [
            { id: 1, age: 10, pastContributions: 35000 } 
        ],
        totalContributionAmount: 500
    };
    
    const result = calculateFamilyRESP(nearLimitParams);
    
    // Check total grants across projection
    const totalGrants = result.yearlyBreakdown.reduce((sum, yr) => sum + yr.grants, 0);
    expect(totalGrants).toBeLessThanOrEqual(7200); 
  });

  it('applies BC Training and Education Savings Grant (BCTESG) at age 6', () => {
    const bcParams = {
        ...baseParams,
        province: 'British Columbia',
        beneficiaries: [{ id: 1, age: 6 }] 
    };
    
    const result = calculateFamilyRESP(bcParams);
    // Year 1: Child is 6. BCTESG applies.
    const firstYear = result.yearlyBreakdown[0];
    expect(firstYear.grants).toBeGreaterThan(1200); // 480 (CESG) + 1200 (BCTESG)
  });

  it('calculates Quebec (QESI) 10% match correctly', () => {
    const qcParams = {
        ...baseParams,
        province: 'Quebec',
        totalContributionAmount: 100 // $1200/year
    };
    
    const result = calculateFamilyRESP(qcParams);
    const firstYear = result.yearlyBreakdown[0];
    
    // CESG: 20% of 1200 = 240
    // QESI: 10% of 1200 = 120
    // Total: 360
    expect(firstYear.grants).toBe(360);
  });

  it('calculates Federal CLB correctly for eligible families', () => {
    const clbParams = {
        ...baseParams,
        clbEligible: true,
        currentBalance: 0,
        totalContributionAmount: 0 // Test CLB without contributions
    };
    
    const result = calculateFamilyRESP(clbParams);
    const firstYear = result.yearlyBreakdown[0];
    
    // First year CLB = $500
    expect(firstYear.grants).toBe(500);
    
    // Second year CLB = $100
    expect(result.yearlyBreakdown[1].grants).toBe(100);
  });

  it('stops all activity after age 18', () => {
    const oldChildParams = {
        ...baseParams,
        beneficiaries: [{ id: 1, age: 17 }]
    };
    
    const result = calculateFamilyRESP(oldChildParams);
    // Should only have 1 year of projection (17 -> 18)
    expect(result.yearlyBreakdown.length).toBe(1);
  });
});
