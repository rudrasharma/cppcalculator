import React, { useMemo } from 'react';
import { MoneyInput, RangeSlider, NativeSelect, HelpCircleIcon } from '../../../components/shared';
import { LENDERS, getLenderOptions } from '../data/lenderData';

export default function MortgageForm({
    balance, setBalance,
    currentRate, setCurrentRate,
    newRate, setNewRate,
    monthsRemaining, setMonthsRemaining,
    lenderKey, setLenderKey,
    mortgageType, setMortgageType,
    newMortgageType, setNewMortgageType,
    isLiveRate,      // Derived boolean from parent
    isLoadingRates   // Loading boolean from parent
}) {
    const lenderOptions = useMemo(() => getLenderOptions(), []);
    const currentLenderRisk = LENDERS[lenderKey]?.risk || "Unknown";
    const isHighRisk = LENDERS[lenderKey]?.type === "BIG_BANK";

    return (
        <div className="space-y-8">
            <header>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight italic">Mortgage Analyzer</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    Exit Strategy & Savings Forecast
                </p>
            </header>

            {/* SECTION 1: THE EXIT (CURRENT MORTGAGE) */}
            <section className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-rose-500"></div>
                <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest flex items-center gap-2">
                    <span className="bg-rose-100 text-rose-600 w-6 h-6 rounded-full flex items-center justify-center text-[10px]">1</span> 
                    Your Current Deal
                </h3>

                <div className="space-y-2">
                    <NativeSelect 
                        label="Who holds your mortgage?"
                        value={lenderKey}
                        onChange={(e) => setLenderKey(e.target.value)}
                        options={lenderOptions}
                    />
                    <div className={`flex items-center gap-2 text-[10px] font-bold px-3 py-1.5 rounded-lg w-fit ${isHighRisk ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
                        <span>Penalty Policy: {currentLenderRisk}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={() => setMortgageType('FIXED')}
                        className={`p-3 rounded-2xl border-2 text-left transition-all ${mortgageType === 'FIXED' ? 'border-rose-500 bg-rose-50 text-rose-900' : 'border-slate-100 bg-slate-50 text-slate-500'}`}
                    >
                        <div className="font-bold text-xs mb-0.5">Fixed Rate</div>
                        <div className="text-[9px] opacity-70">IRD Applies</div>
                    </button>
                    <button 
                        onClick={() => setMortgageType('VARIABLE')}
                        className={`p-3 rounded-2xl border-2 text-left transition-all ${mortgageType === 'VARIABLE' ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-slate-100 bg-slate-50 text-slate-500'}`}
                    >
                        <div className="font-bold text-xs mb-0.5">Variable</div>
                        <div className="text-[9px] opacity-70">3-Month Cap</div>
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <MoneyInput 
                        label="Balance Remaining"
                        value={balance}
                        onChange={(v) => setBalance(Number(v))}
                        className="col-span-2"
                    />
                    <div className="col-span-1 space-y-1.5">
                        <label className="text-xs font-black text-slate-700 block uppercase tracking-tighter">Your Rate</label>
                        <div className="relative">
                            <input 
                                type="number" 
                                value={currentRate} 
                                onChange={(e) => setCurrentRate(parseFloat(e.target.value))}
                                className="w-full pl-3 pr-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-lg font-black focus:ring-2 focus:ring-rose-500 outline-none transition-all"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">%</span>
                        </div>
                    </div>
                    
                    <div className="col-span-1">
                         <RangeSlider 
                            label="Months Left in Term" 
                            value={monthsRemaining}
                            onChange={(e) => setMonthsRemaining(parseInt(e.target.value))}
                            min={6}
                            max={60}
                            step={1}
                            accentColor="rose-500"
                            className="[&_input]:h-1"
                        />
                        <div className="text-right text-[10px] font-bold text-slate-400 mt-1">
                            {monthsRemaining} Mo ≈ {(monthsRemaining/12).toFixed(1)} Years
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 2: THE OPPORTUNITY (NEW MORTGAGE) */}
            <section className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500"></div>
                <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-600 w-6 h-6 rounded-full flex items-center justify-center text-[10px]">2</span> 
                    The New Offer
                </h3>

                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 md:col-span-1 space-y-2">
                        <label className="text-xs font-black text-slate-700 block uppercase tracking-tighter">Rate Type</label>
                        <div className="flex bg-slate-50 p-1 rounded-xl">
                            <button 
                                onClick={() => setNewMortgageType('FIXED')}
                                className={`flex-1 py-2 text-[10px] font-bold uppercase rounded-lg transition-all ${newMortgageType === 'FIXED' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                            >
                                Fixed
                            </button>
                            <button 
                                onClick={() => setNewMortgageType('VARIABLE')}
                                className={`flex-1 py-2 text-[10px] font-bold uppercase rounded-lg transition-all ${newMortgageType === 'VARIABLE' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                            >
                                Variable
                            </button>
                        </div>
                    </div>

                    <div className="col-span-2 md:col-span-1 space-y-1.5">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-black text-slate-700 block uppercase tracking-tighter">New Rate</label>
                            
                            {/* THE LIVE BADGE LOGIC */}
                            {isLoadingRates ? (
                                <span className="text-[9px] text-slate-400 animate-pulse">Fetching rates...</span>
                            ) : isLiveRate && (
                                <div className="flex items-center gap-1.5 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                    <span className="relative flex h-1.5 w-1.5">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                                    </span>
                                    <span className="text-[8px] font-bold text-emerald-700 uppercase tracking-wider">Live</span>
                                </div>
                            )}
                        </div>
                        
                        <div className="relative">
                            <input 
                                type="number" 
                                value={newRate} 
                                onChange={(e) => setNewRate(parseFloat(e.target.value))}
                                className="w-full pl-3 pr-6 py-3 bg-emerald-50/30 border border-emerald-100 rounded-2xl font-mono text-lg font-black focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-emerald-900"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 font-bold text-xs">%</span>
                        </div>
                    </div>
                </div>

                {newMortgageType === 'VARIABLE' && (
                    <div className="flex gap-2 items-start p-3 bg-amber-50 border border-amber-100 rounded-xl">
                        <div className="text-amber-500 mt-0.5"><HelpCircleIcon size={14} /></div>
                        <p className="text-[10px] text-amber-800 font-medium leading-relaxed">
                            <strong>Note:</strong> Variable rates fluctuate. Your savings calculation assumes Prime stays flat, but if rates drop further, you save more. If they rise, you save less.
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}