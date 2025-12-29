import React from 'react';

/**
 * RangeSlider - A styled range input component with value display
 * @param {string} label - Label text displayed above the slider
 * @param {number} value - Current slider value
 * @param {Function} onChange - Callback function when value changes
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {number} step - Step increment
 * @param {string} subLabel - Optional sub-label text displayed below the label
 * @param {string} accentColor - Accent color class (default: 'indigo-600')
 * @param {string} className - Additional CSS classes
 * @param {Object} rest - Additional props to pass to the input element
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
    ...rest 
}) => {
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
                        <label className="text-xs font-black text-slate-700 block uppercase tracking-tighter">
                            {label}
                        </label>
                    )}
                    {subLabel && (
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {subLabel}
                        </div>
                    )}
                </div>
                <span className="font-black text-2xl tabular-nums text-slate-900">
                    {value}
                </span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={onChange}
                className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${accentClass} hover:opacity-80 transition-all`}
                style={{
                    background: `linear-gradient(to right, ${gradientColor} 0%, ${gradientColor} ${((value - min) / (max - min)) * 100}%, rgb(226 232 240) ${((value - min) / (max - min)) * 100}%, rgb(226 232 240) 100%)`
                }}
                {...rest}
            />
        </div>
    );
});

RangeSlider.displayName = 'RangeSlider';

