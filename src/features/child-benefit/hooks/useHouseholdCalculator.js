import { useReducer, useEffect, useMemo, useCallback } from 'react';
import { calculateAll } from '../utils/benefitEngine';

const getParam = (key) => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
};

const initialState = {
    province: getParam('p') || 'ON',
    maritalStatus: getParam('ms') || 'MARRIED',
    grossAfni: (() => {
        const urlI = getParam('i');
        return urlI ? parseInt(urlI, 36) : 65000;
    })(),
    sharedCustody: getParam('sc') === '1',
    isRural: getParam('r') === '1',
    children: (() => {
        const urlC = getParam('c');
        if (urlC) {
            try {
                return urlC.split('_').map((str, idx) => {
                    const [age, dis] = str.split('-');
                    return { id: Date.now() + idx, age: parseInt(age) || 0, disability: dis === '1' };
                });
            } catch(e) { return [{ id: 1, age: 3, disability: false }]; }
        }
        return [{ id: Date.now(), age: 3, disability: false }]; // Default child
    })(),
    activeTab: 'input',
    copySuccess: false,
    mounted: false,
    isVisible: true, // Assuming default visibility
};

function householdCalculatorReducer(state, action) {
    switch (action.type) {
        case 'SET_PROVINCE':
            return { ...state, province: action.payload };
        case 'SET_MARITAL_STATUS':
            return { ...state, maritalStatus: action.payload };
        case 'SET_GROSS_AFNI':
            return { ...state, grossAfni: action.payload };
        case 'SET_SHARED_CUSTODY':
            return { ...state, sharedCustody: action.payload };
        case 'SET_IS_RURAL':
            return { ...state, isRural: action.payload };
        case 'ADD_CHILD':
            return { ...state, children: [...state.children, { id: Date.now(), age: 0, disability: false }] };
        case 'REMOVE_CHILD':
            return { ...state, children: state.children.filter(child => child.id !== action.payload) };
        case 'UPDATE_CHILD':
            return {
                ...state,
                children: state.children.map(child =>
                    child.id === action.payload.id ? { ...child, [action.payload.field]: action.payload.value } : child
                ),
            };
        case 'SET_ACTIVE_TAB':
            return { ...state, activeTab: action.payload };
        case 'SET_COPY_SUCCESS':
            return { ...state, copySuccess: action.payload };
        case 'SET_MOUNTED':
            return { ...state, mounted: action.payload };
        case 'SET_IS_VISIBLE':
            return { ...state, isVisible: action.payload };
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

export const useHouseholdCalculator = () => {
    const [state, dispatch] = useReducer(householdCalculatorReducer, initialState);

    const { province, maritalStatus, grossAfni, sharedCustody, isRural, children, mounted } = state;

    useEffect(() => { dispatch({ type: 'SET_MOUNTED', payload: true }); }, []);

    const afni = Math.max(0, grossAfni || 0);

    // ==========================================
    //   SYNC TO URL (Live Update)
    // ==========================================
    useEffect(() => {
        if (!mounted) return;

        const params = new URLSearchParams(window.location.search);

        if (grossAfni > 0) params.set('i', grossAfni.toString(36));
        else params.delete('i');

        params.set('p', province);
        params.set('ms', maritalStatus);
        params.set('sc', sharedCustody ? '1' : '0');
        params.set('r', isRural ? '1' : '0');

        if (children.length > 0) {
            const childStr = children.map(c => `${c.age}-${c.disability ? 1 : 0}`).join('_');
            params.set('c', childStr);
        } else {
            params.delete('c');
        }

        params.set('view', 'ccb');

        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState(null, '', newUrl);

    }, [grossAfni, province, maritalStatus, sharedCustody, isRural, children, mounted]);

    const results = useMemo(() => calculateAll(afni, children, sharedCustody, province, maritalStatus, isRural), [afni, children, sharedCustody, province, maritalStatus, isRural]);

    const chartData = useMemo(() => {
        const data = [];
        for (let inc = 0; inc <= 180000; inc += 5000) {
            const res = calculateAll(inc, children, sharedCustody, province, maritalStatus, isRural);
            data.push({ 
                income: inc, 
                CCB: Math.round(res.federal), 
                Provincial: Math.round(res.provincial), 
                Credits: Math.round(res.gst + res.caip) 
            });
        }
        return data;
    }, [children, sharedCustody, province, maritalStatus, isRural]);

    const paymentSchedule = useMemo(() => {
        const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"];
        return months.map(m => {
            const isQuarterly = ["Jul", "Oct", "Jan", "Apr"].includes(m);
            let base = (results.federal) / 12;
            
            if (province === 'ON') {
                base += (results.provincial / 12);
            } else if (province === 'AB' || province === 'QC') {
                const isAbQuarter = ["Aug", "Nov", "Feb", "May"].includes(m);
                if (province === 'QC') isAbQuarter ? base += (results.provincial / 4) : base += 0; 
                else isAbQuarter ? base += (results.provincial / 4) : base += 0; 
            } else {
                base += (results.provincial / 12);
            }

            const extra = isQuarterly ? (results.gst / 4) + (results.caip / 4) : 0;
            
            return { month: m, total: base + extra, isQuarterly: (isQuarterly || (["Aug", "Nov", "Feb", "May"].includes(m) && (province === 'AB' || province === 'QC'))) };
        });
    }, [results, province]);

    const copyLink = useCallback(() => {
        navigator.clipboard.writeText(window.location.href).then(() => { 
            dispatch({ type: 'SET_COPY_SUCCESS', payload: true });
            setTimeout(() => dispatch({ type: 'SET_COPY_SUCCESS', payload: false }), 2000); 
        });
    }, []);

    return { state, dispatch, results, chartData, paymentSchedule, afni, copyLink };
};
