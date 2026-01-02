/**
 * Universal Investment Growth Engine
 * Supports: Variable Frequencies (Daily/Weekly/Monthly/Yearly), Inflation, PMT
 */

const getRealRate = (nominal, inflation) => {
    if (!inflation) return nominal / 100;
    // Fisher Equation: (1 + n) = (1 + r)(1 + i)  =>  r = (1+n)/(1+i) - 1
    return ((1 + nominal / 100) / (1 + inflation / 100) - 1);
};

// Helper to get periods per year
const getFrequency = (type) => {
    switch(type) {
        case 'Daily': return 365;
        case 'Weekly': return 52;
        case 'Monthly': return 12;
        case 'Yearly': return 1;
        default: return 12;
    }
};

// 1. Solve for Future Value (FV)
export const calculateFutureValue = (pv, rate, years, pmt = 0, freq = 'Monthly', inflation = 0) => {
    const rAnnual = getRealRate(rate, inflation);
    const periodsPerYear = getFrequency(freq);
    
    // Periodic Rate
    const r = rAnnual / periodsPerYear; 
    const n = years * periodsPerYear;

    if (Math.abs(r) < 1e-9) return pv + (pmt * n);
    
    const fvLump = pv * Math.pow(1 + r, n);
    const fvPmt = pmt * ((Math.pow(1 + r, n) - 1) / r);
    
    return fvLump + fvPmt;
};

// 2. Solve for Present Value (PV)
export const calculatePresentValue = (fv, rate, years, pmt = 0, freq = 'Monthly', inflation = 0) => {
    const rAnnual = getRealRate(rate, inflation);
    const periodsPerYear = getFrequency(freq);
    
    const r = rAnnual / periodsPerYear;
    const n = years * periodsPerYear;

    if (Math.abs(r) < 1e-9) return fv - (pmt * n);

    // FV = PV*(1+r)^n + FV_pmt  =>  PV = (FV - FV_pmt) / (1+r)^n
    const fvPmt = pmt * ((Math.pow(1 + r, n) - 1) / r);
    return (fv - fvPmt) / Math.pow(1 + r, n);
};

// 3. Solve for Rate (CAGR) - Binary Search Iteration
export const calculateRate = (pv, fv, years, pmt = 0, freq = 'Monthly', inflation = 0) => {
    let low = -0.99; // -99%
    let high = 10.0; // 1000%
    let guess = 0.05;
    
    const periodsPerYear = getFrequency(freq);
    const n = years * periodsPerYear;

    for (let i = 0; i < 100; i++) {
        guess = (low + high) / 2;
        const r = guess / periodsPerYear; // Periodic rate based on annual guess
        
        let calcFv = 0;
        if (Math.abs(guess) < 1e-9) {
             calcFv = pv + (pmt * n);
        } else {
             calcFv = (pv * Math.pow(1 + r, n)) + (pmt * ((Math.pow(1 + r, n) - 1) / r));
        }

        if (Math.abs(calcFv - fv) < 1) break;
        
        if (calcFv < fv) low = guess;
        else high = guess;
    }
    
    // Return Nominal Rate (Standard convention)
    // If user asked for inflation adjustment, the engine usually solves for "What nominal rate do I need?"
    return guess * 100; 
};

// 4. Solve for Time (Duration)
export const calculateDuration = (pv, fv, rate, pmt = 0, freq = 'Monthly', inflation = 0) => {
    // Basic iterative solver (safest for mixed cashflows)
    let low = 0;
    let high = 100;
    let yearsGuess = 5;
    
    for(let i=0; i<50; i++) {
        yearsGuess = (low + high) / 2;
        const calcFv = calculateFutureValue(pv, rate, yearsGuess, pmt, freq, inflation);
        
        if (Math.abs(calcFv - fv) < 10) break;
        if (calcFv < fv) low = yearsGuess;
        else high = yearsGuess;
    }
    
    return yearsGuess;
};

// 5. Generate Chart Data (Optimized for Performance)
export const generateGrowthSeries = (pv, rate, years, pmt = 0, freq = 'Monthly', inflation = 0) => {
    const series = [];
    const rAnnual = getRealRate(rate, inflation);
    const periodsPerYear = getFrequency(freq);
    const r = rAnnual / periodsPerYear;
    
    // We calculate "snapshots" at the end of each year to keep the chart performant
    // instead of plotting every single day/week.
    
    for (let i = 0; i <= years; i++) {
        const n = i * periodsPerYear;
        
        let currentBalance = 0;
        let totalInvested = pv + (pmt * n);

        if (Math.abs(r) < 1e-9) {
            currentBalance = totalInvested;
        } else {
            const fvLump = pv * Math.pow(1 + r, n);
            const fvPmt = pmt * ((Math.pow(1 + r, n) - 1) / r);
            currentBalance = fvLump + fvPmt;
        }

        series.push({
            year: i,
            balance: Math.round(currentBalance),
            invested: Math.round(totalInvested),
            interest: Math.round(currentBalance - totalInvested)
        });
    }
    return series;
};