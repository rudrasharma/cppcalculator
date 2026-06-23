import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { calculateTakeHome } from '../utils/taxEngine';
import { MoneyInput, NativeSelect, RangeSlider, AICommandBar, StrategyCard, AICopilot } from '../../../components/shared';
import { TAX_YEAR_CONFIG } from '../../../config/taxYears';
import { useFinancialMemory } from '../../../hooks/useFinancialMemory';

const PROVINCES = Object.entries(TAX_YEAR_CONFIG.PROVINCIAL_TAX).map(([code, config]) => ({
    value: code,
    label: config.NAME
}));

const PERIODS = [
    { value: 'annual', label: 'Annual' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'semiMonthly', label: 'Semi-Monthly' },
    { value: 'biWeekly', label: 'Bi-Weekly' }
];

const TaxCalculator = ({ initialIncome = 75000, initialProvince = 'ON' }) => {
    const { memory, updateMemory } = useFinancialMemory();
    
    // Direct lazy initialization from memory
    const [grossIncome, setGrossIncome] = useState(() => memory.grossIncome || initialIncome);
    const [province, setProvince] = useState(() => memory.province || initialProvince);
    const [rrspContribution, setRrspContribution] = useState(0);
    const [employerMatchPercent, setEmployerMatchPercent] = useState(() => memory.employerMatchPercent || 0);
    
    const [period, setPeriod] = useState('monthly');
    const [aiInsight, setAiInsight] = useState('');

    // Explicit Setters: Update local state + global memory
    const setIncome = useCallback((val) => {
        const num = parseFloat(val) || 0;
        setGrossIncome(num);
        updateMemory({ grossIncome: num });
    }, [updateMemory]);

    const setProv = useCallback((val) => {
        setProvince(val);
        updateMemory({ province: val });
    }, [updateMemory]);

    const setMatch = useCallback((val) => {
        const num = parseFloat(val) || 0;
        setEmployerMatchPercent(num);
        updateMemory({ employerMatchPercent: num });
    }, [updateMemory]);

    // RRSP Logic
    const rrspMaxTotal = useMemo(() => 
        Math.max(0, Math.min(32490, Math.floor(grossIncome * 0.18))),
        [grossIncome]
    );

    const employerMatchAmount = useMemo(() => 
        grossIncome * (employerMatchPercent / 100),
        [grossIncome, employerMatchPercent]
    );

    const remainingUserRoom = Math.max(0, rrspMaxTotal - employerMatchAmount);

    useEffect(() => {
        if (rrspContribution > remainingUserRoom) {
            setRrspContribution(remainingUserRoom);
        }
    }, [remainingUserRoom, rrspContribution]);

    const results = useMemo(() => {
        try {
            return calculateTakeHome(grossIncome, rrspContribution, province, employerMatchPercent);
        } catch (e) {
            console.error("Calculation Error", e);
            return null;
        }
    }, [grossIncome, rrspContribution, province, employerMatchPercent]);

    // Derived Results
    const { displayData, taxSavings, annualData } = useMemo(() => {
        if (!results || !results.annual) return { displayData: null, taxSavings: 0, annualData: null };
        const currentDisplay = results[period] || results.annual;
        try {
            const base = calculateTakeHome(grossIncome, 0, province, 0);
            const savings = Math.max(0, base.annual.totalTax - results.annual.totalTax);
            return { displayData: currentDisplay, taxSavings: savings, annualData: results.annual };
        } catch (e) {
            return { displayData: currentDisplay, taxSavings: 0, annualData: results.annual };
        }
    }, [results, period, grossIncome, province]);

    if (!results || !results.annual || !displayData) {
        return <div className="p-10 text-center text-slate-400 font-bold">Initializing Calculator...</div>;
    }

    const formatter = new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD',
        maximumFractionDigits: 0
    });

    const percentFormatter = new Intl.NumberFormat('en-CA', {
        style: 'percent',
        minimumFractionDigits: 1
    });

    const averageTaxRate = grossIncome > 0 ? annualData.totalTax / grossIncome : 0;
    const marginalTaxRate = (calculateTakeHome(grossIncome + 100, rrspContribution, province, employerMatchPercent).annual.totalTax - annualData.totalTax) / 100;

    const handleAIUpdate = (args) => {
        if (args.grossIncome !== undefined) setIncome(args.grossIncome);
        if (args.province !== undefined) setProv(args.province);
        if (args.rrspContribution !== undefined) setRrspContribution(args.rrspContribution);
        if (args.employerMatchPercent !== undefined) setMatch(args.employerMatchPercent);
        if (args.strategy_insight) setAiInsight(args.strategy_insight);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col min-h-0">
            {/* AI HERO SECTION (Hidden for Copilot Pilot)
            <AICommandBar 
                onUpdate={handleAIUpdate}
                context={{ grossIncome, province, rrspContribution, employerMatchPercent }}
                globalMemory={memory}
            />
            <StrategyCard insight={aiInsight} />
            */}

            {/* AI Copilot Persistent Sidebar/Bottom-sheet */}
            <AICopilot 
                onUpdate={handleAIUpdate}
                context={{ calculatorId: 'tax', grossIncome, province, rrspContribution, employerMatchPercent }}
                globalMemory={memory}
            />

            <div className="w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
                            <MoneyInput 
                                label="Gross Annual Income"
                                value={grossIncome}
                                onChange={(val) => setIncome(val)}
                                subLabel="Before tax"
                            />
                            <NativeSelect 
                                label="Province of Residence"
                                value={province}
                                onChange={(e) => setProv(e.target.value)}
                                options={PROVINCES}
                            />
                            <RangeSlider 
                                label="Your RRSP Contribution"
                                subLabel={`Available Room: ${formatter.format(remainingUserRoom)}`}
                                value={rrspContribution}
                                onChange={(e) => setRrspContribution(parseFloat(e.target.value) || 0)}
                                min={0}
                                max={rrspMaxTotal}
                                step={100}
                            />
                            <RangeSlider 
                                label="Employer Match %"
                                subLabel={`Contribution: ${formatter.format(employerMatchAmount)}`}
                                value={employerMatchPercent}
                                onChange={(e) => setMatch(e.target.value)}
                                min={0}
                                max={10}
                                step={0.5}
                                suffix="%"
                            />
                            <p className="text-[10px] text-slate-400 font-medium mt-2 italic">
                                Total RRSP ({formatter.format(rrspContribution + employerMatchAmount)}) reduces taxable income to {formatter.format(grossIncome - (rrspContribution + employerMatchAmount))}.
                            </p>
                        </div>

                        <div className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100">
                            <h3 className="text-sm font-black text-indigo-900 uppercase tracking-widest mb-3">2026 Tax Insight</h3>
                            <p className="text-sm text-indigo-700 leading-relaxed font-medium">
                                At {formatter.format(grossIncome || 0)} in {TAX_YEAR_CONFIG.PROVINCIAL_TAX[province]?.NAME || 'Canada'}, your average tax rate is <strong>{percentFormatter.format(averageTaxRate)}</strong>. 
                                Your next dollar earned will be taxed at <strong>{percentFormatter.format(marginalTaxRate)}</strong>.
                            </p>
                        </div>
                    </div>

                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-slate-900 text-white p-8 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col justify-center min-h-[300px] border-4 border-slate-800">
                            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-500 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-emerald-500 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
                            <div className="relative z-10 space-y-8">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div>
                                        <h3 className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs mb-2">Estimated Take-Home Pay</h3>
                                        <div className="text-6xl md:text-7xl font-black tracking-tighter text-emerald-400 drop-shadow-2xl">
                                            {formatter.format(displayData?.net || 0)}
                                        </div>
                                    </div>
                                    <div className="flex bg-white/10 p-1 rounded-2xl backdrop-blur-sm self-start">
                                        {PERIODS.map(p => (
                                            <button key={p.value} onClick={() => setPeriod(p.value)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${period === p.value ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-300 hover:text-white'}`}>
                                                {p.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/10">
                                    <div><span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest block mb-1">Federal Tax</span><span className="text-white text-lg font-black">{formatter.format(displayData?.federalTax || 0)}</span></div>
                                    <div><span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest block mb-1">Provincial Tax</span><span className="text-white text-lg font-black">{formatter.format(displayData?.provincialTax || 0)}</span></div>
                                    <div><span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest block mb-1">CPP/EI</span><span className="text-white text-lg font-black">{formatter.format((displayData?.cpp || 0) + (displayData?.ei || 0))}</span></div>
                                    <div><span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest block mb-1">Total Deductions</span><span className="text-rose-400 text-lg font-black">{formatter.format(displayData?.totalDeductions || 0)}</span></div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative">
                            <div className="flex items-center gap-3 mb-6"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div><h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Net Income Components</h3></div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100"><span className="text-sm font-bold text-slate-600">Gross Income</span><span className="text-slate-900 text-lg font-black">{formatter.format(displayData?.gross || 0)}</span></div>
                                <div className="flex justify-between items-center p-4 bg-slate-900 rounded-2xl"><span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Take Home</span><span className="text-white text-2xl font-black">{formatter.format(displayData?.net || 0)}</span></div>
                            </div>
                            <div className="mt-8 text-center">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4">Earnings Schedule Breakdown</p>
                                <div className="inline-grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                                    {[
                                        { label: 'Bi-Weekly', val: results.biWeekly?.net },
                                        { label: 'Monthly', val: results.monthly?.net },
                                        { label: 'Annual', val: results.annual?.net },
                                        { label: 'RRSP Refund', val: taxSavings }
                                    ].map((item, idx) => (
                                        <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                                            <span className="text-[9px] font-black text-slate-500 uppercase block mb-1">{item.label}</span>
                                            <span className={`text-sm font-black ${idx === 3 ? 'text-indigo-600' : 'text-slate-900'}`}>{formatter.format(item.val || 0)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-6 p-4 bg-white/50 rounded-2xl border border-slate-100">
                                <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                                    <strong className="text-slate-700">The "Cliff" Effect:</strong> Most Canadians see an increase in take-home pay in the second half of the year. 
                                    Once you hit the 2026 earnings ceiling of $74,600 (CPP) and $68,900 (EI), those deductions stop.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaxCalculator;
