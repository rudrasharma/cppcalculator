import { useState, useEffect } from 'react';

/**
 * Custom hook to sync tab state with URL query parameters
 * @param {string} defaultTab - Default tab value if not in URL
 * @param {string} queryParam - Query parameter name (default: 'step')
 * @returns {[string, function]} - [activeTab, setActiveTab]
 */
export function useUrlTab(defaultTab = 'input', queryParam = 'step') {
    const [activeTab, setActiveTabState] = useState(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            return params.get(queryParam) || defaultTab;
        }
        return defaultTab;
    });

    useEffect(() => {
        const handlePopState = () => {
            const params = new URLSearchParams(window.location.search);
            const step = params.get(queryParam);
            setActiveTabState(step || defaultTab);
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [defaultTab, queryParam]);

    const setActiveTab = (newTab) => {
        setActiveTabState(newTab);
        const url = new URL(window.location);
        
        if (newTab === defaultTab) {
            url.searchParams.delete(queryParam);
        } else {
            url.searchParams.set(queryParam, newTab);
        }
        
        window.history.pushState({}, '', url);
        
        if (newTab === 'results') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return [activeTab, setActiveTab];
}
