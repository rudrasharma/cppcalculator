import React, { useState } from 'react';
import { 
    AreaChart, Area, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer 
} from 'recharts';

export const PlannerCharts = ({ results, state, isMonteCarlo, setIsMonteCarlo, isCalculatingMC, monteCarloResults }) => {
    const [chartMode, setChartMode] = useState('balances'); // 'balances' or 'income'
    const [isReal, setIsReal] = useState(true);
    
    if (!results || !results.history || results.history.length === 0) return null;

    const inflation = state?.inflation || 0.021;
    const baseAge = state?.currentAge || state?.startAge || results.history[0]?.age || 40;

    const formatYAxis = (value) => {
        if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
        return `$${value}`;
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 border border-slate-200 shadow-xl rounded-xl z-50">
                    <p className="font-semibold text-slate-800 mb-2 border-b pb-2">Age {label} {isReal && <span className="text-xs font-normal text-slate-500 ml-1">($ Today)</span>}</p>
                    {payload.map((entry, index) => (
                        <div key={index} className="flex justify-between items-center gap-6 mb-1 text-sm">
                            <span style={{ color: entry.color }} className="font-medium">{entry.name}</span>
                            <span className="text-slate-700 font-semibold">
                                ${Math.round(entry.value).toLocaleString()}
                            </span>
                        </div>
                    ))}
                    {chartMode === 'income' && payload.length > 0 && payload[0].payload && payload[0].payload.clawback > 0 && (
                        <div className="mt-2 pt-2 border-t text-sm font-semibold flex justify-between">
                            <span className="text-slate-500">OAS Clawback Tax</span>
                            <span className="text-rose-600">
                                -${Math.round(payload[0].payload.clawback).toLocaleString()}
                            </span>
                        </div>
                    )}
                    {chartMode === 'income' && payload.length > 0 && payload[0].payload && payload[0].payload.targetIncome > 0 && (
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

    const chartData = results.history.map(h => {
        const yearsDiff = Math.max(0, h.age - baseAge);
        const discountFactor = isReal ? Math.pow(1 + inflation, yearsDiff) : 1;

        return {
            age: h.age,
            // Balances
            tfsa: (h.balances.tfsa || 0) / discountFactor,
            rrsp: (h.balances.rrsp || 0) / discountFactor,
            nonReg: (h.balances.nonReg || 0) / discountFactor,
            lira: (h.balances.lira || 0) / discountFactor,
            // Incomes
            workingIncome: (h.incomes.workingIncome || 0) / discountFactor,
            pension: (h.incomes.pension || 0) / discountFactor,
            cpp: (h.incomes.cpp || 0) / discountFactor,
            oas: (h.incomes.oas || 0) / discountFactor,
            gis: (h.incomes.gis || 0) / discountFactor,
            withdrawTFSA: (h.incomes.tfsa || 0) / discountFactor,
            withdrawRRSP: ((h.incomes.rrsp || 0) + (h.incomes.lira || 0)) / discountFactor,
            withdrawNonReg: (h.incomes.nonReg || 0) / discountFactor,
            shortfall: (h.shortfall || 0) / discountFactor,
            clawback: (h.clawback || 0) / discountFactor,
            targetIncome: (h.targetIncome || 0) / discountFactor,
            netCash: (h.netCash || 0) / discountFactor
        };
    });

    const mcData = isMonteCarlo && monteCarloResults?.percentiles ? monteCarloResults.percentiles.map(p => {
        const yearsDiff = Math.max(0, p.age - baseAge);
        const discountFactor = isReal ? Math.pow(1 + inflation, yearsDiff) : 1;
        return {
            age: p.age,
            band: [Math.max(0, p.p10) / discountFactor, Math.max(0, p.p90) / discountFactor],
            p50: Math.max(0, p.p50) / discountFactor,
        };
    }) : [];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6 flex flex-col relative">
            {isCalculatingMC && (
                <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-semibold shadow-sm border border-indigo-100 z-10 animate-pulse">
                    <svg className="animate-spin h-3 w-3 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Running Monte Carlo...
                </div>
            )}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-slate-800">Projections</h3>
                    <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200/60">
                        <button 
                            onClick={() => setIsReal(true)}
                            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${isReal ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Real ($ Today)
                        </button>
                        <button 
                            onClick={() => setIsReal(false)}
                            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${!isReal ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Nominal
                        </button>
                    </div>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-xl items-center">
                    <label className="flex items-center gap-2 pr-3 pl-2 border-r border-slate-300/50 cursor-pointer">
                        <div className="relative inline-block w-8 h-4">
                            <input 
                                type="checkbox" 
                                className="opacity-0 w-0 h-0 peer" 
                                checked={isMonteCarlo}
                                onChange={(e) => setIsMonteCarlo(e.target.checked)}
                            />
                            <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-slate-300 rounded-full transition-colors peer-checked:bg-indigo-500"></span>
                            <span className="absolute left-[2px] bottom-[2px] bg-white w-3 h-3 rounded-full transition-transform peer-checked:translate-x-4"></span>
                        </div>
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Monte Carlo</span>
                    </label>
                    <button 
                        onClick={() => setChartMode('balances')}
                        className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ml-1 ${chartMode === 'balances' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-600 hover:text-slate-900'}`}
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

            <div className="w-full h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    {chartMode === 'balances' ? (
                        isMonteCarlo ? (
                            <ComposedChart data={mcData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorBand" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0.05}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="age" tick={{fill: '#64748b'}} tickLine={false} axisLine={false} />
                                <YAxis tickFormatter={formatYAxis} tick={{fill: '#64748b'}} tickLine={false} axisLine={false} width={60} />
                                <RechartsTooltip 
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-white p-4 border border-slate-200 shadow-xl rounded-xl z-50">
                                                    <p className="font-semibold text-slate-800 mb-2 border-b pb-2">Age {label}</p>
                                                    <div className="flex justify-between items-center gap-6 mb-1 text-sm text-emerald-600">
                                                        <span>Great Market (90th)</span>
                                                        <span className="font-semibold">${Math.round(payload.find(p => p.dataKey === 'band').value[1]).toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center gap-6 mb-1 text-sm text-indigo-600">
                                                        <span>Median (50th)</span>
                                                        <span className="font-bold">${Math.round(payload.find(p => p.dataKey === 'p50').value).toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center gap-6 mb-1 text-sm text-rose-600">
                                                        <span>Poor Market (10th)</span>
                                                        <span className="font-semibold">${Math.round(payload.find(p => p.dataKey === 'band').value[0]).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }} 
                                />
                                <Legend iconType="circle" verticalAlign="bottom" height={36} payload={[
                                    { value: 'Median Portfolio', type: 'line', color: '#4f46e5' },
                                    { value: 'Confidence Band (10th - 90th)', type: 'rect', color: '#818cf8' }
                                ]}/>
                                
                                <Area type="monotone" dataKey="band" name="Confidence Band" stroke="none" fill="url(#colorBand)" />
                                <Line type="monotone" dataKey="p50" name="Median Portfolio" stroke="#4f46e5" strokeWidth={3} dot={false} />
                            </ComposedChart>
                        ) : (
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
                                <Legend iconType="circle" verticalAlign="bottom" height={36} />
                                
                                <Area type="monotone" dataKey="nonReg" name="Non-Registered" stackId="1" stroke="#f59e0b" fill="url(#colorNonReg)" strokeWidth={2} />
                                <Area type="monotone" dataKey="lira" name="LIRA" stackId="1" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.2} strokeWidth={2} />
                                <Area type="monotone" dataKey="rrsp" name="RRSP" stackId="1" stroke="#4f46e5" fill="url(#colorRRSP)" strokeWidth={2} />
                                <Area type="monotone" dataKey="tfsa" name="TFSA" stackId="1" stroke="#10b981" fill="url(#colorTFSA)" strokeWidth={2} />
                            </AreaChart>
                        )
                    ) : (
                        <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="age" tick={{fill: '#64748b'}} tickLine={false} axisLine={false} />
                            <YAxis tickFormatter={formatYAxis} tick={{fill: '#64748b'}} tickLine={false} axisLine={false} width={60} />
                            <RechartsTooltip content={<CustomTooltip />} />
                            <Legend iconType="circle" verticalAlign="bottom" height={36} />
                            
                            <Bar dataKey="workingIncome" name="Working Income (Net)" stackId="a" fill="#3b82f6" />
                            <Bar dataKey="cpp" name="CPP (Gross)" stackId="a" fill="#6366f1" />
                            <Bar dataKey="oas" name="OAS (Gross)" stackId="a" fill="#8b5cf6" />
                            <Bar dataKey="gis" name="GIS (Net)" stackId="a" fill="#db2777" />
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
