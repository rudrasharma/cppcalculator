import { calculateRetirementDrawdown } from './src/features/retirement-planner/utils/drawdownEngine.js';

const results = calculateRetirementDrawdown({
    startAge: 40,
    endAge: 90,
    targetIncome: 60000,
    inflation: 0.021,
    returnRate: 0.08,
    balances: {
        tfsa: 275000,
        rrsp: 600000,
        nonReg: 120000,
        lira: 22000
    },
    pension: { amount: 0, startAge: 65 },
    cpp: { amount: 10885, startAge: 65 },
    oas: { amount: 758, startAge: 65 },
    drawdownOrder: ['rrsp', 'lira', 'nonReg', 'tfsa'],
    province: 'ON'
});

const h50 = results.history.find(h => h.age === 50);
console.log("Age 50 History:", JSON.stringify(h50.incomes, null, 2));
console.log("Total Balance:", h50.totalBalance);
