import { useState, useEffect, useCallback } from 'react';

const MEMORY_KEY = 'looniefi_memory_v1';
const MEMORY_EVENT = 'financial-memory-update';

const DEFAULT_MEMORY = {
    province: null,
    maritalStatus: null,
    dob: null,
    partnerDob: null,
    grossIncome: null,
    partnerIncome: null,
    employerMatchPercent: null,
    homeValue: null,
    mortgageBalance: null,
    portfolioBalance: null,
    children: []
};

/**
 * useFinancialMemory - Hook to manage global user data persistence across tools
 */
export const useFinancialMemory = () => {
    // Always initialize with DEFAULT_MEMORY to ensure SSR and initial client render match exactly (fixes React Hydration crashes)
    const [memory, setMemory] = useState(DEFAULT_MEMORY);

    // Load from localStorage ONLY after hydration is complete
    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            const stored = localStorage.getItem(MEMORY_KEY);
            if (stored) {
                setMemory({ ...DEFAULT_MEMORY, ...JSON.parse(stored) });
            }
        } catch (e) {
            console.error('Failed to load financial memory', e);
        }
    }, []);

    // Listen for updates from other components/tabs
    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        const sync = () => {
            const stored = localStorage.getItem(MEMORY_KEY);
            if (stored) {
                try {
                    setMemory(JSON.parse(stored));
                } catch (e) {}
            }
        };

        window.addEventListener(MEMORY_EVENT, sync);
        return () => window.removeEventListener(MEMORY_EVENT, sync);
    }, []);

    const updateMemory = useCallback((updates) => {
        if (typeof window === 'undefined') return;

        setMemory(prev => {
            const next = { ...prev, ...updates };
            localStorage.setItem(MEMORY_KEY, JSON.stringify(next));
            
            // Notify other instances of this hook
            window.dispatchEvent(new CustomEvent(MEMORY_EVENT));
            return next;
        });
    }, []);

    const getMemoryContext = useCallback(() => {
        const facts = [];
        if (memory.province) facts.push(`User lives in ${memory.province}.`);
        if (memory.grossIncome) facts.push(`User's annual gross income is $${memory.grossIncome}.`);
        if (memory.maritalStatus) facts.push(`User is ${memory.maritalStatus}.`);
        if (memory.homeValue) facts.push(`User's home is valued at $${memory.homeValue}.`);
        if (memory.mortgageBalance) facts.push(`User has a mortgage balance of $${memory.mortgageBalance}.`);
        if (memory.children?.length > 0) {
            const ages = memory.children.map(c => c.age).join(', ');
            facts.push(`User has ${memory.children.length} children aged ${ages}.`);
        }
        return facts.join(' ');
    }, [memory]);

    return {
        memory,
        updateMemory,
        getMemoryContext
    };
};
