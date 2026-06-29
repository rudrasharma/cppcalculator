import React, { useState } from 'react';
import { 
    AreaChart, Area, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer 
} from 'recharts';

export const PlannerCharts = ({ results }) => {
    const [chartMode, setChartMode] = useState('balances'); // 'balances' or 'income'
    
    if (!results || !results.history || results.history.length === 0) return null;

    const formatYAxis = (value) => {
        if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
        return `$${value}`;
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 border border-slate-200 shadow-xl rounded-xl">
                    <p className="font-semibold text-slate-800 mb-2 border-b pb-2">Age {label}</p>
                    {payload.map((entry, index) => (
                        <div key={index} className="flex justify-between items-center gap-6 mb-1 text-sm">
                            <span style={{ color: entry.color }} className="font-medium">{entry.name}</span>
                            <span className="text-slate-700 font-semibold">
                                ${Math.round(entry.value).toLocaleString()}
                            </span>
                        </div>
                    ))}
                    {chartMode === 'income' && payload.length > 0 && payload[0].payload && (
                        <div className="mt-2 pt-2 border-t text-sm font-semibold flex justify-between">
                            <span className="text-slate-500">Shortfall</span>
                            <span className={payload[0].payload.shortfall > 10 ? 'text-rose-600' : 'text-emerald-600'}>
                                ${Math.round(payload[0].payload.shortfall).toLocaleString()}
                            </span>
                        </div>
                    )}
                </div>
            );
        }
        return null;
    };

    const chartData = results.history.map(h => ({
        age: h.age,
        // Balances
        tfsa: h.balances.tfsa,
        rrsp: h.balances.rrsp,
        nonReg: h.balances.nonReg,
        lira: h.balances.lira,
        // Incomes
        pension: h.incomes.pension,
        cpp: h.incomes.cpp,
        oas: h.incomes.oas,
        withdrawTFSA: h.incomes.tfsa,
        withdrawRRSP: (h.incomes.rrsp || 0) + (h.incomes.lira || 0),
        withdrawNonReg: h.incomes.nonReg,
        shortfall: h.shortfall,
        targetIncome: h.targetIncome,
        netCash: h.netCash
    }));

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-slate-800">Projections</h3>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button 
                        onClick={() => setChartMode('balances')}
                        className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${chartMode === 'balances' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                        Portfolio Value
                    </button>
                    <button 
                        onClick={() => setChartMode('income')}
                        className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${chartMode === 'income' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                        Income Sources
                    </button>
                </div>
            </div>

            <div className="flex-1 min-h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    {chartMode === 'balances' ? (
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRRSP" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorTFSA" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorNonReg" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="age" tick={{fill: '#64748b'}} tickLine={false} axisLine={false} />
                            <YAxis tickFormatter={formatYAxis} tick={{fill: '#64748b'}} tickLine={false} axisLine={false} width={60} />
                            <RechartsTooltip content={<CustomTooltip />} />
                            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                            
                            <Area type="monotone" dataKey="nonReg" name="Non-Registered" stackId="1" stroke="#f59e0b" fill="url(#colorNonReg)" strokeWidth={2} />
                            <Area type="monotone" dataKey="lira" name="LIRA" stackId="1" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.2} strokeWidth={2} />
                            <Area type="monotone" dataKey="rrsp" name="RRSP" stackId="1" stroke="#4f46e5" fill="url(#colorRRSP)" strokeWidth={2} />
                            <Area type="monotone" dataKey="tfsa" name="TFSA" stackId="1" stroke="#10b981" fill="url(#colorTFSA)" strokeWidth={2} />
                        </AreaChart>
                    ) : (
                        <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="age" tick={{fill: '#64748b'}} tickLine={false} axisLine={false} />
                            <YAxis tickFormatter={formatYAxis} tick={{fill: '#64748b'}} tickLine={false} axisLine={false} width={60} />
                            <RechartsTooltip content={<CustomTooltip />} />
                            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                            
                            <Bar dataKey="cpp" name="CPP (Gross)" stackId="a" fill="#6366f1" />
                            <Bar dataKey="oas" name="OAS (Gross)" stackId="a" fill="#8b5cf6" />
                            <Bar dataKey="pension" name="Pension (Gross)" stackId="a" fill="#0ea5e9" />
                            <Bar dataKey="withdrawNonReg" name="Non-Reg (Gross)" stackId="a" fill="#f59e0b" />
                            <Bar dataKey="withdrawRRSP" name="RRSP/LIRA (Gross)" stackId="a" fill="#ec4899" />
                            <Bar dataKey="withdrawTFSA" name="TFSA (Gross)" stackId="a" fill="#10b981" />

                            <Line type="monotone" dataKey="targetIncome" name="Target Income (Net)" stroke="#0f172a" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                            <Line type="monotone" dataKey="netCash" name="Actual Income (Net)" stroke="#10b981" strokeWidth={3} dot={false} />
                        </ComposedChart>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    );
};
