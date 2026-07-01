import { calculateRetirementDrawdown } from './src/features/retirement-planner/utils/drawdownEngine.js';

const defaultState = {
    currentAge: 40,
    startAge: 65,
    endAge: 90,
    targetIncome: 60000,
    workingIncome: 60000,
    inflation: 0.02,
    returnRate: 0.05,
    balances: {
        tfsa: 200000,
        rrsp: 500000,
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

console.log("Standard (RRSP first):", result1.finalEstate);
console.log("Tax-free First (TFSA first):", result2.finalEstate);
