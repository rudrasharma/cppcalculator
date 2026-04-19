/**
 * Family RESP Calculation Engine
 * 
 * Rules:
 * 1. Lifetime contribution limit: $50,000 per child room.
 * 2. CESG: 20% match on contributions, max $500/year/child, max $7,200 lifetime/child.
 * 3. BCTESG (BC): $1,200 one-time at age 6 per child.
 * 4. QESI (Quebec): 10% match on contributions, max $250/year/child, max $3,600 lifetime/child.
 * 5. CLB: $500 first year, $100 subsequent until age 15, max $2,000 lifetime per child.
 */

export const calculateFamilyRESP = ({
    beneficiaries, // Array of { id, age, pastContributions, name }
    currentBalance,
    annualReturn,
    province,
    clbEligible,
    totalContributionAmount,
    contributionFrequency,
}) => {
    if (!beneficiaries || beneficiaries.length === 0) {
        return { totalProjected: currentBalance, yearlyBreakdown: [] };
    }

    const maxAgeInProjection = 18;
    const youngestAge = Math.min(...beneficiaries.map(b => b.age));
    const oldestAge = Math.max(...beneficiaries.map(b => b.age));
    const yearsToProject = maxAgeInProjection - youngestAge;

    let balance = currentBalance;
    const frequencyMultiplier = {
        'Weekly': 52,
        'Monthly': 12,
        'Yearly': 1
    }[contributionFrequency] || 1;

    const annualTotalContributionBase = totalContributionAmount * frequencyMultiplier;

    // Track per-child lifetime stats
    const childStats = beneficiaries.map(b => ({
        id: b.id,
        currentAge: Number(b.age),
        totalCESG: 0,
        totalCLB: 0,
        totalProvincial: 0,
        totalContributions: 0, // This projection only
        catchUpRoom: Math.max(0, Number(b.age) * 2500) // Simple catch-up estimate
    }));

    let totalProjectedInterest = 0;
    let totalProjectedContributions = 0;
    let totalProjectedGrants = 0;

    const yearlyBreakdown = [];

    for (let year = 0; year < yearsToProject; year++) {
        const yearStartBalance = balance;
        
        // 1. Identify eligible children for contributions (under 18)
        const eligibleForContrib = childStats.filter(c => (c.currentAge + year) < 18);
        const eligibleForCLB = childStats.filter(c => (c.currentAge + year) <= 15);
        
        let yearTotalContributions = 0;
        let yearTotalGrants = 0;

        if (eligibleForContrib.length > 0) {
            const splitContribution = annualTotalContributionBase / eligibleForContrib.length;
            
            eligibleForContrib.forEach(child => {
                let childYearContrib = splitContribution;
                
                // Per-child HARD LIMIT 1: $50,000 lifetime
                // Note: We don't have exact historical per-child contribs here, 
                // but we cap the projection room.
                const remainingRoom = 50000 - child.totalContributions;
                childYearContrib = Math.min(childYearContrib, remainingRoom);
                
                child.totalContributions += childYearContrib;
                yearTotalContributions += childYearContrib;

                // 2. Federal CESG per child
                // Catch-up logic: up to $1,000 grant if room exists
                let maxGrant = 500;
                if (child.catchUpRoom > 0) maxGrant = 1000;

                let childCESG = childYearContrib * 0.20;
                const remainingCESG = 7200 - child.totalCESG;
                childCESG = Math.min(childCESG, maxGrant, remainingCESG);
                
                child.totalCESG += childCESG;
                yearTotalGrants += childCESG;

                // Update catch-up room
                if (childCESG > 500) {
                    child.catchUpRoom = Math.max(0, child.catchUpRoom - (childCESG - 500) / 0.20);
                }

                // 3. Provincial Grants
                let childProvincial = 0;
                const childAgeAtYear = child.currentAge + year;

                if (province === 'British Columbia') {
                    // BCTESG: $1,200 at age 6, or immediately if starting at 7-8
                    if (childAgeAtYear === 6 || (year === 0 && (childAgeAtYear === 7 || childAgeAtYear === 8))) {
                        childProvincial = 1200;
                    }
                } else if (province === 'Quebec') {
                    let qesiMatch = childYearContrib * 0.10;
                    childProvincial = Math.min(qesiMatch, 250, 3600 - child.totalProvincial);
                }
                child.totalProvincial += childProvincial;
                yearTotalGrants += childProvincial;
            });
        }

        // 4. Federal CLB (requires no contribution)
        if (clbEligible) {
            eligibleForCLB.forEach(child => {
                const childAgeAtYear = child.currentAge + year;
                let childCLB = 0;
                const remainingCLB = 2000 - child.totalCLB;

                if (year === 0 || childAgeAtYear === 0) {
                    childCLB = Math.min(500, remainingCLB);
                } else {
                    childCLB = Math.min(100, remainingCLB);
                }
                
                child.totalCLB += childCLB;
                yearTotalGrants += childCLB;
            });
        }

        // 5. Compounding
        const interestRate = annualReturn / 100;
        // Apply interest to start balance + mid-year contributions/grants
        const yearInterest = (yearStartBalance + (yearTotalContributions + yearTotalGrants) / 2) * interestRate;
        
        balance = yearStartBalance + yearTotalContributions + yearTotalGrants + yearInterest;
        
        totalProjectedInterest += yearInterest;
        totalProjectedContributions += yearTotalContributions;
        totalProjectedGrants += yearTotalGrants;

        yearlyBreakdown.push({
            year: year + 1,
            ageOfOldest: oldestAge + year + 1,
            contributions: yearTotalContributions,
            grants: yearTotalGrants,
            interest: yearInterest,
            balance: balance,
            childAges: childStats.map(c => c.currentAge + year + 1)
        });
    }

    return {
        totalProjected: balance,
        totalContributions: totalProjectedContributions,
        totalGrants: totalProjectedGrants,
        totalInterest: totalProjectedInterest,
        childStats,
        yearlyBreakdown
    };
};
