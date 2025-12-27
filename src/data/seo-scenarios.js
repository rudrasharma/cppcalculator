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