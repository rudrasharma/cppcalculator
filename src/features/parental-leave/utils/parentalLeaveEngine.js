import { EI_2025 } from '../../child-benefit/utils/constants.js';

/**
 * Calculate parental leave benefits and totals
 * @param {Object} params - Calculation parameters
 * @param {string} params.province - Province code (e.g., 'ON', 'QC')
 * @param {number} params.salary - Parent 1 annual salary
 * @param {number} params.partnerSalary - Parent 2 annual salary
 * @param {boolean} params.hasPartner - Whether there is a partner
 * @param {string} params.planType - 'STANDARD' or 'EXTENDED'
 * @param {number} params.p1Weeks - Parent 1 parental weeks
 * @param {number} params.p2Weeks - Parent 2 parental weeks
 * @param {boolean} params.p1Maternity - Whether Parent 1 takes maternity leave
 * @returns {Object} - Calculation results
 */
export const calculateParentalLeave = ({
    province,
    salary,
    partnerSalary,
    hasPartner,
    planType,
    p1Weeks,
    p2Weeks,
    p1Maternity
}) => {
    const isQuebec = province === 'QC';
    let data = {
        maternityWeekly: 0, 
        maternityWeeks: p1Maternity ? (isQuebec ? 18 : 15) : 0, 
        maternityTotal: 0,
        p1Weekly: 0, 
        p1Weeks: p1Weeks, 
        p1Total: 0,
        p2Weekly: 0, 
        p2Weeks: p2Weeks, 
        p2Total: 0,
        totalDuration: 0, 
        totalValue: 0
    };

    const insurableCap = isQuebec ? EI_2025.QC_MAX_INSURABLE : EI_2025.MAX_INSURABLE;
    const p1Insurable = Math.min(salary, insurableCap);
    const p2Insurable = Math.min(partnerSalary, insurableCap);
    const isExtended = planType === 'EXTENDED';

    if (!isQuebec) {
        // Maternity
        data.maternityWeekly = Math.min(EI_2025.MAX_WEEKLY_STD, (p1Insurable * EI_2025.STD_RATE) / 52);
        data.maternityTotal = data.maternityWeekly * data.maternityWeeks;

        // Parental
        const pRate = isExtended ? EI_2025.EXT_RATE : EI_2025.STD_RATE;
        const pMax = isExtended ? EI_2025.MAX_WEEKLY_EXT : EI_2025.MAX_WEEKLY_STD;

        data.p1Weekly = Math.min(pMax, (p1Insurable * pRate) / 52);
        data.p1Total = data.p1Weekly * data.p1Weeks;

        data.p2Weekly = Math.min(pMax, (p2Insurable * pRate) / 52);
        data.p2Total = data.p2Weekly * data.p2Weeks;
    } else {
        // Simplified QC
        data.maternityWeekly = (p1Insurable * 0.70) / 52;
        data.maternityTotal = data.maternityWeekly * data.maternityWeeks;
        data.p1Weekly = (p1Insurable * 0.70) / 52;
        data.p1Total = data.p1Weekly * data.p1Weeks;
        data.p2Weekly = (p2Insurable * 0.70) / 52;
        data.p2Total = data.p2Weekly * data.p2Weeks;
    }

    data.totalDuration = data.maternityWeeks + data.p1Weeks + data.p2Weeks;
    data.totalValue = data.maternityTotal + data.p1Total + data.p2Total;
    return data;
};

/**
 * Get current max insurable earnings based on province
 * @param {string} province - Province code
 * @returns {number} - Max insurable earnings
 */
export const getCurrentMaxInsurable = (province) => {
    return province === 'QC' ? EI_2025.QC_MAX_INSURABLE : EI_2025.MAX_INSURABLE;
};

/**
 * Get individual max weeks based on province and plan type
 * @param {string} province - Province code
 * @param {string} planType - 'STANDARD' or 'EXTENDED'
 * @returns {number} - Individual max weeks
 */
export const getIndividualMaxWeeks = (province, planType) => {
    if (province === 'QC') return 32;
    return planType === 'EXTENDED' ? 61 : 35;
};

/**
 * Get total max weeks based on province and plan type
 * @param {string} province - Province code
 * @param {string} planType - 'STANDARD' or 'EXTENDED'
 * @returns {number} - Total max weeks
 */
export const getMaxWeeks = (province, planType) => {
    if (province === 'QC') return 32 + 5;
    return planType === 'EXTENDED' ? 69 : 40;
};

/**
 * Check if bonus weeks are active
 * @param {number} combinedWeeks - Combined weeks from both parents
 * @param {number} individualMax - Individual max weeks
 * @returns {boolean} - Whether bonus weeks are active
 */
export const isBonusWeeksActive = (combinedWeeks, individualMax) => {
    return combinedWeeks > individualMax;
};
