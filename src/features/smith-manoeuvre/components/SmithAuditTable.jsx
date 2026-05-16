import React from 'react';

export const SmithAuditTable = ({ annualData, currency, handleExportCSV }) => {
    return (
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
    );
};
