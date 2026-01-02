import React, { useId } from 'react';

/**
 * RangeSlider - A styled range input component with value display
 */
export const RangeSlider = React.memo(({ 
    label, 
    value, 
    onChange, 
    min = 0, 
    max = 100, 
    step = 1,
    subLabel,
    accentColor = 'indigo-600',
    className = '',
    id,
    ...rest 
}) => {
    const internalId = useId();
    const inputId = id || internalId;

    // Map color names to RGB values for the gradient
    const colorMap = {
        'indigo-600': 'rgb(99 102 241)',
        'indigo-500': 'rgb(99 102 241)',
        'emerald-600': 'rgb(5 150 105)',
        'emerald-500': 'rgb(16 185 129)',
        'emerald-400': 'rgb(52 211 153)',
        'rose-600': 'rgb(225 29 72)',
        'rose-500': 'rgb(244 63 94)'
    };
    
    const gradientColor = colorMap[accentColor] || colorMap['indigo-600'];
    const accentClass = `accent-${accentColor}`;
    
    return (
        <div className={`space-y-3 ${className}`}>
            <div className="flex justify-between items-end">
                <div className="space-y-1.5">
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
                </div>
                <span className="font-black text-2xl tabular-nums text-slate-900">
                    {value}
                </span>
            </div>
            <input
                id={inputId}
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={onChange}
                className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${accentClass} hover:opacity-80 transition-all bg-slate-200`}
                style={{
                    background: `linear-gradient(to right, ${gradientColor} 0%, ${gradientColor} ${((value - min) / (max - min)) * 100}%, rgb(226 232 240) ${((value - min) / (max - min)) * 100}%, rgb(226 232 240) 100%)`
                }}
                {...rest}
            />
        </div>
    );
});

RangeSlider.displayName = 'RangeSlider';