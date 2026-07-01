import { calculateRetirementDrawdown } from '../drawdownEngine.js';

const params = {
    currentAge: 40,
    startAge: 40,
    endAge: 90,
    targetIncome: 60000,
    inflation: 0.02,
    returnRate: 0.05,
    balances: { nonReg: 1000000 },
    pension: { amount: 0, startAge: 65 },
    cpp: { amount: 0, startAge: 65 },
    oas: { amount: 0, startAge: 65 }
};

const res = calculateRetirementDrawdown(params);
console.log("Length:", res.history.length);
if (res.history.length > 0) {
    console.log("Year 40:", res.history[0]);
}
