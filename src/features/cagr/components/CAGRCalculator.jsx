import React, { useState, useMemo } from 'react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer 
} from 'recharts';
import { 
    calculateRate, 
    calculateFutureValue, 
    calculatePresentValue, 
    calculateDuration,
    generateGrowthSeries 
} from '../utils/cagrEngine';
import { 
    MoneyInput, 
    TrendingUpIcon, 
    RotateCcwIcon, 
    InfoIcon,
    CalculatorIcon,
    ArrowRightIcon,
    ScaleIcon,
    TrendingDownIcon,
    NativeSelect 
} from '../../../components/shared';

const MODES = {
    RATE: { 
        id: 'RATE', 
        label: 'Find Growth Rate', 
        question: "What return do I need?",
        icon: TrendingUpIcon,
        desc: "Calculates the annual growth rate required to get from your starting value to your target."
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

const FREQUENCIES = [
    { label: 'Yearly', value: 'Yearly' },
    { label: 'Monthly', value: 'Monthly' },
    { label: 'Weekly', value: 'Weekly' },
    { label: 'Daily', value: 'Daily' }
];

export default function CAGRCalculator({ isVisible }) {
    const [mode, setMode] = useState('FUTURE'); 
    
    // Core State
    const [startValue, setStartValue] = useState(10000);
    const [endValue, setEndValue] = useState(100000);
    const [years, setYears] = useState(10);
    const [rate, setRate] = useState(7.0);
    
    // Contribution State
    const [hasContribution, setHasContribution] = useState(false);
    const [contribution, setContribution] = useState(500);
    const [frequency, setFrequency] = useState('Monthly');
    
    // Inflation State
    const [useInflation, setUseInflation] = useState(false);
    const [inflationRate, setInflationRate] = useState(2.5);

    // Calculate Primary Result
    const result = useMemo(() => {
        const inf = useInflation ? inflationRate : 0;
        const pmt = hasContribution ? contribution : 0;

        switch (mode) {
            case 'RATE':
                return { 
                    val: calculateRate(startValue, endValue, years, pmt, frequency, inf), 
                    nominalVal: calculateRate(startValue, endValue, years, pmt, frequency, 0),
                    label: 'Annual Growth Rate', 
                    subLabel: useInflation ? 'Real Return (Adjusted)' : 'Nominal Return',
                    suffix: '%',
                    isCurrency: false,
                    color: 'text-emerald-400'
                };
            case 'FUTURE':
                return { 
                    val: calculateFutureValue(startValue, rate, years, pmt, frequency, inf), 
                    nominalVal: calculateFutureValue(startValue, rate, years, pmt, frequency, 0),
                    label: 'Projected Value', 
                    subLabel: useInflation ? "Purchasing Power (Today's $)" : "Future Balance",
                    suffix: '',
                    isCurrency: true,
                    color: 'text-indigo-300'
                };
            case 'START':
                return { 
                    val: calculatePresentValue(endValue, rate, years, pmt, frequency, inf), 
                    nominalVal: calculatePresentValue(endValue, rate, years, pmt, frequency, 0),
                    label: 'Required Investment', 
                    subLabel: useInflation ? "Real Capital Requirement" : "Nominal Deposit",
                    suffix: '',
                    isCurrency: true,
                    color: 'text-amber-300'
                };
            case 'TIME':
                return { 
                    val: calculateDuration(startValue, endValue, rate, pmt, frequency, inf), 
                    nominalVal: calculateDuration(startValue, endValue, rate, pmt, frequency, 0),
                    label: 'Time to Goal', 
                    subLabel: useInflation ? "Adjusted for Inflation" : "Standard Timeline",
                    suffix: ' Yrs',
                    isCurrency: false,
                    color: 'text-cyan-300'
                };
            default:
                return { val: 0, label: 'Result', suffix: '' };
        }
    }, [mode, startValue, endValue, years, rate, hasContribution, contribution, frequency, useInflation, inflationRate]);

    // Generate Chart Data
    const chartData = useMemo(() => {
        let effectiveRate = rate;
        let effectiveYears = years;
        let effectiveStart = startValue;

        if (mode === 'RATE' && result.val) effectiveRate = result.val;
        if (mode === 'TIME' && result.val) effectiveYears = result.val;
        if (mode === 'START' && result.val) effectiveStart = result.val;

        const inf = useInflation ? inflationRate : 0;
        const pmt = hasContribution ? contribution : 0;
        
        return generateGrowthSeries(effectiveStart, effectiveRate, effectiveYears, pmt, frequency, inf);
    }, [result, startValue, years, rate, hasContribution, contribution, frequency, useInflation, inflationRate, mode]);

    if (!isVisible) return null;

    const activeConfig = MODES[mode];

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
            
            {/* 1. MODE SELECTOR */}
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

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                
                {/* --- 2. INPUT COLUMN (Left) --- */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 space-y-6 relative overflow-hidden">
                        
                        <div className="absolute top-0 right-0 w-40 h-40 bg-slate-50 rounded-bl-[5rem] -mr-10 -mt-10 -z-0 pointer-events-none"></div>

                        {/* Core Inputs */}
                        <div className="relative z-10 space-y-5">
                            {mode !== 'START' && (
                                <MoneyInput
                                    id="cagr-start"
                                    label="Initial Investment"
                                    subLabel="Starting amount"
                                    value={startValue}
                                    onChange={(val) => setStartValue(parseFloat(val) || 0)}
                                />
                            )}

                            {/* Recurring Contribution Input */}
                             <div className={`relative z-10 pt-4 border-t border-slate-100 transition-all duration-300 ${hasContribution ? 'bg-indigo-50/50 -mx-6 px-6 pb-6 -mb-6 border-t-indigo-100' : ''}`}>
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <div className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 ${hasContribution ? 'bg-indigo-500' : 'bg-slate-300'}`}>
                                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${hasContribution ? 'translate-x-4' : ''}`}></div>
                                        </div>
                                        <span className={`text-sm font-bold transition-colors ${hasContribution ? 'text-indigo-700' : 'text-slate-500'}`}>Add Contributions</span>
                                        <input type="checkbox" className="sr-only" checked={hasContribution} onChange={(e) => setHasContribution(e.target.checked)} />
                                    </label>
                                    {hasContribution && <TrendingUpIcon size={18} className="text-indigo-500 animate-pulse" />}
                                </div>

                                {hasContribution && (
                                    <div className="animate-fade-in mt-4 space-y-4">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="col-span-2 sm:col-span-1">
                                                 <label htmlFor="contrib-freq" className="text-[10px] font-black text-indigo-700 block uppercase tracking-tighter mb-1.5">Frequency</label>
                                                 <NativeSelect 
                                                    id="contrib-freq"
                                                    value={frequency} 
                                                    onChange={(e) => setFrequency(e.target.value)}
                                                    options={FREQUENCIES}
                                                    className="[&_select]:bg-white [&_select]:border-indigo-200 [&_select]:text-indigo-900"
                                                 />
                                            </div>
                                            <div className="col-span-2 sm:col-span-1">
                                                <label htmlFor="contrib-amt" className="text-[10px] font-black text-indigo-700 block uppercase tracking-tighter mb-1.5">Amount</label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 text-xs font-bold">$</span>
                                                    <input 
                                                        id="contrib-amt"
                                                        type="number"
                                                        value={contribution}
                                                        onChange={(e) => setContribution(parseFloat(e.target.value) || 0)}
                                                        className="w-full pl-6 pr-3 py-2.5 bg-white border-2 border-indigo-200 rounded-xl font-mono text-sm font-black focus:ring-2 focus:ring-indigo-500 outline-none text-indigo-900"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>


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
                            </div>

                            {useInflation && (
                                <div className="animate-fade-in mt-4">
                                    <label htmlFor="cagr-inflation" className="text-[10px] font-black text-rose-700 block uppercase tracking-tighter mb-1.5">
                                        Inflation Rate (%)
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
                            {hasContribution && ` Includes ${frequency.toLowerCase()} contributions of $${contribution}.`}
                        </p>
                    </div>
                </div>

                {/* --- 3. RESULTS & CHART COLUMN (Right) --- */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    
                    {/* RESULT HERO */}
                    <div className="bg-slate-900 text-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col justify-center min-h-[200px] border-4 border-slate-800">
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-500 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-emerald-500 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>

                        <div className="relative z-10 text-center">
                            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs mb-3 flex items-center justify-center gap-2">
                                <span className="w-8 h-px bg-slate-600"></span> 
                                {result.label} 
                                <span className="w-8 h-px bg-slate-600"></span>
                            </p>
                            
                            <div className={`text-5xl md:text-6xl font-black tracking-tighter break-words ${result.color} drop-shadow-2xl`}>
                                {result.val !== null && !isNaN(result.val) ? (
                                    <>
                                        {result.isCurrency && <span className="text-3xl align-top mr-1 opacity-60">$</span>}
                                        {result.val.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                        <span className="text-3xl align-baseline ml-1 opacity-60">{result.suffix}</span>
                                    </>
                                ) : "---"}
                            </div>
                            
                            {/* Comparison (Inflation) */}
                            {useInflation && result.nominalVal !== null && (
                                <div className="mt-4 inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/5">
                                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Nominal:</span>
                                    <span className="text-sm font-bold font-mono text-white">
                                        {result.isCurrency ? '$' : ''}{result.nominalVal.toLocaleString(undefined, {maximumFractionDigits:0})}{result.suffix}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* CHART SECTION */}
                    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex-1 min-h-[350px]">
                        <div className="flex justify-between items-center mb-6 ml-2">
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Growth Over Time</h3>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex gap-3">
                                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> Total Value</span>
                                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-300"></div> Principal</span>
                            </div>
                        </div>

                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis 
                                        dataKey="year" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 700}}
                                        tickMargin={10}
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 700}}
                                        tickFormatter={(val) => `$${val >= 1000 ? (val/1000).toFixed(0)+'k' : val}`}
                                    />
                                    <RechartsTooltip 
                                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', color: '#fff' }}
                                        formatter={(val) => `$${val.toLocaleString()}`}
                                        labelFormatter={(y) => `Year ${y}`}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="balance" 
                                        name="Total Value"
                                        stroke="#6366f1" 
                                        strokeWidth={3}
                                        fillOpacity={1} 
                                        fill="url(#colorTotal)" 
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="invested" 
                                        name="Total Invested"
                                        stroke="#cbd5e1" 
                                        strokeWidth={2}
                                        strokeDasharray="5 5"
                                        fill="transparent" 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <button 
                            onClick={() => { 
                                setStartValue(10000); setEndValue(100000); setYears(10); setRate(7); 
                                setUseInflation(false); setHasContribution(false); setContribution(500);
                            }} 
                            className="text-slate-500 hover:text-indigo-600 text-[10px] font-black flex items-center gap-2 transition-all uppercase tracking-widest group bg-slate-50 px-4 py-2 rounded-xl border border-transparent hover:border-slate-200"
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