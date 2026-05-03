import { useState, useMemo, useEffect } from 'react';
import { calculateFamilyRESP } from '../utils/respEngine';
import { usePostHog } from '@posthog/react';

const DEFAULT_STATE = {
    beneficiaries: [
        { id: 1, age: 7, name: 'Child 1' },
        { id: 2, age: 3, name: 'Child 2' }
    ],
    currentBalance: 0,
    annualReturn: 5,
    province: 'Ontario',
    clbEligible: false,
    contributionAmount: 400, // Combined total
    contributionFrequency: 'Monthly',
    showPayouts: false
};

export function useRESPMath(initialStateOverride) {
    const [state, setState] = useState({ ...DEFAULT_STATE, ...initialStateOverride });
    const [mounted, setMounted] = useState(false);
    const posthog = usePostHog();

    // Initial URL sync
    useEffect(() => {
        setMounted(true);
        const params = new URLSearchParams(window.location.search);
        const newState = { ...DEFAULT_STATE };
        
        if (params.has('bal')) newState.currentBalance = parseFloat(params.get('bal')) || DEFAULT_STATE.currentBalance;
        if (params.has('ret')) newState.annualReturn = parseFloat(params.get('ret')) || DEFAULT_STATE.annualReturn;
        if (params.has('prov')) newState.province = params.get('prov');
        if (params.has('clb')) newState.clbEligible = params.get('clb') === 'true';
        if (params.has('amt')) newState.contributionAmount = parseFloat(params.get('amt')) || DEFAULT_STATE.contributionAmount;
        if (params.has('freq')) newState.contributionFrequency = params.get('freq');
        if (params.has('pay')) newState.showPayouts = params.get('pay') === 'true';
        
        if (params.has('kids')) {
            try {
                newState.beneficiaries = JSON.parse(decodeURIComponent(params.get('kids')));
            } catch (e) {
                newState.beneficiaries = DEFAULT_STATE.beneficiaries;
            }
        }

        setState(newState);
    }, []);

    // Update URL on state change
    useEffect(() => {
        if (!mounted) return;
        const params = new URLSearchParams();
        params.set('bal', state.currentBalance);
        params.set('ret', state.annualReturn);
        params.set('prov', state.province);
        params.set('clb', state.clbEligible);
        params.set('amt', state.contributionAmount);
        params.set('freq', state.contributionFrequency);
        params.set('pay', state.showPayouts);
        params.set('kids', encodeURIComponent(JSON.stringify(state.beneficiaries)));

        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState(null, '', newUrl);
    }, [state, mounted]);

    const results = useMemo(() => {
        return calculateFamilyRESP({
            ...state,
            currentBalance: Number(state.currentBalance),
            annualReturn: Number(state.annualReturn),
            totalContributionAmount: Number(state.contributionAmount),
        });
    }, [state]);

    // Analytics
    useEffect(() => {
        if (!posthog || !mounted) return;
        const timer = setTimeout(() => {
            posthog.capture('family_resp_calculated', {
                number_of_children: state.beneficiaries.length,
                total_monthly_contribution: state.contributionAmount,
                province: state.province,
                clb_eligible: state.clbEligible,
                projected_balance: results.totalProjected
            });
        }, 2000);
        return () => clearTimeout(timer);
    }, [results.totalProjected, posthog, mounted]);

    const updateField = (field, value) => {
        setState(prev => ({ ...prev, [field]: value }));
    };

    const updateFields = (fields) => {
        setState(prev => ({ ...prev, ...fields }));
    };

    const addBeneficiary = () => {
        if (state.beneficiaries.length >= 4) return;
        setState(prev => ({
            ...prev,
            beneficiaries: [
                ...prev.beneficiaries,
                { id: Date.now(), age: 0, name: `Child ${prev.beneficiaries.length + 1}` }
            ]
        }));
    };

    const removeBeneficiary = (id) => {
        if (state.beneficiaries.length <= 1) return;
        setState(prev => ({
            ...prev,
            beneficiaries: prev.beneficiaries.filter(b => b.id !== id)
        }));
    };

    const updateBeneficiary = (id, field, value) => {
        setState(prev => ({
            ...prev,
            beneficiaries: prev.beneficiaries.map(b => b.id === id ? { ...b, [field]: value } : b)
        }));
    };

    return {
        state,
        updateField,
        updateFields,
        addBeneficiary,
        removeBeneficiary,
        updateBeneficiary,
        results
    };
}
