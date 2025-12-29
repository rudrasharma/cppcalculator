import React from 'react';
import { HelpCircleIcon } from './Icons';

/**
 * Reusable tooltip component
 */
export const Tooltip = React.memo(({ text, children }) => {
    if (children) {
        return (
            <div className="group/tip relative inline-flex items-center">
                {children}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-4 bg-slate-800 text-slate-50 text-xs rounded-xl shadow-xl opacity-0 group-hover/tip:opacity-100 transition-all duration-200 pointer-events-none z-50 text-center leading-relaxed font-normal border border-slate-700 shadow-indigo-500/10">
                    {text}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="group/tip relative inline-flex items-center ml-1">
            <button type="button" className="text-slate-400 hover:text-indigo-600 transition-colors cursor-help">
                <HelpCircleIcon size={16} />
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-4 bg-slate-800 text-slate-50 text-xs rounded-xl shadow-xl opacity-0 group-hover/tip:opacity-100 transition-all duration-200 pointer-events-none z-50 text-center leading-relaxed font-normal border border-slate-700 shadow-indigo-500/10">
                {text}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
            </div>
        </div>
    );
});

Tooltip.displayName = 'Tooltip';

