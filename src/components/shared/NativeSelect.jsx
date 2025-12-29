import React from 'react';

/**
 * NativeSelect - A styled select dropdown component
 * @param {string} label - Label text displayed above the select
 * @param {string|number} value - Current selected value
 * @param {Function} onChange - Callback function when selection changes
 * @param {Array} options - Array of option objects with {label, value}
 * @param {string} subLabel - Optional sub-label text displayed below the label
 * @param {string} className - Additional CSS classes
 * @param {Object} rest - Additional props to pass to the select element
 */
export const NativeSelect = React.memo(({ 
    label, 
    value, 
    onChange, 
    options = [], 
    subLabel,
    className = '',
    ...rest 
}) => {
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
            <select
                value={value}
                onChange={onChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm hover:border-slate-300 font-medium appearance-none cursor-pointer"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23334155' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    paddingRight: '2.5rem'
                }}
                {...rest}
            >
                {options.map((option, index) => (
                    <option key={option.value ?? index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
});

NativeSelect.displayName = 'NativeSelect';

