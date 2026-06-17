import { useState, useEffect, useCallback } from 'react';

const MEMORY_KEY = 'looniefi_memory_v1';

const DEFAULT_MEMORY = {
    // Core Profile
    province: null,
    maritalStatus: null,
    dob: null,
    partnerDob: null,

    // Income & Employment
    grossIncome: null,
    partnerIncome: null,
    employerMatchPercent: null,

    // Assets & Liabilities
    homeValue: null,
    mortgageBalance: null,
    portfolioBalance: null,

    // Family
    children: []
};

/**
 * useFinancialMemory - Hook to manage global user data persistence across tools
 */
export const useFinancialMemory = () => {
    const [memory, setMemory] = useState(DEFAULT_MEMORY);

    // 1. Initial Load
    useEffect(() => {
        const stored = localStorage.getItem(MEMORY_KEY);
        if (stored) {
            try {
                setMemory(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse financial memory", e);
            }
        }
    }, []);

    // 2. Persist to localStorage on change
    const updateMemory = useCallback((updates) => {
        setMemory(prev => {
            const next = { ...prev, ...updates };
            localStorage.setItem(MEMORY_KEY, JSON.stringify(next));
            return next;
        });
    }, []);

    // 3. Flatten memory for AI prompt context
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
