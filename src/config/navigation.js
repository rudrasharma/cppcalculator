import React from 'react';

/**
 * Navigation Configuration for LoonieFi
 * Categorized tools with metadata for both Astro and React components.
 */

export const TOOL_CATEGORIES = [
    {
        id: 'taxes',
        label: 'Taxes & Pay',
        color: 'text-emerald-600',
        bg: 'bg-emerald-50'
    },
    {
        id: 'family',
        label: 'Family Benefits',
        color: 'text-rose-600',
        bg: 'bg-rose-50'
    },
    {
        id: 'home',
        label: 'Home & Debt',
        color: 'text-blue-600',
        bg: 'bg-blue-50'
    },
    {
        id: 'retirement',
        label: 'Wealth & Retirement',
        color: 'text-indigo-600',
        bg: 'bg-indigo-50'
    }
];

export const ALL_TOOLS = [
    { 
        id: 'tax',
        categoryId: 'taxes',
        href: '/income-tax-calculator/', 
        label: 'Income Tax', 
        shortLabel: 'Income Tax',
        title: '2026 Canadian Income Tax',
        subtitle: 'Calculate your take-home pay and tax brackets',
        description: 'Calculate your take-home pay and 2026 tax brackets.',
        icon: 'ChartIcon'
    },
    { 
        id: 'parental',
        categoryId: 'family',
        href: '/parental-leave-calculator/', 
        label: 'Mat. Leave', 
        shortLabel: 'Mat. Leave',
        title: 'Maternity & Parental Leave',
        subtitle: 'Plan your EI payments and family budget',
        description: 'Estimate your EI weekly payments and total leave duration.',
        icon: 'BabyIcon'
    },
    { 
        id: 'ccb',
        categoryId: 'family',
        href: '/child-benefit-calculator/', 
        label: 'Family Cash', 
        shortLabel: 'Family Cash',
        title: 'Household Benefits Estimator',
        subtitle: 'CCB, Trillium, Carbon Rebate & GST Credits',
        description: 'Maximize your Child Benefits and quarterly tax rebates.',
        icon: 'UsersIcon'
    },
    { 
        id: 'resp',
        categoryId: 'family',
        href: '/resp-calculator/', 
        label: 'Education (RESP)', 
        shortLabel: 'RESP',
        title: 'Education Savings (RESP)',
        subtitle: 'Maximize grants for your children\'s future',
        description: 'Maximize government grants and project your child’s future education fund.',
        icon: 'GraduationCapIcon'
    },
    { 
        id: 'mortgage',
        categoryId: 'home',
        href: '/mortgage-calculator/', 
        label: 'Mortgage', 
        shortLabel: 'Mortgage',
        title: 'Mortgage Paydown',
        subtitle: 'Canadian semi-annual compounding & prepayments',
        description: 'See how Canadian compounding and prepayments save you thousands.',
        icon: 'HomeIcon'
    },
    { 
        id: 'smith',
        categoryId: 'home',
        href: '/smith-manoeuvre/', 
        label: 'Smith Manoeuvre', 
        shortLabel: 'Smith Calc',
        title: 'Smith Manoeuvre Estimator',
        subtitle: 'Convert mortgage debt into deductible investment debt',
        description: 'Make your mortgage tax-deductible and accelerate long-term wealth.',
        icon: 'TrendingUpIcon'
    },
    { 
        id: 'budget',
        categoryId: 'home',
        href: '/calculator/budget/', 
        label: 'AI Budget Analyzer', 
        shortLabel: 'Budget AI',
        title: 'AI Budget Analyzer',
        subtitle: 'Securely extract and categorize your spending with AI',
        description: 'Upload your bank statements and let AI instantly categorize your expenses and find savings.',
        icon: 'WandIcon'
    },
    { 
        id: 'retirement',
        categoryId: 'retirement',
        href: '/retirement-planner/', 
        label: 'Retirement Planner', 
        shortLabel: 'Retirement',
        title: 'Canadian Retirement Planner',
        subtitle: 'CPP, OAS, RRSP & TFSA Projections',
        description: 'Project your retirement income including CPP, OAS, RRSP, and TFSA drawdowns.',
        icon: 'PiggyBankIcon'
    },
    { 
        id: 'cpp',
        categoryId: 'retirement',
        href: '/cpp-oas-calculator/', 
        label: 'CPP Calculator', 
        shortLabel: 'CPP Calc',
        title: 'Canada Pension Plan Calculator',
        subtitle: 'Estimate your future CPP monthly payments',
        description: 'Calculate your future monthly income from the Canada Pension Plan.',
        icon: 'ChartIcon'
    },
    { 
        id: 'compound',
        categoryId: 'retirement',
        href: '/compound-interest-calculator/', 
        label: 'Compound Interest', 
        shortLabel: 'Compound',
        title: 'Compound Interest Calculator',
        subtitle: 'Visualize your long-term wealth growth',
        description: 'Calculate how your investments will grow over time with compound interest.',
        icon: 'BarChartIcon'
    },
    { 
        id: 'cagr',
        categoryId: 'retirement',
        href: '/cagr-calculator/', 
        label: 'Growth Calc', 
        shortLabel: 'CAGR Calc',
        title: 'Investment Growth (CAGR)',
        subtitle: 'Calculate Compound Annual Growth Rate & Future Value',
        description: 'Determine the precise annual growth rate required to grow your investment.',
        icon: 'TrendingUpIcon'
    }
];

// Helper to get grouped tools
export const getGroupedTools = () => {
    return TOOL_CATEGORIES.map(category => ({
        ...category,
        tools: ALL_TOOLS.filter(tool => tool.categoryId === category.id)
    }));
};
