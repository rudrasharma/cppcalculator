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
            startAge: 65,
            endAge: 90,
            targetIncome: 60000,
            inflation: 0.021,
            returnRate: 0.05,
            balances: {
                tfsa: 0,
                rrsp: 0,
                nonReg: 0,
                lira: 0
            },
            pension: { amount: 0, startAge: 65 },
            cpp: { amount: 0, startAge: 65 },
            oas: { amount: 8000, startAge: 65 }, // Standard OAS base
            drawdownOrder: ['nonReg', 'rrsp', 'lira', 'tfsa']
        };
    });

    const [aiInsight, setAiInsight] = useState('');

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

    const updateField = (field, value) => {
        setState(prev => {
            const newState = { ...prev, [field]: value };
            
            // Sync specific fields to global memory
            if (field === 'province') updateMemory({ province: value });
            
            return newState;
        });
    };

    const results = useMemo(() => calculateRetirementDrawdown(state), [state]);

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
                        <PlannerInputs state={state} updateField={updateField} />
                    </div>

                    {/* Right Column: Visualization & Metrics */}
                    <div className="lg:col-span-7 space-y-6">
                        <PlannerMetrics results={results} />
                        <PlannerCharts results={results} />
                    </div>
                </div>
            </main>
        </div>
    );
}
