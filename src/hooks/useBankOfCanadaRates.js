import { useState, useEffect } from 'react';

const CACHE_KEY = 'boc_rates';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export function useBankOfCanadaRates() {
    const [rates, setRates] = useState({
        bondYield5Yr: 3.5, // Fallback
        overnightRate: 4.5, // Fallback
        isLoading: true,
        error: null,
    });

    useEffect(() => {
        const fetchRates = async () => {
            try {
                // Check cache
                const cached = localStorage.getItem(CACHE_KEY);
                if (cached) {
                    const parsed = JSON.parse(cached);
                    if (Date.now() - parsed.timestamp < CACHE_TTL) {
                        setRates({
                            bondYield5Yr: parsed.bondYield5Yr,
                            overnightRate: parsed.overnightRate,
                            isLoading: false,
                            error: null,
                        });
                        return;
                    }
                }

                // Cache is missing or expired, fetch from API
                const url = 'https://www.bankofcanada.ca/valet/observations/BD.CDN.5YR.DQ.YLD,V39079/json?recent=1';
                const response = await fetch(url);
                if (!response.ok) throw new Error('Failed to fetch Bank of Canada rates');
                
                const data = await response.json();
                
                let bondYield5Yr = 3.5;
                let overnightRate = 4.5;
                
                if (data.observations && data.observations.length > 0) {
                    // Loop backwards to grab the most recent valid observation for each series
                    for (let i = data.observations.length - 1; i >= 0; i--) {
                        const obs = data.observations[i];
                        if (obs['BD.CDN.5YR.DQ.YLD']?.v && bondYield5Yr === 3.5) bondYield5Yr = parseFloat(obs['BD.CDN.5YR.DQ.YLD'].v);
                        if (obs.V39079?.v && overnightRate === 4.5) overnightRate = parseFloat(obs.V39079.v);
                    }
                }
                
                const newRates = { bondYield5Yr, overnightRate };
                
                // Save to cache
                localStorage.setItem(CACHE_KEY, JSON.stringify({
                    ...newRates,
                    timestamp: Date.now()
                }));
                
                setRates({
                    ...newRates,
                    isLoading: false,
                    error: null,
                });
            } catch (err) {
                console.error("Bank of Canada API Error:", err);
                setRates(prev => ({ ...prev, isLoading: false, error: err.message }));
            }
        };

        fetchRates();
    }, []);

    return rates;
}
