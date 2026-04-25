import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useLocalStorage Hook
 * 
 * A hydration-safe hook that persists state to window.localStorage.
 * Follows the same API signature as React's useState.
 */
export function useLocalStorage(key, initialValue) {
    // 1. Initialize state with initialValue for SSR/Hydration match
    const [state, setState] = useState(() => {
        return typeof initialValue === 'function' ? initialValue() : initialValue;
    });
    
    // Track if we've initialized from localStorage to avoid overwriting on mount
    const hasInitialized = useRef(false);

    // 2. Load from localStorage once on mount
    useEffect(() => {
        try {
            const item = window.localStorage.getItem(key);
            if (item !== null) {
                setState(JSON.parse(item));
            }
        } catch (error) {
            console.warn(`useLocalStorage: Error reading key "${key}":`, error);
        } finally {
            hasInitialized.current = true;
        }
    }, [key]);

    // 3. Stable setter function
    const setValue = useCallback((value) => {
        setState((prev) => {
            // Resolve functional updates correctly using the latest previous state
            const nextValue = value instanceof Function ? value(prev) : value;
            
            // Persist to localStorage immediately
            try {
                if (typeof window !== 'undefined') {
                    window.localStorage.setItem(key, JSON.stringify(nextValue));
                }
            } catch (error) {
                console.warn(`useLocalStorage: Error setting key "${key}":`, error);
            }
            
            return nextValue;
        });
    }, [key]);

    return [state, setValue];
}
