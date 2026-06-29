import React from 'react';
import { MoneyInput, InfoIcon } from '../../../components/shared';

export const PlannerInputs = ({ state, updateField }) => {
    
    return (
        <div className="space-y-6">
            
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="bg-indigo-100 text-indigo-700 p-1.5 rounded-lg">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </span>
                    Personal Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Province</label>
                        <select 
                            value={state.province} 
                            onChange={(e) => updateField('province', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-3 transition-colors"
                        >
                            <option value="AB">Alberta</option>
                            <option value="BC">British Columbia</option>
                            <option value="MB">Manitoba</option>
                            <option value="NB">New Brunswick</option>
                            <option value="NL">Newfoundland & Labrador</option>
                            <option value="NS">Nova Scotia</option>
                            <option value="ON">Ontario</option>
                            <option value="PE">Prince Edward Island</option>
                            <option value="QC">Quebec</option>
                            <option value="SK">Saskatchewan</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Target Annual Income (After-Tax)</label>
                        <MoneyInput 
                            value={state.targetIncome} 
                            onChange={(val) => updateField('targetIncome', val)} 
                            placeholder="e.g. 60000"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Current Age</label>
                        <input 
                            type="number" 
                            min="18" max="80" 
                            value={state.currentAge || 40} 
                            onChange={(e) => updateField('currentAge', parseInt(e.target.value) || 40)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-3 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Start Retirement Age</label>
                        <input 
                            type="number" 
                            min="30" max="80" 
                            value={state.startAge} 
                            onChange={(e) => updateField('startAge', parseInt(e.target.value) || 65)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-3 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">End Planning Age</label>
                        <input 
                            type="number" 
                            min="60" max="110" 
                            value={state.endAge} 
                            onChange={(e) => updateField('endAge', parseInt(e.target.value) || 90)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-3 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center justify-between">
                            Years in Canada (at 65)
                            <div className="group relative">
                                <InfoIcon className="w-4 h-4 text-slate-400 cursor-help" />
                                <div className="absolute bottom-full mb-2 right-0 w-64 p-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl font-normal">
                                    Number of years lived in Canada between age 18 and 65. Used to calculate your eligible OAS amount.
                                </div>
                            </div>
                        </label>
                        <input 
                            type="number" 
                            min="0" max="47" 
                            value={state.yearsInCanada ?? 40} 
                            onChange={(e) => updateField('yearsInCanada', parseInt(e.target.value) || 0)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-3 transition-colors"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-700 p-1.5 rounded-lg">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </span>
                    Current Assets & Contributions
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">TFSA Balance</label>
                        <MoneyInput value={state.balances.tfsa} onChange={(val) => updateField('balances', { ...state.balances, tfsa: val })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">RRSP Balance</label>
                        <MoneyInput value={state.balances.rrsp} onChange={(val) => updateField('balances', { ...state.balances, rrsp: val })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">LIRA Balance</label>
                        <MoneyInput value={state.balances.lira} onChange={(val) => updateField('balances', { ...state.balances, lira: val })} />
                    </div>
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 mt-2">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Non-Registered Balance</label>
                            <MoneyInput value={state.balances.nonReg} onChange={(val) => updateField('balances', { ...state.balances, nonReg: val })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center justify-between">
                                Book Value (ACB)
                                <div className="group relative">
                                    <InfoIcon className="w-4 h-4 text-slate-400 cursor-help" />
                                    <div className="absolute bottom-full mb-2 right-0 w-64 p-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
                                        Your original investment amount. Used to calculate tax-free return of capital vs taxable capital gains upon withdrawal.
                                    </div>
                                </div>
                            </label>
                            <MoneyInput value={state.balances.nonRegBookValue} onChange={(val) => updateField('balances', { ...state.balances, nonRegBookValue: val })} />
                        </div>
                    </div>
                </div>
                
                <h4 className="text-sm font-semibold text-slate-700 mt-6 mb-3 uppercase tracking-wider">Annual Savings (Until Retirement)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col justify-end">
                        <label className="block text-sm font-medium text-slate-700 mb-1">TFSA Savings / Yr</label>
                        <MoneyInput value={state.contributions?.tfsa || 0} onChange={(val) => updateField('contributions', { ...state.contributions, tfsa: val })} />
                    </div>
                    <div className="flex flex-col justify-end">
                        <label className="block text-sm font-medium text-slate-700 mb-1">RRSP Savings / Yr</label>
                        <MoneyInput value={state.contributions?.rrsp || 0} onChange={(val) => updateField('contributions', { ...state.contributions, rrsp: val })} />
                    </div>
                    <div className="flex flex-col justify-end">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Non-Reg Savings / Yr</label>
                        <MoneyInput value={state.contributions?.nonReg || 0} onChange={(val) => updateField('contributions', { ...state.contributions, nonReg: val })} />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="bg-amber-100 text-amber-700 p-1.5 rounded-lg">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                        </svg>
                    </span>
                    Pensions & Government
                </h3>
                
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Employer Pension (Annual)</label>
                            <MoneyInput value={state.pension.amount} onChange={(val) => updateField('pension', { ...state.pension, amount: val })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Starts at Age</label>
                            <input 
                                type="number" 
                                value={state.pension.startAge} 
                                onChange={(e) => updateField('pension', { ...state.pension, startAge: parseInt(e.target.value) || 65 })}
                                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-3 transition-colors"
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                CPP (Annual)
                                <a href="/cpp-oas-calculator" className="ml-2 text-xs text-indigo-600 hover:underline inline-flex items-center">
                                    Calculate exact
                                    <svg className="w-3 h-3 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            </label>
                            <MoneyInput value={state.cpp.amount} onChange={(val) => updateField('cpp', { ...state.cpp, amount: val })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Starts at Age</label>
                            <input 
                                type="number" min="60" max="70"
                                value={state.cpp.startAge} 
                                onChange={(e) => updateField('cpp', { ...state.cpp, startAge: parseInt(e.target.value) || 65 })}
                                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-3 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">OAS (Annual)</label>
                            <MoneyInput value={state.oas.amount} onChange={(val) => updateField('oas', { ...state.oas, amount: val })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Starts at Age</label>
                            <input 
                                type="number" min="65" max="70"
                                value={state.oas.startAge} 
                                onChange={(e) => updateField('oas', { ...state.oas, startAge: parseInt(e.target.value) || 65 })}
                                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-3 transition-colors"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-700 p-1.5 rounded-lg">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    </span>
                    Assumptions
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Investment Return (%)</label>
                        <input 
                            type="number" step="0.1"
                            value={state.returnRate * 100} 
                            onChange={(e) => updateField('returnRate', (parseFloat(e.target.value) || 0) / 100)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-3 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Inflation Rate (%)</label>
                        <input 
                            type="number" step="0.1"
                            value={state.inflation * 100} 
                            onChange={(e) => updateField('inflation', (parseFloat(e.target.value) || 0) / 100)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-3 transition-colors"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Drawdown Strategy</label>
                    <select 
                        value={state.drawdownOrder.join(',')} 
                        onChange={(e) => updateField('drawdownOrder', e.target.value.split(','))}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-3 transition-colors"
                    >
                        <option value="nonReg,rrsp,lira,tfsa">Standard (Non-Reg → RRSP → TFSA)</option>
                        <option value="rrsp,lira,nonReg,tfsa">Tax-heavy First (RRSP → Non-Reg → TFSA)</option>
                        <option value="tfsa,nonReg,rrsp,lira">Tax-free First (TFSA → Non-Reg → RRSP)</option>
                    </select>
                </div>
            </div>
            
        </div>
    );
};
