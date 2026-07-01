import React, { useState, useMemo, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { calculateRate, calculateFutureValue, calculatePresentValue, calculateDuration, generateGrowthSeries } from '../utils/cagrEngine';
import { MoneyInput, TrendingUpIcon, RotateCcwIcon, InfoIcon, CalculatorIcon, ArrowRightIcon, ScaleIcon, TrendingDownIcon, NativeSelect, AICommandBar, StrategyCard, AICopilot, Accordion, ExternalLinkIcon, DollarSignIcon } from '../../../components/shared';
import { useFinancialMemory } from '../../../hooks/useFinancialMemory';

const MODES = {
    RATE: { id: 'RATE', label: 'Find Growth Rate', question: "What return do I need?", icon: TrendingUpIcon, desc: "Calculates the annual growth rate required to get from your starting value to your target." },
    FUTURE: { id: 'FUTURE', label: 'Find Future Value', question: "How much will I have?", icon: ArrowRightIcon, desc: "Projects your final wealth after a set period. Use this to see the magic of compound interest over time." },
    START: { id: 'START', label: 'Find Initial Deposit', question: "How much to invest?", icon: ScaleIcon, desc: "Reverse-engineers the lump sum you need to deposit today to hit a specific financial goal in the future." },
    TIME: { id: 'TIME', label: 'Find Time Horizon', question: "How long will it take?", icon: CalculatorIcon, desc: "Determines the number of years required to bridge the gap between what you have and what you want." },
};

const FREQUENCIES = [
    { label: 'Yearly', value: 'Yearly' }, { label: 'Monthly', value: 'Monthly' }, { label: 'Weekly', value: 'Weekly' }, { label: 'Daily', value: 'Daily' }
];

const CAGR_SUGGESTIONS = [
    { label: 'Find Return', value: 'What return do I need to turn $10k into $100k in 20 years?' },
    { label: 'Project Growth', value: 'If I invest $500 monthly at 8% return, how much will I have in 15 years?' },
    { label: 'Time Horizon', value: 'How long will it take to hit $1M starting with $50k and $2000/mo at 7%?' }
];

export default function CAGRCalculator({ isVisible = true }) {
    const { memory, updateMemory } = useFinancialMemory();
    const [mode, setMode] = useState('FUTURE'); 
    const [startValue, setStartValue] = useState(() => memory.portfolioBalance || 10000);
    const [endValue, setEndValue] = useState(100000);
    const [years, setYears] = useState(10);
    const [rate, setRate] = useState(7.0);
    const [hasContribution, setHasContribution] = useState(false);
    const [contribution, setContribution] = useState(500);
    const [frequency, setFrequency] = useState('Monthly');
    const [useInflation, setUseInflation] = useState(false);
    const [inflationRate, setInflationRate] = useState(2.5);
    const [aiInsight, setAiInsight] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    // --- EXPLICIT SETTERS ---
    const updateStartValue = (val) => { setStartValue(val); updateMemory({ portfolioBalance: val }); };

    const result = useMemo(() => {
        const inf = useInflation ? inflationRate : 0;
        const pmt = hasContribution ? contribution : 0;
        switch (mode) {
            case 'RATE': return { val: calculateRate(startValue, endValue, years, pmt, frequency, inf), nominalVal: calculateRate(startValue, endValue, years, pmt, frequency, 0), label: 'Annual Growth Rate', subLabel: useInflation ? 'Real Return (Adjusted)' : 'Nominal Return', suffix: '%', isCurrency: false, color: 'text-emerald-400' };
            case 'FUTURE': return { val: calculateFutureValue(startValue, rate, years, pmt, frequency, inf), nominalVal: calculateFutureValue(startValue, rate, years, pmt, frequency, 0), label: 'Projected Value', subLabel: useInflation ? "Purchasing Power (Today's $)" : "Future Balance", suffix: '', isCurrency: true, color: 'text-indigo-300' };
            case 'START': return { val: calculatePresentValue(endValue, rate, years, pmt, frequency, inf), nominalVal: calculatePresentValue(endValue, rate, years, pmt, frequency, 0), label: 'Required Investment', subLabel: useInflation ? "Real Capital Requirement" : "Nominal Deposit", suffix: '', isCurrency: true, color: 'text-amber-300' };
            case 'TIME': return { val: calculateDuration(startValue, endValue, rate, pmt, frequency, inf), nominalVal: calculateDuration(startValue, endValue, rate, pmt, frequency, 0), label: 'Time to Goal', subLabel: useInflation ? "Adjusted for Inflation" : "Standard Timeline", suffix: ' Yrs', isCurrency: false, color: 'text-cyan-300' };
            default: return { val: 0, label: 'Result', suffix: '' };
        }
    }, [mode, startValue, endValue, years, rate, hasContribution, contribution, frequency, useInflation, inflationRate]);

    const chartData = useMemo(() => {
        let eRate = rate; let eYears = years; let eStart = startValue;
        if (mode === 'RATE' && result.val) eRate = result.val;
        if (mode === 'TIME' && result.val) eYears = result.val;
        if (mode === 'START' && result.val) eStart = result.val;
        return generateGrowthSeries(eStart, eRate, eYears, hasContribution ? contribution : 0, frequency, useInflation ? inflationRate : 0);
    }, [result, startValue, years, rate, hasContribution, contribution, frequency, useInflation, inflationRate, mode]);

    if (!isVisible) return null;

    const handleAIUpdate = (args) => {
        if (args.startValue !== undefined) updateStartValue(args.startValue);
        if (args.endValue !== undefined) setEndValue(args.endValue);
        if (args.years !== undefined) setYears(args.years);
        if (args.rate !== undefined) setRate(args.rate);
        if (args.contribution !== undefined) setContribution(args.contribution);
        if (args.hasContribution !== undefined) setHasContribution(args.hasContribution);
        if (args.frequency !== undefined) setFrequency(args.frequency);
        if (args.useInflation !== undefined) setUseInflation(args.useInflation);
        if (args.inflationRate !== undefined) setInflationRate(args.inflationRate);
        if (args.mode !== undefined) setMode(args.mode);
        if (args.strategy_insight) setAiInsight(args.strategy_insight);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in flex flex-col min-h-0">
            {/* AI HERO SECTION (Hidden for Copilot)
            <AICommandBar endpoint="/api/ai/cagr" suggestions={CAGR_SUGGESTIONS} onUpdate={handleAIUpdate} context={{ mode, startValue, endValue, years, rate, hasContribution, contribution, frequency, useInflation, inflationRate }} globalMemory={memory} />
            <StrategyCard insight={aiInsight} />
            */}

            {/* AI Copilot Persistent Sidebar/Bottom-sheet */}
            <AICopilot 
                onUpdate={handleAIUpdate}
                context={{ calculatorId: 'cagr', mode, startValue, endValue, years, rate, hasContribution, contribution, frequency, useInflation, inflationRate }}
                globalMemory={memory}
            />
            <div className="w-full">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
                    {Object.values(MODES).map((m) => {
                        const Icon = m.icon; const isActive = mode === m.id;
                        return (
                            <button key={m.id} onClick={() => setMode(m.id)} className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 ${isActive ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl scale-[1.02]' : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-200 hover:bg-indigo-50'}`}>
                                <Icon size={24} className={`mb-2 ${isActive ? 'text-white' : 'text-indigo-400'}`} />
                                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">{m.label}</span>
                                <span className={`text-xs font-bold mt-1 ${isActive ? 'text-indigo-100' : 'text-slate-800'}`}>{m.question}</span>
                            </button>
                        );
                    })}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-xl space-y-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-slate-50 rounded-bl-[5rem] -mr-10 -mt-10 pointer-events-none"></div>
                            <div className="relative z-10 space-y-5">
                                {mode !== 'START' && <MoneyInput label="Initial Investment" value={startValue} onChange={(val) => updateStartValue(parseFloat(val) || 0)} />}
                                <div className={`relative z-10 pt-4 border-t border-slate-100 transition-all ${hasContribution ? 'bg-indigo-50/50 -mx-6 px-6 pb-6 -mb-6 border-t-indigo-100' : ''}`}>
                                    <label className="flex items-center gap-3 cursor-pointer"><div className={`w-10 h-6 rounded-full p-1 transition-colors ${hasContribution ? 'bg-indigo-500' : 'bg-slate-300'}`}><div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${hasContribution ? 'translate-x-4' : ''}`}></div></div><span className={`text-sm font-bold ${hasContribution ? 'text-indigo-700' : 'text-slate-500'}`}>Add Contributions</span><input type="checkbox" className="sr-only" checked={hasContribution} onChange={(e) => setHasContribution(e.target.checked)} /></label>
                                    {hasContribution && <div className="animate-fade-in mt-4 space-y-4"><div className="grid grid-cols-2 gap-3"><div><label className="text-[10px] font-black text-indigo-700 block uppercase mb-1.5">Frequency</label><NativeSelect value={frequency} onChange={(e) => setFrequency(e.target.value)} options={FREQUENCIES} /></div><div><label className="text-[10px] font-black text-indigo-700 block uppercase mb-1.5">Amount</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 text-xs font-bold">$</span><input type="number" value={contribution} onChange={(e) => setContribution(parseFloat(e.target.value) || 0)} className="w-full pl-6 pr-3 py-2.5 bg-white border-2 border-indigo-200 rounded-xl font-mono text-base font-black text-indigo-900" /></div></div></div></div>}
                                </div>
                                {mode !== 'FUTURE' && <MoneyInput label="Target Goal" value={endValue} onChange={(val) => setEndValue(parseFloat(val) || 0)} />}
                                {mode !== 'RATE' && <div><label className="text-xs font-black text-slate-700 block uppercase mb-1.5">Annual Return (%)</label><div className="relative"><input type="number" step="0.1" value={rate} onChange={(e) => setRate(parseFloat(e.target.value) || 0)} className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-lg font-black text-slate-900" /><span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span></div></div>}
                                {mode !== 'TIME' && <div><label className="text-xs font-black text-slate-700 block uppercase mb-1.5">Time Period</label><div className="relative"><input type="number" min="0.1" step="0.5" value={years} onChange={(e) => setYears(parseFloat(e.target.value) || 0)} className="w-full pl-4 pr-16 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-lg font-black text-slate-900" /><span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs uppercase">Years</span></div></div>}
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        <div className="bg-slate-900 text-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col justify-center min-h-[200px] border-4 border-slate-800">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
                            <div className="relative z-10 text-center">
                                <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs mb-3 flex items-center justify-center gap-2"><span className="w-8 h-px bg-slate-600"></span> {result.label} <span className="w-8 h-px bg-slate-600"></span></p>
                                <div className={`text-5xl md:text-6xl font-black tracking-tighter ${result.color}`}>{result.val !== null && !isNaN(result.val) ? (<>{result.isCurrency && <span className="text-3xl align-top mr-1 opacity-60">$</span>}{result.val.toLocaleString(undefined, { maximumFractionDigits: 2 })}<span className="text-3xl align-baseline ml-1 opacity-60">{result.suffix}</span></>) : "---"}</div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex-1 min-h-[350px]">
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 700}} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 700}} tickFormatter={(val) => `$${val >= 1000 ? (val/1000).toFixed(0)+'k' : val}`} />
                                        <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
                                        <Area type="monotone" dataKey="balance" stroke="#6366f1" strokeWidth={3} fillOpacity={0.1} fill="#6366f1" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Authoritative Resources */}
                <div className="pt-8">
                    <Accordion title="Authoritative Resources" icon={ExternalLinkIcon}>
                        <div className="flex flex-col gap-4">
                            <a href="https://www.investopedia.com/terms/c/cagr.asp" target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-indigo-50 rounded-2xl group transition-all hover:bg-indigo-100">
                                <div className="flex items-center gap-3"><DollarSignIcon className="text-indigo-600" /> <span className="font-bold text-indigo-900 text-sm">Investopedia: How to Calculate CAGR</span></div>
                                <ExternalLinkIcon size={16} className="text-indigo-400 group-hover:translate-x-1 transition-transform" />
                            </a>
                            <a href="https://www.canada.ca/en/financial-consumer-agency/services/savings-investments/investing-basics.html" target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl group transition-all hover:bg-emerald-100">
                                <div className="flex items-center gap-3"><DollarSignIcon className="text-emerald-600" /> <span className="font-bold text-emerald-900 text-sm">FCAC: The Power of Compound Interest</span></div>
                                <ExternalLinkIcon size={16} className="text-emerald-400 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    </Accordion>
                </div>

            </div>
        </div>
    );
}
