import React from 'react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer 
} from 'recharts';
import { AlertCircleIcon, TrendingUpIcon, PiggyBankIcon, GiftIcon, BarChart3Icon, GraduationCapIcon } from '../../../components/shared';

export const RESPResults = ({ results, showPayouts }) => {
    const { 
        totalProjected, 
        totalContributions, 
        totalGrants, 
        totalInterest, 
        childStats,
        yearlyBreakdown 
    } = results;

    const stats = [
        { 
            label: 'Projected Balance', 
            value: totalProjected, 
            icon: <TrendingUpIcon className="text-emerald-600" />,
            bg: 'bg-emerald-50',
            textColor: 'text-emerald-700'
        },
        { 
            label: 'Total Contributions', 
            value: totalContributions, 
            icon: <PiggyBankIcon className="text-blue-600" />,
            bg: 'bg-blue-50',
            textColor: 'text-blue-700'
        },
        { 
            label: 'Total Grants', 
            value: totalGrants, 
            icon: <GiftIcon className="text-indigo-600" />,
            bg: 'bg-indigo-50',
            textColor: 'text-indigo-700'
        },
        { 
            label: 'Interest Earned', 
            value: totalInterest, 
            icon: <BarChart3Icon className="text-amber-600" />,
            bg: 'bg-amber-50',
            textColor: 'text-amber-700'
        }
    ];

    const chartData = yearlyBreakdown.map(year => ({
        name: `Year ${year.year}`,
        Balance: Math.round(year.balance),
        Contributions: Math.round(yearlyBreakdown.slice(0, year.year).reduce((sum, y) => sum + y.contributions, 0)),
        Grants: Math.round(yearlyBreakdown.slice(0, year.year).reduce((sum, y) => sum + y.grants, 0))
    }));

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className={`${stat.bg} p-6 rounded-[2rem] border border-white/50 shadow-sm transition-transform hover:scale-[1.02]`}>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-white p-3 rounded-2xl shadow-sm">
                                {React.cloneElement(stat.icon, { size: 24 })}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{stat.label}</span>
                        </div>
                        <div className={`text-3xl font-black tracking-tight ${stat.textColor}`}>
                            ${stat.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Per-Child Grant Breakdown */}
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Per-Child Grant Room (Projected)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {childStats.map((child, i) => (
                        <div key={child.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="flex justify-between items-center mb-3">
                                <span className="font-bold text-slate-700 text-sm italic">Child {i + 1}</span>
                                <span className="text-[10px] font-black text-indigo-600 bg-white px-2 py-0.5 rounded-lg border border-indigo-100">
                                    Age {child.currentAge} → 18
                                </span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-500 font-medium">CESG (20% match)</span>
                                    <span className="font-bold text-slate-900">${Math.round(child.totalCESG).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-500 font-medium">CLB (Low-income)</span>
                                    <span className="font-bold text-slate-900">${Math.round(child.totalCLB).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-xs border-t border-slate-200 pt-2 mt-2">
                                    <span className="text-slate-700 font-black uppercase text-[10px]">Individual Total</span>
                                    <span className="font-black text-indigo-600">${Math.round(child.totalCESG + child.totalCLB + child.totalProvincial).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Growth Chart */}
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <div className="mb-8">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-1">Family Growth Projection</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Pooled growth until youngest child is 18</p>
                </div>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                                dy={10}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                                tickFormatter={(val) => `$${val/1000}k`}
                            />
                            <RechartsTooltip 
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ fontSize: '12px', fontWeight: 900 }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="Balance" 
                                stroke="#10b981" 
                                strokeWidth={4}
                                fillOpacity={1} 
                                fill="url(#colorBalance)" 
                                name="Total Balance"
                            />
                            <Area 
                                type="monotone" 
                                dataKey="Contributions" 
                                stroke="#3b82f6" 
                                strokeWidth={2}
                                fillOpacity={0} 
                                name="Personal Deposits"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Payout Simulation */}
            {showPayouts && (
                <div className="bg-emerald-900 p-8 rounded-[2.5rem] border border-emerald-800 shadow-2xl text-white space-y-6 animate-slide-up">
                    <div className="flex items-center gap-4">
                        <div className="bg-emerald-800 p-3 rounded-2xl">
                            <GraduationCapIcon size={32} className="text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black uppercase tracking-tight italic">Estimated Payouts</h3>
                            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Available School Funds at Age 18</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-emerald-800">
                        {childStats.map((child, i) => {
                            // Simple split logic: Grants stay with child (up to $7.2k limit check if pooled)
                            // In a family plan, you can share grants but there's a $7.2k limit PER beneficiary.
                            // Interest and contributions are shared.
                            const perChildGrants = child.totalCESG + child.totalCLB + child.totalProvincial;
                            const shareOfPooled = (totalProjected - totalGrants) / childStats.length;
                            const totalAvailable = shareOfPooled + perChildGrants;

                            return (
                                <div key={child.id} className="bg-emerald-800/30 p-5 rounded-3xl border border-emerald-700/50">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-xs font-black uppercase tracking-widest text-emerald-300">Child {i + 1}</span>
                                        <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                    </div>
                                    <div className="text-4xl font-black tracking-tighter mb-1">
                                        ${Math.round(totalAvailable).toLocaleString()}
                                    </div>
                                    <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                                        Includes ${Math.round(perChildGrants).toLocaleString()} in direct grants
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                    <div className="bg-emerald-800/50 p-4 rounded-2xl flex gap-3 items-start border border-emerald-700">
                        <AlertCircleIcon size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-emerald-200 leading-relaxed font-medium">
                            <strong>Note:</strong> In Family RESPs, contributions and growth can be shared. However, government grants have a lifetime use limit of <strong>$7,200</strong> per child.
                        </p>
                    </div>
                </div>
            )}

            {/* Breakdown Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Projection Table</h3>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pooled Family Growth</div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Year</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Contribution</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Grants</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Balance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {yearlyBreakdown.map((row) => (
                                <tr key={row.year} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-900">Year {row.year}</span>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase">Ages: {row.childAges.join(', ')}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-sm font-medium text-slate-600">${Math.round(row.contributions).toLocaleString()}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-sm font-bold text-indigo-600">+${Math.round(row.grants).toLocaleString()}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-sm font-black text-slate-900">${Math.round(row.balance).toLocaleString()}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
