import React, { useState, useMemo } from 'react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { calculateSmithManoeuvre } from '../utils/smithEngine';
import { MoneyInput } from '../../../components/shared/MoneyInput';

export default function SmithCalculator() {
    // Initial State
    const [homeValue, setHomeValue] = useState(1000000);
    const [mortgageBalance, setMortgageBalance] = useState(400000);
    const [mortgageRate, setMortgageRate] = useState(0.045);
    const [helocRate, setHelocRate] = useState(0.065);
    const [marginalTaxRate, setMarginalTaxRate] = useState(0.43);
    
    // New Return States
    const [capitalGainsRate, setCapitalGainsRate] = useState(0.05);
    const [dividendYield, setDividendYield] = useState(0.02);
    const [dividendTaxRate, setDividendTaxRate] = useState(0.15);
    const [reinvestDividends, setReinvestDividends] = useState(true);
    
    // Previous Inputs
    const [amortizationYears, setAmortizationYears] = useState(25);
    const [initialLumpSum, setInitialLumpSum] = useState(0);
    const [readvanceTolerance, setReadvanceTolerance] = useState(1.0);
    const [reinvestTaxRefund, setReinvestTaxRefund] = useState(true);

    const currency = new Intl.NumberFormat('en-CA', { 
        style: 'currency', 
        currency: 'CAD', 
        maximumFractionDigits: 0 
    });

    // CRITICAL: wrap execution in useMemo
    const results = useMemo(() => {
        return calculateSmithManoeuvre({
            homeValue,
            mortgageBalance,
            mortgageRate,
            helocRate,
            marginalTaxRate,
            capitalGainsRate,
            dividendYield,
            dividendTaxRate,
            reinvestDividends,
            amortizationYears,
            initialHelocLumpSum: initialLumpSum,
            readvanceTolerance,
            reinvestTaxRefund
        });
    }, [
        homeValue, mortgageBalance, mortgageRate, helocRate, marginalTaxRate, 
        capitalGainsRate, dividendYield, dividendTaxRate, reinvestDividends,
        amortizationYears, initialLumpSum, readvanceTolerance, reinvestTaxRefund
    ]);

    const lastResult = results[results.length - 1];
    const totalAdvantage = lastResult.smithNetWorth - lastResult.standardNetWorth;

    // Build annualData for table
    const annualData = useMemo(() => {
        return results.filter(r => r.month % 12 === 0 || r.month === results.length);
    }, [results]);

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {/* Inputs Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Strategy Parameters</h3>
                        
                        <MoneyInput 
                            label="Home Value" 
                            value={homeValue} 
                            onChange={(val) => setHomeValue(Number(val))} 
                        />
                        
                        <MoneyInput 
                            label="Mortgage Balance" 
                            value={mortgageBalance} 
                            onChange={(val) => setMortgageBalance(Number(val))} 
                        />

                        <MoneyInput 
                            label="Initial HELOC Investment" 
                            value={initialLumpSum} 
                            onChange={(val) => setInitialLumpSum(Number(val))} 
                            subLabel="Lump sum borrowed from HELOC at Day 1"
                        />

                        <div className="space-y-4 pt-2">
                            <label className="block text-xs font-black uppercase tracking-tighter text-slate-700">Amortization ({amortizationYears} Years)</label>
                            <input 
                                type="range" min="5" max="30" step="1" 
                                value={amortizationYears} 
                                onChange={(e) => setAmortizationYears(Number(e.target.value))}
                                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="block text-xs font-black uppercase tracking-tighter text-slate-700">Re-advance Tolerance ({Math.round(readvanceTolerance * 100)}%)</label>
                            <input 
                                type="range" min="0" max="1" step="0.05" 
                                value={readvanceTolerance} 
                                onChange={(e) => setReadvanceTolerance(Number(e.target.value))}
                                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="block text-xs font-black uppercase tracking-tighter text-slate-700">Mortgage Rate ({(mortgageRate * 100).toFixed(2)}%)</label>
                            <input 
                                type="range" min="0.01" max="0.15" step="0.001" 
                                value={mortgageRate} 
                                onChange={(e) => setMortgageRate(Number(e.target.value))}
                                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="block text-xs font-black uppercase tracking-tighter text-slate-700">HELOC Rate ({(helocRate * 100).toFixed(2)}%)</label>
                            <input 
                                type="range" min="0.01" max="0.15" step="0.001" 
                                value={helocRate} 
                                onChange={(e) => setHelocRate(Number(e.target.value))}
                                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="block text-xs font-black uppercase tracking-tighter text-slate-700">Marginal Tax Rate ({(marginalTaxRate * 100).toFixed(0)}%)</label>
                            <input 
                                type="range" min="0.10" max="0.54" step="0.01" 
                                value={marginalTaxRate} 
                                onChange={(e) => setMarginalTaxRate(Number(e.target.value))}
                                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="block text-xs font-black uppercase tracking-tighter text-slate-700">Capital Gains Rate ({(capitalGainsRate * 100).toFixed(1)}%)</label>
                            <input 
                                type="range" min="0" max="0.15" step="0.005" 
                                value={capitalGainsRate} 
                                onChange={(e) => setCapitalGainsRate(Number(e.target.value))}
                                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="block text-xs font-black uppercase tracking-tighter text-slate-700">Dividend Yield ({(dividendYield * 100).toFixed(1)}%)</label>
                            <input 
                                type="range" min="0" max="0.10" step="0.005" 
                                value={dividendYield} 
                                onChange={(e) => setDividendYield(Number(e.target.value))}
                                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="block text-xs font-black uppercase tracking-tighter text-slate-700">Dividend Tax Rate ({(dividendTaxRate * 100).toFixed(0)}%)</label>
                            <input 
                                type="range" min="0" max="0.50" step="0.01" 
                                value={dividendTaxRate} 
                                onChange={(e) => setDividendTaxRate(Number(e.target.value))}
                                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                        </div>

                        <div className="space-y-3 pt-4 border-t border-slate-100">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-black uppercase tracking-tighter text-slate-700">Reinvest Tax Refund</label>
                                <button 
                                    onClick={() => setReinvestTaxRefund(!reinvestTaxRefund)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${reinvestTaxRefund ? 'bg-indigo-600' : 'bg-slate-200'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${reinvestTaxRefund ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-black uppercase tracking-tighter text-slate-700">Reinvest Dividends</label>
                                <button 
                                    onClick={() => setReinvestDividends(!reinvestDividends)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${reinvestDividends ? 'bg-indigo-600' : 'bg-slate-200'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${reinvestDividends ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-indigo-600 p-8 rounded-3xl text-white shadow-xl shadow-indigo-200">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Total Strategy Advantage</p>
                        <h4 className="text-4xl font-black tracking-tighter">{currency.format(totalAdvantage)}</h4>
                        <p className="text-xs font-bold mt-4 opacity-90 leading-relaxed">
                            Estimated net worth boost after {amortizationYears} years by converting mortgage debt into tax-deductible investment debt.
                        </p>
                    </div>
                </div>

                {/* Chart Area */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
                        <div className="mb-8">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Net Worth Projection</h2>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">{amortizationYears} Year Amortization Period</p>
                        </div>

                        {/* CRITICAL: Wrap chart in ResponsiveContainer */}
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height={400} minWidth={0}>
                                <AreaChart data={results} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorSmith" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorStandard" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis 
                                        dataKey="month" 
                                        hide={false}
                                        tickFormatter={(val) => `Yr ${val / 12}`}
                                        ticks={Array.from({length: amortizationYears + 1}, (_, i) => i * 12)}
                                        fontSize={10}
                                        fontWeight="bold"
                                        stroke="#94a3b8"
                                    />
                                    <YAxis 
                                        tickFormatter={(val) => `$${(val / 1000000).toFixed(1)}M`}
                                        fontSize={10}
                                        fontWeight="bold"
                                        stroke="#94a3b8"
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip 
                                        formatter={(val) => [currency.format(val), '']}
                                        labelFormatter={(label) => `Month ${label} (Year ${(label/12).toFixed(1)})`}
                                        contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    />
                                    <Legend verticalAlign="top" align="right" iconType="circle" />
                                    <Area 
                                        name="Smith Net Worth"
                                        type="monotone" 
                                        dataKey="smithNetWorth" 
                                        stroke="#4f46e5" 
                                        strokeWidth={3}
                                        fillOpacity={1} 
                                        fill="url(#colorSmith)" 
                                    />
                                    <Area 
                                        name="Standard Net Worth"
                                        type="monotone" 
                                        dataKey="standardNetWorth" 
                                        stroke="#94a3b8" 
                                        strokeWidth={2}
                                        fillOpacity={1} 
                                        fill="url(#colorStandard)" 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Investment Balance</h4>
                            <p className="text-3xl font-black text-slate-900 tracking-tighter">
                                {currency.format(lastResult.smithInvestmentBalance)}
                            </p>
                            <p className="text-xs font-bold text-slate-500 mt-2">Compounded portfolio growth</p>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Portfolio Liquidity</h4>
                            <p className="text-3xl font-black text-slate-900 tracking-tighter">
                                {currency.format(lastResult.cumulativePocketedCash)}
                            </p>
                            <p className="text-xs font-bold text-slate-500 mt-2">Non-reinvested net dividends</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Amortization Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-6 py-4 font-black text-slate-900 uppercase tracking-tighter">Year</th>
                            <th className="px-6 py-4 font-black text-slate-900 uppercase tracking-tighter">Mortgage Balance</th>
                            <th className="px-6 py-4 font-black text-slate-900 uppercase tracking-tighter text-indigo-600">HELOC Balance</th>
                            <th className="px-6 py-4 font-black text-slate-900 uppercase tracking-tighter text-blue-600">Annual Tax Refund</th>
                            <th className="px-6 py-4 font-black text-slate-900 uppercase tracking-tighter text-indigo-600">Annual Dividends</th>
                            <th className="px-6 py-4 font-black text-slate-900 uppercase tracking-tighter text-emerald-600">Pocketed Cash</th>
                            <th className="px-6 py-4 font-black text-slate-900 uppercase tracking-tighter">Standard Net Worth</th>
                            <th className="px-6 py-4 font-black text-slate-900 uppercase tracking-tighter text-emerald-600">Smith Net Worth</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {annualData.map((row) => (
                            <tr key={row.month} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 font-bold text-slate-900">{row.month / 12}</td>
                                <td className="px-6 py-4 font-medium text-slate-600 font-mono">{currency.format(row.standardMortgageBalance)}</td>
                                <td className="px-6 py-4 font-bold text-indigo-600 font-mono">{currency.format(row.smithHelocBalance)}</td>
                                <td className="px-6 py-4 font-bold text-blue-600 font-mono">{currency.format(row.annualTaxRefund || 0)}</td>
                                <td className="px-6 py-4 font-bold text-indigo-600 font-mono">{currency.format(row.yearlyNetDividends || 0)}</td>
                                <td className="px-6 py-4 font-bold text-emerald-600 font-mono">{currency.format(row.cumulativePocketedCash || 0)}</td>
                                <td className="px-6 py-4 font-medium text-slate-600 font-mono">{currency.format(row.standardNetWorth)}</td>
                                <td className="px-6 py-4 font-black text-emerald-600 font-mono">{currency.format(row.smithNetWorth)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
