import { calculateFederalTax, calculateProvincialTax } from '../../tax/utils/taxEngine';

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

    const history = [];
    let currentBalances = { ...initialBalances };
    
    let currentTarget = targetIncome;
    let isDepleted = false;
    let ageOfDepletion = null;

    for (let age = startAge; age <= endAge; age++) {
        // 1. Fixed Incomes
        const pAmount = age >= pension.startAge ? pension.amount : 0;
        const cAmount = age >= cpp.startAge ? cpp.amount : 0;
        let oAmount = age >= oas.startAge ? oas.amount : 0;

        let fixedTaxable = pAmount + cAmount + oAmount;

        // 2. Withdraw to hit target
        let currentCash = pAmount + cAmount + oAmount;
        let currentTaxable = fixedTaxable;
        
        let tax = getTax(currentTaxable, province);
        let clawback = getOasClawback(currentTaxable, oAmount);
        
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
                    let pullAmount = Math.min(1000, currentBalances[acct], shortfall * 1.5); 
                    pullAmount = pullFromAccount(acct, pullAmount);
                    
                    if (pullAmount > 0) {
                        chunkFound = true;
                        
                        if (acct === 'rrsp' || acct === 'lira') {
                            currentTaxable += pullAmount;
                        } else if (acct === 'nonReg') {
                            currentTaxable += (pullAmount * 0.25); // 50% cap gains * 50% inclusion
                        }
                        
                        tax = getTax(currentTaxable, province);
                        clawback = getOasClawback(currentTaxable, oAmount);
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
