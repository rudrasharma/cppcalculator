import React, { useState, useMemo } from 'react';
import { 
    calculateCAGR, 
    calculateFutureValue, 
    calculatePresentValue, 
    calculateDuration 
} from '../utils/cagrEngine';
import { 
    MoneyInput, 
    TrendingUpIcon, 
    RotateCcwIcon, 
    InfoIcon,
    CalculatorIcon,
    ArrowRightIcon,
    ScaleIcon,
    TrendingDownIcon
} from '../../../components/shared';

const MODES = {
    RATE: { 
        id: 'RATE', 
        label: 'Find Growth Rate', 
        question: "What return do I need?",
        icon: TrendingUpIcon,
        desc: "Calculates the annual growth rate required to get from your starting value to your target. Useful for evaluating investment performance."
    },
    FUTURE: { 
        id: 'FUTURE', 
        label: 'Find Future Value', 
        question: "How much will I have?",
        icon: ArrowRightIcon,
        desc: "Projects your final wealth after a set period. Use this to see the magic of compound interest over time."
    },
    START: { 
        id: 'START', 
        label: 'Find Initial Deposit', 
        question: "How much to invest?",
        icon: ScaleIcon,
        desc: "Reverse-engineers the lump sum you need to deposit today to hit a specific financial goal in the future."
    },
    TIME: { 
        id: 'TIME', 
        label: 'Find Time Horizon', 
        question: "How long will it take?",
        icon: CalculatorIcon,
        desc: "Determines the number of years required to bridge the gap between what you have and what you want."
    },
};

export default function CAGRCalculator({ isVisible }) {
    const [mode, setMode] = useState('RATE');
    
    // Core State
    const [startValue, setStartValue] = useState(10000);
    const [endValue, setEndValue] = useState(25000);
    const [years, setYears] = useState(10);
    const [rate, setRate] = useState(7.0);
    
    // Inflation State
    const [useInflation, setUseInflation] = useState(false);
    const [inflationRate, setInflationRate] = useState(2.5);

    const result = useMemo(() => {
        const inf = useInflation ? inflationRate : 0;

        switch (mode) {
            case 'RATE':
                return { 
                    val: calculateCAGR(startValue, endValue, years, inf), 
                    nominalVal: calculateCAGR(startValue, endValue, years, 0),
                    label: 'Annual Growth Rate', 
                    subLabel: useInflation ? 'Real Return (Adjusted)' : 'Nominal Return',
                    suffix: '%',
                    isCurrency: false,
                    color: 'text-emerald-400'
                };
            case 'FUTURE':
                return { 
                    val: calculateFutureValue(startValue, rate, years, inf), 
                    nominalVal: calculateFutureValue(startValue, rate, years, 0),
                    label: 'Projected Value', 
                    subLabel: useInflation ? "Purchasing Power (Today's $)" : "Future Balance",
                    suffix: '',
                    isCurrency: true,
                    color: 'text-indigo-300'
                };
            case 'START':
                return { 
                    val: calculatePresentValue(endValue, rate, years, inf), 
                    nominalVal: calculatePresentValue(endValue, rate, years, 0),
                    label: 'Required Investment', 
                    subLabel: useInflation ? "Real Capital Requirement" : "Nominal Deposit",
                    suffix: '',
                    isCurrency: true,
                    color: 'text-amber-300'
                };
            case 'TIME':
                return { 
                    val: calculateDuration(startValue, endValue, rate, inf), 
                    nominalVal: calculateDuration(startValue, endValue, rate, 0),
                    label: 'Time to Goal', 
                    subLabel: useInflation ? "Adjusted for Inflation Drag" : "Standard Timeline",
                    suffix: ' Yrs',
                    isCurrency: false,
                    color: 'text-cyan-300'
                };
            default:
                return { val: 0, label: 'Result', suffix: '' };
        }
    }, [mode, startValue, endValue, years, rate, useInflation, inflationRate]);

    if (!isVisible) return null;

    const activeConfig = MODES[mode];

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
            
            {/* --- 1. MODE SELECTOR (Card Grid) --- */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
                {Object.values(MODES).map((m) => {
                    const Icon = m.icon;
                    const isActive = mode === m.id;
                    return (
                        <button
                            key={m.id}
                            onClick={() => setMode(m.id)}
                            className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 ${
                                isActive
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-200 scale-[1.02]' 
                                : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-200 hover:bg-indigo-50'
                            }`}
                        >
                            <Icon size={24} className={`mb-2 ${isActive ? 'text-white' : 'text-indigo-400'}`} />
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">{m.label}</span>
                            <span className={`text-xs font-bold mt-1 ${isActive ? 'text-indigo-100' : 'text-slate-800'}`}>{m.question}</span>
                        </button>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                
                {/* --- 2. INPUT COLUMN --- */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 space-y-6 relative overflow-hidden">
                        
                        {/* Decorative BG Shape */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-slate-50 rounded-bl-[5rem] -mr-10 -mt-10 -z-0 pointer-events-none"></div>

                        {/* Dynamic Inputs */}
                        <div className="relative z-10 space-y-6">
                            {mode !== 'START' && (
                                <MoneyInput
                                    id="cagr-start"
                                    label="Initial Investment"
                                    subLabel="Starting amount"
                                    value={startValue}
                                    onChange={(val) => setStartValue(parseFloat(val) || 0)}
                                />
                            )}

                            {mode !== 'FUTURE' && (
                                <MoneyInput
                                    id="cagr-end"
                                    label="Target Goal"
                                    subLabel="Desired amount"
                                    value={endValue}
                                    onChange={(val) => setEndValue(parseFloat(val) || 0)}
                                />
                            )}

                            {mode !== 'RATE' && (
                                <div>
                                    <label htmlFor="cagr-rate" className="text-xs font-black text-slate-700 block uppercase tracking-tighter mb-1.5">
                                        Annual Return (%)
                                    </label>
                                    <div className="relative group">
                                        <input
                                            id="cagr-rate"
                                            type="number"
                                            step="0.1"
                                            value={rate}
                                            onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
                                            className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-lg font-black focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm text-slate-900"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold" aria-hidden="true">%</span>
                                    </div>
                                </div>
                            )}

                            {mode !== 'TIME' && (
                                <div>
                                    <label htmlFor="cagr-years" className="text-xs font-black text-slate-700 block uppercase tracking-tighter mb-1.5">
                                        Time Period
                                    </label>
                                    <div className="relative group">
                                        <input
                                            id="cagr-years"
                                            type="number"
                                            min="0.1"
                                            step="0.5"
                                            value={years}
                                            onChange={(e) => setYears(parseFloat(e.target.value) || 0)}
                                            className="w-full pl-4 pr-16 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-lg font-black focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm text-slate-900"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs uppercase tracking-wider" aria-hidden="true">Years</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* --- INFLATION MODIFIER --- */}
                        <div className={`relative z-10 pt-6 border-t border-slate-100 transition-all duration-300 ${useInflation ? 'bg-rose-50/50 -mx-6 px-6 pb-6 -mb-6 border-t-rose-100' : ''}`}>
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <div className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 ${useInflation ? 'bg-rose-500' : 'bg-slate-300'}`}>
                                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${useInflation ? 'translate-x-4' : ''}`}></div>
                                    </div>
                                    <span className={`text-sm font-bold transition-colors ${useInflation ? 'text-rose-700' : 'text-slate-500'}`}>Adjust for Inflation</span>
                                    <input type="checkbox" className="sr-only" checked={useInflation} onChange={(e) => setUseInflation(e.target.checked)} />
                                </label>
                                {useInflation && <TrendingDownIcon size={18} className="text-rose-500 animate-pulse" />}
                            </div>

                            {useInflation && (
                                <div className="animate-fade-in mt-4">
                                    <label htmlFor="cagr-inflation" className="text-[10px] font-black text-rose-700 block uppercase tracking-tighter mb-1.5">
                                        Expected Inflation Rate
                                    </label>
                                    <div className="relative group">
                                        <input
                                            id="cagr-inflation"
                                            type="number"
                                            step="0.1"
                                            value={inflationRate}
                                            onChange={(e) => setInflationRate(parseFloat(e.target.value) || 0)}
                                            className="w-full pl-4 pr-10 py-2 bg-white border-2 border-rose-200 rounded-xl font-mono text-sm font-black focus:ring-2 focus:ring-rose-500 outline-none text-rose-900"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-400 font-bold" aria-hidden="true">%</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Context Helper */}
                    <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100 flex gap-4 items-start">
                        <div className="bg-white p-2 rounded-xl text-indigo-500 shadow-sm shrink-0">
                            <InfoIcon size={20} />
                        </div>
                        <p className="text-xs text-indigo-900 leading-relaxed font-medium pt-1">
                            {activeConfig.desc}
                        </p>
                    </div>
                </div>

                {/* --- 3. RESULTS COLUMN --- */}
                <div className="lg:col-span-7 flex flex-col h-full space-y-6">
                    <div className="bg-slate-900 text-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col justify-center min-h-[380px] flex-grow border-4 border-slate-800">
                        
                        {/* Backgrounds */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-500 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-emerald-500 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>

                        <div className="relative z-10 text-center space-y-2">
                            
                            {/* Primary Result Label */}
                            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs mb-4 flex items-center justify-center gap-2">
                                <span className="w-8 h-px bg-slate-600"></span> 
                                {result.label} 
                                <span className="w-8 h-px bg-slate-600"></span>
                            </p>
                            
                            {/* Primary Result Value */}
                            <div className={`text-6xl md:text-7xl font-black tracking-tighter break-words ${result.color} drop-shadow-2xl`}>
                                {result.val !== null ? (
                                    <>
                                        {result.isCurrency && <span className="text-4xl align-top mr-1 opacity-60">$</span>}
                                        {result.val.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                        <span className="text-4xl align-baseline ml-1 opacity-60">{result.suffix}</span>
                                    </>
                                ) : "---"}
                            </div>

                            <p className="text-sm font-medium text-slate-400 uppercase tracking-widest mt-2">
                                {result.subLabel}
                            </p>

                            {/* Comparison Block (Only shows if Inflation is ON) */}
                            {useInflation && result.nominalVal !== null && result.val !== null && (
                                <div className="mt-8 inline-flex flex-col md:flex-row items-center justify-center gap-4 bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-md">
                                    <div className="text-center px-4">
                                        <span className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">With Inflation ({inflationRate}%)</span>
                                        <span className={`text-xl font-bold font-mono ${result.color}`}>
                                            {result.isCurrency ? '$' : ''}{result.val.toLocaleString(undefined, {maximumFractionDigits:1})}{result.suffix}
                                        </span>
                                    </div>
                                    <div className="hidden md:block w-px h-8 bg-white/10"></div>
                                    <div className="text-center px-4">
                                        <span className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Nominal (No Inflation)</span>
                                        <span className="text-xl font-bold font-mono text-white">
                                            {result.isCurrency ? '$' : ''}{result.nominalVal.toLocaleString(undefined, {maximumFractionDigits:1})}{result.suffix}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Additional Stats (Multiplier / Profit) */}
                            {!useInflation && result.val > 0 && (
                                <div className="pt-8 mt-8 border-t border-white/10 grid grid-cols-2 gap-4 text-left max-w-sm mx-auto">
                                    <div>
                                        <span className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1">Total Multiplier</span>
                                        <span className="text-lg font-bold font-mono text-indigo-200">
                                            {(mode === 'RATE' || mode === 'FUTURE') 
                                                ? `${((endValue || result.val) / (startValue || result.val)).toFixed(2)}x` 
                                                : '---'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1">Total Profit</span>
                                        <span className={`text-lg font-bold font-mono ${(mode === 'FUTURE' ? result.val - startValue : endValue - startValue) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            ${mode === 'FUTURE' 
                                                ? (result.val - startValue).toLocaleString(undefined, {maximumFractionDigits:0}) 
                                                : (endValue - startValue).toLocaleString(undefined, {maximumFractionDigits:0})}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <button 
                            onClick={() => { 
                                setStartValue(10000); setEndValue(25000); setYears(10); setRate(7); setUseInflation(false);
                            }} 
                            className="text-slate-400 hover:text-indigo-600 text-[10px] font-black flex items-center gap-2 transition-all uppercase tracking-widest group bg-slate-50 px-4 py-2 rounded-xl border border-transparent hover:border-slate-200"
                        >
                            <RotateCcwIcon size={14} className="group-hover:-rotate-180 transition-transform duration-500"/> 
                            Reset Inputs
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}