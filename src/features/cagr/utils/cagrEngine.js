/**
 * Universal Investment Growth Engine (Inflation Aware)
 */

// Helper: Calculate Real Rate using Fisher Equation
const getRealRate = (nominalRate, inflationRate) => {
    if (!inflationRate) return nominalRate;
    return ((1 + nominalRate / 100) / (1 + inflationRate / 100) - 1) * 100;
};

// 1. Solve for CAGR (Real or Nominal)
export const calculateCAGR = (start, end, years, inflation = 0) => {
    if (!start || !end || !years || start <= 0 || years <= 0) return null;
    const nominalCAGR = (Math.pow(end / start, 1 / years) - 1) * 100;
    return inflation > 0 ? getRealRate(nominalCAGR, inflation) : nominalCAGR;
};

// 2. Solve for Future Value (Purchasing Power)
export const calculateFutureValue = (start, rate, years, inflation = 0) => {
    if (!start || rate === undefined || !years) return null;
    const effectiveRate = getRealRate(rate, inflation);
    const r = effectiveRate / 100;
    return start * Math.pow(1 + r, years);
};

// 3. Solve for Present Value (Real Capital Required)
export const calculatePresentValue = (end, rate, years, inflation = 0) => {
    if (!end || rate === undefined || !years) return null;
    const effectiveRate = getRealRate(rate, inflation);
    const r = effectiveRate / 100;
    return end / Math.pow(1 + r, years);
};

// 4. Solve for Time (Duration adjusted for drag)
export const calculateDuration = (start, end, rate, inflation = 0) => {
    if (!start || !end || rate === undefined || start <= 0 || rate <= 0) return null;
    const effectiveRate = getRealRate(rate, inflation);
    if (effectiveRate <= 0) return null; // Never reaches goal if inflation > rate
    const r = effectiveRate / 100;
    return Math.log(end / start) / Math.log(1 + r);
};