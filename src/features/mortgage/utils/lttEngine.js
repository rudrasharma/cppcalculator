/**
 * Canadian Land Transfer Tax (LTT) Engine
 * Rates as of 2024/2025.
 */

export const PROVINCES = {
    ON: 'Ontario',
    BC: 'British Columbia',
    QC: 'Quebec',
    AB: 'Alberta',
    MB: 'Manitoba',
    SK: 'Saskatchewan',
    NS: 'Nova Scotia',
    NB: 'New Brunswick',
    PE: 'Prince Edward Island',
    NL: 'Newfoundland and Labrador',
};

/**
 * Calculates LTT based on province and city (specifically Toronto).
 */
export const calculateLTT = (price, province, isToronto = false, isFirstTimeBuyer = false) => {
    let totalTax = 0;
    let provincialTax = 0;
    let municipalTax = 0;
    let provincialRebate = 0;
    let municipalRebate = 0;

    switch (province) {
        case 'ON':
            provincialTax = calculateOntarioLTT(price);
            if (isToronto) {
                municipalTax = calculateTorontoLTT(price);
            }
            if (isFirstTimeBuyer) {
                provincialRebate = Math.min(provincialTax, 4000);
                if (isToronto) {
                    municipalRebate = Math.min(municipalTax, 4475);
                }
            }
            break;
        case 'BC':
            provincialTax = calculateBCLTT(price);
            if (isFirstTimeBuyer && price <= 835000) {
                // BC First Time Home Buyers' Program
                // Full exemption up to $500k, partial up to $835k (approx)
                // Simplified for this engine:
                if (price <= 500000) provincialRebate = provincialTax;
                else if (price <= 835000) {
                    const reduction = (835000 - price) / 335000;
                    provincialRebate = provincialTax * reduction;
                }
            }
            break;
        case 'QC':
            // Quebec (excluding Montreal which has its own tiers)
            // This is a simplified "Welcome Tax" calculation
            provincialTax = calculateQuebecLTT(price);
            break;
        case 'AB':
            // Alberta has no LTT, just registration fees
            // $50 + $2 per $5000 of value (approx)
            provincialTax = 50 + (price / 5000) * 2;
            break;
        case 'MB':
            provincialTax = calculateManitobaLTT(price);
            break;
        case 'SK':
            // Saskatchewan: 0.3% of value
            provincialTax = price * 0.003;
            break;
        case 'NS':
            // Nova Scotia: Varies by municipality. Halifax is 1.5%.
            provincialTax = price * 0.015;
            break;
        case 'NB':
            // New Brunswick: 1%
            provincialTax = price * 0.01;
            break;
        case 'PE':
            // PEI: 1% (exempt for first time buyers under $200k)
            provincialTax = price * 0.01;
            if (isFirstTimeBuyer && price <= 200000) provincialRebate = provincialTax;
            break;
        case 'NL':
            // NL: $100 for first $500 + $0.40 per $100 after (approx 0.4%)
            provincialTax = price * 0.004;
            break;
        default:
            provincialTax = 0;
    }

    totalTax = Math.max(0, provincialTax - provincialRebate) + Math.max(0, municipalTax - municipalRebate);

    return {
        totalTax,
        provincialTax,
        municipalTax,
        provincialRebate,
        municipalRebate,
    };
};

const calculateOntarioLTT = (price) => {
    let tax = 0;
    if (price > 0) tax += Math.min(price, 55000) * 0.005;
    if (price > 55000) tax += (Math.min(price, 250000) - 55000) * 0.01;
    if (price > 250000) tax += (Math.min(price, 400000) - 250000) * 0.015;
    if (price > 400000) tax += (Math.min(price, 2000000) - 400000) * 0.02;
    if (price > 2000000) tax += (price - 2000000) * 0.025;
    return tax;
};

const calculateTorontoLTT = (price) => {
    // Toronto LTT is now identical to Ontario LTT tiers as of 2024 for most properties
    // but has higher tiers for ultra-luxury
    let tax = 0;
    if (price > 0) tax += Math.min(price, 55000) * 0.005;
    if (price > 55000) tax += (Math.min(price, 250000) - 55000) * 0.01;
    if (price > 250000) tax += (Math.min(price, 400000) - 250000) * 0.015;
    if (price > 400000) tax += (Math.min(price, 2000000) - 400000) * 0.02;
    if (price > 2000000) tax += (Math.min(price, 3000000) - 2000000) * 0.035;
    if (price > 3000000) tax += (Math.min(price, 4000000) - 3000000) * 0.045;
    if (price > 4000000) tax += (Math.min(price, 5000000) - 4000000) * 0.055;
    if (price > 5000000) tax += (Math.min(price, 10000000) - 5000000) * 0.065;
    if (price > 10000000) tax += (Math.min(price, 20000000) - 10000000) * 0.075;
    if (price > 20000000) tax += (price - 20000000) * 0.085;
    return tax;
};

const calculateBCLTT = (price) => {
    let tax = 0;
    if (price > 0) tax += Math.min(price, 200000) * 0.01;
    if (price > 200000) tax += (Math.min(price, 2000000) - 200000) * 0.02;
    if (price > 2000000) tax += (price - 2000000) * 0.03;
    // Additional 2% for residential property value over $3M
    if (price > 3000000) tax += (price - 3000000) * 0.02;
    return tax;
};

const calculateQuebecLTT = (price) => {
    let tax = 0;
    if (price > 0) tax += Math.min(price, 58900) * 0.005;
    if (price > 58900) tax += (Math.min(price, 294600) - 58900) * 0.01;
    if (price > 294600) tax += (price - 294600) * 0.015;
    return tax;
};

const calculateManitobaLTT = (price) => {
    let tax = 0;
    if (price > 30000) tax += (Math.min(price, 90000) - 30000) * 0.005;
    if (price > 90000) tax += (Math.min(price, 150000) - 90000) * 0.01;
    if (price > 150000) tax += (Math.min(price, 200000) - 150000) * 0.015;
    if (price > 200000) tax += (price - 200000) * 0.02;
    return tax;
};
