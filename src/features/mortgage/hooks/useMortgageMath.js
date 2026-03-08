import { useReducer, useEffect, useMemo } from 'react';
import { calculateAmortization, PAYMENT_FREQUENCIES, COMPOUNDING_PERIODS } from '../utils/mortgageEngine';

const today = new Date();
const defaultStartDate = today.toISOString().split('T')[0];
const nextYear = new Date(today);
nextYear.setFullYear(today.getFullYear() + 1);
const defaultLumpSumDate = nextYear.toISOString().split('T')[0];

const initialState = {
    principal: 500000,
    annualRate: 5.0,
    amortizationYears: 25,
    paymentFrequency: PAYMENT_FREQUENCIES.MONTHLY,
    compounding: COMPOUNDING_PERIODS.SEMI_ANNUAL,
    customPayment: 0,
    startDate: defaultStartDate,
    prepayments: {
        monthlyIncrease: 0,
    },
    lumpSums: [],
    mounted: false,
};

function mortgageReducer(state, action) {
    switch (action.type) {
        case 'SET_PRINCIPAL':
            return { ...state, principal: action.payload };
        case 'SET_RATE':
            return { ...state, annualRate: action.payload };
        case 'SET_AMORTIZATION':
            return { ...state, amortizationYears: action.payload };
        case 'SET_FREQUENCY':
            return { ...state, paymentFrequency: action.payload };
        case 'SET_COMPOUNDING':
            return { ...state, compounding: action.payload };
        case 'SET_CUSTOM_PAYMENT':
            return { ...state, customPayment: action.payload };
        case 'SET_START_DATE':
            return { ...state, startDate: action.payload };
        case 'SET_PREPAYMENT':
            return { 
                ...state, 
                prepayments: { ...state.prepayments, ...action.payload } 
            };
        case 'ADD_LUMP_SUM':
            return {
                ...state,
                lumpSums: [...state.lumpSums, { id: Date.now(), amount: 10000, date: defaultLumpSumDate }]
            };
        case 'REMOVE_LUMP_SUM':
            return {
                ...state,
                lumpSums: state.lumpSums.filter(ls => ls.id !== action.payload)
            };
        case 'UPDATE_LUMP_SUM':
            return {
                ...state,
                lumpSums: state.lumpSums.map(ls => 
                    ls.id === action.payload.id ? { ...ls, [action.payload.field]: action.payload.value } : ls
                )
            };
        case 'SET_MOUNTED':
            return { ...state, mounted: action.payload };
        default:
            return state;
    }
}

export const useMortgageMath = () => {
    const [state, dispatch] = useReducer(mortgageReducer, initialState);

    useEffect(() => {
        dispatch({ type: 'SET_MOUNTED', payload: true });
        
        // Initial load from URL
        const params = new URLSearchParams(window.location.search);
        if (params.get('p')) dispatch({ type: 'SET_PRINCIPAL', payload: parseFloat(params.get('p')) });
        if (params.get('r')) dispatch({ type: 'SET_RATE', payload: parseFloat(params.get('r')) });
        if (params.get('a')) dispatch({ type: 'SET_AMORTIZATION', payload: parseInt(params.get('a')) });
        if (params.get('f')) dispatch({ type: 'SET_FREQUENCY', payload: params.get('f') });
        if (params.get('c')) dispatch({ type: 'SET_COMPOUNDING', payload: params.get('c') });
        if (params.get('cp')) dispatch({ type: 'SET_CUSTOM_PAYMENT', payload: parseFloat(params.get('cp')) });
        if (params.get('sd')) dispatch({ type: 'SET_START_DATE', payload: params.get('sd') });
        if (params.get('mi')) dispatch({ type: 'SET_PREPAYMENT', payload: { monthlyIncrease: parseFloat(params.get('mi')) } });
        // Removed complex lump sums from URL sync to keep URLs manageable
    }, []);

    useEffect(() => {
        if (!state.mounted) return;
        
        const params = new URLSearchParams(window.location.search);
        params.set('p', state.principal);
        params.set('r', state.annualRate);
        params.set('a', state.amortizationYears);
        params.set('f', state.paymentFrequency);
        params.set('c', state.compounding);
        if (state.customPayment > 0) params.set('cp', state.customPayment);
        else params.delete('cp');
        if (state.startDate !== defaultStartDate) params.set('sd', state.startDate);
        else params.delete('sd');
        if (state.prepayments.monthlyIncrease > 0) params.set('mi', state.prepayments.monthlyIncrease);
        else params.delete('mi');

        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState(null, '', newUrl);
    }, [state.principal, state.annualRate, state.amortizationYears, state.paymentFrequency, state.compounding, state.customPayment, state.startDate, state.prepayments, state.mounted]);

    const results = useMemo(() => {
        return calculateAmortization({
            principal: state.principal,
            annualRate: state.annualRate / 100,
            amortizationYears: state.amortizationYears,
            paymentFrequency: state.paymentFrequency,
            compounding: state.compounding,
            customPayment: state.customPayment,
            startDate: state.startDate,
            prepayments: state.prepayments,
            lumpSums: state.lumpSums,
        });
    }, [state.principal, state.annualRate, state.amortizationYears, state.paymentFrequency, state.compounding, state.customPayment, state.startDate, state.prepayments, state.lumpSums]);

    return { state, dispatch, results };
};
