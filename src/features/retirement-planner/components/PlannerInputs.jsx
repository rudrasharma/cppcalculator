import React, { useState } from 'react';
import { MoneyInput, InfoIcon } from '../../../components/shared';

export const PlannerInputs = ({ state, updateField, isMonteCarlo, setIsMonteCarlo, monteCarloProfile, setMonteCarloProfile }) => {
    const [activeTab, setActiveTab] = useState('applicant');

    const handleSpouseToggle = (e) => {
        const checked = e.target.checked;
        updateField('hasSpouse', checked);
        if (!checked && activeTab === 'spouse') {
            setActiveTab('applicant');
        }
    };

    const isSpouse = activeTab === 'spouse';
    const isJoint = activeTab === 'joint';
    const pState = isSpouse ? state.spouse : state;

    const updatePField = (field, value) => {
        if (isSpouse) updateField('spouse', { ...state.spouse, [field]: value });
        else updateField(field, value);
    };

    const updatePBalance = (acc, value) => {
        if (isSpouse) updateField('spouse', { ...state.spouse, balances: { ...state.spouse.balances, [acc]: value } });
        else updateField('balances', { ...state.balances, [acc]: value });
    };

    const updatePContrib = (acc, value) => {
        if (isSpouse) updateField('spouse', { ...state.spouse, contributions: { ...state.spouse.contributions, [acc]: value } });
        else updateField('contributions', { ...state.contributions, [acc]: value });
    };

    const updatePPension = (type, field, value) => {
        if (isSpouse) updateField('spouse', { ...state.spouse, [type]: { ...state.spouse[type], [field]: value } });
        else updateField(type, { ...state[type], [field]: value });
    };

    const showIndividual = !state.hasSpouse || activeTab === 'applicant' || activeTab === 'spouse';
    const showJoint = !state.hasSpouse || activeTab === 'joint';

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6">
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4 md:mb-0">
                        <span className="bg-indigo-100 text-indigo-700 p-1.5 rounded-lg">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </span>
                        Plan Details
                    </h3>
                    
                    <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
                        <div className="relative inline-block w-8 h-4">
                            <input type="checkbox" className="opacity-0 w-0 h-0 peer" checked={state.hasSpouse} onChange={handleSpouseToggle} />
                            <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-slate-300 rounded-full transition-colors peer-checked:bg-indigo-500"></span>
                            <span className="absolute left-[2px] bottom-[2px] bg-white w-3 h-3 rounded-full transition-transform peer-checked:translate-x-4"></span>
                        </div>
                        <span className="text-sm font-semibold text-slate-700">Include Spouse</span>
                    </label>
                </div>

                {state.hasSpouse && (
                    <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
                        {['applicant', 'spouse', 'joint'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors capitalize ${
                                    activeTab === tab ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {showJoint && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Province</label>
                                <select value={state.province} onChange={(e) => updateField('province', e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-3">
                                    <option value="ON">Ontario</option>
                                    <option value="BC">British Columbia</option>
                                    <option value="AB">Alberta</option>
                                    <option value="MB">Manitoba</option>
                                    <option value="NB">New Brunswick</option>
                                    <option value="NL">Newfoundland & Labrador</option>
                                    <option value="NS">Nova Scotia</option>
                                    <option value="PE">Prince Edward Island</option>
                                    <option value="QC">Quebec</option>
                                    <option value="SK">Saskatchewan</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Target Annual Income (After-Tax)</label>
                                <MoneyInput value={state.targetIncome} onChange={(val) => updateField('targetIncome', val)} placeholder="e.g. 60000" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">End Planning Age</label>
                                <input type="number" min="60" max="110" value={state.endAge} onChange={(e) => updateField('endAge', parseInt(e.target.value) || 90)} className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-3" />
                            </div>
                        </>
                    )}

                    {showIndividual && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Current Age</label>
                                <input type="number" min="18" max="80" value={pState.currentAge || 40} onChange={(e) => updatePField('currentAge', parseInt(e.target.value) || 40)} className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-3" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Current Working Income (Net)</label>
                                <MoneyInput value={pState.workingIncome} onChange={(val) => updatePField('workingIncome', val)} placeholder="e.g. 60000" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Start Retirement Age</label>
                                <input type="number" min="30" max="80" value={pState.startAge} onChange={(e) => updatePField('startAge', parseInt(e.target.value) || 65)} className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-3" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1.5">
                                    Years in Canada (at 65)
                                    <div className="group relative flex items-center">
                                        <InfoIcon className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 p-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl font-normal text-center">
                                            Number of years lived in Canada between age 18 and 65. Used to calculate eligible OAS amount.
                                        </div>
                                    </div>
                                </label>
                                <input type="number" min="0" max="47" value={pState.yearsInCanada ?? 40} onChange={(e) => updatePField('yearsInCanada', parseInt(e.target.value) || 0)} className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-3" />
                            </div>
                        </>
                    )}
                </div>
            </div>

            {(showIndividual || showJoint) && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <span className="bg-emerald-100 text-emerald-700 p-1.5 rounded-lg">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </span>
                        {showIndividual && !showJoint ? `${isSpouse ? "Spouse's " : "Applicant's "}Assets & Contributions` : 'Current Assets & Contributions'}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {showIndividual && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">TFSA Balance</label>
                                    <MoneyInput value={pState.balances.tfsa} onChange={(val) => updatePBalance('tfsa', val)} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1.5">
                                        RRSP Balance
                                        {state.hasSpouse && (
                                            <div className="group relative flex items-center">
                                                <InfoIcon className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                                                <div className="absolute bottom-full mb-2 right-0 w-64 p-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl font-normal text-left">
                                                    Include any Spousal RRSPs where this person is the annuitant (the one who withdraws the money).
                                                </div>
                                            </div>
                                        )}
                                    </label>
                                    <MoneyInput value={pState.balances.rrsp} onChange={(val) => updatePBalance('rrsp', val)} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">LIRA Balance</label>
                                    <MoneyInput value={pState.balances.lira} onChange={(val) => updatePBalance('lira', val)} />
                                </div>
                            </>
                        )}
                        {showJoint && (
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 mt-2">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Joint Non-Registered Balance</label>
                                    <MoneyInput value={state.balances.nonReg} onChange={(val) => updateField('balances', { ...state.balances, nonReg: val })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center justify-between">
                                        Book Value (ACB)
                                    </label>
                                    <MoneyInput value={state.balances.nonRegBookValue} onChange={(val) => updateField('balances', { ...state.balances, nonRegBookValue: val })} />
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <h4 className="text-sm font-semibold text-slate-700 mt-6 mb-3 uppercase tracking-wider">Annual Savings (Until Retirement)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {showIndividual && (
                            <>
                                <div className="flex flex-col justify-end">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">TFSA Savings / Yr</label>
                                    <MoneyInput value={pState.contributions?.tfsa || 0} onChange={(val) => updatePContrib('tfsa', val)} />
                                </div>
                                <div className="flex flex-col justify-end">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">RRSP Savings / Yr</label>
                                    <MoneyInput value={pState.contributions?.rrsp || 0} onChange={(val) => updatePContrib('rrsp', val)} />
                                </div>
                            </>
                        )}
                        {showJoint && (
                            <div className="flex flex-col justify-end">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Non-Reg Savings / Yr</label>
                                <MoneyInput value={state.contributions?.nonReg || 0} onChange={(val) => updateField('contributions', { ...state.contributions, nonReg: val })} />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {showIndividual && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <span className="bg-amber-100 text-amber-700 p-1.5 rounded-lg">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </span>
                        {state.hasSpouse ? (isSpouse ? "Spouse's " : "Applicant's ") : ""}Future Income Sources
                    </h3>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">DB Pension (Annual)</label>
                                <MoneyInput value={pState.pension.amount} onChange={(val) => updatePPension('pension', 'amount', val)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">DB Pension Start Age</label>
                                <input type="number" min="50" max="75" value={pState.pension.startAge} onChange={(e) => updatePPension('pension', 'startAge', parseInt(e.target.value) || 65)} className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-3" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Expected CPP (Annual)</label>
                                <MoneyInput value={pState.cpp.amount} onChange={(val) => updatePPension('cpp', 'amount', val)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">CPP Start Age</label>
                                <input type="number" min="60" max="70" value={pState.cpp.startAge} onChange={(e) => updatePPension('cpp', 'startAge', parseInt(e.target.value) || 65)} className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-3" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showJoint && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <span className="bg-rose-100 text-rose-700 p-1.5 rounded-lg">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </span>
                        Assumptions
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Inflation Rate (%)</label>
                            <input 
                                type="number" 
                                step="0.1" 
                                value={(state.inflation * 100).toFixed(1)} 
                                onChange={(e) => updateField('inflation', (parseFloat(e.target.value) || 0) / 100)}
                                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-3"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Est. Real Return (%)</label>
                            <input 
                                type="number" 
                                step="0.1" 
                                value={(state.returnRate * 100).toFixed(1)} 
                                onChange={(e) => updateField('returnRate', (parseFloat(e.target.value) || 0) / 100)}
                                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-3"
                            />
                        </div>
                        
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Drawdown Strategy</label>
                            <select 
                                value={state.drawdownOrder?.join(',') || 'nonReg,rrsp,lira,tfsa'} 
                                onChange={(e) => updateField('drawdownOrder', e.target.value.split(','))}
                                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-3 transition-colors cursor-pointer"
                            >
                                <option value="nonReg,rrsp,lira,tfsa">Standard (Non-Reg → RRSP → TFSA)</option>
                                <option value="rrsp,lira,nonReg,tfsa">Tax-heavy First (RRSP/LIRA → Non-Reg → TFSA)</option>
                                <option value="tfsa,nonReg,rrsp,lira">Tax-free First (TFSA → Non-Reg → RRSP/LIRA)</option>
                            </select>
                        </div>

                        <div className="md:col-span-2 mt-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <div className="relative inline-block w-10 h-5">
                                    <input 
                                        type="checkbox" 
                                        className="opacity-0 w-0 h-0 peer" 
                                        checked={isMonteCarlo}
                                        onChange={(e) => {
                                            if (setIsMonteCarlo) setIsMonteCarlo(e.target.checked);
                                            if (setMonteCarloProfile && e.target.checked) setMonteCarloProfile('balanced');
                                        }}
                                    />
                                    <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-slate-300 rounded-full transition-colors peer-checked:bg-indigo-500"></span>
                                    <span className="absolute left-[2px] bottom-[2px] bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></span>
                                </div>
                                <div>
                                    <span className="text-sm font-semibold text-slate-800 block">Enable Monte Carlo Simulation</span>
                                    <span className="text-xs text-slate-500 block">Stress test your plan against market volatility</span>
                                </div>
                            </label>
                            
                            {isMonteCarlo && (
                                <div className="mt-4 pt-4 border-t border-slate-200">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Risk Profile (Volatility)</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { id: 'conservative', label: 'Conservative', dev: '6%' },
                                            { id: 'balanced', label: 'Balanced', dev: '11%' },
                                            { id: 'aggressive', label: 'Aggressive', dev: '15%' }
                                        ].map(profile => (
                                            <button
                                                key={profile.id}
                                                onClick={() => setMonteCarloProfile(profile.id)}
                                                className={`p-2 rounded-lg border text-sm text-center transition-colors ${
                                                    monteCarloProfile === profile.id 
                                                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-semibold'
                                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                                }`}
                                            >
                                                <div className="block">{profile.label}</div>
                                                <div className="text-xs font-normal opacity-70">±{profile.dev}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
