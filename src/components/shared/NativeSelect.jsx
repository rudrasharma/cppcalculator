import React from 'react';

/**
 * NativeSelect - A styled select dropdown component
 * Supports flat options array OR grouped options array
 * Grouped format: [{ label: "Group Name", options: [{ label: "Option 1", value: "1" }] }]
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
                {options.map((option, index) => {
                    // Check if this is a group
                    if (option.options) {
                        return (
                            <optgroup key={index} label={option.label} className="font-bold text-slate-900 bg-slate-100">
                                {option.options.map((subOption, subIndex) => (
                                    <option key={`${index}-${subIndex}`} value={subOption.value} className="bg-white font-medium text-slate-700">
                                        {subOption.label}
                                    </option>
                                ))}
                            </optgroup>
                        );
                    }
                    // Standard flat option
                    return (
                        <option key={option.value ?? index} value={option.value}>
                            {option.label}
                        </option>
                    );
                })}
            </select>
        </div>
    );
});

NativeSelect.displayName = 'NativeSelect';