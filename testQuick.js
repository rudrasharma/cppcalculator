import { calculateRetirementDrawdown } from './src/features/retirement-planner/utils/drawdownEngine.js';
const baseParams = {
    startAge: 65, endAge: 90, targetIncome: 80000,
    inflation: 0.02, returnRate: 0.05,
    balances: { tfsa: 500000, rrsp: 500000, nonReg: 0, lira: 0 },
    pension: { amount: 0, startAge: 65 }, cpp: { amount: 15000, startAge: 65 }, oas: { amount: 8000, startAge: 65 },
    province: 'ON', hasSpouse: false
};
const result = calculateRetirementDrawdown({ ...baseParams, drawdownOrder: ['rrsp', 'lira', 'nonReg', 'tfsa'] });
console.log(result.finalEstate);
console.log(result.ageOfDepletion);
