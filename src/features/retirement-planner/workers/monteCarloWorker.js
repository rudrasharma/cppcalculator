import { calculateRetirementDrawdown } from '../utils/drawdownEngine.js';
import { randomNormal, mulberry32 } from '../../../utils/mathUtils.js';

// Configuration for Risk Profiles
const RISK_PROFILES = {
    'Conservative': { returnStdDev: 0.06, inflationStdDev: 0.01 },
    'Balanced': { returnStdDev: 0.11, inflationStdDev: 0.015 },
    'Aggressive': { returnStdDev: 0.15, inflationStdDev: 0.02 }
};

self.onmessage = (e) => {
    const { state, riskProfile = 'Balanced', iterations = 1000 } = e.data;
    
    const baseReturn = parseFloat(state.returnRate) || 0.05;
    const baseInflation = parseFloat(state.inflation) || 0.021;
    
    const profile = RISK_PROFILES[riskProfile] || RISK_PROFILES['Balanced'];
    const { returnStdDev, inflationStdDev } = profile;

    let successCount = 0;
    
    // We want to calculate the 10th percentile, and 90th percentile over time.
    // We'll keep track of the totalBalance for each age across all runs.
    const ageBalances = {}; // { age: [balance1, balance2, ..., balance1000] }

    for (let i = 0; i < iterations; i++) {
        const prng = mulberry32(1337 + i); // fixed seed for stable results
        
        // Pass a randomizer function to the engine so it can generate yearly returns
        const params = {
            ...state,
            // We pass a function that drawdownEngine can call to get the return rate for a specific year
            yearlyReturnGenerator: () => randomNormal(baseReturn, returnStdDev, prng),
            yearlyInflationGenerator: () => randomNormal(baseInflation, inflationStdDev, prng)
        };

        const result = calculateRetirementDrawdown(params);
        
        if (!result.isDepleted) {
            successCount++;
        }

        result.history.forEach(h => {
            if (!ageBalances[h.age]) ageBalances[h.age] = [];
            ageBalances[h.age].push(h.totalBalance);
        });
    }

    // Process percentiles
    const percentiles = [];
    Object.keys(ageBalances).forEach(age => {
        const balances = ageBalances[age].sort((a, b) => a - b);
        const p10 = balances[Math.floor(iterations * 0.10)];
        const p50 = balances[Math.floor(iterations * 0.50)];
        const p90 = balances[Math.floor(iterations * 0.90)];
        
        percentiles.push({
            age: parseInt(age),
            p10,
            p50,
            p90
        });
    });

    self.postMessage({
        probabilityOfSuccess: (successCount / iterations) * 100,
        percentiles
    });
};
