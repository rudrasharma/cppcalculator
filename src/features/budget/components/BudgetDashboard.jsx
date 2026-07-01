import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export default function BudgetDashboard({ data, onReset }) {
    
    // Group transactions by category to feed the Pie chart
    const categoryData = useMemo(() => {
        if (!data || !data.transactions) return [];
        const groups = {};
        
        data.transactions.forEach(t => {
            if (t.amount > 0) { // Only graph expenses for the donut
                if (!groups[t.category]) groups[t.category] = 0;
                groups[t.category] += t.amount;
            }
        });
        
        return Object.keys(groups)
            .map(key => ({ name: key, value: groups[key] }))
            .sort((a, b) => b.value - a.value); // sort largest to smallest
    }, [data]);

    const COLORS = ['#6366f1', '#14b8a6', '#f43f5e', '#f59e0b', '#8b5cf6', '#0ea5e9', '#10b981', '#64748b'];

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(val);
    };

    if (!data) return null;

    return (
        <div className="animate-fade-in w-full pb-12">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">AI Budget Analysis</h2>
                    <p className="text-slate-500 font-medium">Your spending categorized and optimized.</p>
                </div>
                <button 
                    onClick={onReset}
                    className="px-5 py-2 rounded-full text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                    Analyze Another
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                
                {/* DONUT CHART */}
                <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                        Spending Breakdown
                    </h3>
                    
                    {categoryData.length > 0 ? (
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        formatter={(value) => formatCurrency(value)}
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-slate-400 text-sm font-medium">
                            No expenses found.
                        </div>
                    )}
                    
                    <div className="mt-4 space-y-2">
                        {categoryData.map((cat, i) => (
                            <div key={cat.name} className="flex justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                                    <span className="font-medium text-slate-600">{cat.name}</span>
                                </div>
                                <span className="font-bold text-slate-900">{formatCurrency(cat.value)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI INSIGHTS */}
                <div className="lg:col-span-2">
                    <div className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl p-8 text-white h-full relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                        
                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="font-black text-xl">AI Optimization Insights</h3>
                        </div>

                        <div className="space-y-4 relative z-10">
                            {data.insights && data.insights.length > 0 ? (
                                data.insights.map((insight, idx) => (
                                    <div key={idx} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 hover:bg-white/15 transition-colors">
                                        <p className="leading-relaxed font-medium text-indigo-50">{insight}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-indigo-200">No specific insights generated for this period.</p>
                            )}
                        </div>
                        
                        <div className="mt-8 flex gap-6 border-t border-white/20 pt-6 relative z-10">
                            <div>
                                <div className="text-xs font-bold uppercase tracking-wider text-indigo-200 mb-1">Total Expenses</div>
                                <div className="text-2xl font-black text-white">{formatCurrency(data.totals?.expenses || 0)}</div>
                            </div>
                            <div>
                                <div className="text-xs font-bold uppercase tracking-wider text-indigo-200 mb-1">Total Income</div>
                                <div className="text-2xl font-black text-white">{formatCurrency(data.totals?.income || 0)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* TRANSACTIONS TABLE */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="px-8 py-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <h3 className="font-black text-slate-800">Extracted Transactions</h3>
                    <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full uppercase tracking-wide">
                        {data.transactions?.length || 0} ITEMS
                    </span>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b border-slate-100 text-xs uppercase tracking-wider font-black text-slate-400">
                                <th className="p-4 pl-8">Date</th>
                                <th className="p-4">Merchant / Description</th>
                                <th className="p-4">Category</th>
                                <th className="p-4 pr-8 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.transactions && data.transactions.map((tx, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                                    <td className="p-4 pl-8 text-sm text-slate-500 whitespace-nowrap">{tx.date}</td>
                                    <td className="p-4 text-sm font-bold text-slate-800">{tx.cleanName}</td>
                                    <td className="p-4">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-700 transition-colors">
                                            {tx.category}
                                        </span>
                                    </td>
                                    <td className="p-4 pr-8 text-sm font-black text-slate-900 text-right">
                                        {formatCurrency(tx.amount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
