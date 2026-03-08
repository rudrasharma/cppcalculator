import { useReducer, useEffect, useMemo } from 'react';
import { calculateAmortization, PAYMENT_FREQUENCIES, COMPOUNDING_PERIODS } from '../utils/mortgageEngine';
import { calculateLTT } from '../utils/lttEngine';

const today = new Date();
const defaultStartDate = today.toISOString().split('T')[0];
const nextYear = new Date(today);
nextYear.setFullYear(today.getFullYear() + 1);
const defaultLumpSumDate = nextYear.toISOString().split('T')[0];

const initialState = {
    homePrice: 500000,
    downPayment: 100000,
    downPaymentType: 'dollar', // 'dollar' or 'percent'
    annualRate: 5.0,
    amortizationYears: 25,
    termYears: 5,
    paymentFrequency: PAYMENT_FREQUENCIES.MONTHLY,
    compounding: COMPOUNDING_PERIODS.SEMI_ANNUAL,
    customPayment: 0,
    startDate: defaultStartDate,
    province: 'ON',
    isToronto: false,
    isFirstTimeBuyer: false,
    showStressTest: false,
    prepayments: {
        monthlyIncrease: 0,
    },
    lumpSums: [],
    mounted: false,
};

function mortgageReducer(state, action) {
    switch (action.type) {
        case 'SET_HOME_PRICE':
            return { ...state, homePrice: action.payload };
        case 'SET_DOWN_PAYMENT':
            return { ...state, downPayment: action.payload };
        case 'SET_DOWN_PAYMENT_TYPE':
            return { ...state, downPaymentType: action.payload };
        case 'SET_RATE':
            return { ...state, annualRate: action.payload };
        case 'SET_AMORTIZATION':
            return { ...state, amortizationYears: action.payload };
        case 'SET_TERM_YEARS':
            return { ...state, termYears: action.payload };
        case 'SET_FREQUENCY':
            return { ...state, paymentFrequency: action.payload };
        case 'SET_COMPOUNDING':
            return { ...state, compounding: action.payload };
        case 'SET_CUSTOM_PAYMENT':
            return { ...state, customPayment: action.payload };
        case 'SET_START_DATE':
            return { ...state, startDate: action.payload };
        case 'SET_PROVINCE':
            return { ...state, province: action.payload, isToronto: action.payload === 'ON' ? state.isToronto : false };
        case 'SET_IS_TORONTO':
            return { ...state, isToronto: action.payload };
        case 'SET_IS_FIRST_TIME_BUYER':
            return { ...state, isFirstTimeBuyer: action.payload };
        case 'SET_SHOW_STRESS_TEST':
            return { ...state, showStressTest: action.payload };
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
        case 'SET_STATE':
            return { ...state, ...action.payload };
        case 'SET_MOUNTED':
            return { ...state, mounted: action.payload };
        default:
            return state;
    }
}

export const useMortgageMath = (initialStateOverride = null) => {
    // Merge any server-side overrides with the default state
    const startingState = useMemo(() => {
        if (!initialStateOverride) return initialState;
        
        // Handle migration from old 'principal' overrrides if they exist in pSEO data
        let override = { ...initialStateOverride };
        if (override.principal && !override.homePrice) {
            override.homePrice = override.principal;
            override.downPayment = 0; // If they passed raw principal, assume no downpayment to hit exact number
        }

        return {
            ...initialState,
            ...override,
            prepayments: {
                ...initialState.prepayments,
                ...(override.prepayments || {})
            },
            lumpSums: override.lumpSums || initialState.lumpSums
        };
    }, [initialStateOverride]);

    const [state, dispatch] = useReducer(mortgageReducer, startingState);

    // Sync state if the server override changes (e.g. Astro View Transitions between pages)
    useEffect(() => {
        if (initialStateOverride) {
            dispatch({ type: 'SET_STATE', payload: startingState });
        }
    }, [startingState]);

    useEffect(() => {
        dispatch({ type: 'SET_MOUNTED', payload: true });
        
        // If an override was provided by the server (pSEO), don't override it with empty URL params on first mount.
        // The subsequent useEffect will push this server state to the URL.
        if (initialStateOverride) return;

        // Initial load from URL
        const params = new URLSearchParams(window.location.search);
        
        if (params.has('hp')) {
            const val = parseFloat(params.get('hp'));
            if (!isNaN(val)) dispatch({ type: 'SET_HOME_PRICE', payload: val });
        }
        // Backwards compatibility for old URLs
        else if (params.has('p')) {
            const val = parseFloat(params.get('p'));
            if (!isNaN(val)) {
                dispatch({ type: 'SET_HOME_PRICE', payload: val });
                dispatch({ type: 'SET_DOWN_PAYMENT', payload: 0 });
            }
        }

        if (params.has('dp')) {
            const val = parseFloat(params.get('dp'));
            if (!isNaN(val)) dispatch({ type: 'SET_DOWN_PAYMENT', payload: val });
        }
        if (params.has('dpt')) {
            dispatch({ type: 'SET_DOWN_PAYMENT_TYPE', payload: params.get('dpt') });
        }
        if (params.has('ty')) {
            const val = parseInt(params.get('ty'), 10);
            if (!isNaN(val)) dispatch({ type: 'SET_TERM_YEARS', payload: val });
        }
        if (params.has('r')) {
            const val = parseFloat(params.get('r'));
            if (!isNaN(val)) dispatch({ type: 'SET_RATE', payload: val });
        }
        if (params.has('a')) {
            const val = parseInt(params.get('a'), 10);
            if (!isNaN(val)) dispatch({ type: 'SET_AMORTIZATION', payload: val });
        }
        if (params.has('f')) {
            dispatch({ type: 'SET_FREQUENCY', payload: params.get('f') });
        }
        if (params.has('c')) {
            dispatch({ type: 'SET_COMPOUNDING', payload: params.get('c') });
        }
        if (params.has('cp')) {
            const val = parseFloat(params.get('cp'));
            if (!isNaN(val)) dispatch({ type: 'SET_CUSTOM_PAYMENT', payload: val });
        }
        if (params.has('sd')) {
            dispatch({ type: 'SET_START_DATE', payload: params.get('sd') });
        }
        if (params.has('mi')) {
            const val = parseFloat(params.get('mi'));
            if (!isNaN(val)) dispatch({ type: 'SET_PREPAYMENT', payload: { monthlyIncrease: val } });
        }
        if (params.has('pv')) {
            dispatch({ type: 'SET_PROVINCE', payload: params.get('pv') });
        }
        if (params.has('t')) {
            dispatch({ type: 'SET_IS_TORONTO', payload: params.get('t') === 'true' });
        }
        if (params.has('ftb')) {
            dispatch({ type: 'SET_IS_FIRST_TIME_BUYER', payload: params.get('ftb') === 'true' });
        }
        if (params.has('st')) {
            dispatch({ type: 'SET_SHOW_STRESS_TEST', payload: params.get('st') === 'true' });
        }
    }, []);

    useEffect(() => {
        if (!state.mounted) return;
        
        const params = new URLSearchParams(window.location.search);
        params.set('hp', state.homePrice);
        params.set('dp', state.downPayment);
        params.set('dpt', state.downPaymentType);
        params.set('r', state.annualRate);
        params.set('a', state.amortizationYears);
        params.set('ty', state.termYears);
        params.set('f', state.paymentFrequency);
        params.set('c', state.compounding);
        params.set('pv', state.province);
        if (state.isToronto) params.set('t', 'true'); else params.delete('t');
        if (state.isFirstTimeBuyer) params.set('ftb', 'true'); else params.delete('ftb');
        if (state.showStressTest) params.set('st', 'true'); else params.delete('st');

        if (state.customPayment > 0) params.set('cp', state.customPayment);
        else params.delete('cp');
        if (state.startDate !== defaultStartDate) params.set('sd', state.startDate);
        else params.delete('sd');
        if (state.prepayments.monthlyIncrease > 0) params.set('mi', state.prepayments.monthlyIncrease);
        else params.delete('mi');

        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState(null, '', newUrl);
    }, [state.homePrice, state.downPayment, state.downPaymentType, state.annualRate, state.amortizationYears, state.termYears, state.paymentFrequency, state.compounding, state.customPayment, state.startDate, state.prepayments, state.province, state.isToronto, state.isFirstTimeBuyer, state.showStressTest, state.mounted]);

    const results = useMemo(() => {
        const mortgageResults = calculateAmortization({
            homePrice: state.homePrice,
            downPayment: state.downPayment,
            downPaymentType: state.downPaymentType,
            annualRate: state.annualRate,
            amortizationYears: state.amortizationYears,
            termYears: state.termYears,
            paymentFrequency: state.paymentFrequency,
            compounding: state.compounding,
            customPayment: state.customPayment,
            startDate: state.startDate,
            prepayments: state.prepayments,
            lumpSums: state.lumpSums,
        });

        const lttResults = calculateLTT(
            state.homePrice,
            state.province,
            state.isToronto,
            state.isFirstTimeBuyer
        );

        return {
            ...mortgageResults,
            ltt: lttResults,
        };
    }, [state.homePrice, state.downPayment, state.downPaymentType, state.annualRate, state.amortizationYears, state.termYears, state.paymentFrequency, state.compounding, state.customPayment, state.startDate, state.prepayments, state.lumpSums, state.province, state.isToronto, state.isFirstTimeBuyer]);

    return { state, dispatch, results };
};
