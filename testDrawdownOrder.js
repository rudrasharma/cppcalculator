import { calculateRetirementDrawdown } from './src/features/retirement-planner/utils/drawdownEngine.js';

const baseParams = {
    currentAge: 65,
    startAge: 65,
    endAge: 90,
    targetIncome: 60000,
    inflation: 0.02,
    returnRate: 0.05,
    balances: { tfsa: 500000, rrsp: 500000, nonReg: 0, lira: 0 },
    pension: { amount: 0, startAge: 65 },
    cpp: { amount: 10000, startAge: 65 },
    oas: { amount: 8000, startAge: 65 },
    province: 'ON'
};

const result1 = calculateRetirementDrawdown({ ...baseParams, drawdownOrder: ['tfsa', 'rrsp', 'lira', 'nonReg'] });
const result2 = calculateRetirementDrawdown({ ...baseParams, drawdownOrder: ['rrsp', 'tfsa', 'lira', 'nonReg'] });

console.log("TFSA First Estate:", result1.finalEstate);
console.log("RRSP First Estate:", result2.finalEstate);
