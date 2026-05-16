import React from 'react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

export const SmithCharts = ({ results, amortizationYears, currency }) => {
    return (
        <div className="space-y-8">
            {/* Net Worth Projection */}
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
                                ticks={Array.from({length: Math.ceil(amortizationYears) + 1}, (_, i) => i * 12)}
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

            {/* Debt Conversion Chart */}
            <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="mb-8">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Debt Conversion</h2>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Non-Deductible vs Deductible Debt</p>
                </div>

                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height={300} minWidth={0}>
                        <AreaChart data={results} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorMortgage" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorHeloc" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                                dataKey="month" 
                                tickFormatter={(val) => `Yr ${val / 12}`}
                                ticks={Array.from({length: Math.ceil(amortizationYears) + 1}, (_, i) => i * 12)}
                                fontSize={10}
                                fontWeight="bold"
                                stroke="#94a3b8"
                            />
                            <YAxis 
                                tickFormatter={(val) => `$${(val / 1000).toFixed(0)}K`}
                                fontSize={10}
                                fontWeight="bold"
                                stroke="#94a3b8"
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip 
                                isAnimationActive={false}
                                formatter={(val) => [currency.format(val), '']}
                                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                            />
                            <Legend verticalAlign="top" align="right" iconType="circle" />
                            <Area 
                                name="Mortgage (Non-Deductible)"
                                type="monotone" 
                                dataKey="smithMortgageBalance" 
                                stroke="#ef4444" 
                                strokeWidth={3}
                                fillOpacity={0.1} 
                                fill="#ef4444" 
                            />
                            <Area 
                                name="HELOC (Tax-Deductible)"
                                type="monotone" 
                                dataKey="smithHelocBalance" 
                                stroke="#10b981" 
                                strokeWidth={3}
                                fillOpacity={0.1} 
                                fill="#10b981" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
