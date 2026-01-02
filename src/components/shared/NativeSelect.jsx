import React, { useId } from 'react';

/**
 * NativeSelect - A styled select dropdown component
 */
export const NativeSelect = React.memo(({ 
    label, 
    value, 
    onChange, 
    options = [], 
    subLabel,
    className = '',
    id,
    ...rest 
}) => {
    const internalId = useId();
    const selectId = id || internalId;

    return (
        <div className={`space-y-1.5 ${className}`}>
            {label && (
                <label htmlFor={selectId} className="text-xs font-black text-slate-700 block uppercase tracking-tighter">
                    {label}
                </label>
            )}
            {subLabel && (
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {subLabel}
                </div>
            )}
            <select
                id={selectId}
                value={value}
                onChange={onChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm hover:border-slate-300 font-medium appearance-none cursor-pointer"
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