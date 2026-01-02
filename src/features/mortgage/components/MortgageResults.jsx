import React, { useMemo, useState } from 'react';
import { calculateBreakAnalysis } from '../utils/mortgageEngine';
import { CheckIcon, XIcon, AlertTriangleIcon, TrendingDownIcon, CalculatorIcon, ExternalLinkIcon, InfoIcon } from '../../../components/shared';
import { LENDERS } from '../data/lenderData';

export default function MortgageResults({ balance, currentRate, newRate, monthsRemaining, lenderKey, mortgageType, newMortgageType }) {
    
    const [showMath, setShowMath] = useState(false);

    const results = useMemo(() => 
        calculateBreakAnalysis(balance, currentRate, newRate, monthsRemaining, lenderKey, mortgageType),
    [balance, currentRate, newRate, monthsRemaining, lenderKey, mortgageType]);

    const isProfitable = results.netBenefit > 0;
    
    // Comparison for "Bank vs Market" rate gap (The "Hidden Buffer")
    const comparisonGap = results.calculationDetails?.comparisonRate 
        ? (results.calculationDetails.comparisonRate - newRate).toFixed(2)
        : "0.00";

    const oldMonthlyInt = (balance * (currentRate / 100)) / 12;
    const newMonthlyInt = (balance * (newRate / 100)) / 12;

    return (
        <div className="space-y-6 lg:sticky lg:top-24">
            
            {/* VERDICT CARD */}
            <div className={`p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden transition-colors duration-500 ${isProfitable ? 'bg-emerald-600' : 'bg-rose-600'}`}>
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div className="inline-flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
                            {isProfitable ? <CheckIcon size={14} /> : <XIcon size={14} />}
                            <span className="text-[10px] font-black uppercase tracking-widest">
                                {isProfitable ? "Switch & Save" : "Stay Put"}
                            </span>
                        </div>
                    </div>
                    
                    <div className="text-center mb-6">
                        <div className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">
                            {newMortgageType === 'VARIABLE' ? 'Estimated Net Savings' : 'Guaranteed Net Savings'}
                        </div>
                        <div className="text-5xl md:text-6xl font-black tracking-tighter">
                            {isProfitable ? '+' : ''}${Math.round(results.netBenefit).toLocaleString()}
                        </div>
                    </div>

                    {/* Mini Timeline Bar */}
                    <div className="bg-black/20 h-2 rounded-full w-full overflow-hidden mb-2 flex">
                        <div className="h-full bg-white/40" style={{ width: `${Math.min(100, (results.actualPenalty / (results.totalInterestSavings || 1)) * 100)}%` }}></div>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold opacity-80 uppercase tracking-wider">
                        <span>Cost: ${Math.round(results.actualPenalty).toLocaleString()}</span>
                        <span>Benefit: ${Math.round(results.totalInterestSavings).toLocaleString()}</span>
                    </div>
                </div>
                
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            </div>

            {/* BREAKDOWN */}
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
                
                {/* 1. PENALTY ANALYSIS */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-rose-600">
                            <div className="p-2 bg-rose-50 rounded-xl"><AlertTriangleIcon size={18} /></div>
                            <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">The Break Penalty</h3>
                        </div>
                        
                        <button 
                            onClick={() => setShowMath(!showMath)}
                            className="text-[10px] font-bold text-indigo-600 flex items-center gap-1 hover:bg-indigo-50 px-2 py-1 rounded-lg transition-colors"
                        >
                            {CalculatorIcon && <CalculatorIcon size={12}/>} {showMath ? 'Hide Math' : 'Verify Math'}
                        </button>
                    </div>

                    {/* DYNAMIC MATH BREAKDOWN */}
                    {showMath && results.calculationDetails && (
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-mono text-slate-600 animate-fade-in space-y-4 mb-4">
                            
                            {/* PART 1: PENALTY */}
                            <div className="space-y-2">
                                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-200 pb-1">1. Penalty Calculation ({results.calculationDetails.type})</div>
                                {results.calculationDetails.type === 'IRD' && (
                                    <>
                                        <div className="flex justify-between text-slate-500">
                                            <span>Current Rate:</span>
                                            <span>{currentRate}%</span>
                                        </div>
                                        <div className="flex justify-between text-slate-500">
                                            <span>Bank's Comparison Rate:</span>
                                            <span>{results.calculationDetails.comparisonRate.toFixed(2)}%</span>
                                        </div>
                                        {parseFloat(comparisonGap) > 0 && (
                                            <div className="text-[9px] text-right text-slate-400 italic">
                                                *Bank rate is {comparisonGap}% higher than your New Rate
                                            </div>
                                        )}
                                        <div className="w-full h-px bg-slate-200 my-1"></div>
                                        <div className="flex justify-between font-bold text-slate-800">
                                            <span>Penalty Rate Gap:</span>
                                            <span>{results.calculationDetails.effectiveDifferential.toFixed(2)}%</span>
                                        </div>
                                        <div className="mt-2 text-[10px] text-slate-400 font-sans leading-tight italic">
                                            Formula: Balance × Penalty Gap × (Months ÷ 12)
                                        </div>
                                    </>
                                )}
                                {results.calculationDetails.type === '3_MONTHS' && (
                                    <div className="text-[10px] text-slate-500">
                                        Standard Variable Penalty: 3 Months Interest
                                    </div>
                                )}
                            </div>

                            {/* PART 2: SAVINGS */}
                            <div className="space-y-2">
                                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-200 pb-1">2. Savings Calculation</div>
                                <div className="flex justify-between text-slate-500">
                                    <span>Savings Rate Gap:</span>
                                    <span>{(currentRate - newRate).toFixed(2)}%</span>
                                </div>
                                <div className="flex justify-between text-emerald-600 font-bold">
                                    <span>Monthly Savings:</span>
                                    <span>${Math.round(results.monthlySavings).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-slate-400 text-[10px]">
                                    <span>× {monthsRemaining} Months</span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className={`p-4 rounded-2xl border text-center ${!results.isIRD ? 'bg-rose-50 border-rose-200 shadow-sm' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">3 Months Interest</div>
                            <div className="font-black text-slate-800 text-lg">${Math.round(results.penalty3Months).toLocaleString()}</div>
                        </div>
                        <div className={`p-4 rounded-2xl border text-center ${results.isIRD ? 'bg-rose-50 border-rose-200 shadow-sm' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Lost Interest (IRD)</div>
                            <div className="font-black text-slate-800 text-lg">${Math.round(results.penaltyIRD).toLocaleString()}</div>
                        </div>
                    </div>
                </div>

                {/* 2. SAVINGS ANALYSIS */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2 text-emerald-600">
                        <div className="p-2 bg-emerald-50 rounded-xl"><TrendingDownIcon size={18} /></div>
                        <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Interest Savings</h3>
                    </div>
                    
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        <div className="flex justify-between items-center mb-4">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Monthly Drop</div>
                            <div className="text-2xl font-black text-emerald-600">-${Math.round(results.monthlySavings).toLocaleString()}</div>
                        </div>
                        <div className="w-full h-px bg-slate-200 mb-4"></div>
                        <div className="flex justify-between items-center">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Term Savings</div>
                            <div className="text-lg font-black text-slate-800">${Math.round(results.totalInterestSavings).toLocaleString()}</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}