import { calculateRetirementDrawdown } from './src/features/retirement-planner/utils/drawdownEngine.js';

const defaultState = {
    currentAge: 65, // Let's just put them right at retirement so we can see
    startAge: 65,
    endAge: 90,
    targetIncome: 60000,
    workingIncome: 60000,
    inflation: 0.02,
    returnRate: 0.05,
    balances: {
        tfsa: 20000,
        rrsp: 50000,
        nonReg: 0,
        nonRegBookValue: 0,
        lira: 0
    },
    contributions: {
        tfsa: 0,
        rrsp: 0,
        nonReg: 0
    },
    pension: { amount: 0, startAge: 65 },
    cpp: { amount: 0, startAge: 65 },
    oas: { amount: 8000, startAge: 65 },
    province: 'ON',
    hasSpouse: false
};

const result1 = calculateRetirementDrawdown({ ...defaultState, drawdownOrder: ['nonReg', 'rrsp', 'lira', 'tfsa'] });
const result2 = calculateRetirementDrawdown({ ...defaultState, drawdownOrder: ['tfsa', 'nonReg', 'rrsp', 'lira'] });

console.log("RRSP First - Final Estate:", result1.finalEstate, "Depletion Age:", result1.ageOfDepletion);
console.log("TFSA First - Final Estate:", result2.finalEstate, "Depletion Age:", result2.ageOfDepletion);
