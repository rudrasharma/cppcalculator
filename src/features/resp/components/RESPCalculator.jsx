import React from 'react';
import { useRESPMath } from '../hooks/useRESPMath';
import { RESPForm } from './RESPForm';
import { RESPResults } from './RESPResults';
import { GraduationCapIcon, InfoIcon, RotateCcwIcon } from '../../../components/shared';

export default function RESPCalculator({ initialStateOverride }) {
    const { 
        state, 
        updateField, 
        addBeneficiary, 
        removeBeneficiary, 
        updateBeneficiary, 
        results 
    } = useRESPMath(initialStateOverride);

    const handleReset = () => {
        window.location.search = '';
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 pb-32 md:pb-8 animate-fade-in relative">
            {/* Header */}
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
                    <button 
                        onClick={handleReset}
                        className="bg-white border border-slate-200 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-2 group shadow-sm shadow-slate-100"
                    >
                        <RotateCcwIcon size={16} className="group-hover:-rotate-180 transition-transform duration-500" />
                        Reset
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                {/* --- INPUT COLUMN (Left) --- */}
                <div className="lg:col-span-4 space-y-6">
                    <RESPForm 
                        state={state} 
                        updateField={updateField} 
                        addBeneficiary={addBeneficiary}
                        removeBeneficiary={removeBeneficiary}
                        updateBeneficiary={updateBeneficiary}
                    />

                    {/* Context Helper */}
                    <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 flex gap-4 items-start mb-8 md:mb-0">
                        <div className="bg-white p-2 rounded-xl text-emerald-500 shadow-sm shrink-0">
                            <InfoIcon size={20} />
                        </div>
                        <p className="text-xs text-emerald-900 leading-relaxed font-medium pt-1">
                            <strong>Contribution Splitting:</strong> The monthly amount is automatically divided among children under 18 to maximize per-child grants.
                        </p>
                    </div>
                </div>

                {/* --- RESULTS COLUMN (Right) --- */}
                <div className="lg:col-span-8">
                    <RESPResults results={results} showPayouts={state.showPayouts} />
                </div>
            </div>

            {/* Sticky Mobile Results Banner */}
            <div className="md:hidden fixed bottom-4 left-4 right-4 z-50 animate-fade-in pointer-events-none">
                <div className="bg-slate-900 rounded-2xl shadow-2xl p-4 flex justify-between items-center border border-slate-800 pointer-events-auto">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Projected</span>
                        <span className="text-xl font-black text-emerald-400 tracking-tight">
                            ${Math.round(results.totalProjected).toLocaleString()}
                        </span>
                    </div>
                    <div className="flex flex-col items-end text-right">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Grants</span>
                        <span className="text-lg font-bold font-mono text-indigo-300">
                            +${Math.round(results.totalGrants).toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
