import React, { useState, useEffect } from 'react';
import { useRESPMath } from '../hooks/useRESPMath';
import { RESPForm } from './RESPForm';
import { RESPResults } from './RESPResults';
import { GraduationCapIcon, RotateCcwIcon, AICommandBar, StrategyCard, AICopilot } from '../../../components/shared';
import { useFinancialMemory } from '../../../hooks/useFinancialMemory';

const RESP_SUGGESTIONS = [
    { label: 'One Child', value: 'I have a newborn and want to save $200 a month for education' },
    { label: 'Family Plan', value: 'We have a 2 year old and a 5 year old. How much will we have at age 18?' },
    { label: 'BC Grant', value: 'I live in BC and my child is 6, what grants do I get?' }
];

export default function RESPCalculator({ initialStateOverride }) {
    const { memory, updateMemory } = useFinancialMemory();
    
    const { 
        state, 
        updateField, 
        updateFields,
        addBeneficiary, 
        removeBeneficiary, 
        updateBeneficiary, 
        results 
    } = useRESPMath(initialStateOverride);

    const [aiInsight, setAiInsight] = useState('');

    // --- EXPLICIT SETTERS (Bridge to state + memory) ---
    const updateProvince = (val) => {
        updateField('province', val);
        updateMemory({ province: val });
    };

    const updateCurrentBalance = (val) => {
        updateField('currentBalance', val);
        updateMemory({ portfolioBalance: val });
    };

    const updateKids = (val) => {
        // useRESPMath handles beneficiaries state internally, 
        // we just need to ensure memory is synced when they change.
        updateMemory({ children: val.map(b => ({ name: b.name, age: b.age })) });
    };

    // Effect to sync internal complex state changes (like beneficiaries) back to memory
    useEffect(() => {
        if (!state.mounted) return;
        updateMemory({
            province: state.province,
            portfolioBalance: state.currentBalance,
            children: state.beneficiaries.map(b => ({ name: b.name, age: b.age }))
        });
    }, [state.beneficiaries, state.mounted]); // Only sync when beneficiaries change

    const handleReset = () => {
        window.location.search = '';
    };

    const handleAIUpdate = (args) => {
        const updates = {};
        if (args.currentBalance !== undefined) updates.currentBalance = args.currentBalance;
        if (args.annualReturn !== undefined) updates.annualReturn = args.annualReturn;
        if (args.province !== undefined) updates.province = args.province;
        if (args.clbEligible !== undefined) updates.clbEligible = args.clbEligible;
        if (args.contributionAmount !== undefined) updates.contributionAmount = args.contributionAmount;
        if (args.contributionFrequency !== undefined) updates.contributionFrequency = args.contributionFrequency;
        
        if (args.beneficiaries && Array.isArray(args.beneficiaries)) {
            updates.beneficiaries = args.beneficiaries.map((b, i) => ({
                id: Date.now() + i,
                age: b.age,
                name: b.name || `Child ${i + 1}`
            }));
        }

        updateFields(updates);
        if (args.strategy_insight) setAiInsight(args.strategy_insight);
        
        // Sync any core profile updates from AI back to memory
        const memoryUpdates = {};
        if (args.province) memoryUpdates.province = args.province;
        if (args.currentBalance) memoryUpdates.portfolioBalance = args.currentBalance;
        if (args.beneficiaries) memoryUpdates.children = args.beneficiaries.map(b => ({ age: b.age }));
        if (Object.keys(memoryUpdates).length > 0) updateMemory(memoryUpdates);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 pb-32 md:pb-8 animate-fade-in relative flex flex-col min-h-0">
            {/* AI HERO SECTION (Hidden for Copilot)
            <AICommandBar 
                endpoint="/api/ai/resp"
                suggestions={RESP_SUGGESTIONS}
                onUpdate={handleAIUpdate}
                context={state}
                globalMemory={memory}
            />
            <StrategyCard insight={aiInsight} />
            */}

            {/* AI Copilot Persistent Sidebar/Bottom-sheet */}
            <AICopilot 
                onUpdate={handleAIUpdate}
                context={{ calculatorId: 'resp', ...state }}
                globalMemory={memory}
            />

            <div className="w-full">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-emerald-600 p-3 rounded-2xl shadow-xl shadow-emerald-200">
                            <GraduationCapIcon size={32} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">Family RESP Plan</h1>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Multi-child savings strategy</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={handleReset} className="bg-white border border-slate-200 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-2 group shadow-sm shadow-slate-100">
                            <RotateCcwIcon size={16} className="group-hover:-rotate-180 transition-transform duration-500" /> Reset
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                    <div className="lg:col-span-4 space-y-6">
                        <RESPForm 
                            state={state} 
                            updateField={(f, v) => f === 'province' ? updateProvince(v) : f === 'currentBalance' ? updateCurrentBalance(v) : updateField(f, v)} 
                            addBeneficiary={addBeneficiary}
                            removeBeneficiary={removeChild => { removeBeneficiary(removeChild); }}
                            updateBeneficiary={updateBeneficiary}
                        />
                        <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 flex gap-4 items-start mb-8 md:mb-0">
                            <div className="bg-white p-2 rounded-xl text-emerald-500 shadow-sm shrink-0"><GraduationCapIcon size={20} className="text-emerald-500" /></div>
                            <p className="text-xs text-emerald-900 leading-relaxed font-medium pt-1"><strong>Contribution Splitting:</strong> The contribution amount is automatically divided among children under 18 to maximize per-child grants.</p>
                        </div>
                    </div>
                    <div className="lg:col-span-8">
                        <RESPResults results={results} showPayouts={state.showPayouts} />
                    </div>
                </div>
            </div>

            <div className="md:hidden fixed bottom-4 left-4 right-4 z-50 animate-fade-in pointer-events-none">
                <div className="bg-slate-900 rounded-2xl shadow-2xl p-4 flex justify-between items-center border border-slate-800 pointer-events-auto">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Projected</span>
                        <span className="text-xl font-black text-emerald-400 tracking-tight">${Math.round(results.totalProjected).toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col items-end text-right">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Grants</span>
                        <span className="text-lg font-bold font-mono text-indigo-300">+${Math.round(results.totalGrants).toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
