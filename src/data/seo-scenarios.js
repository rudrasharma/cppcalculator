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
  30000, 40000, 50000, 55000, 60000, 65000, 
  70000, 75000, 80000, 90000, 100000, 120000, 150000
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

export const CPP_SCENARIOS = [
    // --- 1. THE TIMING STRATEGISTS (High Volume) ---
    { 
        slug: 'taking-cpp-early-at-60', 
        age: 60, income: '55000', years: 40, married: false,
        label: "Retiring Early at Age 60",
        desc: "See the impact of the 36% permanent penalty on your monthly payments."
    },
    { 
        slug: 'taking-cpp-at-62', 
        age: 62, income: '60000', years: 40, married: false,
        label: "Retiring at Age 62",
        desc: "A common compromise age. Calculate your specific penalty (21.6% reduction)."
    },
    { 
        slug: 'standard-retirement-age-65', 
        age: 65, income: '55000', years: 40, married: false,
        label: "Standard Retirement (Age 65)",
        desc: "The benchmark calculation. 100% of your entitled CPP and OAS with no adjustments."
    },
    { 
        slug: 'deferring-cpp-to-68', 
        age: 68, income: '65000', years: 40, married: false,
        label: "Deferring to Age 68",
        desc: "Boost your pension by 25.2% (CPP) and 21.6% (OAS) by waiting three extra years."
    },
    { 
        slug: 'maximum-deferral-age-70', 
        age: 70, income: '65000', years: 40, married: false,
        label: "Max Deferral (Age 70)",
        desc: "The 'patience payoff'. See the maximum possible monthly boost (42% CPP, 36% OAS)."
    },

    // --- 2. INCOME TIERS (Search intent: "How much will I get?") ---
    { 
        slug: 'maximum-cpp-amount-2025', 
        age: 65, income: '73200', years: 40, married: false, // 2025 YMPE
        label: "Maximum CPP Contributor",
        desc: "Estimate for high-income earners who consistently hit the Yearly Maximum Pensionable Earnings."
    },
    { 
        slug: 'average-canadian-salary', 
        age: 65, income: '55000', years: 40, married: false,
        label: "Average Canadian Income ($55k)",
        desc: "A realistic baseline for the typical Canadian worker with steady employment."
    },
    { 
        slug: 'modest-income-35k', 
        age: 65, income: '35000', years: 40, married: false,
        label: "Modest Income ($35k/yr)",
        desc: "Estimate benefits for service/retail workers or those with part-time career history."
    },
    { 
        slug: 'low-income-gis-estimate', 
        age: 65, income: '18000', years: 40, married: false,
        label: "Low Income & GIS Estimate",
        desc: "Check eligibility for the Guaranteed Income Supplement (GIS) top-up for low-income seniors."
    },
    { 
        slug: 'high-income-oas-clawback', 
        age: 65, income: '95000', years: 40, married: false,
        label: "High Income (OAS Clawback Risk)",
        desc: "See how higher retirement income might trigger the OAS Recovery Tax (Clawback)."
    },

    // --- 3. NEWCOMERS & IMMIGRANTS (Specific "Years in Canada" intent) ---
    { 
        slug: 'newcomer-10-years-residence', 
        age: 65, income: '45000', years: 10, married: false,
        label: "Newcomer (10 Years in Canada)",
        desc: "The absolute minimum residency to qualify for Old Age Security (OAS)."
    },
    { 
        slug: 'newcomer-15-years-residence', 
        age: 65, income: '50000', years: 15, married: false,
        label: "Newcomer (15 Years in Canada)",
        desc: "Estimate your partial OAS pension (15/40ths) and CPP contributions."
    },
    { 
        slug: 'newcomer-20-years-residence', 
        age: 65, income: '55000', years: 20, married: false,
        label: "Newcomer (20 Years in Canada)",
        desc: "Mid-life arrival estimate. You qualify for exactly 50% of the full OAS pension."
    },
    { 
        slug: 'immigrant-30-years-residence', 
        age: 65, income: '60000', years: 30, married: false,
        label: "Immigrant (30 Years in Canada)",
        desc: "Long-term resident estimate. You qualify for 75% of the standard OAS pension."
    },

    // --- 4. FAMILY & LIFESTYLE ---
    { 
        slug: 'stay-at-home-parent', 
        age: 65, income: '45000', years: 40, married: true, childCount: 2,
        label: "Stay-at-Home Parent",
        desc: "See how the Child Rearing Dropout provision helps protect your average earnings history."
    },
    { 
        slug: 'retired-couple-average-income', 
        age: 65, income: '50000', years: 40, married: true, spouseIncome: '50000',
        label: "Retired Couple (Average Income)",
        desc: "Combined household pension estimate for two average income earners."
    },
    { 
        slug: 'retired-couple-one-earner', 
        age: 65, income: '70000', years: 40, married: true, spouseIncome: '0',
        label: "Retired Couple (One Earner)",
        desc: "Estimate for a household where one spouse worked and the other had no income (Allowance eligibility)."
    },
    { 
        slug: 'self-employed-contractor', 
        age: 65, income: '60000', years: 40, married: false,
        label: "Self-Employed / Contractor",
        desc: "Estimate for gig workers or business owners who contribute both portions of CPP."
    },
    { 
        slug: 'fire-retirement-at-55', 
        age: 60, income: '80000', years: 40, married: false,
        label: "FIRE (Retired Early at 55)",
        desc: "Stopped working at 55, taking pension at 60. See how 'zero contribution' years affect your average."
    }
];

// ==========================================
//          4. GROCERY INFLATION
// ==========================================
// ... keep existing PROVINCES, LEAVE_SCENARIOS, FAMILY_SCENARIOS, CPP_SCENARIOS ...

// ==========================================
//          4. GROCERY INFLATION
// ==========================================
export const GROCERY_SCENARIOS = [
    { 
        slug: 'family-essentials-basket', 
        years: 5, 
        // IDs: Milk, Eggs, Bread, Chicken, Beef, Apples, Potatoes, Pasta, Cheese
        cart: ['milk', 'eggs', 'bread', 'chicken', 'beef', 'apples', 'potatoes', 'pasta', 'cheese'], 
        label: "Family Essentials Basket (5-Year Forecast)",
        desc: "Forecast for a standard weekly shop including dairy, meat, and produce staples."
    },
    { 
        slug: 'vegetarian-healthy-basket', 
        years: 5, 
        // IDs: Milk, Eggs, Bread, Apples, Bananas, Potatoes, Rice, Tofu, Lettuce
        cart: ['milk', 'eggs', 'bread', 'apples', 'bananas', 'potatoes', 'rice', 'tofu', 'lettuce'], 
        label: "Vegetarian & Healthy Basket",
        desc: "See how inflation impacts a produce-heavy diet without meat products."
    },
    { 
        slug: 'carnivore-protein-basket', 
        years: 3, 
        // IDs: Beef, Chicken, Bacon, Salmon, Eggs, Butter
        cart: ['beef', 'chicken', 'bacon', 'salmon', 'eggs', 'butter'], 
        label: "High-Protein / Carnivore Basket",
        desc: "Meat prices are volatile. See the 3-year outlook for a protein-focused diet."
    },
    { 
        slug: 'pantry-staples-long-term', 
        years: 10, 
        // IDs: Rice, Pasta, Coffee, Bread, Cereal
        cart: ['rice', 'pasta', 'coffee', 'bread', 'cereal'], 
        label: "Pantry Staples (10-Year Outlook)",
        desc: "Long-term inflation forecast for shelf-stable goods and basic ingredients."
    },
    { 
        slug: 'single-student-budget', 
        years: 1, 
        // IDs: Pasta, Bread, Eggs, Apples, Beef
        cart: ['pasta', 'bread', 'eggs', 'apples', 'beef'], 
        label: "Student / Single Budget Basket",
        desc: "Short-term forecast for essential low-cost grocery items."
    }
];

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
        homePrice: 500000, downPayment: 100000, rate: 5.25, amortization: 25, freq: 'monthly',
        label: "First National Mortgage Calculator",
        desc: "Calculate payments for First National Financial LP, Canada's largest non-bank mortgage lender."
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
        label: "Toronto Mortgage Calculator",
        desc: "Estimate monthly payments for Toronto real estate, where home prices average over $1.1 million."
    },
    {
        slug: 'vancouver-mortgage-calculator',
        homePrice: 1200000, downPayment: 240000, rate: 5.0, amortization: 30, freq: 'monthly',
        label: "Vancouver Mortgage Calculator",
        desc: "Calculate Vancouver mortgage payments to help plan for one of Canada's most expensive housing markets."
    },
    {
        slug: 'calgary-mortgage-calculator',
        homePrice: 550000, downPayment: 27500, rate: 5.0, amortization: 25, freq: 'monthly',
        label: "Calgary Mortgage Calculator",
        desc: "Estimate your Calgary mortgage payments, including CMHC insurance fees for smaller down payments."
    },
    {
        slug: 'alberta-mortgage-calculator',
        homePrice: 450000, downPayment: 22500, rate: 5.0, amortization: 25, freq: 'monthly',
        label: "Alberta Mortgage Calculator",
        desc: "Calculate mortgage payments across Alberta, accounting for local real estate prices and CMHC rules."
    },
    {
        slug: 'ontario-mortgage-calculator',
        homePrice: 850000, downPayment: 170000, rate: 5.0, amortization: 25, freq: 'monthly',
        label: "Ontario Mortgage Calculator",
        desc: "Estimate your Ontario mortgage payments and total interest over the life of your loan."
    },
    {
        slug: 'bc-mortgage-calculator',
        homePrice: 950000, downPayment: 190000, rate: 5.0, amortization: 25, freq: 'monthly',
        label: "BC Mortgage Calculator",
        desc: "Calculate British Columbia mortgage payments to understand affordability in the local market."
    },

    // --- 4. SITUATIONAL / STRATEGY KEYWORDS ---
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
    }
];