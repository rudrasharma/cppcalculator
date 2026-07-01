import React, { useMemo, useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { TrashIcon } from '../../../components/shared/Icons';

// Extended categories for the dropdown
const CATEGORIES = [
    "Housing", "Food & Groceries", "Dining Out", "Transportation", 
    "Utilities", "Recreational", "Income", "Healthcare", "Shopping", "Internal Transfer", "Other"
];

export default function BudgetDashboard({ data, onReset }) {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [localData, setLocalData] = useState({ transactions: [], insights: [] });
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

    // Initialize localData once when data prop arrives
    useEffect(() => {
        if (data && data.transactions) {
            setLocalData({
                transactions: [...data.transactions],
                insights: data.insights || []
            });
        }
    }, [data]);

    // Recalculate totals dynamically
    const computedTotals = useMemo(() => {
        let income = 0;
        let expenses = 0;
        localData.transactions.forEach(t => {
            if (t.category === 'Internal Transfer') return; // Ignore transfers to prevent double counting
            
            if (t.amount > 0) expenses += t.amount;
            else income += Math.abs(t.amount); // amount might be negative for income
        });
        return { income, expenses };
    }, [localData.transactions]);

    // Group transactions by category to feed the Pie chart
    const categoryData = useMemo(() => {
        const groups = {};
        localData.transactions.forEach(t => {
            if (t.category === 'Internal Transfer') return; // Hide from donut chart
            
            if (t.amount > 0) { // Only graph expenses for the donut
                if (!groups[t.category]) groups[t.category] = 0;
                groups[t.category] += t.amount;
            }
        });
        
        return Object.keys(groups)
            .map(key => ({ name: key, value: groups[key] }))
            .sort((a, b) => b.value - a.value); // sort largest to smallest
    }, [localData.transactions]);

    // Group transactions by date for the timeline
    const timelineData = useMemo(() => {
        const groups = {};
        let filtered = localData.transactions.filter(t => t.category !== 'Internal Transfer' && t.amount > 0);
        if (selectedCategory) filtered = filtered.filter(t => t.category === selectedCategory);
        
        filtered.forEach(t => {
            if (!groups[t.date]) groups[t.date] = 0;
            groups[t.date] += t.amount;
        });
        return Object.keys(groups)
            .map(date => ({ date, amount: groups[date] }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [localData.transactions, selectedCategory]);

    // Group transactions by merchant for the leaderboard
    const merchantData = useMemo(() => {
        const groups = {};
        let filtered = localData.transactions.filter(t => t.category !== 'Internal Transfer' && t.amount > 0);
        if (selectedCategory) filtered = filtered.filter(t => t.category === selectedCategory);

        filtered.forEach(t => {
            if (!groups[t.cleanName]) groups[t.cleanName] = 0;
            groups[t.cleanName] += t.amount;
        });
        return Object.keys(groups)
            .map(name => ({ name, amount: groups[name] }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5);
    }, [localData.transactions, selectedCategory]);

    const COLORS = ['#6366f1', '#14b8a6', '#f43f5e', '#f59e0b', '#8b5cf6', '#0ea5e9', '#10b981', '#64748b', '#ec4899', '#6b7280'];

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(val);
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortedAndFilteredTransactions = () => {
        let filtered = localData.transactions;
        
        if (selectedCategory) {
            filtered = filtered.filter(t => t.category === selectedCategory);
        }

        return filtered.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    };

    const updateCategory = (index, newCategory) => {
        const updated = [...localData.transactions];
        updated[index].category = newCategory;
        setLocalData({ ...localData, transactions: updated });
    };

    const deleteTransaction = (index) => {
        const updated = [...localData.transactions];
        updated.splice(index, 1);
        setLocalData({ ...localData, transactions: updated });
    };

    const exportToCSV = () => {
        const headers = ["Date", "Merchant", "Category", "Amount"];
        const rows = localData.transactions.map(t => [
            t.date, 
            `"${t.cleanName.replace(/"/g, '""')}"`, // escape quotes
            t.category, 
            t.amount
        ]);
        
        const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "budget_analysis.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!data) return null;

    const displayedTransactions = getSortedAndFilteredTransactions();

    const SortIcon = ({ active, direction }) => {
        if (!active) return <span className="ml-1 text-slate-300 opacity-50">⇅</span>;
        return <span className="ml-1 text-indigo-500">{direction === 'asc' ? '↑' : '↓'}</span>;
    };

    return (
        <div className="animate-fade-in w-full pb-12">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">AI Budget Analysis</h2>
                    <p className="text-slate-500 font-medium">Your spending categorized and optimized.</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={exportToCSV}
                        className="px-5 py-2 rounded-full text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        Export CSV
                    </button>
                    <button 
                        onClick={onReset}
                        className="px-5 py-2 rounded-full text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm"
                    >
                        Analyze Another
                    </button>
                </div>
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
                    
                    <div className="mt-4 space-y-1">
                        {categoryData.map((cat, i) => (
                            <div 
                                key={cat.name} 
                                onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
                                className={`flex justify-between text-sm p-2 rounded-xl cursor-pointer transition-colors ${selectedCategory === cat.name ? 'bg-indigo-50 shadow-sm' : 'hover:bg-slate-50'}`}
                            >
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                                    <span className={`font-medium ${selectedCategory === cat.name ? 'text-indigo-700 font-bold' : 'text-slate-600'}`}>{cat.name}</span>
                                </div>
                                <span className="font-bold text-slate-900">{formatCurrency(cat.value)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI INSIGHTS */}
                <div className="lg:col-span-2">
                    <div className="bg-white border border-slate-200 rounded-3xl p-8 text-slate-800 h-full relative overflow-hidden shadow-sm">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                        
                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="font-black text-xl text-slate-900">AI Optimization Insights</h3>
                        </div>

                        <div className="space-y-4 relative z-10">
                            {localData.insights && localData.insights.length > 0 ? (
                                localData.insights.map((insight, idx) => (
                                    <div key={idx} className="bg-slate-50 border border-slate-100 rounded-2xl p-5 hover:bg-slate-100 transition-colors">
                                        <p className="leading-relaxed font-medium text-slate-700">{insight}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-500">No specific insights generated for this period.</p>
                            )}
                        </div>
                        
                        <div className="mt-8 flex gap-6 border-t border-slate-200 pt-6 relative z-10">
                            <div>
                                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Total Expenses</div>
                                <div className="text-2xl font-black text-slate-900">{formatCurrency(computedTotals.expenses)}</div>
                            </div>
                            <div>
                                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Total Income</div>
                                <div className="text-2xl font-black text-slate-900">{formatCurrency(computedTotals.income)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ADDITIONAL VISUALIZATIONS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* TIMELINE CHART */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Daily Spending Timeline
                    </h3>
                    {timelineData.length > 0 ? (
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis 
                                        dataKey="date" 
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(str) => {
                                            const parts = str.split('-');
                                            return `${parts[1]}/${parts[2]}`;
                                        }}
                                    />
                                    <YAxis 
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(val) => `$${val}`}
                                    />
                                    <Tooltip 
                                        formatter={(value) => formatCurrency(value)}
                                        labelStyle={{ color: '#64748b', fontWeight: 'bold', marginBottom: '4px' }}
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-slate-400 text-sm font-medium">
                            No timeline data available.
                        </div>
                    )}
                </div>

                {/* MERCHANTS CHART */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        Top Merchants
                    </h3>
                    {merchantData.length > 0 ? (
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={merchantData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                    <XAxis type="number" hide />
                                    <YAxis 
                                        dataKey="name" 
                                        type="category" 
                                        axisLine={false} 
                                        tickLine={false}
                                        width={120}
                                        tick={{ fill: '#64748b', fontSize: 12, fontWeight: 'bold' }}
                                    />
                                    <Tooltip 
                                        formatter={(value) => formatCurrency(value)}
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Bar dataKey="amount" fill="#f43f5e" radius={[0, 4, 4, 0]} barSize={24} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-slate-400 text-sm font-medium">
                            No merchant data available.
                        </div>
                    )}
                </div>
            </div>

            {/* TRANSACTIONS TABLE */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="px-8 py-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <h3 className="font-black text-slate-800 flex items-center gap-2">
                        Extracted Transactions
                        {selectedCategory && (
                            <span className="text-sm font-bold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full">
                                Filter: {selectedCategory}
                                <button 
                                    onClick={() => setSelectedCategory(null)}
                                    className="ml-2 text-indigo-400 hover:text-indigo-600 font-bold"
                                >
                                    &times;
                                </button>
                            </span>
                        )}
                    </h3>
                    <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full uppercase tracking-wide">
                        {displayedTransactions.length} ITEMS
                    </span>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b border-slate-100 text-xs uppercase tracking-wider font-black text-slate-400 cursor-pointer select-none">
                                <th className="p-4 pl-8 hover:bg-slate-50 transition-colors" onClick={() => handleSort('date')}>
                                    Date <SortIcon active={sortConfig.key === 'date'} direction={sortConfig.direction} />
                                </th>
                                <th className="p-4 hover:bg-slate-50 transition-colors" onClick={() => handleSort('cleanName')}>
                                    Merchant <SortIcon active={sortConfig.key === 'cleanName'} direction={sortConfig.direction} />
                                </th>
                                <th className="p-4 hover:bg-slate-50 transition-colors" onClick={() => handleSort('category')}>
                                    Category <SortIcon active={sortConfig.key === 'category'} direction={sortConfig.direction} />
                                </th>
                                <th className="p-4 text-right hover:bg-slate-50 transition-colors" onClick={() => handleSort('amount')}>
                                    Amount <SortIcon active={sortConfig.key === 'amount'} direction={sortConfig.direction} />
                                </th>
                                <th className="p-4 pr-8 text-center w-12"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {displayedTransactions.map((tx) => {
                                // Find original index for mutations
                                const originalIndex = localData.transactions.indexOf(tx);
                                
                                return (
                                    <tr key={originalIndex} className="hover:bg-slate-50 transition-colors group">
                                        <td className="p-4 pl-8 text-sm text-slate-500 whitespace-nowrap">{tx.date}</td>
                                        <td className="p-4 text-sm font-bold text-slate-800">{tx.cleanName}</td>
                                        <td className="p-4">
                                            <select
                                                value={tx.category}
                                                onChange={(e) => updateCategory(originalIndex, e.target.value)}
                                                className="bg-slate-100 text-slate-700 text-xs font-bold rounded-lg px-2 py-1.5 border-none outline-none focus:ring-2 focus:ring-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 transition-colors cursor-pointer appearance-none"
                                            >
                                                {!CATEGORIES.includes(tx.category) && (
                                                    <option value={tx.category}>{tx.category}</option>
                                                )}
                                                {CATEGORIES.map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="p-4 text-sm font-black text-slate-900 text-right">
                                            {formatCurrency(tx.amount)}
                                        </td>
                                        <td className="p-4 pr-8 text-right">
                                            <button 
                                                onClick={() => deleteTransaction(originalIndex)}
                                                className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                title="Delete transaction"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
