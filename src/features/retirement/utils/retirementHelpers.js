import { CURRENT_YEAR, getYMPE } from '../../../utils/constants';

/**
 * Apply average salary to earnings history
 * @param {Object} earnings - Current earnings object
 * @param {string} avgSalaryInput - Average salary input string
 * @param {Array} years - Array of years to process
 * @param {number} birthYear - Birth year
 * @returns {Object} - New earnings object
 */
export const applyAverageSalary = (earnings, avgSalaryInput, years, birthYear) => {
    if (!avgSalaryInput || avgSalaryInput <= 0) return earnings;
    
    const currentYMPE = getYMPE(CURRENT_YEAR);
    const peakRatio = parseFloat(avgSalaryInput) / currentYMPE;

    const newEarnings = { ...earnings };
    
    const getAgeFactor = (age) => {
        if (age < 22) return 0.3;  
        if (age < 25) return 0.6;  
        if (age < 30) return 0.8;  
        if (age < 35) return 0.9;  
        return 1.0;                
    };

    years.forEach(year => {
        const age = year - birthYear;
        const isFuture = year >= CURRENT_YEAR;
        const isEmpty = newEarnings[year] === undefined;

        if (isFuture || isEmpty) {
            const yYMPE = getYMPE(year);
            const ageFactor = isFuture ? 1.0 : getAgeFactor(age); 
            newEarnings[year] = Math.round(yYMPE * peakRatio * ageFactor);
        }
    });
    
    return newEarnings;
};

/**
 * Calculate display values with inflation and tax factors
 * @param {Object} results - Calculation results
 * @param {boolean} useFutureDollars - Whether to apply inflation
 * @param {boolean} showNet - Whether to apply tax factor
 * @param {number} retirementAge - Retirement age
 * @param {number} birthYear - Birth year
 * @param {number} taxRate - Tax rate (default 0.15)
 * @returns {Object} - Display values and percentages
 */
export const calculateDisplayValues = (results, useFutureDollars, showNet, retirementAge, birthYear, taxRate = 0.15) => {
    const inflationFactor = useFutureDollars ? Math.pow(1.025, retirementAge - (CURRENT_YEAR - birthYear)) : 1;
    const taxFactor = showNet ? (1 - taxRate) : 1; 
    
    const displayTotal = (results.grandTotal || 0) * inflationFactor * taxFactor;
    const displayCPP = (results.cpp.total || 0) * inflationFactor * taxFactor;
    const displayOAS = (results.oas.total || 0) * inflationFactor * taxFactor;
    const displayGIS = (results.gis.total || 0) * inflationFactor * taxFactor;

    const totalRaw = displayTotal || 1; 
    const cppPerc = (displayCPP / totalRaw) * 100;
    const oasPerc = (displayOAS / totalRaw) * 100;
    const gisPerc = (displayGIS / totalRaw) * 100;

    return {
        displayTotal,
        displayCPP,
        displayOAS,
        displayGIS,
        cppPerc,
        oasPerc,
        gisPerc,
        inflationFactor,
        taxFactor
    };
};

/**
 * Calculate comparison message data between two retirement ages
 * @param {Object} comparisonSnapshot - Snapshot data
 * @param {number} retirementAge - Current retirement age
 * @param {Array} currentBreakevenData - Current breakeven data
 * @param {Array} snapshotBreakevenData - Snapshot breakeven data
 * @returns {Object|null} - Comparison message data or null
 */
export const calculateComparisonMessage = (comparisonSnapshot, retirementAge, currentBreakevenData, snapshotBreakevenData) => {
    if (!comparisonSnapshot || comparisonSnapshot.age === retirementAge) return null;
    
    const isCurrentLater = retirementAge > comparisonSnapshot.age;
    const lateAge = isCurrentLater ? retirementAge : comparisonSnapshot.age;
    const earlyAge = isCurrentLater ? comparisonSnapshot.age : retirementAge;
    let foundCrossover = null;

    for (let i = 0; i < currentBreakevenData.length; i++) {
        const age = currentBreakevenData[i].age;
        if (age <= lateAge) continue; 
        const currentTotal = currentBreakevenData[i].Selected;
        const snapshotTotal = snapshotBreakevenData.find(d => d.age === age)?.Selected || 0;
        if (isCurrentLater) { 
            if (currentTotal > snapshotTotal) { 
                foundCrossover = age; 
                break; 
            } 
        } else { 
            if (snapshotTotal > currentTotal) { 
                foundCrossover = age; 
                break; 
            } 
        }
    }

    return {
        lateAge,
        earlyAge,
        foundCrossover,
        hasCrossover: foundCrossover !== null
    };
};

