import React from 'react';
import { 
    MoneyInput, 
    NativeSelect, 
    RangeSlider,
    InfoIcon,
    Tooltip,
    TrashIcon,
    UsersIcon,
    PlusIcon
} from '../../../components/shared';

export const RESPForm = ({ 
    state, 
    updateField, 
    addBeneficiary, 
    removeBeneficiary, 
    updateBeneficiary 
}) => {
    return (
        <div className="space-y-6">
            {/* Beneficiaries Section */}
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                        <UsersIcon size={18} className="text-indigo-600" />
                        Children
                    </h3>
                    {state.beneficiaries.length < 4 && (
                        <button 
                            onClick={addBeneficiary}
                            className="text-[10px] font-black text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1"
                        >
                            <PlusIcon size={14} /> Add Child
                        </button>
                    )}
                </div>

                <div className="space-y-4">
                    {state.beneficiaries.map((child, index) => (
                        <div key={child.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 relative group">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Child {index + 1}</span>
                                {state.beneficiaries.length > 1 && (
                                    <button 
                                        onClick={() => removeBeneficiary(child.id)}
                                        className="text-rose-400 hover:text-rose-600 transition-colors"
                                    >
                                        <TrashIcon size={14} />
                                    </button>
                                )}
                            </div>
                            <label className="block">
                                <span className="text-xs font-bold text-slate-600 mb-2 block">
                                    Current Age: <span className="text-indigo-600">{child.age}</span>
                                </span>
                                <RangeSlider 
                                    value={child.age}
                                    min={0}
                                    max={17}
                                    step={1}
                                    onChange={(e) => updateBeneficiary(child.id, 'age', parseInt(e.target.value))}
                                />
                            </label>
                        </div>
                    ))}
                </div>

                <div className="pt-4 border-t border-slate-100">
                    <MoneyInput 
                        label="Total Current Plan Balance"
                        subLabel="Combined across all children"
                        value={state.currentBalance}
                        onChange={(val) => updateField('currentBalance', val)}
                    />
                </div>
            </div>

            {/* Contribution Plan */}
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    Contribution Plan
                </h3>

                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 sm:col-span-1">
                        <MoneyInput 
                            label="Total Amount"
                            value={state.contributionAmount}
                            onChange={(val) => updateField('contributionAmount', val)}
                        />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                        <NativeSelect 
                            label="Frequency"
                            value={state.contributionFrequency}
                            options={[
                                { value: 'Weekly', label: 'Weekly' },
                                { value: 'Monthly', label: 'Monthly' },
                                { value: 'Yearly', label: 'Yearly' }
                            ]}
                            onChange={(e) => updateField('contributionFrequency', e.target.value)}
                        />
                    </div>
                </div>

                <label className="block">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                        Expected Annual Return ({state.annualReturn}%)
                    </span>
                    <RangeSlider 
                        value={state.annualReturn}
                        min={0}
                        max={12}
                        step={0.5}
                        onChange={(e) => updateField('annualReturn', parseFloat(e.target.value))}
                    />
                </label>
            </div>

            {/* Eligibility */}
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
                <NativeSelect 
                    label="Province of Residence"
                    value={state.province}
                    options={[
                        { value: 'Ontario', label: 'Ontario' },
                        { value: 'British Columbia', label: 'British Columbia' },
                        { value: 'Quebec', label: 'Quebec' },
                        { value: 'Other', label: 'Other' }
                    ]}
                    onChange={(e) => updateField('province', e.target.value)}
                />

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200 group hover:border-indigo-200 transition-colors">
                    <div className="flex items-center gap-3">
                        <Tooltip text="Low-income eligibility. Each child receives up to $2,000 individually.">
                            <div className="bg-white p-2 rounded-xl text-slate-400 group-hover:text-indigo-500 shadow-sm transition-colors cursor-help">
                                <InfoIcon size={18} />
                            </div>
                        </Tooltip>
                        <div>
                            <span className="text-sm font-bold text-slate-700 block">Canada Learning Bond</span>
                            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-tight italic">Low-income eligibility</span>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={state.clbEligible}
                            onChange={(e) => updateField('clbEligible', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 group hover:border-emerald-200 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-xl text-emerald-500 shadow-sm transition-colors">
                            <InfoIcon size={18} />
                        </div>
                        <div>
                            <span className="text-sm font-bold text-slate-700 block text-emerald-900">Show Estimated Payouts</span>
                            <span className="text-[10px] text-emerald-600 font-medium uppercase tracking-tight">Withdrawal Simulation</span>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={state.showPayouts}
                            onChange={(e) => updateField('showPayouts', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                </div>
            </div>
        </div>
    );
};
