import { calculateFederalTax, calculateProvincialTax } from '../../tax/utils/taxEngine.js';

const OAS_CLAWBACK_THRESHOLD = 90997; // 2024 value approx
const OAS_CLAWBACK_RATE = 0.15;

/**
 * Calculates the total tax (Federal + Provincial) for a given taxable income.
 */
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
        startAge,
        endAge,
        targetIncome,
        inflation,
        returnRate,
        balances: initialBalances,
        pension,
        cpp,
        oas,
        drawdownOrder = ['nonReg', 'rrsp', 'lira', 'tfsa'],
        province = 'ON'
    } = params;

    const num = (val) => parseFloat(val) || 0;

    const startAgeNum = num(startAge);
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

    for (let age = startAgeNum; age <= endAgeNum; age++) {
        const yearsDiff = age - startAgeNum;
        const inflationFactor = Math.pow(1 + inflationNum, yearsDiff);

        // 1. Fixed Incomes (Indexed to inflation)
        // Note: For simplistic planning, we assume employer pensions are also fully indexed.
        const pAmount = age >= num(pension.startAge) ? num(pension.amount) * inflationFactor : 0;
        const cAmount = age >= num(cpp.startAge) ? num(cpp.amount) * inflationFactor : 0;
        let oAmount = age >= num(oas.startAge) ? num(oas.amount) * inflationFactor : 0;

        let fixedTaxable = pAmount + cAmount + oAmount;

        // 2. Withdraw to hit target
        let currentCash = pAmount + cAmount + oAmount;
        let currentTaxable = fixedTaxable;
        
        // Deflate to today's dollars to avoid tax bracket creep
        const realFixedTaxable = currentTaxable / inflationFactor;
        const realOAmount = oAmount / inflationFactor;

        let tax = getTax(realFixedTaxable, province) * inflationFactor;
        let clawback = getOasClawback(realFixedTaxable, realOAmount) * inflationFactor;
        
        let netCash = currentCash - tax - clawback;
        
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

    return {
        history,
        isDepleted,
        ageOfDepletion,
        finalEstate: history[history.length - 1].totalBalance
    };
};
