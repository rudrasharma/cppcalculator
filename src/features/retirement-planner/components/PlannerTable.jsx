import React, { useState } from 'react';

const formatMoney = (val) => {
    return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(val || 0);
};

export const PlannerTable = ({ results, state }) => {
    const [isReal, setIsReal] = useState(true);
    const [activeView, setActiveView] = useState('overview'); // overview, accounts, income
    const inflation = parseFloat(state.inflation) || 0;
    const baseAge = results?.history?.length > 0 ? results.history[0].age : 0;

    if (!results || !results.history) return null;

    const tableData = results.history.map(h => {
        const yearsDiff = Math.max(0, h.age - baseAge);
        const discountFactor = isReal ? Math.pow(1 + inflation, yearsDiff) : 1;
        
        return {
            age: h.age,
            tfsaBal: (h.balances.tfsa || 0) / discountFactor,
            rrspBal: ((h.balances.rrsp || 0) + (h.balances.lira || 0)) / discountFactor,
            nonRegBal: (h.balances.nonReg || 0) / discountFactor,
            
            workingIncome: (h.incomes.workingIncome || 0) / discountFactor,
            pension: (h.incomes.pension || 0) / discountFactor,
            cpp: (h.incomes.cpp || 0) / discountFactor,
            oas: (h.incomes.oas || 0) / discountFactor,
            gis: (h.incomes.gis || 0) / discountFactor,
            ccb: (h.incomes.ccb || 0) / discountFactor,
            
            withdrawTFSA: (h.incomes.tfsa || 0) / discountFactor,
            withdrawRRSP: ((h.incomes.rrsp || 0) + (h.incomes.lira || 0)) / discountFactor,
            withdrawNonReg: (h.incomes.nonReg || 0) / discountFactor,
            
            netCash: (h.netCash || 0) / discountFactor,
            targetIncome: (h.targetIncome || 0) / discountFactor,
            shortfall: (h.shortfall || 0) / discountFactor,
        };
    });

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-5 md:p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-slate-800">Cash Flow Table</h3>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200/60 w-full md:w-auto">
                        <button 
                            onClick={() => setActiveView('overview')}
                            className={`flex-1 md:flex-none px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${activeView === 'overview' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Overview
                        </button>
                        <button 
                            onClick={() => setActiveView('accounts')}
                            className={`flex-1 md:flex-none px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${activeView === 'accounts' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Accounts
                        </button>
                        <button 
                            onClick={() => setActiveView('income')}
                            className={`flex-1 md:flex-none px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${activeView === 'income' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Income
                        </button>
                    </div>

                    <div className="hidden md:block w-px h-6 bg-slate-200"></div>

                    <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200/60 w-full md:w-auto">
                        <button 
                            onClick={() => setIsReal(true)}
                            className={`flex-1 md:flex-none px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors ${isReal ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Real ($ Today)
                        </button>
                        <button 
                            onClick={() => setIsReal(false)}
                            className={`flex-1 md:flex-none px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors ${!isReal ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Nominal
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="overflow-x-auto max-h-[600px]">
                <table className="w-full text-sm text-left text-slate-600">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 border-b border-slate-200 shadow-sm z-20">
                        <tr>
                            <th scope="col" className="px-4 py-3 sticky left-0 bg-slate-50 border-r border-slate-200 font-bold text-slate-800 shadow-[1px_0_0_0_#e2e8f0] z-30">Age</th>
                            
                            {activeView === 'overview' && (
                                <>
                                    <th scope="col" className="px-4 py-3 text-right text-slate-600 whitespace-nowrap">Total Portfolio</th>
                                    <th scope="col" className="px-4 py-3 text-right text-emerald-600 whitespace-nowrap">Total Withdrawals</th>
                                </>
                            )}
                            
                            {activeView === 'accounts' && (
                                <>
                                    <th scope="col" className="px-4 py-3 text-right bg-slate-50/50 whitespace-nowrap leading-tight">TFSA <span className="text-[10px] font-normal text-emerald-600 block">(Draw)</span></th>
                                    <th scope="col" className="px-4 py-3 text-right bg-slate-50/50 whitespace-nowrap leading-tight">RRSP/LIRA <span className="text-[10px] font-normal text-emerald-600 block">(Draw)</span></th>
                                    <th scope="col" className="px-4 py-3 text-right bg-slate-50/50 whitespace-nowrap leading-tight">Non-Reg <span className="text-[10px] font-normal text-emerald-600 block">(Draw)</span></th>
                                </>
                            )}
                            
                            {activeView === 'income' && (
                                <>
                                    <th scope="col" className="px-4 py-3 text-right text-indigo-600 whitespace-nowrap leading-tight">Work <span className="text-[10px] font-normal text-indigo-400 block">(Pension)</span></th>
                                    <th scope="col" className="px-4 py-3 text-right text-indigo-600 whitespace-nowrap">CPP</th>
                                    <th scope="col" className="px-4 py-3 text-right text-indigo-600 whitespace-nowrap">OAS</th>
                                    <th scope="col" className="px-4 py-3 text-right text-indigo-600 whitespace-nowrap">GIS</th>
                                    <th scope="col" className="px-4 py-3 text-right text-indigo-600 whitespace-nowrap">CCB</th>
                                </>
                            )}
                            
                            <th scope="col" className="px-4 py-3 text-right font-bold text-slate-800 bg-slate-50 border-l border-slate-200 whitespace-nowrap">Total Net Inc.</th>
                            <th scope="col" className="px-4 py-3 text-right font-bold text-rose-600 bg-slate-50 whitespace-nowrap">Shortfall</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {tableData.map((row) => {
                            const isDeficit = row.shortfall > 10;
                            return (
                                <tr key={row.age} className={`hover:bg-slate-50 transition-colors ${isDeficit ? 'bg-rose-50/30' : ''}`}>
                                    <td className={`px-4 py-2 sticky left-0 font-semibold text-slate-900 border-r border-slate-200 shadow-[1px_0_0_0_#e2e8f0] ${isDeficit ? 'bg-rose-50' : 'bg-white group-hover:bg-slate-50'} z-10`}>{row.age}</td>
                                    
                                    {activeView === 'overview' && (
                                        <>
                                            <td className="px-4 py-2 text-right font-mono whitespace-nowrap text-slate-700">{formatMoney(row.tfsaBal + row.rrspBal + row.nonRegBal)}</td>
                                            <td className="px-4 py-2 text-right font-mono whitespace-nowrap text-emerald-600">{formatMoney(row.withdrawTFSA + row.withdrawRRSP + row.withdrawNonReg)}</td>
                                        </>
                                    )}

                                    {activeView === 'accounts' && (
                                        <>
                                            <td className="px-4 py-2 text-right bg-slate-50/30 whitespace-nowrap">
                                                <div className="font-mono">{formatMoney(row.tfsaBal)}</div>
                                                {row.withdrawTFSA > 0 && <div className="text-[10px] font-mono text-emerald-600 -mt-0.5">+{formatMoney(row.withdrawTFSA)}</div>}
                                            </td>
                                            <td className="px-4 py-2 text-right bg-slate-50/30 whitespace-nowrap">
                                                <div className="font-mono">{formatMoney(row.rrspBal)}</div>
                                                {row.withdrawRRSP > 0 && <div className="text-[10px] font-mono text-emerald-600 -mt-0.5">+{formatMoney(row.withdrawRRSP)}</div>}
                                            </td>
                                            <td className="px-4 py-2 text-right bg-slate-50/30 whitespace-nowrap">
                                                <div className="font-mono">{formatMoney(row.nonRegBal)}</div>
                                                {row.withdrawNonReg > 0 && <div className="text-[10px] font-mono text-emerald-600 -mt-0.5">+{formatMoney(row.withdrawNonReg)}</div>}
                                            </td>
                                        </>
                                    )}
                                    
                                    {activeView === 'income' && (
                                        <>
                                            <td className="px-4 py-2 text-right text-slate-500 whitespace-nowrap">
                                                {row.workingIncome > 0 ? <div className="font-mono">{formatMoney(row.workingIncome)}</div> : <div className="font-mono text-slate-300">-</div>}
                                                {row.pension > 0 && <div className="text-[10px] font-mono text-indigo-400 -mt-0.5">+{formatMoney(row.pension)}</div>}
                                            </td>
                                            <td className="px-4 py-2 text-right text-slate-500 font-mono whitespace-nowrap">{row.cpp > 0 ? formatMoney(row.cpp) : '-'}</td>
                                            <td className="px-4 py-2 text-right text-slate-500 font-mono whitespace-nowrap">{row.oas > 0 ? formatMoney(row.oas) : '-'}</td>
                                            <td className="px-4 py-2 text-right text-slate-500 font-mono whitespace-nowrap">{row.gis > 0 ? formatMoney(row.gis) : '-'}</td>
                                            <td className="px-4 py-2 text-right text-slate-500 font-mono whitespace-nowrap">{row.ccb > 0 ? formatMoney(row.ccb) : '-'}</td>
                                        </>
                                    )}
                                    
                                    <td className="px-4 py-2 text-right font-bold text-slate-800 bg-slate-50/50 border-l border-slate-100 font-mono whitespace-nowrap">{formatMoney(row.netCash)}</td>
                                    <td className={`px-4 py-2 text-right font-bold bg-slate-50/50 font-mono whitespace-nowrap ${isDeficit ? 'text-rose-600' : 'text-slate-300'}`}>{isDeficit ? formatMoney(row.shortfall) : '-'}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
