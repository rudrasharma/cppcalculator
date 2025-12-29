// src/hooks/useRetirementMath.js
import { useMemo } from 'react';
import { 
    getYMPE, getYAMPE, MAX_BASE_CPP_2025, MAX_OAS_2025, 
    OAS_CLAWBACK_THRESHOLD_2025, GIS_PARAMS, CURRENT_YEAR 
} from '../../../utils/constants';

export const useRetirementMath = ({
    earnings, dob, retirementAge, yearsInCanada, otherIncome,
    isMarried, spouseDob, spouseIncome, forceAllowance, children = []
}) => {
    return useMemo(() => {
        const birthYear = parseInt(dob.split('-')[0]);
        const startYear = birthYear + 18;
        const endYear = birthYear + retirementAge;
        
        // --- 1. Identify Child Rearing Years (CRDO) ---
        // A year is eligible if a child was age 0 to 6 at any point
        const crdoEligibleYears = new Set();
        children.forEach(childBirthYear => {
            if (!childBirthYear) return;
            // The provision applies to years the child is < 7.
            // This covers the birth year up to and including the year they turn 6.
            for (let y = childBirthYear; y <= childBirthYear + 6; y++) {
                if (y >= startYear && y < endYear) {
                    crdoEligibleYears.add(y);
                }
            }
        });

        // --- 2. Generate Initial Year Data ---
        const initialYears = [];
        for (let y = startYear; y < endYear; y++) initialYears.push(y);

        const yearData = initialYears.map(year => {
            const ympe = getYMPE(year);
            const yampe = getYAMPE(year);
            let rawIncome = parseFloat(earnings[year] || 0);
            
            // Tier 1 (Base)
            const tier1Income = Math.min(rawIncome, ympe); 
            const ratio = tier1Income / ympe;
            
            // Tier 2 (Enhanced)
            const isEnhancedYear = year >= 2019;
            const tier2Income = Math.max(0, Math.min(rawIncome, yampe) - ympe);
            
            return { 
                year, ratio, isEnhancedYear, tier1Income, tier2Income, ympe, yampe,
                isCrdoEligible: crdoEligibleYears.has(year)
            };
        });

        // --- 3. Apply CRDO Logic ---
        // Rule: If earnings in a CRDO-eligible year are lower than the average of NON-CRDO years, drop it.
        
        // Calculate average ratio of "normal" working years
        const normalYears = yearData.filter(d => !d.isCrdoEligible);
        const normalAverageRatio = normalYears.length > 0 
            ? normalYears.reduce((sum, d) => sum + d.ratio, 0) / normalYears.length
            : 0;

        // Filter the list: Keep normal years OR CRDO years that were actually high income
        // If it's a CRDO year AND ratio < normalAverage, it gets DROPPED.
        const afterCrdoYears = yearData.filter(d => {
            if (!d.isCrdoEligible) return true; // Keep normal years
            return d.ratio >= normalAverageRatio; // Keep CRDO years only if they beat the average
        });

        // --- 4. General Dropout (17%) ---
        // Now apply the standard dropout to the remaining pool
        const sortedByRatio = [...afterCrdoYears].sort((a, b) => a.ratio - b.ratio);
        
        // Note: The 17% is applied to the *original* contributory period length, 
        // minus the CRDO years dropped.
        const monthsToDrop = Math.floor(afterCrdoYears.length * 12 * 0.17);
        const retainedYears = sortedByRatio.slice(Math.floor(monthsToDrop / 12));
        
        const avgRatio = retainedYears.length > 0 
            ? retainedYears.reduce((sum, y) => sum + y.ratio, 0) / retainedYears.length 
            : 0;
            
        const baseBenefit = MAX_BASE_CPP_2025 * avgRatio;

        // --- 5. Enhanced CPP (Add-on) ---
        let enhancedTier1Total = 0, enhancedTier2Total = 0;
        const currentYMPE = getYMPE(CURRENT_YEAR);
        
        yearData.forEach(d => {
            if (d.isEnhancedYear) {
                // Tier 1 Credit
                enhancedTier1Total += (d.tier1Income / d.ympe) * (0.0833 / 40) * currentYMPE;
                
                // Tier 2 Credit
                if (d.year >= 2024) {
                    const spread = d.yampe - d.ympe;
                    if (spread > 0) {
                        const currentSpread = currentYMPE * 0.14;
                        enhancedTier2Total += (d.tier2Income / spread) * (0.3333 / 40) * currentSpread;
                    }
                }
            }
        });

        const enhancedBenefit = (enhancedTier1Total / 12) + (enhancedTier2Total / 12);
        const baseCppAt65 = baseBenefit + enhancedBenefit;

        // --- 6. Adjustments (Age 60-70) ---
        const monthsDiff = (retirementAge - 65) * 12;
        let cppAdjustmentPercent = 0;
        if (monthsDiff < 0) cppAdjustmentPercent = monthsDiff * 0.6;
        else if (monthsDiff > 0) cppAdjustmentPercent = Math.min(monthsDiff, 60) * 0.7;
        
        const finalCPP = baseCppAt65 * (1 + (cppAdjustmentPercent / 100));

        // --- 7. OAS, GIS, Clawback (Standard Logic) ---
        const validYears = Math.min(Math.max(0, yearsInCanada), 40);
        const baseOASAt65 = MAX_OAS_2025 * (validYears / 40);
        let oasGross = 0;
        if (retirementAge >= 65) {
            const oasMonthsDeferred = Math.min((retirementAge - 65) * 12, 60);
            oasGross = baseOASAt65 * (1 + (oasMonthsDeferred * 0.6 / 100));
        }

        const annualCPP = finalCPP * 12;
        const annualOAS = oasGross * 12;
        const annualOther = parseFloat(otherIncome) || 0;
        const totalNetWorldIncome = annualOther + annualCPP + annualOAS;
        
        let oasClawbackMonthly = 0;
        if (retirementAge >= 65 && totalNetWorldIncome > OAS_CLAWBACK_THRESHOLD_2025) {
            oasClawbackMonthly = ((totalNetWorldIncome - OAS_CLAWBACK_THRESHOLD_2025) * 0.15) / 12;
        }
        const finalOAS = Math.max(0, oasGross - oasClawbackMonthly);

        let gisAmount = 0;
        let gisNote = "GIS starts at age 65";
        if (retirementAge >= 65) {
            let params = GIS_PARAMS.SINGLE;
            let combinedIncome = annualCPP + annualOther;
            if (isMarried) {
                const spouseAnnual = parseFloat(spouseIncome) || 0;
                combinedIncome += spouseAnnual;
                const spBirthYear = parseInt(spouseDob.split('-')[0]);
                const spouseAgeAtRetirement = (birthYear + retirementAge) - spBirthYear;

                if (spouseAgeAtRetirement >= 65) params = GIS_PARAMS.MARRIED_SPOUSE_OAS;
                else if (spouseAgeAtRetirement >= 60) params = forceAllowance ? GIS_PARAMS.MARRIED_SPOUSE_ALLOWANCE : GIS_PARAMS.MARRIED_SPOUSE_NO_OAS;
                else params = GIS_PARAMS.MARRIED_SPOUSE_NO_OAS;
            }
            const annualClawback = Math.max(0, combinedIncome) * params.rate;
            gisAmount = Math.max(0, params.max - (annualClawback / 12));
        }

        // --- 8. Generate Insights (For CRDO) ---
        const insights = [];
        const droppedCrdoCount = yearData.length - afterCrdoYears.length;
        if (droppedCrdoCount > 0) {
            insights.push({
                type: 'success',
                text: `Child Rearing Dropout applied! We removed ${droppedCrdoCount} low-income years from your average.`
            });
        }
        if (retirementAge < 65) insights.push({ type: 'opportunity', text: `Retiring at ${retirementAge} reduces CPP by ${Math.abs(cppAdjustmentPercent).toFixed(1)}%.` });
        if (gisAmount > 0) insights.push({ type: 'success', text: `You qualify for ~$${gisAmount.toFixed(0)}/mo in GIS.` });

        // --- 9. Breakeven Data Calculation ---
        const breakevenData = [];
        const age65CPP = baseCppAt65;
        const age65OAS = MAX_OAS_2025 * (validYears / 40); 
        
        const age60CPP = baseCppAt65 * 0.64; 
        const age70CPP = baseCppAt65 * 1.42;
        const age70OAS = age65OAS * 1.36;

        let cum60 = 0, cum65 = 0, cum70 = 0, cumSelected = 0;
        let crossover65 = null, crossover70 = null;
        
        const userIsDistinct = retirementAge !== 60 && retirementAge !== 65 && retirementAge !== 70;

        for (let age = 60; age <= 95; age++) {
            // Early (60)
            if (age >= 60) cum60 += (age60CPP * 12);
            if (age >= 65) cum60 += (age65OAS * 12);

            // Standard (65)
            if (age >= 65) cum65 += (age65CPP * 12) + (age65OAS * 12);

            // Deferred (70)
            if (age >= 70) cum70 += (age70CPP * 12) + (age70OAS * 12);

            // User Selected
            if (age >= retirementAge) cumSelected += (finalCPP * 12);
            if (age >= (retirementAge < 65 ? 65 : retirementAge)) cumSelected += (finalOAS * 12); 

            // Crossovers
            if (!crossover65 && cum65 > cum60 && age > 65) crossover65 = age;
            if (!crossover70 && cum70 > cum65 && age > 70) crossover70 = age;

            // Data Point
            const dataPoint = {
                age,
                Early: Math.round(cum60),
                Standard: Math.round(cum65),
                Deferred: Math.round(cum70),
                Selected: Math.round(cumSelected) // ALWAYS include Selected
            };
            breakevenData.push(dataPoint);
        }

        return {
            cpp: { total: finalCPP, base: baseBenefit, enhanced: enhancedBenefit, adjustment: cppAdjustmentPercent },
            oas: { total: finalOAS, gross: oasGross, clawback: oasClawbackMonthly },
            gis: { total: gisAmount, note: gisNote },
            grandTotal: finalCPP + finalOAS + gisAmount,
            breakevenData,
            years: initialYears,
            insights, 
            crossovers: { age65: crossover65, age70: crossover70 },
            userIsDistinct,
            selectedAge: retirementAge
        };
    }, [earnings, dob, retirementAge, yearsInCanada, otherIncome, isMarried, spouseDob, spouseIncome, forceAllowance, children]);
};