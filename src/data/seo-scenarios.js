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
    // --- TIMING SCENARIOS ---
    { 
        slug: 'early-retirement-age-60', 
        age: 60, income: '65000', years: 40, married: false,
        label: "Taking CPP Early at Age 60",
        desc: "Calculate the 36% permanent reduction penalty for starting your pension early."
    },
    { 
        slug: 'standard-retirement-age-65', 
        age: 65, income: '65000', years: 40, married: false,
        label: "Standard Retirement at Age 65",
        desc: "Estimate your standard CPP and OAS payments with no penalties or bonuses."
    },
    { 
        slug: 'deferred-retirement-age-70', 
        age: 70, income: '65000', years: 40, married: false,
        label: "Maximum Deferral to Age 70",
        desc: "See how waiting until 70 increases your monthly pension by 42%."
    },

    // --- INCOME SCENARIOS ---
    { 
        slug: 'max-cpp-contribution', 
        age: 65, income: '73200', years: 40, married: false, // 2025 YMPE
        label: "Maximum CPP Contributor",
        desc: "Scenario for high-income earners who hit the yearly maximum pensionable earnings (YMPE)."
    },
    { 
        slug: 'average-canadian-salary', 
        age: 65, income: '55000', years: 40, married: false,
        label: "Average Canadian Income ($55k)",
        desc: "A realistic estimate for the average Canadian worker retiring today."
    },
    { 
        slug: 'low-income-gis-eligibility', 
        age: 65, income: '20000', years: 40, married: false,
        label: "Low Income & GIS Estimate",
        desc: "Determine if you qualify for the Guaranteed Income Supplement (GIS) top-up."
    },

    // --- NEWCOMER SCENARIOS ---
    { 
        slug: 'newcomer-10-years-residence', 
        age: 65, income: '45000', years: 10, married: false,
        label: "Newcomer (10 Years in Canada)",
        desc: "The minimum residency requirement to qualify for Old Age Security (OAS) in Canada."
    },
    { 
        slug: 'newcomer-20-years-residence', 
        age: 65, income: '50000', years: 20, married: false,
        label: "Newcomer (20 Years in Canada)",
        desc: "Calculate your partial OAS pension (20/40ths) based on 20 years of residency."
    },

    // --- FAMILY SCENARIOS ---
    { 
        slug: 'senior-couple-gis', 
        age: 65, income: '35000', years: 40, married: true, spouseIncome: '25000',
        label: "Senior Couple (GIS Eligibility)",
        desc: "Calculate combined household benefits for a retired couple with modest income."
    },
    { 
        slug: 'stay-at-home-parent', 
        age: 65, income: '45000', years: 40, married: true, childCount: 2,
        label: "Stay-at-Home Parent (Child Rearing)",
        desc: "See how the Child-Rearing Dropout Provision protects your CPP benefit amount."
    }
];