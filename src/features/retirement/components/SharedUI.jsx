import React from 'react';
import { HelpCircleIcon, ChevronDownIcon } from './Icons'; // Adjust path as needed

export const Tooltip = ({ text }) => (
    <div className="group relative inline-flex items-center ml-1 align-middle text-left">
        <button type="button" className="text-slate-400 hover:text-indigo-600 transition-colors cursor-help">
            <HelpCircleIcon size={16} />
        </button>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 text-slate-50 text-xs rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 text-center leading-relaxed font-normal">
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
        </div>
    </div>
);

export const Accordion = ({ title, icon: Icon, children, defaultOpen = false }) => {
    return (
        <details className="group bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-4 transition-all duration-300 hover:shadow-md" open={defaultOpen}>
            <summary className="flex items-center justify-between p-4 cursor-pointer bg-white hover:bg-slate-50 transition select-none">
                <div className="flex items-center gap-4">
                    <div className="text-indigo-600 bg-indigo-50 p-2.5 rounded-lg"><Icon size={20} /></div>
                    <h3 className="font-bold text-slate-800">{title}</h3>
                </div>
                <div className="text-slate-400 transition-transform duration-300 group-open:rotate-180"><ChevronDownIcon size={20} /></div>
            </summary>
            <div className="p-6 pt-2 border-t border-slate-100 text-sm text-slate-600 leading-relaxed animate-fade-in">{children}</div>
        </details>
    );
};