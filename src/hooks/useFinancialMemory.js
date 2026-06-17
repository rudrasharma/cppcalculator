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
 * Uses a singleton-style event system to prevent infinite re-render loops
 */
export const useFinancialMemory = () => {
    const [memory, setMemory] = useState(DEFAULT_MEMORY);

    // 1. Initial Load & Listen for updates from other components
    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        const load = () => {
            const stored = localStorage.getItem(MEMORY_KEY);
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    setMemory(prev => ({ ...prev, ...parsed }));
                } catch (e) {
                    console.error("Failed to parse financial memory", e);
                }
            }
        };

        load();

        const handleGlobalUpdate = () => load();
        window.addEventListener(MEMORY_EVENT, handleGlobalUpdate);
        return () => window.removeEventListener(MEMORY_EVENT, handleGlobalUpdate);
    }, []);

    // 2. Broadcast updates to all other hooks/components
    const updateMemory = useCallback((updates) => {
        if (typeof window === 'undefined') return;

        const stored = localStorage.getItem(MEMORY_KEY);
        const current = stored ? JSON.parse(stored) : DEFAULT_MEMORY;
        const next = { ...current, ...updates };

        localStorage.setItem(MEMORY_KEY, JSON.stringify(next));
        setMemory(next);

        // Notify other instances of this hook
        window.dispatchEvent(new CustomEvent(MEMORY_EVENT));
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
