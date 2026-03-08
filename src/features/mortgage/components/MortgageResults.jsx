import React from 'react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';
import { 
    TrendingUpIcon, 
    CalendarIcon, 
    CalculatorIcon,
    InfoIcon,
    ArrowRightIcon,
    CheckCircleIcon,
    FileTextIcon,
    RotateCcwIcon,
} from '../../../components/shared';

export const MortgageResults = ({ results, state }) => {
    const { monthlyPayment, totalInterest, totalCost, yearsToPayOff, schedule, savings, cmhcPremium, principal, balanceAtEndOfTerm, ltt, stressTest } = results;
    const { amortizationYears, paymentFrequency, termYears, showStressTest } = state;

    const formattedPayment = monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const formattedInterest = totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 });
    const formattedCost = totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 });
    const formattedPrincipal = principal.toLocaleString(undefined, { maximumFractionDigits: 0 });

    const timeSavedYears = Math.floor(savings.time);
    const timeSavedMonths = Math.round((savings.time - timeSavedYears) * 12);

    const isRenewal = state.calculationMode === 'renewal';

    return (
        <div className="flex flex-col gap-8">
            {/* Payment Hero */}
            <div className="bg-slate-900 text-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col justify-center min-h-[200px] border-4 border-slate-800">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-500 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-emerald-500 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>

                <div className="relative z-10 text-center">
                    <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs mb-3 flex items-center justify-center gap-2">
                        <span className="w-8 h-px bg-slate-600"></span> 
                        Regular Payment ({paymentFrequency})
                        <span className="w-8 h-px bg-slate-600"></span>
                    </p>
                    
                    <div className="text-5xl md:text-6xl font-black tracking-tighter break-words text-indigo-300 drop-shadow-2xl">
                        <span className="text-3xl align-top mr-1 opacity-60">$</span>
                        {formattedPayment}
                    </div>

                    <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex flex-col items-center">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Total Loan</span>
                            <span className="text-lg font-bold font-mono text-white mt-1">${formattedPrincipal}</span>
                            {cmhcPremium > 0 && <span className="text-[9px] text-rose-400 mt-1 uppercase font-bold text-center border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 rounded-md">Includes ${cmhcPremium.toLocaleString(undefined, { maximumFractionDigits: 0 })} CMHC</span>}
                        </div>
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex flex-col items-center">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">End of Term ({termYears}yr)</span>
                            <span className="text-lg font-bold font-mono text-white mt-1">${balanceAtEndOfTerm.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                        </div>
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex flex-col items-center justify-center">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Total Interest</span>
                            <span className="text-lg font-bold font-mono text-white mt-1">${formattedInterest}</span>
                        </div>
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex flex-col items-center justify-center">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Payoff Time</span>
                            <span className="text-lg font-bold font-mono text-white mt-1">
                                {Math.floor(yearsToPayOff)}yr {Math.round((yearsToPayOff % 1) * 12)}mo
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stress Test Banner */}
            {showStressTest && (
                <div className="bg-rose-50 border border-rose-100 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 animate-in slide-in-from-top-4 duration-500">
                    <div className="bg-white p-3 rounded-2xl shadow-sm text-rose-500 shrink-0">
                        <CheckCircleIcon size={24} />
                    </div>
                    <div className="flex-grow text-center md:text-left">
                        <h4 className="text-sm font-black text-rose-900 uppercase tracking-tight">Stress Test Result</h4>
                        <p className="text-xs text-rose-700 font-medium leading-relaxed mt-1">
                            At a qualifying rate of <strong className="font-black underline decoration-rose-200 underline-offset-4">{stressTest.rate.toFixed(2)}%</strong>, 
                            your payment would be <strong className="text-rose-900">${stressTest.payment.toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong>. 
                            This is <strong className="text-rose-900">${stressTest.difference.toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong> more than your base payment.
                        </p>
                    </div>
                    <div className="shrink-0 bg-rose-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                        Qualifying Rate
                    </div>
                </div>
            )}

            {/* Savings & Tax Cards */}
            <div className={`grid grid-cols-1 md:grid-cols-2 ${isRenewal ? 'lg:grid-cols-2' : 'lg:grid-cols-3'} gap-4`}>
                {/* Interest Saved */}
                {(savings.interest > 1 || savings.time > 0.01) && (
                    <div className="bg-emerald-50 p-6 rounded-[2.5rem] border border-emerald-100 flex flex-col items-center text-center">
                        <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600 mb-3">
                            <TrendingUpIcon size={24} />
                        </div>
                        <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Interest Saved</span>
                        <span className="text-2xl font-black text-emerald-900 mt-1">${savings.interest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                        <span className="text-[10px] font-bold text-emerald-600 mt-1 uppercase tracking-tighter">
                            {timeSavedYears > 0 && `${timeSavedYears}yr `}
                            {timeSavedMonths > 0 && `${timeSavedMonths}mo`}
                            {timeSavedYears === 0 && timeSavedMonths === 0 && '0 mo'} faster
                        </span>
                    </div>
                )}

                {/* Land Transfer Tax (Hidden in Renewal) */}
                {!isRenewal && (
                    <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-200 flex flex-col items-center text-center">
                        <div className="bg-slate-100 p-2 rounded-xl text-slate-600 mb-3">
                            <FileTextIcon size={24} />
                        </div>
                        <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Land Transfer Tax</span>
                        <span className="text-2xl font-black text-slate-900 mt-1">${ltt.totalTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                        <div className="flex gap-2 mt-1">
                            {ltt.provincialRebate > 0 && <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase">-${ltt.provincialRebate.toLocaleString()} Rebate</span>}
                            {ltt.municipalRebate > 0 && <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase">-${ltt.municipalRebate.toLocaleString()} Tor Rebate</span>}
                        </div>
                    </div>
                )}

                {/* Closing Costs Estimate / Renewal Note */}
                {!isRenewal ? (
                    <div className="bg-indigo-50 p-6 rounded-[2.5rem] border border-indigo-100 flex flex-col items-center text-center">
                        <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600 mb-3">
                            <CalculatorIcon size={24} />
                        </div>
                        <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">Est. Cash to Close</span>
                        <span className="text-2xl font-black text-indigo-900 mt-1">
                            ${(state.downPayment + ltt.totalTax + 2000).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span>
                        <p className="text-[9px] font-bold text-indigo-400 mt-1 uppercase leading-tight">Incl. Down Payment, LTT & $2k Legal/Fees</p>
                    </div>
                ) : (
                    <div className="bg-indigo-50 p-6 rounded-[2.5rem] border border-indigo-100 flex flex-col items-center text-center">
                        <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600 mb-3">
                            <RotateCcwIcon size={24} />
                        </div>
                        <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">Renewal Mode</span>
                        <span className="text-sm font-black text-indigo-900 mt-1">No LTT Applied</span>
                        <p className="text-[9px] font-bold text-indigo-400 mt-1 uppercase leading-tight">Switch to Purchase mode for closing cost estimates.</p>
                    </div>
                )}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Balance Chart */}
                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm min-h-[350px]">
                    <div className="flex justify-between items-center mb-6 ml-2">
                        <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Balance Over Time</h3>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex gap-3">
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> Remaining Balance</span>
                        </div>
                    </div>

                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={schedule} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
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
                                    formatter={(val) => `$${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                                    labelFormatter={(y) => `Year ${y}`}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="remainingBalance" 
                                    stroke="#6366f1" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorBalance)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Yearly Interest vs Principal Chart */}
                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm min-h-[350px]">
                    <div className="flex justify-between items-center mb-6 ml-2">
                        <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Yearly Composition</h3>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex gap-3">
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-400"></div> Interest</span>
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-400"></div> Principal</span>
                        </div>
                    </div>

                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={schedule.filter((_, i) => i % (amortizationYears > 20 ? 2 : 1) === 0)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                                    formatter={(val) => `$${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                                    labelFormatter={(y) => `Year ${y}`}
                                />
                                <Bar dataKey="yearlyInterest" stackId="a" fill="#fb7185" radius={[0, 0, 0, 0]} />
                                <Bar dataKey="yearlyPrincipal" stackId="a" fill="#34d399" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Amortization Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Complete Schedule</h3>
                    <CalculatorIcon size={20} className="text-slate-400" />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                <th className="px-6 py-4">Year</th>
                                <th className="px-6 py-4 text-center">Interest</th>
                                <th className="px-6 py-4 text-center">Principal</th>
                                <th className="px-6 py-4 text-right">Balance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-mono text-xs">
                            {schedule.map((row) => (
                                <tr key={row.year} className="hover:bg-indigo-50/30 transition-colors">
                                    <td className="px-6 py-4 font-bold text-slate-900">{row.year}</td>
                                    <td className="px-6 py-4 text-rose-500 text-center">${row.yearlyInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                    <td className="px-6 py-4 text-emerald-600 text-center">${row.yearlyPrincipal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                    <td className="px-6 py-4 font-bold text-slate-900 text-right">${row.remainingBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Disclaimer */}
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 flex gap-4 items-start">
                <InfoIcon size={20} className="text-slate-400 shrink-0 mt-0.5" />
                <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                    Disclaimer: This calculator is for informational purposes only. Actual mortgage rates, taxes, and fees may vary based on lender, credit score, and location. Land Transfer Tax estimates are based on current provincial and municipal rates but do not account for all possible exemptions or regional variations. Always consult with a mortgage professional or financial advisor before making real estate decisions.
                </p>
            </div>
        </div>
    );
};
