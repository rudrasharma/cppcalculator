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