import React from 'react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer 
} from 'recharts';
import { 
    TrendingUpIcon, 
    CalendarIcon, 
    CalculatorIcon,
    InfoIcon,
    ArrowRightIcon,
} from '../../../components/shared';

export const MortgageResults = ({ results, state }) => {
    const { monthlyPayment, totalInterest, totalCost, yearsToPayOff, schedule, savings } = results;
    const { amortizationYears, paymentFrequency } = state;

    const formattedPayment = monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const formattedInterest = totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 });
    const formattedCost = totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 });

    const timeSavedYears = Math.floor(savings.time);
    const timeSavedMonths = Math.round((savings.time - timeSavedYears) * 12);

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

                    <div className="mt-6 flex flex-wrap justify-center gap-4">
                        <div className="bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-sm border border-white/5 flex flex-col items-center">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Interest</span>
                            <span className="text-lg font-bold font-mono text-white">${formattedInterest}</span>
                        </div>
                        <div className="bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-sm border border-white/5 flex flex-col items-center">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Cost</span>
                            <span className="text-lg font-bold font-mono text-white">${formattedCost}</span>
                        </div>
                        <div className="bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-sm border border-white/5 flex flex-col items-center">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payoff Time</span>
                            <span className="text-lg font-bold font-mono text-white">
                                {Math.floor(yearsToPayOff)}yr {Math.round((yearsToPayOff % 1) * 12)}mo
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Savings Cards */}
            {(savings.interest > 1 || savings.time > 0.01) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100 flex flex-col items-center text-center">
                        <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600 mb-3">
                            <TrendingUpIcon size={24} />
                        </div>
                        <span className="text-xs font-black text-emerald-700 uppercase tracking-tighter">Interest Saved</span>
                        <span className="text-2xl font-black text-emerald-900 mt-1">${savings.interest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100 flex flex-col items-center text-center">
                        <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600 mb-3">
                            <CalendarIcon size={24} />
                        </div>
                        <span className="text-xs font-black text-indigo-700 uppercase tracking-tighter">Time Saved</span>
                        <span className="text-2xl font-black text-indigo-900 mt-1">
                            {timeSavedYears > 0 && `${timeSavedYears}yr `}
                            {timeSavedMonths > 0 && `${timeSavedMonths}mo`}
                            {timeSavedYears === 0 && timeSavedMonths === 0 && '0 mo'}
                        </span>
                    </div>
                </div>
            )}

            {/* Chart Section */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex-1 min-h-[350px]">
                <div className="flex justify-between items-center mb-6 ml-2">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Mortgage Paydown</h3>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex gap-3">
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> Balance</span>
                    </div>
                </div>

                <div className="h-[300px] w-full">
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
                                label={{ value: 'Years', position: 'insideBottomRight', offset: -5, fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
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
                                name="Balance"
                                stroke="#6366f1" 
                                strokeWidth={3}
                                fillOpacity={1} 
                                fill="url(#colorBalance)" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Amortization Table */}
            <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Yearly Schedule</h3>
                    <CalculatorIcon size={20} className="text-slate-400" />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                <th className="px-6 py-4">Year</th>
                                <th className="px-6 py-4">Interest Paid</th>
                                <th className="px-6 py-4">Principal Paid</th>
                                <th className="px-6 py-4">Balance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-mono text-xs">
                            {schedule.filter((_, i) => i % (amortizationYears > 30 ? 2 : 1) === 0 || i === schedule.length - 1).map((row) => (
                                <tr key={row.year} className="hover:bg-indigo-50/30 transition-colors">
                                    <td className="px-6 py-4 font-bold text-slate-900">{row.year}</td>
                                    <td className="px-6 py-4 text-rose-500">${row.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                    <td className="px-6 py-4 text-emerald-600">${row.totalPrincipal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                    <td className="px-6 py-4 font-bold text-slate-900">${row.remainingBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
