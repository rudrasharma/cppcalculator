import React from 'react';
import { 
    MoneyInput, 
    NativeSelect, 
    Accordion,
    InfoIcon,
    TrendingUpIcon,
    CalendarIcon,
    CalculatorIcon,
    TrashIcon,
    SparklesIcon,
    RotateCcwIcon,
} from '../../../components/shared';
import { PAYMENT_FREQUENCIES, COMPOUNDING_PERIODS } from '../utils/mortgageEngine';
import { PROVINCES } from '../utils/lttEngine';

const AMORTIZATION_YEARS = [5, 10, 15, 20, 25, 30].map(y => ({ label: `${y} Years`, value: y }));

const PROVINCE_OPTIONS = Object.entries(PROVINCES).map(([code, name]) => ({ label: name, value: code }));

const FREQUENCY_OPTIONS = [
    { label: 'Monthly', value: PAYMENT_FREQUENCIES.MONTHLY },
    { label: 'Semi-Monthly', value: PAYMENT_FREQUENCIES.SEMI_MONTHLY },
    { label: 'Bi-Weekly', value: PAYMENT_FREQUENCIES.BI_WEEKLY },
    { label: 'Accelerated Bi-Weekly', value: PAYMENT_FREQUENCIES.ACCELERATED_BI_WEEKLY },
    { label: 'Weekly', value: PAYMENT_FREQUENCIES.WEEKLY },
    { label: 'Accelerated Weekly', value: PAYMENT_FREQUENCIES.ACCELERATED_WEEKLY },
];

const COMPOUNDING_OPTIONS = [
    { label: 'Semi-Annual (Fixed Rate)', value: COMPOUNDING_PERIODS.SEMI_ANNUAL },
    { label: 'Monthly (Variable Rate)', value: COMPOUNDING_PERIODS.MONTHLY },
];

export const MortgageForm = ({ state, dispatch }) => {
    const { 
        homePrice, downPayment, downPaymentType, annualRate, amortizationYears, 
        termYears, paymentFrequency, compounding, customPayment, startDate, 
        prepayments, lumpSums, province, isToronto, isFirstTimeBuyer, showStressTest,
        calculationMode
    } = state;

    const isRenewal = calculationMode === 'renewal';

    return (
        <div className="space-y-6">
            {/* Mode Selector */}
            <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex gap-1">
                <button
                    onClick={() => dispatch({ type: 'SET_CALCULATION_MODE', payload: 'purchase' })}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${calculationMode === 'purchase' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    <SparklesIcon size={14} />
                    New Purchase
                </button>
                <button
                    onClick={() => dispatch({ type: 'SET_CALCULATION_MODE', payload: 'renewal' })}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${calculationMode === 'renewal' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    <RotateCcwIcon size={14} />
                    Renewal / Refi
                </button>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[5rem] -mr-10 -mt-10 -z-0 pointer-events-none"></div>

                <div className="relative z-10 space-y-5">
                    {!isRenewal && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-700 block uppercase tracking-tighter">
                                    Province
                                </label>
                                <NativeSelect
                                    value={province}
                                    onChange={(e) => dispatch({ type: 'SET_PROVINCE', payload: e.target.value })}
                                    options={PROVINCE_OPTIONS}
                                />
                            </div>
                            <div className="flex flex-col justify-end gap-2">
                                {province === 'ON' && (
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <div className="relative">
                                            <input 
                                                type="checkbox" 
                                                className="sr-only peer" 
                                                checked={isToronto}
                                                onChange={(e) => dispatch({ type: 'SET_IS_TORONTO', payload: e.target.checked })}
                                            />
                                            <div className="w-8 h-4 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-600"></div>
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight group-hover:text-slate-700 transition-colors">Inside Toronto</span>
                                    </label>
                                )}
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <div className="relative">
                                        <input 
                                            type="checkbox" 
                                            className="sr-only peer" 
                                            checked={isFirstTimeBuyer}
                                            onChange={(e) => dispatch({ type: 'SET_IS_FIRST_TIME_BUYER', payload: e.target.checked })}
                                    />
                                    <div className="w-8 h-4 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-600"></div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight group-hover:text-slate-700 transition-colors">First-Time Buyer</span>
                            </label>
                        </div>
                    </div>
                    )}

                    <MoneyInput
                        label={isRenewal ? "Remaining Balance" : "Asking Price"}
                        subLabel={isRenewal ? "Current Mortgage Principal" : "Property Purchase Price"}
                        value={homePrice}
                        onChange={(val) => dispatch({ type: 'SET_HOME_PRICE', payload: parseFloat(val) || 0 })}
                    />

                    {!isRenewal && (
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-xs font-black text-slate-700 block uppercase tracking-tighter">Down Payment</label>
                                <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                                    <button
                                        onClick={() => {
                                            if (downPaymentType !== 'dollar') {
                                                const newDollarAmount = homePrice * (downPayment / 100);
                                                dispatch({ type: 'SET_DOWN_PAYMENT', payload: Math.round(newDollarAmount) });
                                                dispatch({ type: 'SET_DOWN_PAYMENT_TYPE', payload: 'dollar' });
                                            }
                                        }}
                                        className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${downPaymentType === 'dollar' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        $ CAD
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (downPaymentType !== 'percent') {
                                                const newPercentAmount = (downPayment / homePrice) * 100;
                                                dispatch({ type: 'SET_DOWN_PAYMENT', payload: parseFloat(newPercentAmount.toFixed(2)) });
                                                dispatch({ type: 'SET_DOWN_PAYMENT_TYPE', payload: 'percent' });
                                            }
                                        }}
                                        className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${downPaymentType === 'percent' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        % Percent
                                    </button>
                                </div>
                            </div>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold group-focus-within:text-indigo-500 transition-colors pointer-events-none" aria-hidden="true">{downPaymentType === 'dollar' ? '$' : '%'}</span>
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    value={downPayment || ''}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                            dispatch({ type: 'SET_DOWN_PAYMENT', payload: val === '' ? 0 : parseFloat(val) });
                                        }
                                    }}
                                    className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-lg font-black focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm text-slate-900"
                                />
                            </div>
                            <p className="text-[10px] font-medium text-slate-400 text-right mt-1">
                                {downPaymentType === 'percent' 
                                    ? `$${(homePrice * (downPayment / 100)).toLocaleString('en-CA', { maximumFractionDigits: 0 })}`
                                    : `${((downPayment / homePrice) * 100 || 0).toFixed(1)}%`}
                            </p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-700 block uppercase tracking-tighter">
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => dispatch({ type: 'SET_START_DATE', payload: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-sm font-black focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm text-slate-900"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-black text-slate-700 block uppercase tracking-tighter">
                                    Interest Rate
                                </label>
                                <label className="flex items-center gap-1.5 cursor-pointer group">
                                    <div className="relative">
                                        <input 
                                            type="checkbox" 
                                            className="sr-only peer" 
                                            checked={showStressTest}
                                            onChange={(e) => dispatch({ type: 'SET_SHOW_STRESS_TEST', payload: e.target.checked })}
                                        />
                                        <div className="w-6 h-3 bg-slate-200 rounded-full peer peer-checked:after:translate-x-[12px] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-2 after:w-2 after:transition-all peer-checked:bg-rose-500"></div>
                                    </div>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight group-hover:text-slate-600 transition-colors">Stress Test</span>
                                </label>
                            </div>
                            <div className="relative group">
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    value={annualRate}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                            dispatch({ type: 'SET_RATE', payload: val });
                                        }
                                    }}
                                    className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-lg font-black focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm text-slate-900"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold" aria-hidden="true">%</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-700 block uppercase tracking-tighter">
                                {isRenewal ? "Remaining Amort" : "Amortization"}
                            </label>
                            <NativeSelect
                                value={amortizationYears}
                                onChange={(e) => dispatch({ type: 'SET_AMORTIZATION', payload: parseInt(e.target.value) })}
                                options={AMORTIZATION_YEARS}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-700 block uppercase tracking-tighter">
                                Mortgage Term
                            </label>
                            <NativeSelect
                                value={termYears}
                                onChange={(e) => dispatch({ type: 'SET_TERM_YEARS', payload: parseInt(e.target.value) })}
                                options={[
                                    { label: '1 Year', value: 1 },
                                    { label: '2 Years', value: 2 },
                                    { label: '3 Years', value: 3 },
                                    { label: '4 Years', value: 4 },
                                    { label: '5 Years', value: 5 },
                                    { label: '7 Years', value: 7 },
                                    { label: '10 Years', value: 10 },
                                ]}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-700 block uppercase tracking-tighter">
                                Payment Frequency
                            </label>
                            <NativeSelect
                                value={paymentFrequency}
                                onChange={(e) => dispatch({ type: 'SET_FREQUENCY', payload: e.target.value })}
                                options={FREQUENCY_OPTIONS}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-700 block uppercase tracking-tighter">
                                Compounding
                            </label>
                            <NativeSelect
                                value={compounding}
                                onChange={(e) => dispatch({ type: 'SET_COMPOUNDING', payload: e.target.value })}
                                options={COMPOUNDING_OPTIONS}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-700 block uppercase tracking-tighter">
                            Custom Payment
                        </label>
                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold group-focus-within:text-indigo-500 transition-colors pointer-events-none" aria-hidden="true">$</span>
                            <input
                                type="text"
                                inputMode="decimal"
                                value={customPayment || ''}
                                placeholder="Optional"
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                        dispatch({ type: 'SET_CUSTOM_PAYMENT', payload: val === '' ? 0 : parseFloat(val) });
                                    }
                                }}
                                className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-sm font-black focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm text-slate-900"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Prepayments Accordion */}
            <div className="bg-indigo-50/50 rounded-[2rem] border border-indigo-100 overflow-hidden">
                <Accordion 
                    title="Prepayment Options"
                    icon={TrendingUpIcon}
                    defaultOpen={false}
                >
                    <div className="p-6 pt-2 space-y-6">
                        <div className="space-y-4">
                            <div className="p-4 bg-white rounded-2xl border border-indigo-100 shadow-sm space-y-4">
                                <label className="text-[10px] font-black text-indigo-700 block uppercase tracking-tighter">
                                    Recurring Payment Increase
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 font-bold">$</span>
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        value={prepayments.monthlyIncrease}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                                dispatch({ type: 'SET_PREPAYMENT', payload: { monthlyIncrease: parseFloat(val) || 0 } });
                                            }
                                        }}
                                        className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
                                        placeholder="0.00"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase">Per Payment</span>
                                </div>
                            </div>

                            <div className="p-4 bg-white rounded-2xl border border-indigo-100 shadow-sm space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-black text-indigo-700 block uppercase tracking-tighter">
                                        One-Time Lump Sums
                                    </label>
                                    <button 
                                        onClick={() => dispatch({ type: 'ADD_LUMP_SUM' })}
                                        className="text-[10px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded-md transition-colors"
                                    >
                                        + Add Payment
                                    </button>
                                </div>
                                
                                {lumpSums.length === 0 ? (
                                    <p className="text-xs text-slate-400 italic text-center py-2">No lump sum payments added.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {lumpSums.map((ls, index) => (
                                            <div key={ls.id} className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-3 items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                <div className="w-full sm:col-span-5 relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 font-bold text-xs">$</span>
                                                    <input
                                                        type="number"
                                                        value={ls.amount || ''}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            dispatch({ type: 'UPDATE_LUMP_SUM', payload: { id: ls.id, field: 'amount', value: val === '' ? 0 : parseFloat(val) } });
                                                        }}
                                                        className="w-full pl-6 pr-2 py-2 sm:py-1.5 bg-white border border-slate-200 rounded-lg font-mono text-xs sm:text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                                                        placeholder="Amount"
                                                    />
                                                </div>
                                                <div className="w-full flex gap-2 sm:col-span-7">
                                                    <div className="flex-grow relative">
                                                        <input
                                                            type="date"
                                                            value={ls.date}
                                                            onChange={(e) => dispatch({ type: 'UPDATE_LUMP_SUM', payload: { id: ls.id, field: 'date', value: e.target.value } })}
                                                            className="w-full px-3 py-2 sm:py-1.5 bg-white border border-slate-200 rounded-lg font-mono text-[10px] sm:text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
                                                        />
                                                    </div>
                                                    <button onClick={() => dispatch({ type: 'REMOVE_LUMP_SUM', payload: ls.id })} className="shrink-0 flex items-center justify-center bg-white border border-slate-200 rounded-lg w-9 sm:w-8 h-9 sm:h-[1.875rem] text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-colors">
                                                        <TrashIcon size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3 items-start bg-white/60 p-3 rounded-xl border border-indigo-50">
                            <InfoIcon size={16} className="text-indigo-400 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-indigo-800 leading-relaxed font-medium">
                                Select the exact date you plan to make your lump sum prepayment. The engine will accurately apply it to the closest payment cycle.
                            </p>
                        </div>
                    </div>
                </Accordion>
            </div>
        </div>
    );
};
