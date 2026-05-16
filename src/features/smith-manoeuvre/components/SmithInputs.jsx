import React, { useState, useEffect } from 'react';
import { MoneyInput } from '../../../components/shared/MoneyInput';

const InfoTooltip = ({ text }) => (
    <div className="group relative inline-block ml-1">
        <span className="text-slate-400 cursor-help text-[10px] bg-slate-100 rounded-full w-4 h-4 inline-flex items-center justify-center font-serif italic border border-slate-200 hover:bg-slate-200 transition-colors">i</span>
        <div className="hidden group-hover:block absolute z-50 w-64 p-3 text-xs font-medium leading-relaxed bg-slate-800 text-white rounded-xl shadow-xl -left-1/2 mt-2 pointer-events-none border border-slate-700">
            {text}
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
        </div>
    </div>
);

const EditablePercent = ({ label, value, onChange, min, max, step, suffix = "%", isDecimal = true, tooltip }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState("");

    // Format for display
    const displayValue = isDecimal ? (value * 100).toFixed(2).replace(/\.?0+$/, '') : value;

    useEffect(() => {
        if (isEditing) setInputValue(displayValue);
    }, [isEditing, displayValue]);

    const handleBlur = () => {
        setIsEditing(false);
        const num = parseFloat(inputValue);
        if (!isNaN(num)) {
            const finalVal = isDecimal ? num / 100 : num;
            onChange(Math.max(min, Math.min(max, finalVal)));
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleBlur();
        if (e.key === 'Escape') setIsEditing(false);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <label className="flex items-center text-xs font-black uppercase tracking-tighter text-slate-700">
                    {label}
                    {tooltip && <InfoTooltip text={tooltip} />}
                </label>
                {isEditing ? (
                    <div className="flex items-center gap-1">
                        <input
                            autoFocus
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onBlur={handleBlur}
                            onKeyDown={handleKeyDown}
                            className="w-12 px-1 py-0.5 bg-slate-100 border border-indigo-300 rounded text-[10px] font-black font-mono text-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <span className="text-[10px] font-black text-indigo-600">{suffix}</span>
                    </div>
                ) : (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="text-[10px] font-black font-mono text-indigo-600 hover:bg-indigo-50 px-1 rounded transition-colors"
                    >
                        {displayValue}{suffix}
                    </button>
                )}
            </div>
            <input 
                type="range" min={min} max={max} step={step} 
                value={value} 
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
        </div>
    );
};

export const SmithInputs = ({
    homeValue, setHomeValue,
    mortgageBalance, setMortgageBalance,
    mortgageRate, setMortgageRate,
    helocRate, setHelocRate,
    marginalTaxRate, setMarginalTaxRate,
    capitalGainsRate, setCapitalGainsRate,
    dividendYield, setDividendYield,
    showAdvanced, setShowAdvanced,
    initialLumpSum, setInitialLumpSum,
    isOverLimit, absoluteMaxLumpSum,
    amortizationYears, setAmortizationYears,
    readvanceTolerance, setReadvanceTolerance,
    dividendTaxRate, setDividendTaxRate,
    capitalizeInterest, setCapitalizeInterest,
    taxRefundAllocation, setTaxRefundAllocation,
    dividendAllocation, setDividendAllocation,
    currency
}) => {
    return (
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-indigo-600">Strategy Presets</h3>
                    <div className="grid grid-cols-3 gap-2">
                        <button 
                            onClick={() => {
                                setReadvanceTolerance(0.5);
                                setCapitalizeInterest(false);
                                setInitialLumpSum(0);
                                setTaxRefundAllocation('portfolio');
                                setDividendAllocation('portfolio');
                            }}
                            className={`px-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all border ${
                                readvanceTolerance === 0.5 && !capitalizeInterest && initialLumpSum === 0
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-indigo-300'
                            }`}
                        >
                            🛡️ Cons.
                        </button>
                        <button 
                            onClick={() => {
                                setReadvanceTolerance(1.0);
                                setCapitalizeInterest(true);
                                setInitialLumpSum(0);
                                setTaxRefundAllocation('portfolio');
                                setDividendAllocation('portfolio');
                            }}
                            className={`px-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all border ${
                                readvanceTolerance === 1.0 && capitalizeInterest && initialLumpSum === 0
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-indigo-300'
                            }`}
                        >
                            ⚖️ Bal.
                        </button>
                        <button 
                            onClick={() => {
                                setReadvanceTolerance(1.0);
                                setCapitalizeInterest(true);
                                const maxByTotalLTV = (homeValue * 0.8) - mortgageBalance;
                                const maxByHelocLTV = (homeValue * 0.65);
                                const safeLumpSum = Math.max(0, Math.floor(Math.min(maxByTotalLTV, maxByHelocLTV)));
                                setInitialLumpSum(safeLumpSum);
                                setTaxRefundAllocation('mortgage');
                                setDividendAllocation('mortgage');
                            }}
                            className={`px-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all border ${
                                readvanceTolerance === 1.0 && capitalizeInterest && initialLumpSum > 0 && taxRefundAllocation === 'mortgage'
                                ? 'bg-slate-900 border-slate-900 text-white shadow-md' 
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-indigo-300'
                            }`}
                        >
                            🔥 Aggr.
                        </button>
                    </div>
                </div>

                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 pt-2 border-t border-slate-50">The Essentials</h3>
                
                <MoneyInput 
                    label="Home Value" 
                    value={homeValue} 
                    onChange={(val) => setHomeValue(Number(val))} 
                />
                
                <MoneyInput 
                    label="Mortgage Balance" 
                    value={mortgageBalance} 
                    onChange={(val) => setMortgageBalance(Number(val))} 
                />

                <EditablePercent 
                    label="Mortgage Rate" 
                    value={mortgageRate} 
                    onChange={setMortgageRate}
                    min={0.01} max={0.15} step={0.001}
                />

                <EditablePercent 
                    label="HELOC Rate" 
                    value={helocRate} 
                    onChange={setHelocRate}
                    min={0.01} max={0.15} step={0.001}
                    tooltip="The interest rate on your investment loan. HELOC rates in Canada are typically Prime + 0.5% or higher."
                />

                <EditablePercent 
                    label="Marginal Tax Rate" 
                    value={marginalTaxRate} 
                    onChange={setMarginalTaxRate}
                    min={0.10} max={0.54} step={0.01}
                    tooltip="The tax rate on your highest dollar of income. This determines the exact size of the tax refund generated by your investment loan interest."
                />

                <EditablePercent 
                    label="Capital Gains Rate" 
                    value={capitalGainsRate} 
                    onChange={setCapitalGainsRate}
                    min={0} max={0.15} step={0.005}
                />

                <EditablePercent 
                    label="Dividend Yield" 
                    value={dividendYield} 
                    onChange={setDividendYield}
                    min={0} max={0.10} step={0.005}
                />

                <div className="pt-4 border-t border-slate-100">
                    <button 
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="flex items-center justify-between w-full text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                        <span>⚙️ Advanced Settings</span>
                        <span className={`transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`}>▼</span>
                    </button>

                    {showAdvanced && (
                        <div className="mt-6 space-y-6 animate-fade-in">
                            <div className="space-y-2">
                                <MoneyInput 
                                    label="Initial HELOC Investment" 
                                    value={initialLumpSum} 
                                    onChange={(val) => setInitialLumpSum(Number(val))} 
                                    subLabel={`Lump sum borrowed from HELOC at Day 1`}
                                    className={isOverLimit ? 'border-amber-400' : ''}
                                />
                                <div className="flex justify-between items-center px-1">
                                    <p className={`text-[10px] font-bold uppercase tracking-wider ${isOverLimit ? 'text-amber-600' : 'text-slate-400'}`}>
                                        {isOverLimit ? '⚠️ Limit Exceeded' : 'Available Room'}
                                    </p>
                                    <p className={`text-[10px] font-black font-mono ${isOverLimit ? 'text-amber-600' : 'text-indigo-600'}`}>
                                        {currency.format(absoluteMaxLumpSum)}
                                    </p>
                                </div>
                                {isOverLimit && (
                                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 mt-2">
                                        <p className="text-[10px] leading-relaxed text-amber-800 font-medium">
                                            <strong>Note:</strong> OSFI regulations cap total debt at 80% LTV and HELOCs at 65%. Your projection is being automatically capped at {currency.format(absoluteMaxLumpSum)}.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <EditablePercent 
                                label="Amortization" 
                                value={amortizationYears} 
                                onChange={setAmortizationYears}
                                min={5} max={30} step={1}
                                isDecimal={false}
                                suffix=" Years"
                            />

                            <EditablePercent 
                                label="Re-advance Tolerance" 
                                value={readvanceTolerance} 
                                onChange={setReadvanceTolerance}
                                min={0} max={1} step={0.05}
                                tooltip="What percentage of your paid principal do you want to borrow back to invest? 100% is the standard Smith Manoeuvre, but lower numbers are safer."
                            />

                            <EditablePercent 
                                label="Dividend Tax Rate" 
                                value={dividendTaxRate} 
                                onChange={setDividendTaxRate}
                                min={0} max={0.50} step={0.01}
                            />

                            <div className="space-y-3 pt-4 border-t border-slate-50">
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center text-xs font-black uppercase tracking-tighter text-slate-700">
                                        Capitalize Interest
                                        <InfoTooltip text="Turn ON to pay the HELOC interest by borrowing more from the HELOC. Turn OFF to pay the interest out of your own pocket monthly." />
                                    </label>
                                    <button 
                                        onClick={() => setCapitalizeInterest(!capitalizeInterest)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${capitalizeInterest ? 'bg-indigo-600' : 'bg-slate-200'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${capitalizeInterest ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>

                                <div className="space-y-3 py-4 border-y border-slate-50">
                                    <div className="flex flex-col gap-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tax Refund Allocation</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {['portfolio', 'mortgage', 'none'].map((target) => (
                                                <button
                                                    key={target}
                                                    onClick={() => setTaxRefundAllocation(target)}
                                                    className={`px-2 py-2 rounded-lg text-[9px] font-black uppercase border transition-all ${
                                                        taxRefundAllocation === target 
                                                        ? 'bg-indigo-600 border-indigo-600 text-white' 
                                                        : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300'
                                                    }`}
                                                >
                                                    {target}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Dividend Allocation</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {['portfolio', 'mortgage', 'none'].map((target) => (
                                                <button
                                                    key={target}
                                                    onClick={() => setDividendAllocation(target)}
                                                    className={`px-2 py-2 rounded-lg text-[9px] font-black uppercase border transition-all ${
                                                        dividendAllocation === target 
                                                        ? 'bg-indigo-600 border-indigo-600 text-white' 
                                                        : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300'
                                                    }`}
                                                >
                                                    {target}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
