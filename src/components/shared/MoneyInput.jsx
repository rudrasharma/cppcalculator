import React, { useId } from 'react';

/**
 * MoneyInput - A styled input component for currency values
 */
export const MoneyInput = React.memo(({ 
    label, 
    value, 
    onChange, 
    subLabel, 
    className = '',
    id, // Allow external ID override
    ...rest 
}) => {
    const internalId = useId();
    const inputId = id || internalId;

    const handleChange = (e) => {
        const inputValue = e.target.value;
        // Allow empty string, numbers, and decimal points
        if (inputValue === '' || /^\d*\.?\d*$/.test(inputValue)) {
            onChange(inputValue);
        }
    };

    return (
        <div className={`space-y-1.5 ${className}`}>
            {label && (
                <label htmlFor={inputId} className="text-xs font-black text-slate-700 block uppercase tracking-tighter">
                    {label}
                </label>
            )}
            {subLabel && (
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {subLabel}
                </div>
            )}
            <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold group-focus-within:text-indigo-500 transition-colors pointer-events-none" aria-hidden="true">
                    $
                </span>
                <input
                    id={inputId}
                    type="text"
                    inputMode="decimal"
                    value={value}
                    onChange={handleChange}
                    className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-lg font-black focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm hover:border-slate-300 text-slate-900"
                    {...rest}
                />
            </div>
        </div>
    );
});

MoneyInput.displayName = 'MoneyInput';