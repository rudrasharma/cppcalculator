import React, { useId, useState, useEffect } from 'react';

/**
 * NumberStepper - A resilient numeric input with touch-friendly step buttons,
 * quick preset chips, and non-clobbering local edit state.
 */
export const NumberStepper = React.memo(({
    label,
    value,
    onChange,
    min,
    max,
    step = 1,
    unit = '',
    presets = [],
    tooltip,
    id,
    className = '',
    inputMode = 'numeric',
    disabled = false,
}) => {
    const internalId = useId();
    const inputId = id || internalId;

    // Maintain local string input while typing so clearing or backspacing doesn't snap immediately
    const [localValue, setLocalValue] = useState(value !== undefined && value !== null ? String(value) : '');

    useEffect(() => {
        setLocalValue(value !== undefined && value !== null ? String(value) : '');
    }, [value]);

    const numValue = parseFloat(value) || 0;

    const clamp = (val) => {
        let n = parseFloat(val);
        if (isNaN(n)) return min !== undefined ? min : 0;
        if (min !== undefined && n < min) n = min;
        if (max !== undefined && n > max) n = max;
        // round to precision of step
        const stepDecimals = (step.toString().split('.')[1] || '').length;
        if (stepDecimals > 0) {
            n = parseFloat(n.toFixed(stepDecimals));
        }
        return n;
    };

    const handleStep = (delta) => {
        if (disabled) return;
        const next = clamp(numValue + delta * step);
        setLocalValue(String(next));
        onChange(next);
    };

    const handleBlur = () => {
        if (localValue === '') {
            const fallback = min !== undefined ? min : 0;
            setLocalValue(String(fallback));
            onChange(fallback);
            return;
        }
        const next = clamp(localValue);
        setLocalValue(String(next));
        onChange(next);
    };

    const handleChange = (e) => {
        const val = e.target.value;
        setLocalValue(val);
        // Only broadcast if it's a valid complete number
        const parsed = parseFloat(val);
        if (!isNaN(parsed)) {
            // Keep in bounds without resetting user cursor mid-edit
            onChange(parsed);
        }
    };

    const canDecrement = min === undefined || numValue > min;
    const canIncrement = max === undefined || numValue < max;

    return (
        <div className={`space-y-1.5 ${className}`}>
            {label && (
                <div className="flex items-center justify-between">
                    <label htmlFor={inputId} className="text-xs font-black text-slate-700 flex items-center gap-1.5 uppercase tracking-tighter cursor-pointer">
                        {label}
                        {tooltip && (
                            <div className="group relative flex items-center">
                                <span className="text-slate-400 hover:text-slate-600 transition-colors cursor-help">ⓘ</span>
                                <div className="absolute bottom-full mb-2 left-0 w-64 p-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-xl font-normal normal-case text-left">
                                    {tooltip}
                                </div>
                            </div>
                        )}
                    </label>
                </div>
            )}

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => handleStep(-1)}
                    disabled={disabled || !canDecrement}
                    aria-label={`Decrease ${label || 'value'}`}
                    className="w-11 h-11 shrink-0 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 disabled:opacity-30 disabled:pointer-events-none text-slate-700 font-bold text-lg rounded-xl flex items-center justify-center transition-colors shadow-sm select-none"
                >
                    −
                </button>

                <div className="relative flex-1">
                    <input
                        id={inputId}
                        type="text"
                        inputMode={inputMode}
                        value={localValue}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onFocus={(e) => e.target.select()}
                        disabled={disabled}
                        className={`w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-base font-black text-slate-900 text-center focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm hover:border-slate-300 ${
                            unit ? 'pr-8' : ''
                        }`}
                    />
                    {unit && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs pointer-events-none select-none">
                            {unit}
                        </span>
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => handleStep(1)}
                    disabled={disabled || !canIncrement}
                    aria-label={`Increase ${label || 'value'}`}
                    className="w-11 h-11 shrink-0 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 disabled:opacity-30 disabled:pointer-events-none text-slate-700 font-bold text-lg rounded-xl flex items-center justify-center transition-colors shadow-sm select-none"
                >
                    +
                </button>
            </div>

            {presets.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                    {presets.map((p) => {
                        const pVal = typeof p === 'object' ? p.value : p;
                        const pLabel = typeof p === 'object' ? p.label : `${p}${unit ? ` ${unit}` : ''}`;
                        const isSelected = numValue === pVal;
                        return (
                            <button
                                key={pVal}
                                type="button"
                                onClick={() => {
                                    setLocalValue(String(pVal));
                                    onChange(pVal);
                                }}
                                className={`px-2 py-0.5 text-[11px] font-bold rounded-md transition-colors ${
                                    isSelected
                                        ? 'bg-indigo-600 text-white shadow-xs'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {pLabel}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
});

NumberStepper.displayName = 'NumberStepper';
