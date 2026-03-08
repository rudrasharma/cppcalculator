import React from 'react';
import { useMortgageMath } from '../hooks/useMortgageMath';
import { MortgageForm } from './MortgageForm';
import { MortgageResults } from './MortgageResults';
import { CalculatorIcon, InfoIcon, RotateCcwIcon } from '../../../components/shared';

export default function MortgageCalculator({ isVisible, initialStateOverride }) {
    console.log("MortgageCalculator mounted with override:", initialStateOverride);
    const { state, dispatch, results } = useMortgageMath(initialStateOverride);

    if (!isVisible) return null;

    const handleReset = () => {
        window.location.search = '';
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
            {/* Header / Mode Selector equivalent */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                <div className="flex items-center gap-4">
                    <div className="bg-indigo-600 p-3 rounded-2xl shadow-xl shadow-indigo-200">
                        <CalculatorIcon size={32} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">Canadian Mortgage Paydown</h1>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Accelerate Your Financial Freedom</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button 
                        onClick={handleReset}
                        className="bg-white border border-slate-200 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-2 group shadow-sm shadow-slate-100"
                    >
                        <RotateCcwIcon size={16} className="group-hover:-rotate-180 transition-transform duration-500" />
                        Reset Calculator
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                {/* --- INPUT COLUMN (Left) --- */}
                <div className="lg:col-span-4 space-y-6">
                    <MortgageForm state={state} dispatch={dispatch} />

                    {/* Context Helper */}
                    <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100 flex gap-4 items-start">
                        <div className="bg-white p-2 rounded-xl text-indigo-500 shadow-sm shrink-0">
                            <InfoIcon size={20} />
                        </div>
                        <p className="text-xs text-indigo-900 leading-relaxed font-medium pt-1">
                            Use this tool to calculate your mortgage payments and see how prepayments can save you thousands in interest. 
                            <strong> Canadian specific:</strong> Fixed rates compound semi-annually.
                        </p>
                    </div>
                </div>

                {/* --- RESULTS & CHART COLUMN (Right) --- */}
                <div className="lg:col-span-8">
                    <MortgageResults results={results} state={state} />
                </div>
            </div>
        </div>
    );
}
