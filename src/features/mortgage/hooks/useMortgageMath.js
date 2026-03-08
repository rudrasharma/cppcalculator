import { useReducer, useEffect, useMemo } from 'react';
import { calculateAmortization, PAYMENT_FREQUENCIES, COMPOUNDING_PERIODS } from '../utils/mortgageEngine';
import { calculateLTT } from '../utils/lttEngine';

const today = new Date();
const defaultStartDate = today.toISOString().split('T')[0];
const nextYear = new Date(today);
nextYear.setFullYear(today.getFullYear() + 1);
const defaultLumpSumDate = nextYear.toISOString().split('T')[0];

const initialState = {
    calculationMode: 'purchase', // 'purchase' or 'renewal'
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
    propertyTaxes: 0,
    heating: 0,
    condoFees: 0,
    prepayments: {
        monthlyIncrease: 0,
    },
    lumpSums: [],
    mounted: false,
};

function mortgageReducer(state, action) {
    switch (action.type) {
        case 'SET_CALCULATION_MODE':
            return { ...state, calculationMode: action.payload };
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
        case 'SET_PROPERTY_TAXES':
            return { ...state, propertyTaxes: action.payload };
        case 'SET_HEATING':
            return { ...state, heating: action.payload };
        case 'SET_CONDO_FEES':
            return { ...state, condoFees: action.payload };
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
    const startingState = useMemo(() => {
        if (!initialStateOverride) return initialState;
        
        let override = { ...initialStateOverride };
        if (override.principal && !override.homePrice) {
            override.homePrice = override.principal;
            override.downPayment = 0;
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

    useEffect(() => {
        if (initialStateOverride) {
            dispatch({ type: 'SET_STATE', payload: startingState });
        }
    }, [startingState]);

    // CMHC Rule Enforcement: If down payment < 20%, max amortization is 25 years
    useEffect(() => {
        if (state.calculationMode !== 'renewal') {
            const actualDownPayment = state.downPaymentType === 'percent' 
                ? state.homePrice * (state.downPayment / 100) 
                : state.downPayment;
            
            const downPaymentPercent = state.homePrice > 0 ? (actualDownPayment / state.homePrice) * 100 : 0;
            
            if (downPaymentPercent < 20 && state.amortizationYears > 25) {
                dispatch({ type: 'SET_AMORTIZATION', payload: 25 });
            }
        }
    }, [state.homePrice, state.downPayment, state.downPaymentType, state.amortizationYears, state.calculationMode]);

    useEffect(() => {
        dispatch({ type: 'SET_MOUNTED', payload: true });
        
        if (initialStateOverride) return;

        const params = new URLSearchParams(window.location.search);
        
        if (params.has('m')) dispatch({ type: 'SET_CALCULATION_MODE', payload: params.get('m') });
        if (params.has('hp')) dispatch({ type: 'SET_HOME_PRICE', payload: parseFloat(params.get('hp')) || 0 });
        else if (params.has('p')) {
            dispatch({ type: 'SET_HOME_PRICE', payload: parseFloat(params.get('p')) || 0 });
            dispatch({ type: 'SET_DOWN_PAYMENT', payload: 0 });
        }
        if (params.has('dp')) dispatch({ type: 'SET_DOWN_PAYMENT', payload: parseFloat(params.get('dp')) || 0 });
        if (params.has('dpt')) dispatch({ type: 'SET_DOWN_PAYMENT_TYPE', payload: params.get('dpt') });
        if (params.has('ty')) dispatch({ type: 'SET_TERM_YEARS', payload: parseInt(params.get('ty'), 10) || 5 });
        if (params.has('r')) dispatch({ type: 'SET_RATE', payload: parseFloat(params.get('r')) || 5 });
        if (params.has('a')) dispatch({ type: 'SET_AMORTIZATION', payload: parseInt(params.get('a'), 10) || 25 });
        if (params.has('f')) dispatch({ type: 'SET_FREQUENCY', payload: params.get('f') });
        if (params.has('c')) dispatch({ type: 'SET_COMPOUNDING', payload: params.get('c') });
        if (params.has('cp')) dispatch({ type: 'SET_CUSTOM_PAYMENT', payload: parseFloat(params.get('cp')) || 0 });
        if (params.has('sd')) dispatch({ type: 'SET_START_DATE', payload: params.get('sd') });
        if (params.has('mi')) dispatch({ type: 'SET_PREPAYMENT', payload: { monthlyIncrease: parseFloat(params.get('mi')) || 0 } });
        if (params.has('pv')) dispatch({ type: 'SET_PROVINCE', payload: params.get('pv') });
        if (params.has('t')) dispatch({ type: 'SET_IS_TORONTO', payload: params.get('t') === 'true' });
        if (params.has('ftb')) dispatch({ type: 'SET_IS_FIRST_TIME_BUYER', payload: params.get('ftb') === 'true' });
        if (params.has('st')) dispatch({ type: 'SET_SHOW_STRESS_TEST', payload: params.get('st') === 'true' });
        if (params.has('pt')) dispatch({ type: 'SET_PROPERTY_TAXES', payload: parseFloat(params.get('pt')) || 0 });
        if (params.has('ht')) dispatch({ type: 'SET_HEATING', payload: parseFloat(params.get('ht')) || 0 });
        if (params.has('cf')) dispatch({ type: 'SET_CONDO_FEES', payload: parseFloat(params.get('cf')) || 0 });
    }, []);

    useEffect(() => {
        if (!state.mounted) return;
        
        const params = new URLSearchParams(window.location.search);
        params.set('m', state.calculationMode);
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
        if (state.customPayment > 0) params.set('cp', state.customPayment); else params.delete('cp');
        if (state.startDate !== defaultStartDate) params.set('sd', state.startDate); else params.delete('sd');
        if (state.prepayments.monthlyIncrease > 0) params.set('mi', state.prepayments.monthlyIncrease); else params.delete('mi');
        if (state.propertyTaxes > 0) params.set('pt', state.propertyTaxes); else params.delete('pt');
        if (state.heating > 0) params.set('ht', state.heating); else params.delete('ht');
        if (state.condoFees > 0) params.set('cf', state.condoFees); else params.delete('cf');

        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState(null, '', newUrl);
    }, [state]);

    const results = useMemo(() => {
        const isRenewal = state.calculationMode === 'renewal';
        const mortgageResults = calculateAmortization({
            homePrice: state.homePrice,
            downPayment: isRenewal ? 0 : state.downPayment,
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
            isRenewal,
            province: state.province,
            propertyTaxes: state.propertyTaxes,
            heating: state.heating,
            condoFees: state.condoFees
        });

        const lttResults = isRenewal ? { totalTax: 0, provincialTax: 0, municipalTax: 0, provincialRebate: 0, municipalRebate: 0 } : calculateLTT(
            state.homePrice,
            state.province,
            state.isToronto,
            state.isFirstTimeBuyer
        );

        return {
            ...mortgageResults,
            ltt: lttResults,
        };
    }, [state.calculationMode, state.homePrice, state.downPayment, state.downPaymentType, state.annualRate, state.amortizationYears, state.termYears, state.paymentFrequency, state.compounding, state.customPayment, state.startDate, state.prepayments, state.lumpSums, state.province, state.isToronto, state.isFirstTimeBuyer, state.propertyTaxes, state.heating, state.condoFees]);

    return { state, dispatch, results };
};
