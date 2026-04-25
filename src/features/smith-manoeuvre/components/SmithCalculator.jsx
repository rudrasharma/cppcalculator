import React, { useState, useMemo } from 'react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { calculateSmithManoeuvre } from '../utils/smithEngine';
import { MoneyInput } from '../../../components/shared/MoneyInput';
import { useLocalStorage } from '../../../hooks/useLocalStorage';

export default function SmithCalculator() {
    // UI State
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Initial State
    const [homeValue, setHomeValue] = useLocalStorage('looniefi_smith_home_val', 750000);
    const [mortgageBalance, setMortgageBalance] = useLocalStorage('looniefi_smith_mort_bal', 500000);
    const [mortgageRate, setMortgageRate] = useLocalStorage('looniefi_smith_mort_rate', 0.045);
    const [helocRate, setHelocRate] = useLocalStorage('looniefi_smith_heloc_rate', 0.065);
    const [marginalTaxRate, setMarginalTaxRate] = useLocalStorage('looniefi_smith_tax_rate', 0.43);
    
    // New Return States
    const [capitalGainsRate, setCapitalGainsRate] = useLocalStorage('looniefi_smith_cap_gains', 0.05);
    const [dividendYield, setDividendYield] = useLocalStorage('looniefi_smith_div_yield', 0.02);
    const [dividendTaxRate, setDividendTaxRate] = useLocalStorage('looniefi_smith_div_tax', 0.15);
    const [reinvestDividends, setReinvestDividends] = useLocalStorage('looniefi_smith_reinvest_div', true);
    
    // Previous Inputs
    const [amortizationYears, setAmortizationYears] = useLocalStorage('looniefi_smith_amort', 25);
    const [initialLumpSum, setInitialLumpSum] = useLocalStorage('looniefi_smith_lump_sum', 0);
    const [readvanceTolerance, setReadvanceTolerance] = useLocalStorage('looniefi_smith_tolerance', 1.0);
    const [reinvestTaxRefund, setReinvestTaxRefund] = useLocalStorage('looniefi_smith_reinvest_tax', true);
    const [capitalizeInterest, setCapitalizeInterest] = useLocalStorage('looniefi_smith_capitalize', true);

    const currency = new Intl.NumberFormat('en-CA', { 
        style: 'currency', 
        currency: 'CAD', 
        maximumFractionDigits: 0 
    });

    // Tooltip Component
    const InfoTooltip = ({ text }) => (
        <div className="group relative inline-block ml-1">
            <span className="text-slate-400 cursor-help text-[10px] bg-slate-100 rounded-full w-4 h-4 inline-flex items-center justify-center font-serif italic border border-slate-200 hover:bg-slate-200 transition-colors">i</span>
            <div className="hidden group-hover:block absolute z-50 w-64 p-3 text-xs font-medium leading-relaxed bg-slate-800 text-white rounded-xl shadow-xl -left-1/2 mt-2 pointer-events-none border border-slate-700">
                {text}
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
            </div>
        </div>
    );

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
            reinvestTaxRefund,
            capitalizeInterest
        });
    }, [
        homeValue, mortgageBalance, mortgageRate, helocRate, marginalTaxRate, 
        capitalGainsRate, dividendYield, dividendTaxRate, reinvestDividends,
        amortizationYears, initialLumpSum, readvanceTolerance, reinvestTaxRefund,
        capitalizeInterest
    ]);

    const lastResult = results[results.length - 1];
    const totalAdvantage = lastResult.smithNetWorth - lastResult.standardNetWorth;

    // Build annualData for table
    const annualData = useMemo(() => {
        return results.filter(r => r.month % 12 === 0 || r.month === results.length);
    }, [results]);

    const handleExportCSV = () => {
        const headers = "Year,Mortgage Balance,HELOC Balance,Investment Portfolio,Out-of-Pocket Interest,Net Annual Dividends,Pocketed Cash,Standard Net Worth,Smith Net Worth,Net Benefit";
        const rows = annualData.map(row => {
            const netBenefit = row.smithNetWorth - row.standardNetWorth;
            return [
                row.month / 12,
                row.standardMortgageBalance,
                row.smithHelocBalance,
                row.smithInvestmentBalance,
                row.yearlyOutOfPocketInterest || 0,
                row.yearlyNetDividends || 0,
                row.cumulativePocketedCash || 0,
                row.standardNetWorth,
                row.smithNetWorth,
                netBenefit
            ].join(",");
        });
        
        const csvContent = [headers, ...rows].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "smith-manoeuvre-projection.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-fade-in">
            {/* Task 1: Intro Primer */}
            <div className="space-y-4 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Smith Manoeuvre Optimizer</h1>
                <p className="text-lg text-slate-600 max-w-4xl leading-relaxed">
                    In Canada, mortgage interest isn't tax-deductible. The Smith Manoeuvre solves this by gradually converting your standard mortgage into a tax-deductible investment loan, generating annual tax refunds and accelerating your wealth.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Inputs Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                        <h3 className="text-sm font-black uppercase tracking-widest text-indigo-600">The Essentials</h3>
                        
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

                        <div className="space-y-4 pt-2">
                            <label className="block text-xs font-black uppercase tracking-tighter text-slate-700">Mortgage Rate ({(mortgageRate * 100).toFixed(2)}%)</label>
                            <input 
                                type="range" min="0.01" max="0.15" step="0.001" 
                                value={mortgageRate} 
                                onChange={(e) => setMortgageRate(Number(e.target.value))}
                                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="flex items-center text-xs font-black uppercase tracking-tighter text-slate-700">
                                Marginal Tax Rate ({(marginalTaxRate * 100).toFixed(0)}%)
                                <InfoTooltip text="The tax rate on your highest dollar of income. This determines the exact size of the tax refund generated by your investment loan interest." />
                            </label>
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

                        {/* Task 3: Advanced Strategy Section */}
                        <div className="pt-4 border-t border-slate-100">
                            <button 
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className="flex items-center justify-between w-full text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors"
                            >
                                <span>⚙️ Advanced Settings</span>
                                <span className={`transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`}>▼</span>
                            </button>

                            {showAdvanced && (
                                <div className="mt-6 space-y-6 animate-fade-in">
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
                                        <label className="flex items-center text-xs font-black uppercase tracking-tighter text-slate-700">
                                            Re-advance Tolerance ({Math.round(readvanceTolerance * 100)}%)
                                            <InfoTooltip text="What percentage of your paid principal do you want to borrow back to invest? 100% is the standard Smith Manoeuvre, but lower numbers are safer." />
                                        </label>
                                        <input 
                                            type="range" min="0" max="1" step="0.05" 
                                            value={readvanceTolerance} 
                                            onChange={(e) => setReadvanceTolerance(Number(e.target.value))}
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

                                    <div className="space-y-3 pt-4 border-t border-slate-50">
                                        <div className="flex items-center justify-between">
                                            <label className="flex items-center text-xs font-black uppercase tracking-tighter text-slate-700">
                                                Capitalize Interest
                                                <InfoTooltip text="Turn ON to pay the HELOC interest by borrowing more from the HELOC. Turn OFF to pay the interest out of your own pocket monthly." />
                                            </label>
                                            <button 
                                                onClick={() => setCapitalizeInterest(!capitalizeInterest)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${capitalizeInterest ? 'bg-indigo-600' : 'bg-slate-200'}`}
                                            >
                                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${capitalizeInterest ? 'translate-x-6' : 'translate-x-1'}`} />
                                            </button>
                                        </div>
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
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Dashboard Area */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Task 2: Summary Metric Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Net Worth</p>
                            <p className="text-2xl font-black text-slate-900 tracking-tight">{currency.format(lastResult.smithNetWorth)}</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm bg-emerald-50/20">
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Extra Wealth Created</p>
                            <p className="text-2xl font-black text-emerald-600 tracking-tight">+{currency.format(totalAdvantage)}</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Portfolio Built</p>
                            <p className="text-2xl font-black text-slate-900 tracking-tight">{currency.format(lastResult.smithInvestmentBalance)}</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Out-of-Pocket Cost</p>
                            <p className={`text-2xl font-black tracking-tight ${lastResult.cumulativeOutOfPocketInterest > 0 ? 'text-red-600' : 'text-slate-400'}`}>
                                {currency.format(lastResult.cumulativeOutOfPocketInterest || 0)}
                            </p>
                        </div>
                    </div>

                    {/* Chart Visualization */}
                    <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
                        <div className="mb-8">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Net Worth Projection</h2>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">{amortizationYears} Year Strategy Lifecycle</p>
                        </div>

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
                                        isAnimationActive={false}
                                        allowEscapeViewBox={{ x: false, y: true }}
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

                    {/* Secondary Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-sm">
                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 text-center md:text-left">Strategy Liquidity</h4>
                            <p className="text-3xl font-black text-slate-900 tracking-tighter text-center md:text-left">
                                {currency.format(lastResult.cumulativePocketedCash)}
                            </p>
                            <p className="text-xs font-bold text-slate-500 mt-2 text-center md:text-left italic">Total cash flow extracted from dividends</p>
                        </div>
                        <div className="bg-indigo-600 p-8 rounded-3xl text-white shadow-xl shadow-indigo-100">
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Total Net Worth Advantage</p>
                            <h4 className="text-4xl font-black tracking-tighter">{currency.format(totalAdvantage)}</h4>
                            <p className="text-xs font-bold mt-4 opacity-90 leading-relaxed italic">
                                Projected wealth increase over standard home ownership.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-lg overflow-hidden overflow-x-auto">
                <div className="bg-slate-50 px-8 py-6 border-b border-slate-200">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h3 className="text-lg font-black text-slate-900 tracking-tight">Year-by-Year Financial Audit</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Detailed breakdown of debt conversion and growth</p>
                        </div>
                        <button 
                            onClick={handleExportCSV}
                            className="text-xs font-bold px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-2 whitespace-nowrap"
                        >
                            ⬇️ Export Timeline (CSV)
                        </button>
                    </div>
                </div>
                <table className="w-full text-left text-sm border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-200">
                            <th className="px-6 py-4 font-black text-slate-900 uppercase tracking-tighter sticky left-0 bg-slate-50 z-20 shadow-[1px_0_0_0_#e5e7eb]">Year</th>
                            <th className="px-6 py-4 font-black text-slate-900 uppercase tracking-tighter">Mortgage Balance</th>
                            <th className="px-6 py-4 font-black text-slate-900 uppercase tracking-tighter text-indigo-600">HELOC Balance</th>
                            <th className="px-6 py-4 font-black text-slate-900 uppercase tracking-tighter text-red-600">Out-of-Pocket Interest</th>
                            <th className="px-6 py-4 font-black text-slate-900 uppercase tracking-tighter text-blue-600">Annual Tax Refund</th>
                            <th className="px-6 py-4 font-black text-slate-900 uppercase tracking-tighter text-indigo-600">Annual Dividends</th>
                            <th className="px-6 py-4 font-black text-slate-900 uppercase tracking-tighter">Standard Net Worth</th>
                            <th className="px-6 py-4 font-black text-slate-900 uppercase tracking-tighter text-indigo-600">Smith Net Worth</th>
                            <th className="px-6 py-4 font-black text-slate-900 uppercase tracking-tighter text-emerald-600">Net Benefit</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {annualData.map((row) => (
                            <tr key={row.month} className="hover:bg-slate-50/50 transition-colors text-xs md:text-sm">
                                <td className="px-6 py-4 font-bold text-slate-900 sticky left-0 bg-white z-10 shadow-[1px_0_0_0_#e5e7eb]">{row.month / 12}</td>
                                <td className="px-6 py-4 font-medium text-slate-600 font-mono">{currency.format(row.standardMortgageBalance)}</td>
                                <td className="px-6 py-4 font-bold text-indigo-600 font-mono">{currency.format(row.smithHelocBalance)}</td>
                                <td className="px-6 py-4 font-bold text-red-500 font-mono">{currency.format(row.yearlyOutOfPocketInterest || 0)}</td>
                                <td className="px-6 py-4 font-bold text-blue-600 font-mono">{currency.format(row.annualTaxRefund || 0)}</td>
                                <td className="px-6 py-4 font-bold text-indigo-600 font-mono">{currency.format(row.yearlyNetDividends || 0)}</td>
                                <td className="px-6 py-4 font-medium text-slate-500 font-mono">{currency.format(row.standardNetWorth)}</td>
                                <td className="px-6 py-4 font-bold text-indigo-600 font-mono">{currency.format(row.smithNetWorth)}</td>
                                <td className="px-6 py-4 font-black text-emerald-600 font-mono">+{currency.format(row.smithNetWorth - row.standardNetWorth)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
