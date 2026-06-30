import { calculateFederalTax, calculateProvincialTax } from '../../tax/utils/taxEngine.js';

const OAS_CLAWBACK_THRESHOLD = 90997; // 2024 value approx
const OAS_CLAWBACK_RATE = 0.15;

/**
 * Calculates the total tax (Federal + Provincial) for a given taxable income.
 */
export const RRIF_MINIMUM_FACTORS = {
    71: 0.0528, 72: 0.0540, 73: 0.0553, 74: 0.0567, 75: 0.0582,
    76: 0.0598, 77: 0.0617, 78: 0.0636, 79: 0.0658, 80: 0.0682,
    81: 0.0708, 82: 0.0738, 83: 0.0771, 84: 0.0808, 85: 0.0851,
    86: 0.0899, 87: 0.0955, 88: 0.1021, 89: 0.1099, 90: 0.1192,
    91: 0.1306, 92: 0.1449, 93: 0.1634, 94: 0.1879
};

const getRrifFactor = (age) => {
    if (age < 72) return 0;
    if (age >= 95) return 0.20;
    return RRIF_MINIMUM_FACTORS[age] || 0.20;
};

const getTax = (taxableIncome, province) => {
    const fed = calculateFederalTax(taxableIncome, taxableIncome);
    const prov = calculateProvincialTax(taxableIncome, province);
    return fed + prov;
};

/**
 * Calculates the OAS clawback if taxable income exceeds the threshold.
 */
const getOasClawback = (taxableIncome, oasAmount) => {
    if (taxableIncome <= OAS_CLAWBACK_THRESHOLD) return 0;
    const excess = taxableIncome - OAS_CLAWBACK_THRESHOLD;
    const clawback = excess * OAS_CLAWBACK_RATE;
    return Math.min(clawback, oasAmount);
};

/**
 * Core engine for simulating retirement drawdown
 */
export const calculateRetirementDrawdown = (params) => {
    const {
        currentAge,
        startAge,
        endAge,
        targetIncome,
        inflation,
        returnRate,
        balances: initialBalances,
        contributions,
        pension,
        cpp,
        oas,
        yearsInCanada = 40,
        drawdownOrder = ['nonReg', 'rrsp', 'lira', 'tfsa'],
        province = 'ON'
    } = params;

    const num = (val) => parseFloat(val) || 0;

    const startAgeNum = num(startAge);
    const currentAgeNum = num(currentAge) || startAgeNum;
    const endAgeNum = num(endAge);
    const targetIncomeNum = num(targetIncome);
    const inflationNum = num(inflation);
    const returnRateNum = num(returnRate);
    
    const history = [];
    let currentBalances = { 
        tfsa: num(initialBalances?.tfsa),
        rrsp: num(initialBalances?.rrsp),
        nonReg: num(initialBalances?.nonReg),
        lira: num(initialBalances?.lira),
    };
    let currentBookValue = {
        nonReg: num(initialBalances?.nonRegBookValue) || num(initialBalances?.nonReg)
    };
    
    let currentTarget = targetIncomeNum;
    let isDepleted = false;
    let ageOfDepletion = null;

    for (let age = currentAgeNum; age <= endAgeNum; age++) {
        const yearsDiff = age - currentAgeNum;
        const inflationFactor = Math.pow(1 + inflationNum, yearsDiff);

        if (age < startAgeNum) {
            // Accumulation Phase
            const totalBalance = (currentBalances.tfsa || 0) + (currentBalances.rrsp || 0) + (currentBalances.nonReg || 0) + (currentBalances.lira || 0);
            
            history.push({
                age,
                balances: { ...currentBalances },
                totalBalance,
                incomes: {
                    pension: 0,
                    cpp: 0,
                    oas: 0,
                    nonReg: 0, rrsp: 0, lira: 0, tfsa: 0
                },
                tax: 0,
                clawback: 0,
                netCash: 0,
                targetIncome: 0,
                shortfall: 0
            });
            
            // Grow balances and add contributions
            currentTarget = currentTarget * (1 + inflationNum);
            
            currentBalances.tfsa = ((currentBalances.tfsa || 0) + num(contributions?.tfsa)) * (1 + returnRateNum);
            currentBalances.rrsp = ((currentBalances.rrsp || 0) + num(contributions?.rrsp)) * (1 + returnRateNum);
            
            const nonRegContrib = num(contributions?.nonReg);
            currentBalances.nonReg = ((currentBalances.nonReg || 0) + nonRegContrib) * (1 + returnRateNum);
            currentBookValue.nonReg += nonRegContrib; // contributions directly increase book value
            
            currentBalances.lira = (currentBalances.lira || 0) * (1 + returnRateNum); 
            
            continue;
        }

        // 1. Fixed Incomes (Indexed to inflation)
        // Note: For simplistic planning, we assume employer pensions are also fully indexed.
        const pAmount = age >= num(pension.startAge) ? num(pension.amount) * inflationFactor : 0;
        const cAmount = age >= num(cpp.startAge) ? num(cpp.amount) * inflationFactor : 0;
        
        const baseOAS = 8560;
        const delayYears = Math.max(0, Math.min(num(oas.startAge) - 65, 5));
        let oasEligibleBase = baseOAS * (1 + (delayYears * 0.072));
        
        const validYears = Math.min(Math.max(0, num(yearsInCanada)), 40);
        if (validYears < 10) {
            oasEligibleBase = 0; // Requires at least 10 years
        } else if (validYears < 40) {
            oasEligibleBase = oasEligibleBase * (validYears / 40);
        }
        
        let oAmount = age >= num(oas.startAge) ? oasEligibleBase * inflationFactor : 0;

        let fixedTaxable = pAmount + cAmount + oAmount;

        let withdrawals = {
            nonReg: 0,
            rrsp: 0,
            lira: 0,
            tfsa: 0
        };

        const pullFromAccount = (acctType, amountNeeded) => {
            const available = currentBalances[acctType] || 0;
            const pulled = Math.min(available, amountNeeded);
            currentBalances[acctType] -= pulled;
            withdrawals[acctType] += pulled;
            return pulled;
        };

        // --- RRIF/LIF Minimums ---
        let rrifForcedTaxable = 0;
        if (age >= 72) {
            const rrifFactor = getRrifFactor(age);
            
            if ((currentBalances.rrsp || 0) > 0) {
                const forcedRrsp = currentBalances.rrsp * rrifFactor;
                rrifForcedTaxable += pullFromAccount('rrsp', forcedRrsp);
            }
            
            if ((currentBalances.lira || 0) > 0) {
                const forcedLira = currentBalances.lira * rrifFactor;
                rrifForcedTaxable += pullFromAccount('lira', forcedLira);
            }
        }

        // 2. Withdraw to hit target
        let currentCash = pAmount + cAmount + oAmount + rrifForcedTaxable;
        let currentTaxable = fixedTaxable + rrifForcedTaxable;
        
        // Deflate to today's dollars to avoid tax bracket creep
        const realFixedTaxable = currentTaxable / inflationFactor;
        const realOAmount = oAmount / inflationFactor;

        let tax = getTax(realFixedTaxable, province) * inflationFactor;
        let clawback = getOasClawback(realFixedTaxable, realOAmount) * inflationFactor;
        
        let netCash = currentCash - tax - clawback;

        let shortfall = currentTarget - netCash;
        let accountsExhausted = false;

        // Dynamic precision step withdrawal to approximate progressive tax brackets
        while (shortfall > 10 && !accountsExhausted) {
            let chunkFound = false;
            
            for (const acct of drawdownOrder) {
                if ((currentBalances[acct] || 0) > 0) {
                    // Pull a chunk to cover the shortfall + estimated tax drag
                    let pullAmount = Math.min(1000 * inflationFactor, currentBalances[acct], shortfall * 1.5); 
                    pullAmount = pullFromAccount(acct, pullAmount);
                    
                    if (pullAmount > 0) {
                        chunkFound = true;
                        
                        if (acct === 'rrsp' || acct === 'lira') {
                            currentTaxable += pullAmount;
                        } else if (acct === 'nonReg') {
                            const prePullBalance = currentBalances.nonReg + pullAmount;
                            
                            if (prePullBalance > 0 && prePullBalance > currentBookValue.nonReg) {
                                const gainProportion = (prePullBalance - currentBookValue.nonReg) / prePullBalance;
                                const realizedGain = pullAmount * gainProportion;
                                currentTaxable += (realizedGain * 0.5); // 50% inclusion rate
                                
                                const returnOfCapital = pullAmount - realizedGain;
                                currentBookValue.nonReg = Math.max(0, currentBookValue.nonReg - returnOfCapital);
                            } else {
                                // If book value >= balance (loss or flat), no taxable gain, but book value reduces
                                currentBookValue.nonReg = Math.max(0, currentBookValue.nonReg - pullAmount);
                            }
                        }
                        
                        // Deflate taxable income to calculate taxes using today's progressive brackets
                        const realTaxable = currentTaxable / inflationFactor;
                        const realOAmount = oAmount / inflationFactor;

                        const realTax = getTax(realTaxable, province);
                        const realClawback = getOasClawback(realTaxable, realOAmount);

                        tax = realTax * inflationFactor;
                        clawback = realClawback * inflationFactor;

                        currentCash += pullAmount;
                        netCash = currentCash - tax - clawback;
                        shortfall = currentTarget - netCash;
                        
                        break; 
                    }
                }
            }

            if (!chunkFound) accountsExhausted = true;
        }

        if (shortfall < -10) {
            // We have a surplus from forced minimums! Reinvest into Non-Reg
            const surplusCash = -shortfall;
            currentBalances.nonReg = (currentBalances.nonReg || 0) + surplusCash;
            currentBookValue.nonReg += surplusCash;
            // Target is fully met
            shortfall = 0;
        }

        if (shortfall > 100 && !isDepleted) {
            isDepleted = true;
            ageOfDepletion = age;
        }

        const totalBalance = (currentBalances.tfsa || 0) + (currentBalances.rrsp || 0) + (currentBalances.nonReg || 0) + (currentBalances.lira || 0);

        history.push({
            age,
            balances: { ...currentBalances },
            totalBalance,
            incomes: {
                pension: pAmount,
                cpp: cAmount,
                oas: Math.max(0, oAmount - clawback),
                ...withdrawals
            },
            tax,
            clawback,
            netCash,
            targetIncome: currentTarget,
            shortfall: Math.max(0, shortfall)
        });

        // 3. Grow remaining balances and inflate target
        currentTarget = currentTarget * (1 + inflation);
        
        currentBalances.tfsa = (currentBalances.tfsa || 0) * (1 + returnRate);
        currentBalances.rrsp = (currentBalances.rrsp || 0) * (1 + returnRate);
        currentBalances.lira = (currentBalances.lira || 0) * (1 + returnRate);
        currentBalances.nonReg = (currentBalances.nonReg || 0) * (1 + returnRate);
    }

    const finalEstate = history.length > 0 
        ? history[history.length - 1].totalBalance 
        : ((balances.tfsa || 0) + (balances.rrsp || 0) + (balances.nonReg || 0) + (balances.lira || 0));

    return {
        history,
        isDepleted,
        ageOfDepletion,
        finalEstate
    };
};
