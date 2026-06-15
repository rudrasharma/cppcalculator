import React from 'react';
import { SparklesIcon } from '../Icons';

export const StrategyCard = ({ insight }) => {
    if (!insight) return null;

    return (
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-1 rounded-[2.5rem] shadow-2xl shadow-indigo-200 animate-fade-in-up mb-12">
            <div className="bg-white/95 backdrop-blur-sm p-6 md:p-8 rounded-[2.3rem] flex flex-col md:flex-row items-start gap-6">
                <div className="bg-indigo-100 p-4 rounded-2xl text-indigo-600 shrink-0 shadow-inner">
                    <SparklesIcon size={32} />
                </div>
                <div className="flex-1">
                    <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-3">AI Strategy Insight</h3>
                    <p className="text-base md:text-xl text-slate-900 font-bold leading-tight tracking-tight">
                        {insight}
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                        <div className="h-0.5 w-8 bg-indigo-500 rounded-full"></div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Powered by Gemini 3.5 Flash</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
