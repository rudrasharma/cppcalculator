import { PROVINCIAL_FACTORS } from '../data/groceryData';

/**
 * Pure function to calculate grocery totals and inflation metrics
 * @param {Array} cart - Array of grocery items
 * @param {number} years - Number of years to project
 * @param {string} province - Province code (e.g., 'ON', 'BC')
 * @returns {Object} - Object containing current, future, avgInflation, and increasePercent
 */
export const calculateGroceryTotals = (cart = [], years = 5, province = 'ON') => {
    const provData = PROVINCIAL_FACTORS[province] || PROVINCIAL_FACTORS['ON'];
    const current = cart.reduce((sum, item) => sum + (item.price * provData.factor), 0);
    
    const future = cart.reduce((sum, item) => {
        // Blended rate of item-specific and provincial inflation trends
        const combinedRate = (item.inflation + provData.inflation) / 2 / 100;
        return sum + (item.price * provData.factor * Math.pow(1 + combinedRate, years));
    }, 0);
    
    const avgInflation = cart.length > 0 
        ? cart.reduce((sum, i) => sum + i.inflation, 0) / cart.length 
        : 4.7;

    return { 
        current: current || 0, 
        future: future || 0, 
        avgInflation,
        increasePercent: current > 0 ? ((future / current - 1) * 100) : 0
    };
};

/**
 * Calculate future price for a single item
 * @param {Object} item - Grocery item object
 * @param {number} years - Number of years to project
 * @param {string} province - Province code
 * @returns {number} - Future price
 */
export const calculateItemFuturePrice = (item, years = 5, province = 'ON') => {
    const provData = PROVINCIAL_FACTORS[province] || PROVINCIAL_FACTORS['ON'];
    const combinedRate = (item.inflation + provData.inflation) / 2 / 100;
    return item.price * provData.factor * Math.pow(1 + combinedRate, years);
};

/**
 * Calculate regional price for an item
 * @param {Object} item - Grocery item object
 * @param {string} province - Province code
 * @returns {number} - Regional price
 */
export const calculateRegionalPrice = (item, province = 'ON') => {
    const provData = PROVINCIAL_FACTORS[province] || PROVINCIAL_FACTORS['ON'];
    return item.price * provData.factor;
};

