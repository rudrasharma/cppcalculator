import { compressEarnings, decompressEarnings } from '../../../utils/compression';

/**
 * Load state from URL parameters
 */
export const loadStateFromUrl = (initialState) => {
    if (typeof window === 'undefined') return initialState;
    
    const params = new URLSearchParams(window.location.search);
    if (!params.toString()) return initialState;

    const state = { ...initialState };

    if (params.get('d')) {
        state.dob = params.get('d').replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
    }
    if (params.get('r')) {
        state.retirementAge = parseInt(params.get('r'));
    }
    const yic = params.get('y');
    if (yic) {
        const yicVal = parseInt(yic);
        state.yearsInCanada = yicVal;
        if (yicVal < 40) state.livedInCanadaAllLife = false;
    }
    if (params.get('s')) {
        state.avgSalaryInput = parseInt(params.get('s'), 36).toString();
    }
    if (params.get('o')) {
        state.otherIncome = parseInt(params.get('o'), 36).toString();
    }
    if (params.get('m') === '1') {
        state.isMarried = true;
    }
    if (params.get('sd')) {
        state.spouseDob = params.get('sd').replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
    }
    if (params.get('si')) {
        state.spouseIncome = parseInt(params.get('si'), 36).toString();
    }
    if (params.get('fa') === '1') {
        state.forceAllowance = true;
    }
    
    const earningsStr = params.get('e');
    const dobParam = params.get('d');
    if (earningsStr && dobParam) {
        const bYear = parseInt(dobParam.substring(0, 4));
        state.earnings = decompressEarnings(earningsStr, bYear);
    }

    return state;
};

/**
 * Sync state to URL parameters
 */
export const syncStateToUrl = (state, birthYear) => {
    const params = new URLSearchParams(window.location.search);

    params.set('d', state.dob.replace(/-/g,'')); 
    params.set('r', state.retirementAge);
    params.set('y', state.yearsInCanada);

    if (state.avgSalaryInput) {
        params.set('s', parseInt(state.avgSalaryInput).toString(36));
    } else {
        params.delete('s');
    }

    if (state.otherIncome) {
        params.set('o', parseInt(state.otherIncome).toString(36));
    } else {
        params.delete('o');
    }

    if (state.isMarried) {
        params.set('m', '1');
        params.set('sd', state.spouseDob.replace(/-/g,''));
        if (state.spouseIncome) {
            params.set('si', parseInt(state.spouseIncome).toString(36));
        }
        if (state.forceAllowance) {
            params.set('fa', '1');
        }
    } else {
        params.delete('m');
        params.delete('sd');
        params.delete('si');
        params.delete('fa');
    }

    const compressedEarn = compressEarnings(state.earnings, birthYear);
    if (compressedEarn) {
        params.set('e', compressedEarn);
    } else {
        params.delete('e');
    }

    params.set('view', 'cpp');

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
};

