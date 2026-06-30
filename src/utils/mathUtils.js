/**
 * Seeded pseudo-random number generator (Mulberry32)
 * Returns a function that generates a random number between 0 and 1.
 */
export const mulberry32 = (a) => {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

/**
 * Generates a normally distributed random number using the Box-Muller transform.
 * @param {number} mean The average (e.g., 0.05 for 5% return)
 * @param {number} stdDev The standard deviation (e.g., 0.10 for 10% volatility)
 * @param {function} randomFunc A function returning a random number between 0 and 1 (default Math.random)
 */
export const randomNormal = (mean = 0, stdDev = 1, randomFunc = Math.random) => {
    let u = 0, v = 0;
    while(u === 0) u = randomFunc(); // Converting [0,1) to (0,1)
    while(v === 0) v = randomFunc();
    const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return num * stdDev + mean;
};
