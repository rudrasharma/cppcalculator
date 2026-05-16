import React from 'react';

export const SmithMetrics = ({ lastResult, totalAdvantage, currency }) => {
    return (
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
    );
};
