import React from 'react';

/**
 * MoneyInput - A styled input component for currency values
 * @param {string} label - Label text displayed above the input
 * @param {string|number} value - Current input value
 * @param {Function} onChange - Callback function when value changes
 * @param {string} subLabel - Optional sub-label text displayed below the label
 * @param {string} className - Additional CSS classes
 * @param {Object} rest - Additional props to pass to the input element
 */
export const MoneyInput = React.memo(({ 
    label, 
    value, 
    onChange, 
    subLabel, 
    className = '',
    ...rest 
}) => {
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
                <label className="text-xs font-black text-slate-700 block uppercase tracking-tighter">
                    {label}
                </label>
            )}
            {subLabel && (
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {subLabel}
                </div>
            )}
            <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold group-focus-within:text-indigo-500 transition-colors pointer-events-none">
                    $
                </span>
                <input
                    type="text"
                    inputMode="decimal"
                    value={value}
                    onChange={handleChange}
                    className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-lg font-black focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm hover:border-slate-300"
                    {...rest}
                />
            </div>
        </div>
    );
});

MoneyInput.displayName = 'MoneyInput';

