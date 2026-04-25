import { useState, useEffect, useCallback } from 'react';

/**
 * useLocalStorage Hook
 * 
 * A hydration-safe hook that persists state to window.localStorage.
 * Follows the same API signature as React's useState.
 * 
 * @param {string} key - The unique storage key
 * @param {any} initialValue - The fallback value if no storage exists
 */
export function useLocalStorage(key, initialValue) {
    // 1. Initialize state with initialValue
    // This ensures Server-Side Rendering matches the first Client-Side render
    const [state, setState] = useState(initialValue);

    // 2. Load from localStorage once on mount
    useEffect(() => {
        try {
            const item = window.localStorage.getItem(key);
            if (item !== null) {
                setState(JSON.parse(item));
            }
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
        }
    }, [key]);

    // 3. Persist to localStorage whenever state changes
    const setValue = useCallback((value) => {
        try {
            // Support both direct values and functional updates
            const valueToStore = value instanceof Function ? value(state) : value;
            
            setState(valueToStore);
            
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, state]);

    return [state, setValue];
}
