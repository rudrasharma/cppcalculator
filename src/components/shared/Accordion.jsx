import React from 'react';
import { ChevronDownIcon } from './Icons';

/**
 * Reusable accordion component
 */
export const Accordion = React.memo(({ title, icon: Icon, children, defaultOpen = false }) => (
    <details className="group bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-4 transition-all duration-300 hover:shadow-md" open={defaultOpen}>
        <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition select-none">
            <div className="flex items-center gap-4">
                <div className="text-indigo-600 bg-indigo-50 p-2.5 rounded-lg"><Icon size={20} /></div>
                <h3 className="font-bold text-slate-800">{title}</h3>
            </div>
            <div className="text-slate-400 transition-transform duration-300 group-open:rotate-180"><ChevronDownIcon size={20} /></div>
        </summary>
        <div className="p-6 pt-2 border-t border-slate-100 text-sm text-slate-600 leading-relaxed animate-fade-in">{children}</div>
    </details>
));

Accordion.displayName = 'Accordion';

