import {
    calculateParentalLeave,
    getCurrentMaxInsurable,
    getIndividualMaxWeeks,
    getMaxWeeks,
    isBonusWeeksActive
} from '../parentalLeaveEngine';

describe('parentalLeaveEngine', () => {
    describe('getCurrentMaxInsurable', () => {
        it('returns standard max insurable for ON', () => {
            expect(getCurrentMaxInsurable('ON')).toBe(68900);
        });
        it('returns QC max insurable for QC', () => {
            expect(getCurrentMaxInsurable('QC')).toBe(101000);
        });
    });

    describe('getIndividualMaxWeeks', () => {
        it('returns 32 for QC regardless of plan', () => {
            expect(getIndividualMaxWeeks('QC', 'STANDARD')).toBe(32);
            expect(getIndividualMaxWeeks('QC', 'EXTENDED')).toBe(32);
        });
        it('returns 35 for standard outside QC', () => {
            expect(getIndividualMaxWeeks('ON', 'STANDARD')).toBe(35);
        });
        it('returns 61 for extended outside QC', () => {
            expect(getIndividualMaxWeeks('ON', 'EXTENDED')).toBe(61);
        });
    });

    describe('getMaxWeeks', () => {
        it('returns 37 for QC', () => {
            expect(getMaxWeeks('QC', 'STANDARD')).toBe(37); // 32 + 5
        });
        it('returns 40 for standard outside QC', () => {
            expect(getMaxWeeks('ON', 'STANDARD')).toBe(40);
        });
        it('returns 69 for extended outside QC', () => {
            expect(getMaxWeeks('ON', 'EXTENDED')).toBe(69);
        });
    });

    describe('isBonusWeeksActive', () => {
        it('returns true if combined exceeds individual max', () => {
            expect(isBonusWeeksActive(36, 35)).toBe(true);
        });
        it('returns false if combined does not exceed individual max', () => {
            expect(isBonusWeeksActive(35, 35)).toBe(false);
            expect(isBonusWeeksActive(30, 35)).toBe(false);
        });
    });

    describe('calculateParentalLeave', () => {
        it('calculates standard leave for ON with maternity', () => {
            const params = {
                province: 'ON',
                salary: 100000, // Capped at 68,900
                partnerSalary: 60000,
                hasPartner: true,
                planType: 'STANDARD',
                p1Weeks: 35,
                p2Weeks: 5,
                p1Maternity: true
            };
            const result = calculateParentalLeave(params);
            
            expect(result.maternityWeeks).toBe(15);
            expect(result.maternityWeekly).toBeCloseTo(728.75, 1); 
            expect(result.maternityTotal).toBe(result.maternityWeekly * 15);

            expect(result.p1Weeks).toBe(35);
            expect(result.p1Weekly).toBeCloseTo(728.75, 1);
            expect(result.p1Total).toBe(result.p1Weekly * 35);

            expect(result.p2Weeks).toBe(5);
            expect(result.p2Weekly).toBeCloseTo(634.62, 1); 
            expect(result.p2Total).toBe(result.p2Weekly * 5);
            
            expect(result.totalDuration).toBe(55); 
            expect(result.totalValue).toBeCloseTo(result.maternityTotal + result.p1Total + result.p2Total, 1);
        });

        it('calculates extended leave for ON without maternity', () => {
            const params = {
                province: 'ON',
                salary: 50000, 
                partnerSalary: 0,
                hasPartner: false,
                planType: 'EXTENDED',
                p1Weeks: 61,
                p2Weeks: 0,
                p1Maternity: false
            };
            const result = calculateParentalLeave(params);
            
            expect(result.maternityWeeks).toBe(0);
            expect(result.maternityTotal).toBe(0);

            expect(result.p1Weekly).toBeCloseTo(317.31, 1);
            expect(result.p1Total).toBe(result.p1Weekly * 61);
            
            expect(result.p2Total).toBe(0);
        });

        it('calculates QPIP (QC) leave with maternity', () => {
            const params = {
                province: 'QC',
                salary: 120000, 
                partnerSalary: 80000,
                hasPartner: true,
                planType: 'STANDARD',
                p1Weeks: 32,
                p2Weeks: 5,
                p1Maternity: true
            };
            const result = calculateParentalLeave(params);
            
            expect(result.maternityWeeks).toBe(18);
            expect(result.maternityWeekly).toBeCloseTo(1359.62, 1);
            expect(result.maternityTotal).toBe(result.maternityWeekly * 18);

            expect(result.p1Weekly).toBeCloseTo(1359.62, 1);
            expect(result.p2Weekly).toBeCloseTo(1076.92, 1);
        });
        
        it('calculates QPIP (QC) leave without maternity', () => {
            const params = {
                province: 'QC',
                salary: 80000, 
                partnerSalary: 0,
                hasPartner: false,
                planType: 'STANDARD',
                p1Weeks: 32,
                p2Weeks: 0,
                p1Maternity: false
            };
            const result = calculateParentalLeave(params);
            
            expect(result.maternityWeeks).toBe(0); 
            expect(result.maternityTotal).toBe(0); 
            expect(result.p1Weekly).toBeCloseTo(1076.92, 1); 
        });
    });
});
