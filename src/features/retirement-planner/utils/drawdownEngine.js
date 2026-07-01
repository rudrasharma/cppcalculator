import { calculateFederalTax, calculateProvincialTax } from '../../tax/utils/taxEngine.js';
import { GIS_PARAMS } from '../../../utils/constants.js';

const OAS_CLAWBACK_THRESHOLD = 90997; // 2024 approx
const OAS_CLAWBACK_RATE = 0.15;

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
    if (taxableIncome <= 0) return 0;
    const fed = calculateFederalTax(taxableIncome, taxableIncome);
    const prov = calculateProvincialTax(taxableIncome, province);
    return fed + prov;
};

const getOasClawback = (taxableIncome, oasAmount) => {
    if (taxableIncome <= OAS_CLAWBACK_THRESHOLD) return 0;
    const excess = taxableIncome - OAS_CLAWBACK_THRESHOLD;
    const clawback = excess * OAS_CLAWBACK_RATE;
    return Math.min(clawback, oasAmount);
};

const getOasEligibleBase = (yearsInCanada, startAge) => {
    const baseOAS = 8560; // Approx max annual 2024
    const validYears = Math.min(Math.max(0, yearsInCanada), 40);
    let eligible = 0;
    if (validYears >= 10 && validYears < 40) eligible = baseOAS * (validYears / 40);
    else if (validYears >= 40) eligible = baseOAS;

    const delayYears = Math.max(0, Math.min((parseFloat(startAge) || 0) - 65, 5));
    return eligible * (1 + (delayYears * 0.072));
};

const calculateGIS = (familyIncome, hasSpouse, spouseGetsOAS) => {
    let params;
    if (!hasSpouse) {
        params = GIS_PARAMS.SINGLE;
    } else if (spouseGetsOAS) {
        params = GIS_PARAMS.MARRIED_SPOUSE_OAS;
    } else {
        params = GIS_PARAMS.MARRIED_SPOUSE_NO_OAS;
    }
    if (familyIncome >= params.limit) return 0;
    const annualMax = params.max * 12;
    const gis = annualMax - (familyIncome * params.rate);
    return Math.max(0, gis);
};

export const calculateRetirementDrawdown = (params) => {
    const num = (val) => parseFloat(val) || 0;

    const {
        hasSpouse = false,
        spouse = {},
        currentAge, startAge, endAge, targetIncome,
        inflation, returnRate, balances: initialBalances,
        contributions, pension, cpp, oas, yearsInCanada = 40,
        drawdownOrder = ['nonReg', 'rrsp', 'lira', 'tfsa'],
        province = 'ON',
        yearlyInflationGenerator, yearlyReturnGenerator
    } = params;

    const primaryStartAge = currentAge !== undefined ? num(currentAge) : num(startAge);
    const primaryEndAge = Math.max(primaryStartAge, num(endAge));
    const maxYears = primaryEndAge - primaryStartAge;

    const history = [];

    let currentBalances = {
        primary: { tfsa: num(initialBalances?.tfsa), rrsp: num(initialBalances?.rrsp), lira: num(initialBalances?.lira) },
        spouse: { tfsa: num(spouse?.balances?.tfsa), rrsp: num(spouse?.balances?.rrsp), lira: num(spouse?.balances?.lira) },
        joint: { nonReg: num(initialBalances?.nonReg) }
    };
    let currentBookValue = { nonReg: num(initialBalances?.nonRegBookValue) || num(initialBalances?.nonReg) };

    let currentTarget = num(targetIncome);
    let isDepleted = false;
    let ageOfDepletion = null;
    let currentInflationFactor = 1;
    let currentGIS = 0; 

    for (let year = 0; year <= maxYears; year++) {
        const pAge = primaryStartAge + year;
        const sAge = hasSpouse ? num(spouse.currentAge) + year : null;

        const currentInflation = yearlyInflationGenerator ? yearlyInflationGenerator() : num(inflation);
        const currentReturn = yearlyReturnGenerator ? yearlyReturnGenerator() : num(returnRate);

        if (year > 0) currentInflationFactor *= (1 + currentInflation);
        const infFactor = currentInflationFactor;

        const pWorking = pAge < num(startAge);
        const sWorking = hasSpouse && sAge < num(spouse.startAge);

        // Apply Working Income offsets
        let pWorkingIncome = pWorking ? num(params.workingIncome) * infFactor : 0;
        let sWorkingIncome = sWorking ? num(spouse.workingIncome) * infFactor : 0;
        let familyWorkingIncome = pWorkingIncome + sWorkingIncome;

        // Safeguard: If everyone is working (pure accumulation phase), assume their income fully covers their lifestyle
        // so we don't accidentally drain the portfolio before they retire if they didn't input a working income.
        if (pWorking && (!hasSpouse || sWorking)) {
            familyWorkingIncome = Math.max(currentTarget, familyWorkingIncome);
        }

        // Drawdown phase for at least one person
        let pPension = pAge >= num(pension.startAge) ? num(pension.amount) * infFactor : 0;
        let pCPP = pAge >= num(cpp.startAge) ? num(cpp.amount) * infFactor : 0;
        let pOAS = pAge >= num(oas.startAge) ? getOasEligibleBase(num(yearsInCanada), num(oas.startAge)) * infFactor : 0;

        let sPension = hasSpouse && sAge >= num(spouse.pension?.startAge) ? num(spouse.pension?.amount) * infFactor : 0;
        let sCPP = hasSpouse && sAge >= num(spouse.cpp?.startAge) ? num(spouse.cpp?.amount) * infFactor : 0;
        let sOAS = hasSpouse && sAge >= num(spouse.oas?.startAge) ? getOasEligibleBase(num(spouse.yearsInCanada), num(spouse.oas?.startAge)) * infFactor : 0;

        // Pension Splitting (Simple 50% shift of DB Pension if age > 65)
        if (hasSpouse && pAge >= 65 && sAge >= 65) {
            if (pPension > sPension) {
                const shift = (pPension - sPension) / 2;
                pPension -= shift;
                sPension += shift;
            } else if (sPension > pPension) {
                const shift = (sPension - pPension) / 2;
                sPension -= shift;
                pPension += shift;
            }
        }

        const pullFrom = (person, type, amount) => {
            const avail = currentBalances[person][type];
            const pull = Math.min(avail, amount);
            currentBalances[person][type] -= pull;
            return pull;
        };

        const pullFromJoint = (amount) => {
            const avail = currentBalances.joint.nonReg;
            const pull = Math.min(avail, amount);
            currentBalances.joint.nonReg -= pull;
            return pull;
        };

        // Forced Minimums
        let pRrifForced = pAge >= 72 ? pullFrom('primary', 'rrsp', currentBalances.primary.rrsp * getRrifFactor(pAge)) : 0;
        let pLifForced = pAge >= 72 ? pullFrom('primary', 'lira', currentBalances.primary.lira * getRrifFactor(pAge)) : 0;
        
        let sRrifForced = hasSpouse && sAge >= 72 ? pullFrom('spouse', 'rrsp', currentBalances.spouse.rrsp * getRrifFactor(sAge)) : 0;
        let sLifForced = hasSpouse && sAge >= 72 ? pullFrom('spouse', 'lira', currentBalances.spouse.lira * getRrifFactor(sAge)) : 0;

        let pTaxable = pPension + pCPP + pOAS + pRrifForced + pLifForced;
        let sTaxable = sPension + sCPP + sOAS + sRrifForced + sLifForced;

        // Calculate tax based on real dollars
        const pRealTaxable = pTaxable / infFactor;
        const sRealTaxable = sTaxable / infFactor;
        
        let pTax = getTax(pRealTaxable, province) * infFactor;
        let sTax = getTax(sRealTaxable, province) * infFactor;
        
        let pClawback = getOasClawback(pRealTaxable, pOAS / infFactor) * infFactor;
        let sClawback = getOasClawback(sRealTaxable, sOAS / infFactor) * infFactor;

        // Family Income for GIS (Excluding OAS). Only eligible if at least one is 65+
        let gisDelta = 0;
        if (pAge >= 65 || (hasSpouse && sAge >= 65)) {
            let famRealIncomeExOAS = ((pTaxable - pOAS) + (sTaxable - sOAS)) / infFactor;
            let newGIS = calculateGIS(famRealIncomeExOAS, hasSpouse, sOAS > 0) * infFactor;
            gisDelta = newGIS - currentGIS;
            currentGIS = newGIS;
        } else {
            currentGIS = 0;
        }

        let familyNetCash = (pTaxable + sTaxable) - (pTax + sTax) - (pClawback + sClawback) + gisDelta;
        let shortfall = currentTarget - familyNetCash;

        let utilizedWorkingIncome = 0;
        if (shortfall > 0) {
            utilizedWorkingIncome = Math.min(shortfall, familyWorkingIncome);
            shortfall -= utilizedWorkingIncome;
        }

        // Safeguard: If everyone is working (pure accumulation phase), assume their income fully covers their lifestyle
        // so we don't accidentally drain the portfolio before they retire if they didn't input a working income.
        if (pWorking && (!hasSpouse || sWorking)) {
            if (shortfall > 0) {
                utilizedWorkingIncome += shortfall;
                shortfall = 0;
            }
        }

        let withdrawals = { nonReg: 0, rrsp: pRrifForced + sRrifForced, lira: pLifForced + sLifForced, tfsa: 0 };

        // Pull to meet shortfall
        if (shortfall > 0) {
            let accountsExhausted = false;

            while (shortfall > 10 && !accountsExhausted) {
                let chunkFound = false;
                const chunk = Math.min(shortfall, 5000);

                for (const acct of drawdownOrder) {
                    if (chunkFound) break;

                    if (acct === 'tfsa' || acct === 'rrsp' || acct === 'lira') {
                        // Proportional pull from primary and spouse
                        const pBal = currentBalances.primary[acct];
                        const sBal = hasSpouse ? currentBalances.spouse[acct] : 0;
                        const totalBal = pBal + sBal;

                        if (totalBal > 0) {
                            const pPull = pullFrom('primary', acct, chunk * (pBal / totalBal));
                            const sPull = hasSpouse ? pullFrom('spouse', acct, chunk * (sBal / totalBal)) : 0;
                            const totalPull = pPull + sPull;

                            withdrawals[acct] += totalPull;

                            if (acct === 'rrsp' || acct === 'lira') {
                                // Add to taxable and recalculate tax
                                pTaxable += pPull;
                                sTaxable += sPull;

                                pTax = getTax(pTaxable / infFactor, province) * infFactor;
                                sTax = getTax(sTaxable / infFactor, province) * infFactor;
                                
                                pClawback = getOasClawback(pTaxable / infFactor, pOAS / infFactor) * infFactor;
                                sClawback = getOasClawback(sTaxable / infFactor, sOAS / infFactor) * infFactor;
                                
                                let famRealIncomeExOAS = ((pTaxable - pOAS) + (sTaxable - sOAS)) / infFactor;
                                if (pAge >= 65 || (hasSpouse && sAge >= 65)) {
                                    currentGIS = calculateGIS(famRealIncomeExOAS, hasSpouse, sOAS > 0) * infFactor;
                                } else {
                                    currentGIS = 0;
                                }

                                let cashTaxableSources = pPension + sPension + pCPP + sCPP + pOAS + sOAS + withdrawals.rrsp + withdrawals.lira;
                                familyNetCash = cashTaxableSources - (pTax + sTax) - (pClawback + sClawback) + currentGIS;
                                shortfall = currentTarget - familyNetCash - withdrawals.nonReg - withdrawals.tfsa;

                                utilizedWorkingIncome = 0;
                                if (shortfall > 0) {
                                    utilizedWorkingIncome = Math.min(shortfall, familyWorkingIncome);
                                    shortfall -= utilizedWorkingIncome;
                                }
                                if (pWorking && (!hasSpouse || sWorking)) {
                                    if (shortfall > 0) {
                                        utilizedWorkingIncome += shortfall;
                                        shortfall = 0;
                                    }
                                }
                            } else {
                                // TFSA is not taxable
                                shortfall -= totalPull;
                            }
                            chunkFound = true;
                        }
                    } else if (acct === 'nonReg') {
                        if (currentBalances.joint.nonReg > 0) {
                            // Non-Reg pull logic
                            // Simplified for brevity: roughly 50% inclusion on gains
                            let pullAmount = pullFromJoint(chunk);
                            withdrawals.nonReg += pullAmount;

                            const prePullBalance = currentBalances.joint.nonReg + pullAmount;
                            if (prePullBalance > 0 && prePullBalance > currentBookValue.nonReg) {
                                const gainProp = (prePullBalance - currentBookValue.nonReg) / prePullBalance;
                                const realizedGain = pullAmount * gainProp;
                                
                                // Split gain between primary and spouse
                                const pGain = realizedGain / (hasSpouse ? 2 : 1);
                                const sGain = hasSpouse ? realizedGain / 2 : 0;
                                
                                pTaxable += (pGain * 0.5);
                                sTaxable += (sGain * 0.5);

                                pTax = getTax(pTaxable / infFactor, province) * infFactor;
                                sTax = getTax(sTaxable / infFactor, province) * infFactor;
                                
                                pClawback = getOasClawback(pTaxable / infFactor, pOAS / infFactor) * infFactor;
                                sClawback = getOasClawback(sTaxable / infFactor, sOAS / infFactor) * infFactor;
                                
                                let famRealIncomeExOAS = ((pTaxable - pOAS) + (sTaxable - sOAS)) / infFactor;
                                if (pAge >= 65 || (hasSpouse && sAge >= 65)) {
                                    currentGIS = calculateGIS(famRealIncomeExOAS, hasSpouse, sOAS > 0) * infFactor;
                                } else {
                                    currentGIS = 0;
                                }

                                currentBookValue.nonReg = Math.max(0, currentBookValue.nonReg - (pullAmount - realizedGain));
                            } else {
                                currentBookValue.nonReg = Math.max(0, currentBookValue.nonReg - pullAmount);
                            }

                            let cashTaxableSources = pPension + sPension + pCPP + sCPP + pOAS + sOAS + withdrawals.rrsp + withdrawals.lira;
                            familyNetCash = cashTaxableSources - (pTax + sTax) - (pClawback + sClawback) + currentGIS;
                            shortfall = currentTarget - familyNetCash - withdrawals.nonReg - withdrawals.tfsa;

                            utilizedWorkingIncome = 0;
                            if (shortfall > 0) {
                                utilizedWorkingIncome = Math.min(shortfall, familyWorkingIncome);
                                shortfall -= utilizedWorkingIncome;
                            }
                            if (pWorking && (!hasSpouse || sWorking)) {
                                if (shortfall > 0) {
                                    utilizedWorkingIncome += shortfall;
                                    shortfall = 0;
                                }
                            }
                            chunkFound = true;
                        }
                    }
                }
                if (!chunkFound) accountsExhausted = true;
            }
        }

        if (shortfall < -10) {
            // Surplus, reinvest in non-reg
            currentBalances.joint.nonReg -= shortfall;
            currentBookValue.nonReg -= shortfall;
            shortfall = 0;
        }

        if (shortfall > 100 && !isDepleted) {
            isDepleted = true;
            ageOfDepletion = pAge;
        }

        const getTotalBalance = () => {
            return Object.values(currentBalances.primary).reduce((a, b) => a + b, 0) +
                   (hasSpouse ? Object.values(currentBalances.spouse).reduce((a, b) => a + b, 0) : 0) +
                   currentBalances.joint.nonReg;
        };

        history.push({
            age: pAge,
            balances: {
                tfsa: currentBalances.primary.tfsa + (hasSpouse ? currentBalances.spouse.tfsa : 0),
                rrsp: currentBalances.primary.rrsp + (hasSpouse ? currentBalances.spouse.rrsp : 0),
                lira: currentBalances.primary.lira + (hasSpouse ? currentBalances.spouse.lira : 0),
                nonReg: currentBalances.joint.nonReg
            },
            totalBalance: getTotalBalance(),
            incomes: {
                workingIncome: utilizedWorkingIncome,
                pension: pPension + sPension,
                cpp: pCPP + sCPP,
                oas: Math.max(0, pOAS - pClawback) + Math.max(0, sOAS - sClawback),
                gis: currentGIS,
                ...withdrawals
            },
            tax: pTax + sTax,
            clawback: pClawback + sClawback,
            netCash: currentTarget - (shortfall < 10 ? 0 : shortfall),
            targetIncome: currentTarget,
            shortfall: shortfall < 10 ? 0 : shortfall
        });

        // Growth and Contributions
        currentTarget = currentTarget * (1 + currentInflation);
        
        // Process Contributions if working (added before growth so they compound)
        if (pWorking) {
            currentBalances.primary.tfsa += num(contributions?.tfsa);
            currentBalances.primary.rrsp += num(contributions?.rrsp);
            currentBalances.joint.nonReg += (num(contributions?.nonReg) / (hasSpouse && sWorking ? 2 : 1));
            currentBookValue.nonReg += (num(contributions?.nonReg) / (hasSpouse && sWorking ? 2 : 1));
        }
        if (sWorking) {
            currentBalances.spouse.tfsa += num(spouse.contributions?.tfsa);
            currentBalances.spouse.rrsp += num(spouse.contributions?.rrsp);
            currentBalances.joint.nonReg += (num(spouse.contributions?.nonReg) / (pWorking ? 2 : 1));
            currentBookValue.nonReg += (num(spouse.contributions?.nonReg) / (pWorking ? 2 : 1));
        }

        currentBalances.primary.tfsa *= (1 + currentReturn);
        currentBalances.primary.rrsp *= (1 + currentReturn);
        currentBalances.primary.lira *= (1 + currentReturn);
        if (hasSpouse) {
            currentBalances.spouse.tfsa *= (1 + currentReturn);
            currentBalances.spouse.rrsp *= (1 + currentReturn);
            currentBalances.spouse.lira *= (1 + currentReturn);
        }
        currentBalances.joint.nonReg *= (1 + currentReturn);
    }

    const finalEstate = history.length > 0 ? history[history.length - 1].totalBalance : getTotalBalance();

    return { history, isDepleted, ageOfDepletion, finalEstate };
};
