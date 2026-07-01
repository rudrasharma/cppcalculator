import { TAX_YEAR_CONFIG } from '../config/taxYears.js';
const { CURRENT_APP_YEAR, CPP } = TAX_YEAR_CONFIG;

export const PROVINCES = [
  { code: 'ON', name: 'Ontario', slug: 'ontario' },
  { code: 'BC', name: 'British Columbia', slug: 'bc' },
  { code: 'AB', name: 'Alberta', slug: 'alberta' },
  { code: 'QC', name: 'Quebec', slug: 'quebec' },
  { code: 'NS', name: 'Nova Scotia', slug: 'nova-scotia' },
  { code: 'MB', name: 'Manitoba', slug: 'manitoba' },
  { code: 'SK', name: 'Saskatchewan', slug: 'saskatchewan' },
  { code: 'NB', name: 'New Brunswick', slug: 'new-brunswick' },
  { code: 'NL', name: 'Newfoundland and Labrador', slug: 'newfoundland' },
  { code: 'PE', name: 'Prince Edward Island', slug: 'pei' },
];

export const SALARIES = [
  25000, 30000, 35000, 40000, 45000, 50000, 55000, 60000, 65000, 
  70000, 75000, 80000, 85000, 90000, 95000, 100000, 105000, 115000, 
  120000, 125000, 145000, 150000, 155000
];

export const FAMILY_SCENARIOS = [
  { slug: 'single-1-child', status: 'SINGLE', count: 1, label: "Single Parent (1 Child)" },
  { slug: 'single-2-children', status: 'SINGLE', count: 2, label: "Single Parent (2 Children)" },
  { slug: 'married-1-child', status: 'MARRIED', count: 1, label: "Couple (1 Child)" },
  { slug: 'married-2-children', status: 'MARRIED', count: 2, label: "Couple (2 Children)" },
  { slug: 'married-3-children', status: 'MARRIED', count: 3, label: "Couple (3 Children)" },
  { slug: 'married-4-children', status: 'MARRIED', count: 4, label: "Couple (4 Children)" }
];

// --- NEW PARENTAL LEAVE SCENARIOS ---
export const LEAVE_SCENARIOS = [
    { slug: 'standard-couple', plan: 'STANDARD', partner: true, label: "Standard 12-Month Leave (Couple)" },
    { slug: 'extended-couple', plan: 'EXTENDED', partner: true, label: "Extended 18-Month Leave (Couple)" },
    { slug: 'standard-solo', plan: 'STANDARD', partner: false, label: "Standard 12-Month Leave (Single Parent)" },
    { slug: 'extended-solo', plan: 'EXTENDED', partner: false, label: "Extended 18-Month Leave (Single Parent)" }
];

// ... existing exports ...



// ==========================================
//          5. MORTGAGE PAYDOWN
// ==========================================
export const MORTGAGE_SCENARIOS = [
    // --- 1. MAJOR BANKS (The "Big Six") ---
    {
        slug: 'rbc-mortgage-calculator',
        homePrice: 500000, downPayment: 100000, rate: 5.25, amortization: 25, freq: 'monthly',
        label: "RBC Mortgage Calculator Comparison",
        desc: "Calculate your Royal Bank of Canada (RBC) mortgage payments using standard semi-annual compounding."
    },
    {
        slug: 'td-mortgage-calculator',
        homePrice: 500000, downPayment: 100000, rate: 5.25, amortization: 25, freq: 'monthly',
        label: "TD Mortgage Calculator Comparison",
        desc: "Estimate your TD Canada Trust mortgage payments and see how prepayments can reduce your interest."
    },
    {
        slug: 'scotiabank-mortgage-calculator',
        homePrice: 500000, downPayment: 100000, rate: 5.25, amortization: 25, freq: 'monthly',
        label: "Scotiabank Mortgage Calculator",
        desc: "See your Scotiabank mortgage schedule and compare accelerated bi-weekly payment options."
    },
    {
        slug: 'bmo-mortgage-calculator',
        homePrice: 500000, downPayment: 100000, rate: 5.25, amortization: 25, freq: 'monthly',
        label: "BMO Mortgage Calculator",
        desc: "Calculate your Bank of Montreal (BMO) mortgage payments and total interest cost over time."
    },
    {
        slug: 'cibc-mortgage-calculator',
        homePrice: 500000, downPayment: 100000, rate: 5.25, amortization: 25, freq: 'monthly',
        label: "CIBC Mortgage Calculator",
        desc: "Estimate your CIBC home loan payments with precise Canadian compounding rules."
    },
    {
        slug: 'national-bank-mortgage-calculator',
        homePrice: 500000, downPayment: 100000, rate: 5.25, amortization: 25, freq: 'monthly',
        label: "National Bank Mortgage Calculator",
        desc: "Calculate National Bank of Canada (NBC) mortgage payments, including lump sum prepayment options."
    },

    // --- 2. REGIONAL & DIGITAL BANKS / LENDERS ---
    {
        slug: 'tangerine-mortgage-calculator',
        homePrice: 500000, downPayment: 100000, rate: 4.99, amortization: 25, freq: 'monthly',
        label: "Tangerine Mortgage Calculator",
        desc: "Calculate Tangerine mortgage payments and track their generous 25% annual lump-sum prepayment privileges."
    },
    {
        slug: 'simplii-mortgage-calculator',
        homePrice: 500000, downPayment: 100000, rate: 4.99, amortization: 25, freq: 'monthly',
        label: "Simplii Financial Mortgage Calculator",
        desc: "Estimate Simplii Financial mortgage payments and see how increasing regular payments affects your amortization."
    },
    {
        slug: 'eq-bank-mortgage-calculator',
        homePrice: 500000, downPayment: 100000, rate: 4.99, amortization: 25, freq: 'monthly',
        label: "EQ Bank Mortgage Calculator",
        desc: "Calculate EQ Bank mortgage payments and total interest costs."
    },
    {
        slug: 'desjardins-mortgage-calculator',
        homePrice: 500000, downPayment: 100000, rate: 5.25, amortization: 25, freq: 'monthly',
        label: "Desjardins Mortgage Calculator",
        desc: "Calculate your Desjardins mortgage payments with accurate semi-annual compounding."
    },
    {
        slug: 'laurentian-bank-mortgage-calculator',
        homePrice: 500000, downPayment: 100000, rate: 5.25, amortization: 25, freq: 'monthly',
        label: "Laurentian Bank Mortgage Calculator",
        desc: "Estimate Laurentian Bank mortgage payments and accelerated payoff schedules."
    },
    {
        slug: 'atb-financial-mortgage-calculator',
        homePrice: 500000, downPayment: 100000, rate: 5.25, amortization: 25, freq: 'monthly',
        label: "ATB Financial Mortgage Calculator",
        desc: "Calculate ATB Financial mortgage payments tailored for Alberta homebuyers."
    },
    {
        slug: 'first-national-mortgage-calculator',
        homePrice: 500000, downPayment: 100000, rate: 4.89, amortization: 25, freq: 'monthly',
        label: "First National Mortgage Calculator",
        desc: "Estimate payments for First National Financial, Canada's largest non-bank mortgage lender."
    },

    // --- 4. AFFORDABILITY & QUALIFICATION ---
    {
        slug: 'mortgage-affordability-calculator',
        calculationMode: 'affordability',
        grossIncome: 100000, monthlyDebt: 500,
        homePrice: 400000, downPayment: 25000, rate: 4.99, amortization: 25, freq: 'monthly',
        label: "Mortgage Affordability Calculator",
        desc: "Calculate exactly how much house you can afford based on your income and existing debt."
    },
    {
        slug: 'gds-tds-calculator',
        calculationMode: 'affordability',
        grossIncome: 100000, monthlyDebt: 500,
        homePrice: 400000, downPayment: 25000, rate: 4.99, amortization: 25, freq: 'monthly',
        label: "GDS and TDS Calculator",
        desc: "Calculate your Gross Debt Service (GDS) and Total Debt Service (TDS) ratios to see if you qualify for a mortgage."
    },
    {
        slug: 'cmhc-mortgage-qualifier',
        calculationMode: 'affordability',
        grossIncome: 100000, monthlyDebt: 500,
        homePrice: 400000, downPayment: 25000, rate: 4.99, amortization: 25, freq: 'monthly',
        label: "CMHC Mortgage Qualifier",
        desc: "Test your financial profile against standard CMHC qualification guidelines and stress test rules."
    },
    {
        slug: 'mcap-mortgage-calculator',
        homePrice: 500000, downPayment: 100000, rate: 5.25, amortization: 25, freq: 'monthly',
        label: "MCAP Mortgage Calculator",
        desc: "Estimate your MCAP mortgage payments and view your complete amortization schedule."
    },
    
    // --- 3. PROVINCES & MAJOR CITIES ---
    {
        slug: 'toronto-mortgage-calculator',
        homePrice: 1100000, downPayment: 220000, rate: 5.0, amortization: 30, freq: 'monthly',
        province: 'ON', isToronto: true,
        label: "Toronto Mortgage Calculator",
        desc: "Estimate monthly payments for Toronto real estate, including both Ontario and Toronto Land Transfer Taxes."
    },
    {
        slug: 'vancouver-mortgage-calculator',
        homePrice: 1200000, downPayment: 240000, rate: 5.0, amortization: 30, freq: 'monthly',
        province: 'BC',
        label: "Vancouver Mortgage Calculator",
        desc: "Calculate Vancouver mortgage payments and BC Land Transfer Tax for one of Canada's most expensive markets."
    },
    {
        slug: 'calgary-mortgage-calculator',
        homePrice: 550000, downPayment: 27500, rate: 5.0, amortization: 25, freq: 'monthly',
        province: 'AB',
        label: "Calgary Mortgage Calculator",
        desc: "Estimate Calgary mortgage payments with Alberta's low closing fees and CMHC insurance for 5% down."
    },
    {
        slug: 'alberta-mortgage-calculator',
        homePrice: 450000, downPayment: 22500, rate: 5.0, amortization: 25, freq: 'monthly',
        province: 'AB',
        label: "Alberta Mortgage Calculator",
        desc: "Calculate mortgage payments across Alberta, accounting for local registration fees and CMHC rules."
    },
    {
        slug: 'ontario-mortgage-calculator',
        homePrice: 850000, downPayment: 170000, rate: 5.0, amortization: 25, freq: 'monthly',
        province: 'ON',
        label: "Ontario Mortgage Calculator",
        desc: "Estimate Ontario mortgage payments and Land Transfer Tax over the life of your loan."
    },
    {
        slug: 'bc-mortgage-calculator',
        homePrice: 950000, downPayment: 190000, rate: 5.0, amortization: 25, freq: 'monthly',
        province: 'BC',
        label: "BC Mortgage Calculator",
        desc: "Calculate British Columbia mortgage payments and LTT to understand total cost of ownership."
    },
    {
        slug: 'montreal-mortgage-calculator',
        homePrice: 600000, downPayment: 120000, rate: 5.0, amortization: 25, freq: 'monthly',
        province: 'QC',
        label: "Montreal Mortgage Calculator",
        desc: "Estimate Montreal mortgage payments and Quebec 'Welcome Tax' (taxe de bienvenue)."
    },

    // --- 4. SITUATIONAL / STRATEGY KEYWORDS ---
    {
        slug: '5-year-fixed-mortgage-calculator',
        homePrice: 500000, downPayment: 100000, rate: 4.89, amortization: 25, freq: 'monthly', termYears: 5, compounding: 'semi-annual',
        label: "5-Year Fixed Mortgage Calculator",
        desc: "The most popular mortgage in Canada. Calculate your payments and balance at the end of a 5-year fixed term."
    },
    {
        slug: '3-year-variable-mortgage-calculator',
        homePrice: 500000, downPayment: 100000, rate: 5.95, amortization: 25, freq: 'monthly', termYears: 3, compounding: 'monthly',
        label: "3-Year Variable Mortgage Calculator",
        desc: "Estimate payments for a variable rate mortgage, which legally compounds monthly instead of semi-annually."
    },
    {
        slug: 'cmhc-mortgage-calculator',
        homePrice: 400000, downPayment: 20000, rate: 4.99, amortization: 25, freq: 'monthly',
        label: "CMHC Mortgage Calculator",
        desc: "Calculate your exact CMHC insurance premium and mandatory provincial sales taxes for down payments under 20%."
    },
    {
        slug: '500k-mortgage-payment',
        homePrice: 625000, downPayment: 125000, rate: 5.0, amortization: 25, freq: 'monthly',
        label: "$500k Mortgage Calculator",
        desc: "See the monthly payment and total interest cost for a standard half-million dollar Canadian mortgage."
    },
    {
        slug: '1-million-dollar-mortgage',
        homePrice: 1250000, downPayment: 250000, rate: 5.0, amortization: 30, freq: 'monthly',
        label: "$1 Million Mortgage Calculator",
        desc: "Estimate payments for a $1M home loan, common in high-cost cities like Toronto and Vancouver."
    },
    {
        slug: 'accelerated-bi-weekly-mortgage-calculator',
        homePrice: 500000, downPayment: 100000, rate: 5.0, amortization: 25, freq: 'accelerated-bi-weekly',
        label: "Accelerated Bi-Weekly Calculator",
        desc: "See exactly how much time and interest you save by making 26 accelerated bi-weekly payments per year."
    },
    {
        slug: 'mortgage-payoff-calculator-with-lump-sums',
        homePrice: 500000, downPayment: 100000, rate: 5.0, amortization: 25, freq: 'monthly',
        lumpSums: [{ amount: 20000, offsetYears: 1 }],
        label: "Mortgage Payoff with Prepayments",
        desc: "Calculate how a large lump-sum payment (like an inheritance or bonus) reduces your total mortgage term."
    },
    {
        slug: '30-year-amortization-calculator',
        homePrice: 500000, downPayment: 100000, rate: 5.0, amortization: 30, freq: 'monthly',
        label: "30-Year Amortization Calculator",
        desc: "Compare the lower monthly payments of a 30-year mortgage against the higher total interest costs."
    },
    {
        slug: 'mortgage-renewal-payment-calculator',
        homePrice: 400000, rate: 5.5, amortization: 20, freq: 'monthly',
        calculationMode: 'renewal',
        label: "Mortgage Renewal Calculator",
        desc: "Calculate your new monthly payments when renewing your mortgage at current market rates."
    },
    {
        slug: 'refinance-mortgage-calculator-canada',
        homePrice: 600000, rate: 5.25, amortization: 25, freq: 'monthly',
        calculationMode: 'renewal',
        label: "Refinance Calculator",
        desc: "Estimate payments and total interest when refinancing your Canadian mortgage to access equity or lower rates."
    }
];