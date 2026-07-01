import React, { useState, useMemo, useEffect } from 'react';
import { PlannerInputs } from './PlannerInputs';
import { PlannerCharts } from './PlannerCharts';
import { PlannerMetrics } from './PlannerMetrics';
import { calculateRetirementDrawdown } from '../utils/drawdownEngine';
import { useFinancialMemory } from '../../../hooks/useFinancialMemory';
import { AICommandBar, StrategyCard, AICopilot } from '../../../components/shared';

const RETIREMENT_PLANNER_SUGGESTIONS = [
    { label: 'Basic Drawdown', value: 'I am retiring at 65 with $500k in RRSP and $200k in TFSA. Target income is $60k/year.' },
    { label: 'Early FIRE', value: 'I want to retire at 40 with $1M Non-Reg. Will it last until 90?' },
    { label: 'Pension Safety', value: 'I have a $40k/yr DB pension. How much RRSP do I need to hit $80k income?' }
];

export default function RetirementPlanner({ isVisible = true }) {
    const { memory, updateMemory } = useFinancialMemory();

    // Core state
    const [state, setState] = useState(() => {
        // Hydrate from memory where possible
        return {
            province: memory?.province || 'ON',
            yearsInCanada: memory?.yearsInCanada || 40,
            currentAge: 40,
            startAge: 65,
            endAge: 90,
            workingIncome: 60000,
            targetIncome: 60000,
            inflation: 0.021,
            returnRate: 0.05,
            balances: {
                tfsa: 20000,
                rrsp: 50000,
                nonReg: 0,
                nonRegBookValue: 0,
                lira: 0
            },
            contributions: {
                tfsa: 0,
                rrsp: 0,
                nonReg: 0
            },
            pension: { amount: 0, startAge: 65 },
            cpp: { amount: 0, startAge: 65 },
            oas: { amount: 8000, startAge: 65 }, // Standard OAS base
            drawdownOrder: ['nonReg', 'rrsp', 'lira', 'tfsa'],
            hasSpouse: false,
            spouse: {
                currentAge: 40,
                startAge: 65,
                workingIncome: 60000,
                yearsInCanada: 40,
                balances: {
                    tfsa: 0,
                    rrsp: 0,
                    lira: 0
                },
                contributions: {
                    tfsa: 0,
                    rrsp: 0
                },
                pension: { amount: 0, startAge: 65 },
                cpp: { amount: 0, startAge: 65 },
                oas: { amount: 8000, startAge: 65 }
            }
        };
    });

    const [aiInsight, setAiInsight] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount (client-side only to prevent hydration mismatch)
    useEffect(() => {
        try {
            const savedState = localStorage.getItem('retirementPlannerState');
            if (savedState) {
                const parsed = JSON.parse(savedState);
                // Ensure global memory province overwrites local if exists
                if (memory?.province) parsed.province = memory.province;
                
                // Schema migration: Add spouse object if it doesn't exist
                if (parsed.hasSpouse === undefined) parsed.hasSpouse = false;
                if (parsed.workingIncome === undefined) parsed.workingIncome = 60000;
                
                if (!parsed.spouse) {
                    parsed.spouse = {
                        currentAge: 40,
                        startAge: 65,
                        workingIncome: 60000,
                        yearsInCanada: 40,
                        balances: { tfsa: 0, rrsp: 0, lira: 0 },
                        contributions: { tfsa: 0, rrsp: 0 },
                        pension: { amount: 0, startAge: 65 },
                        cpp: { amount: 0, startAge: 65 },
                        oas: { amount: 8000, startAge: 65 }
                    };
                } else if (parsed.spouse.workingIncome === undefined) {
                    parsed.spouse.workingIncome = 60000;
                }

                setState(parsed);
            }
        } catch (e) {
            console.error("Failed to parse saved retirement state", e);
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage when state changes (only after initial load)
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem('retirementPlannerState', JSON.stringify(state));
            } catch (e) {
                console.error("Failed to save retirement state", e);
            }
        }
    }, [state, isLoaded]);

    // Effect to auto-fill CPP if they have grossIncome in memory, but don't overwrite if they already typed something
    useEffect(() => {
        if (memory?.grossIncome && state.cpp.amount === 0) {
            // Rough estimation for Simplistic Planner: 
            // If they make > 68k (YMPE), they get roughly max CPP (around 15k). Otherwise proportional.
            const estimatedCPP = Math.min(15000, (memory.grossIncome / 68500) * 15000);
            setState(prev => ({
                ...prev,
                cpp: { ...prev.cpp, amount: Math.round(estimatedCPP) }
            }));
        }
    }, [memory?.grossIncome]);

    const [isMonteCarlo, setIsMonteCarlo] = useState(false);
    const [monteCarloResults, setMonteCarloResults] = useState(null);
    const [isCalculatingMC, setIsCalculatingMC] = useState(false);
    const [monteCarloProfile, setMonteCarloProfile] = useState('Balanced');

    const updateField = (field, value) => {
        setState(prev => {
            const newState = { ...prev, [field]: value };
            
            // Sync specific fields to global memory
            if (field === 'province') updateMemory({ province: value });
            
            return newState;
        });
    };

    const results = useMemo(() => calculateRetirementDrawdown(state), [state]);

    // Handle Monte Carlo Web Worker
    useEffect(() => {
        if (!isMonteCarlo) return;

        setIsCalculatingMC(true);
        const worker = new Worker(new URL('../workers/monteCarloWorker.js', import.meta.url), { type: 'module' });
        
        worker.onmessage = (e) => {
            if (e.data.error) {
                console.error("Monte Carlo Error:", e.data.error);
            } else {
                setMonteCarloResults(e.data);
            }
            setIsCalculatingMC(false);
        };

        // Debounce sending state to worker
        const timer = setTimeout(() => {
            worker.postMessage({ state, riskProfile: monteCarloProfile });
        }, 500);

        return () => {
            clearTimeout(timer);
            worker.terminate();
        };
    }, [state, isMonteCarlo, monteCarloProfile]);

    const handleAIUpdate = (updates) => {
        setState(prev => ({ ...prev, ...updates }));
        if (updates.strategy_insight) setAiInsight(updates.strategy_insight);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 flex flex-col min-h-0 pb-32 md:pb-8">
            <main className="max-w-7xl mx-auto p-4 md:p-8 w-full mt-6">
                
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Retirement Planner</h1>
                    <p className="text-lg text-slate-600 mt-2 max-w-3xl">
                        A simplistic asset drawdown simulator. See if your portfolio and government benefits can sustain your target lifestyle.
                    </p>
                </div>

                <AICopilot 
                    onUpdate={handleAIUpdate}
                    context={{ calculatorId: 'retirement-planner', ...state }}
                    globalMemory={memory}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Inputs */}
                    <div className="lg:col-span-5 space-y-6">
                        <PlannerInputs 
                            state={state} 
                            updateField={updateField} 
                            isMonteCarlo={isMonteCarlo}
                            setIsMonteCarlo={setIsMonteCarlo}
                            monteCarloProfile={monteCarloProfile}
                            setMonteCarloProfile={setMonteCarloProfile}
                        />
                    </div>

                    {/* Right Column: Visualization & Metrics */}
                    <div className="lg:col-span-7 space-y-6">
                        <PlannerMetrics 
                            results={results} 
                            state={state}
                            isMonteCarlo={isMonteCarlo}
                            monteCarloResults={monteCarloResults}
                        />
                        <PlannerCharts 
                            results={results} 
                            state={state} 
                            isMonteCarlo={isMonteCarlo}
                            setIsMonteCarlo={setIsMonteCarlo}
                            isCalculatingMC={isCalculatingMC}
                            monteCarloResults={monteCarloResults}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
