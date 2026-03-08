/**
 * Canadian Mortgage Engine
 * Handles Canadian-specific compounding and payment frequencies.
 */

export const PAYMENT_FREQUENCIES = {
    MONTHLY: 'monthly',
    SEMI_MONTHLY: 'semi-monthly',
    BI_WEEKLY: 'bi-weekly',
    ACCELERATED_BI_WEEKLY: 'accelerated-bi-weekly',
    WEEKLY: 'weekly',
    ACCELERATED_WEEKLY: 'accelerated-weekly',
};

export const COMPOUNDING_PERIODS = {
    SEMI_ANNUAL: 'semi-annual', // Standard for Canadian Fixed
    MONTHLY: 'monthly',         // Standard for Canadian Variable
};

const PAYMENTS_PER_YEAR = {
    [PAYMENT_FREQUENCIES.MONTHLY]: 12,
    [PAYMENT_FREQUENCIES.SEMI_MONTHLY]: 24,
    [PAYMENT_FREQUENCIES.BI_WEEKLY]: 26,
    [PAYMENT_FREQUENCIES.ACCELERATED_BI_WEEKLY]: 26,
    [PAYMENT_FREQUENCIES.WEEKLY]: 52,
    [PAYMENT_FREQUENCIES.ACCELERATED_WEEKLY]: 52,
};

/**
 * Calculates the periodic interest rate based on Canadian compounding rules.
 */
export const getPeriodicInterestRate = (annualRate, frequency, compounding = COMPOUNDING_PERIODS.SEMI_ANNUAL) => {
    const paymentsPerYear = PAYMENTS_PER_YEAR[frequency];
    
    if (compounding === COMPOUNDING_PERIODS.SEMI_ANNUAL) {
        return Math.pow(1 + annualRate / 2, 2 / paymentsPerYear) - 1;
    } else {
        return Math.pow(1 + annualRate / 12, 12 / paymentsPerYear) - 1;
    }
};

/**
 * Calculates the regular payment amount.
 */
export const calculatePeriodicPayment = (principal, annualRate, amortizationYears, frequency, compounding) => {
    const periodicRate = getPeriodicInterestRate(annualRate, frequency, compounding);
    const totalPayments = amortizationYears * PAYMENTS_PER_YEAR[frequency];

    const standardPayment = (principal * periodicRate * Math.pow(1 + periodicRate, totalPayments)) / 
                           (Math.pow(1 + periodicRate, totalPayments) - 1);

    if (frequency === PAYMENT_FREQUENCIES.ACCELERATED_BI_WEEKLY) {
        const monthlyRate = getPeriodicInterestRate(annualRate, PAYMENT_FREQUENCIES.MONTHLY, compounding);
        const monthlyPayments = amortizationYears * 12;
        const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, monthlyPayments)) / 
                              (Math.pow(1 + monthlyRate, monthlyPayments) - 1);
        return monthlyPayment / 2;
    }

    if (frequency === PAYMENT_FREQUENCIES.ACCELERATED_WEEKLY) {
        const monthlyRate = getPeriodicInterestRate(annualRate, PAYMENT_FREQUENCIES.MONTHLY, compounding);
        const monthlyPayments = amortizationYears * 12;
        const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, monthlyPayments)) / 
                              (Math.pow(1 + monthlyRate, monthlyPayments) - 1);
        return monthlyPayment / 4;
    }

    return standardPayment;
};

const parseSafeDate = (dateStr) => {
    if (!dateStr || typeof dateStr !== 'string') return new Date();
    const parts = dateStr.split('-');
    if (parts.length !== 3) return new Date();
    return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10), 12, 0, 0);
};

const getPaymentDate = (startDateStr, paymentNumber, frequency) => {
    const date = parseSafeDate(startDateStr);

    switch (frequency) {
        case PAYMENT_FREQUENCIES.MONTHLY:
            date.setMonth(date.getMonth() + paymentNumber);
            break;
        case PAYMENT_FREQUENCIES.SEMI_MONTHLY:
            date.setMonth(date.getMonth() + Math.floor(paymentNumber / 2));
            if (paymentNumber % 2 !== 0) date.setDate(date.getDate() + 15);
            break;
        case PAYMENT_FREQUENCIES.BI_WEEKLY:
        case PAYMENT_FREQUENCIES.ACCELERATED_BI_WEEKLY:
            date.setDate(date.getDate() + paymentNumber * 14);
            break;
        case PAYMENT_FREQUENCIES.WEEKLY:
        case PAYMENT_FREQUENCIES.ACCELERATED_WEEKLY:
            date.setDate(date.getDate() + paymentNumber * 7);
            break;
        default:
            date.setMonth(date.getMonth() + paymentNumber);
    }
    return date;
};

/**
 * Main calculation engine for mortgage amortization with prepayments.
 */
export const calculateAmortization = ({
    homePrice = 500000,
    downPayment = 100000,
    downPaymentType = 'dollar',
    annualRate = 5.0,
    amortizationYears = 25,
    termYears = 5,
    paymentFrequency = PAYMENT_FREQUENCIES.MONTHLY,
    compounding = COMPOUNDING_PERIODS.SEMI_ANNUAL,
    customPayment = 0,
    startDate = new Date().toISOString().split('T')[0],
    prepayments = {
        monthlyIncrease: 0,
    },
    lumpSums = [],
    isRenewal = false,
    province = 'ON',
    propertyTaxes = 0, // Annual
    heating = 0,       // Monthly
    condoFees = 0      // Monthly
}) => {
    const actualDownPayment = downPaymentType === 'percent' 
        ? homePrice * (downPayment / 100) 
        : downPayment;

    const baseMortgageAmount = homePrice - actualDownPayment;
    const downPaymentPercent = (actualDownPayment / homePrice) * 100;

    let cmhcRate = 0;
    if (!isRenewal) {
        if (downPaymentPercent < 5) {
            cmhcRate = 0.0400; 
        } else if (downPaymentPercent < 10) {
            cmhcRate = 0.0400;
        } else if (downPaymentPercent < 15) {
            cmhcRate = 0.0310;
        } else if (downPaymentPercent < 20) {
            cmhcRate = 0.0280;
        }
    }

    const cmhcPremium = baseMortgageAmount * cmhcRate;
    
    // Calculate CMHC PST (Ontario 8%, Quebec 9%, Saskatchewan 6%)
    let cmhcPST = 0;
    if (cmhcPremium > 0) {
        if (province === 'ON') cmhcPST = cmhcPremium * 0.08;
        else if (province === 'QC') cmhcPST = cmhcPremium * 0.09;
        else if (province === 'SK') cmhcPST = cmhcPremium * 0.06;
    }

    const principal = baseMortgageAmount + cmhcPremium;

    const periodicRate = getPeriodicInterestRate(annualRate / 100, paymentFrequency, compounding);
    const standardPayment = calculatePeriodicPayment(principal, annualRate / 100, amortizationYears, paymentFrequency, compounding);
    const basePayment = customPayment > 0 ? customPayment : standardPayment;
    const paymentsPerYear = PAYMENTS_PER_YEAR[paymentFrequency];

    // Calculate PITH (Principal, Interest, Taxes, Heating) + 50% Condo Fees (Monthly Equiv)
    const monthlyPaymentEquiv = basePayment * (paymentsPerYear / 12);
    const pithPayment = monthlyPaymentEquiv + (propertyTaxes / 12) + heating + (condoFees / 2);
    const totalMonthlyCarryingCost = monthlyPaymentEquiv + (propertyTaxes / 12) + heating + condoFees;
    
    let balance = principal;
    let totalInterest = 0;
    let totalPrincipal = 0;
    let yearlyInterestAccumulator = 0;
    let yearlyPrincipalAccumulator = 0;
    const schedule = [];
    let paymentNumber = 0;
    
    const termPaymentTarget = termYears * paymentsPerYear;
    let balanceAtEndOfTerm = 0;

    let pendingLumpSums = lumpSums.map(ls => ({ 
        ...ls, 
        applied: false, 
        parsedDate: parseSafeDate(ls.date).getTime() 
    }));

    const maxPayments = 50 * paymentsPerYear;

    while (balance > 0.01 && paymentNumber < maxPayments) {
        paymentNumber++;
        const currentPaymentDate = getPaymentDate(startDate, paymentNumber, paymentFrequency).getTime();
        
        const interestPayment = balance * periodicRate;
        let principalPayment = (basePayment + (prepayments.monthlyIncrease || 0)) - interestPayment;

        const applicableLumpSums = pendingLumpSums.filter(ls => !ls.applied && ls.parsedDate <= currentPaymentDate);
        let lumpSumTotal = 0;
        applicableLumpSums.forEach(ls => {
            lumpSumTotal += (ls.amount || 0);
            ls.applied = true;
        });
        principalPayment += lumpSumTotal;

        if (principalPayment > balance + interestPayment) {
            principalPayment = balance;
        }

        const actualPrincipalPaid = Math.min(principalPayment, balance);
        balance -= actualPrincipalPaid;
        totalInterest += interestPayment;
        totalPrincipal += actualPrincipalPaid;
        yearlyInterestAccumulator += interestPayment;
        yearlyPrincipalAccumulator += actualPrincipalPaid;

        if (paymentNumber === termPaymentTarget) {
            balanceAtEndOfTerm = Math.max(0, balance);
        }

        if (paymentNumber % paymentsPerYear === 0 || balance <= 0) {
            schedule.push({
                year: Math.ceil(paymentNumber / paymentsPerYear),
                remainingBalance: Math.max(0, balance),
                totalInterest: totalInterest,
                totalPrincipal: totalPrincipal,
                yearlyInterest: yearlyInterestAccumulator,
                yearlyPrincipal: yearlyPrincipalAccumulator,
            });
            yearlyInterestAccumulator = 0;
            yearlyPrincipalAccumulator = 0;
        }
    }

    if (paymentNumber < termPaymentTarget) {
        balanceAtEndOfTerm = 0;
    }

    const baselineResults = calculateBaseline(principal, annualRate / 100, amortizationYears, paymentFrequency, compounding);

    // Merge baseline balance into schedule for charting
    const combinedSchedule = schedule.map(s => {
        const baseYear = baselineResults.schedule.find(b => b.year === s.year);
        return {
            ...s,
            baselineRemainingBalance: baseYear ? baseYear.baselineRemainingBalance : 0
        };
    });

    const stressTestRate = Math.max(5.25, annualRate + 2);
    const stressTestPayment = calculatePeriodicPayment(principal, stressTestRate / 100, amortizationYears, paymentFrequency, compounding);

    return {
        monthlyPayment: basePayment,
        totalInterest,
        totalPrincipal,
        totalCost: totalInterest + totalPrincipal,
        yearsToPayOff: paymentNumber / paymentsPerYear,
        schedule: combinedSchedule,
        cmhcPremium,
        cmhcPST,
        principal,
        baseMortgageAmount,
        actualDownPayment,
        downPaymentPercent,
        balanceAtEndOfTerm,
        pithPayment, // For qualifying
        totalMonthlyCarryingCost, // For actual budget
        stressTest: {
            rate: stressTestRate,
            payment: stressTestPayment,
            difference: stressTestPayment - basePayment
        },
        savings: {
            interest: Math.max(0, baselineResults.totalInterest - totalInterest),
            time: Math.max(0, amortizationYears - (paymentNumber / paymentsPerYear)),
        }
    };
};

const calculateBaseline = (principal, annualRate, amortizationYears, frequency, compounding) => {
    const periodicRate = getPeriodicInterestRate(annualRate, frequency, compounding);
    const payment = calculatePeriodicPayment(principal, annualRate, amortizationYears, frequency, compounding);
    const totalPayments = amortizationYears * PAYMENTS_PER_YEAR[frequency];
    const paymentsPerYear = PAYMENTS_PER_YEAR[frequency];
    
    let balance = principal;
    let totalInterest = 0;
    const schedule = [];
    
    for (let i = 0; i < totalPayments; i++) {
        const interest = balance * periodicRate;
        const principalPaid = Math.min(payment - interest, balance);
        balance -= principalPaid;
        totalInterest += interest;
        
        if ((i + 1) % paymentsPerYear === 0 || balance <= 0) {
            schedule.push({
                year: Math.ceil((i + 1) / paymentsPerYear),
                baselineRemainingBalance: Math.max(0, balance),
            });
        }
        
        if (balance <= 0) break;
    }

    return { totalInterest, schedule };
};
