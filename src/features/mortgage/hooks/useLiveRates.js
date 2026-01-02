import { useState, useEffect } from 'react';

export const useLiveRates = () => {
    const [rates, setRates] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRates = async () => {
            setLoading(true);
            try {
                // Call our own internal API route
                const response = await fetch('/api/rates.json');
                
                if (!response.ok) {
                    throw new Error('Failed to fetch rates');
                }

                const data = await response.json();
                
                setRates({
                    fixed5Year: data.fixed5Year,
                    variable5Year: data.variable5Year,
                    benchmarkPosted: data.postedRate, // Useful for comparison logic
                    primeRate: data.primeRate,
                    lastUpdated: data.effectiveDate,
                    source: data.source
                });
            } catch (err) {
                console.error("Failed to load rates", err);
                setError(err);
                
                // Final safety fallback if the internal API route crashes
                setRates({
                    fixed5Year: 3.99,
                    variable5Year: 3.45,
                    benchmarkPosted: 6.09,
                    primeRate: 4.45,
                    lastUpdated: 'Offline Mode',
                    source: 'Offline'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchRates();
    }, []);

    return { rates, loading, error };
};