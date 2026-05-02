import React, { useState, useMemo } from 'react';
import { calculateTakeHome } from '../utils/taxEngine';
import { MoneyInput, NativeSelect, RangeSlider } from '../../../components/shared';
import { TAX_YEAR_CONFIG } from '../../../config/taxYears';

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

const TaxCalculator = () => {
    const [grossIncome, setGrossIncome] = useState(75000);
    const [rrspContribution, setRrspContribution] = useState(0);
    const [employerMatchPercent, setEmployerMatchPercent] = useState(0);
    const [province, setProvince] = useState('ON');
    const [period, setPeriod] = useState('monthly');

    // RRSP Max is roughly 18% of previous year's income, but for this simple calculator 
    // we'll cap it at 30k or a percentage of gross income.
    const rrspMaxTotal = Math.max(0, Math.min(32490, Math.floor(grossIncome * 0.18))); 
    const employerMatchAmount = grossIncome * (employerMatchPercent / 100);
    const remainingUserRoom = Math.max(0, rrspMaxTotal - employerMatchAmount);

    // Cap user RRSP contribution if it exceeds the remaining room
    React.useEffect(() => {
        if (rrspContribution > remainingUserRoom) {
            setRrspContribution(remainingUserRoom);
        }
    }, [remainingUserRoom]);

    const results = useMemo(() => {
        return calculateTakeHome(grossIncome, rrspContribution, province, employerMatchPercent);
    }, [grossIncome, rrspContribution, province, employerMatchPercent]);

    const displayData = results[period];
    const annualData = results.annual;

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

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
            {/* INPUTS */}
            <div className="lg:col-span-5 space-y-6">
                <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
                    <MoneyInput 
                        label="Gross Annual Income"
                        value={grossIncome}
                        onChange={(val) => setGrossIncome(parseFloat(val) || 0)}
                        helpText="Your total salary before any deductions."
                    />

                    <NativeSelect 
                        label="Province of Residence"
                        value={province}
                        options={PROVINCES}
                        onChange={(e) => setProvince(e.target.value)}
                    />

                    <div className="space-y-6 pt-4 border-t border-slate-100">
                        <RangeSlider 
                            label="Your RRSP Contribution"
                            subLabel={`Available Room: ${formatter.format(remainingUserRoom)}`}
                            value={rrspContribution}
                            min={0}
                            max={remainingUserRoom || 0}
                            step={100}
                            onChange={(e) => setRrspContribution(parseFloat(e.target.value) || 0)}
                            accentColor="indigo-600"
                        />

                        <RangeSlider 
                            label="Employer Match %"
                            subLabel={`Contribution: ${formatter.format(employerMatchAmount)}`}
                            value={employerMatchPercent}
                            min={0}
                            max={10}
                            step={0.5}
                            onChange={(e) => setEmployerMatchPercent(parseFloat(e.target.value) || 0)}
                            accentColor="emerald-500"
                        />
                        
                        <p className="text-[10px] text-slate-400 font-medium mt-2 italic">
                            Total RRSP ({formatter.format(rrspContribution + employerMatchAmount)}) reduces taxable income to {formatter.format(grossIncome - (rrspContribution + employerMatchAmount))}.
                        </p>
                    </div>
                </div>

                <div className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100">
                    <h3 className="text-sm font-black text-indigo-900 uppercase tracking-widest mb-3">2026 Tax Insight</h3>
                    <p className="text-sm text-indigo-700 leading-relaxed font-medium">
                        At {formatter.format(grossIncome)} in {TAX_YEAR_CONFIG.PROVINCIAL_TAX[province].NAME}, your average tax rate is <strong>{percentFormatter.format(averageTaxRate)}</strong>. 
                        Your next dollar earned will be taxed at <strong>{percentFormatter.format(marginalTaxRate)}</strong>.
                    </p>
                </div>
            </div>

            {/* OUTPUTS */}
            <div className="lg:col-span-7 space-y-6">
                <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                        <div>
                            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Take-Home Pay</h2>
                            <p className="text-5xl font-black text-slate-900 tracking-tight">
                                {formatter.format(displayData.net)}
                            </p>
                        </div>
                        
                        <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100 self-start">
                            {PERIODS.map(p => (
                                <button
                                    key={p.value}
                                    onClick={() => setPeriod(p.value)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                        period === p.value 
                                        ? 'bg-white text-indigo-600 shadow-sm' 
                                        : 'text-slate-500 hover:text-slate-900'
                                    }`}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-4 border-b border-slate-100">
                            <span className="text-slate-500 font-bold">Gross Pay</span>
                            <span className="text-slate-900 font-black">{formatter.format(displayData.gross)}</span>
                        </div>
                        
                        <div className="flex justify-between items-center py-4 border-b border-slate-100">
                            <div className="flex flex-col">
                                <span className="text-slate-500 font-bold">Federal Tax</span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Includes BPA Credit</span>
                            </div>
                            <span className="text-rose-500 font-bold">-{formatter.format(displayData.federalTax)}</span>
                        </div>

                        <div className="flex justify-between items-center py-4 border-b border-slate-100">
                            <div className="flex flex-col">
                                <span className="text-slate-500 font-bold">Provincial Tax</span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{TAX_YEAR_CONFIG.PROVINCIAL_TAX[province].NAME}</span>
                            </div>
                            <span className="text-rose-500 font-bold">-{formatter.format(displayData.provincialTax)}</span>
                        </div>

                        <div className="flex justify-between items-center py-4 border-b border-slate-100 text-sm">
                            <span className="text-slate-400 font-medium">CPP/CPP2 Premiums</span>
                            <span className="text-slate-600 font-bold">-{formatter.format(displayData.cpp)}</span>
                        </div>

                        <div className="flex justify-between items-center py-4 border-b border-slate-100 text-sm">
                            <span className="text-slate-400 font-medium">EI Premiums</span>
                            <span className="text-slate-600 font-bold">-{formatter.format(displayData.ei)}</span>
                        </div>

                        <div className="flex justify-between items-center py-6 mt-4 bg-slate-900 rounded-3xl px-8 shadow-xl shadow-slate-200">
                            <span className="text-white font-black uppercase tracking-widest text-xs">Total {period === 'annual' ? 'Annual' : period.charAt(0).toUpperCase() + period.slice(1)} Net</span>
                            <span className="text-white text-2xl font-black">{formatter.format(displayData.net)}</span>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                            Estimates for the 2026 tax year
                        </p>
                    </div>
                </div>

                {/* PAYCHECK SCHEDULE (THE CLIFF) */}
                <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Paycheck Schedule</h3>
                        <span className="text-[10px] font-bold text-slate-400 uppercase bg-white px-3 py-1 rounded-full border border-slate-100">Monthly Breakdown</span>
                    </div>
                    
                    <div className="space-y-3">
                        {results.schedule.map((month, idx) => {
                            const monthName = new Date(2026, month.month).toLocaleString('en-CA', { month: 'short' });
                            const isMaxed = month.cpp === 0 && month.ei === 0;
                            
                            return (
                                <div key={idx} className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${isMaxed ? 'bg-emerald-50 border-emerald-100 shadow-sm' : 'bg-white border-slate-100'}`}>
                                    <div className="flex items-center gap-4">
                                        <span className="w-10 text-xs font-black text-slate-400 uppercase">{monthName}</span>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-slate-900">{formatter.format(month.net)}</span>
                                            {isMaxed && <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-tighter">CPP/EI Maxed Out ✨</span>}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {month.cpp > 0 && <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" title="CPP Deduction Active"></div>}
                                        {month.ei > 0 && <div className="w-1.5 h-1.5 rounded-full bg-amber-400" title="EI Deduction Active"></div>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-6 p-4 bg-white/50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                            <strong className="text-slate-700">The "Cliff" Effect:</strong> Most Canadians see an increase in take-home pay in the second half of the year. 
                            Once you hit the 2026 earnings ceiling of $74,600 (CPP) and $68,900 (EI), those deductions stop, as shown in the <span className="text-emerald-600 font-bold">green highlights</span> above.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaxCalculator;
