// src/components/PurchasingPowerGauge.jsx
import React from 'react';

const ITEM_TYPES = [
    { name: 'Eggs', baseCount: 30, icon: '🥚' },
    { name: 'Loaves', baseCount: 40, icon: '🍞' },
    { name: 'Milk (L)', baseCount: 20, icon: '🥛' }
];

export default function PurchasingPowerGauge({ years, rate }) {
    // Calculate the multiplier (how much $1 today is worth in the future)
    // Formula: 1 / (1 + r)^n
    const multiplier = 1 / Math.pow(1 + rate / 100, years);
    const displayPower = (multiplier * 100).toFixed(0);

    // SVG Circular Progress Constants
    const radius = 88;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (multiplier * circumference);

    return (
        <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm animate-fade-in">
            <div className="text-center mb-8">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
                    Value of your $100.00
                </h3>
                <p className="text-xs text-slate-500 font-medium italic">
                    Forecasted purchasing power in {2025 + years}
                </p>
            </div>
            
            <div className="flex flex-col items-center gap-10">
                {/* 1. VISUAL GAUGE */}
                <div className="relative w-48 h-48 flex items-center justify-center">
                    {/* Background Circle */}
                    <svg className="absolute w-full h-full -rotate-90">
                        <circle 
                            cx="96" cy="96" r={radius} 
                            fill="transparent" 
                            stroke="#f1f5f9" 
                            strokeWidth="12" 
                        />
                        {/* Progress Circle */}
                        <circle 
                            cx="96" cy="96" r={radius} 
                            fill="transparent" 
                            stroke="url(#indigoGradient)" 
                            strokeWidth="12" 
                            strokeDasharray={circumference} 
                            strokeDashoffset={offset} 
                            strokeLinecap="round" 
                            className="transition-all duration-1000 ease-out"
                        />
                        <defs>
                            <linearGradient id="indigoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#6366f1" />
                                <stop offset="100%" stopColor="#4f46e5" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Central Text */}
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="flex items-baseline">
                            <span className="text-sm font-bold text-slate-400 mr-0.5">$</span>
                            <span className="text-5xl font-black text-slate-900 tracking-tighter tabular-nums">
                                {displayPower}
                            </span>
                        </div>
                        <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mt-1">
                            Effective Value
                        </span>
                    </div>
                </div>

                {/* 2. ITEM COMPARISON GRID */}
                <div className="w-full space-y-4">
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center border-b border-slate-100 pb-2">
                        What fits in the same $100 cart?
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {ITEM_TYPES.map(item => (
                            <div key={item.name} className="bg-slate-50 rounded-2xl p-4 flex flex-col items-center justify-center transition-colors hover:bg-indigo-50 group">
                                <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                                    {item.icon}
                                </span>
                                <div className="text-lg font-black text-slate-800 tabular-nums">
                                    {Math.floor(item.baseCount * multiplier)}
                                </div>
                                <div className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
                                    {item.name}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. CONTEXT NOTE */}
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-100/50">
                    <p className="text-[9px] text-amber-800 font-bold leading-relaxed text-center uppercase tracking-wide">
                        At an average rate of <span className="text-rose-600">{rate.toFixed(1)}%</span>, your money loses <br/>
                        <span className="text-rose-600">{(100 - displayPower)}%</span> of its utility by {2025 + years}.
                    </p>
                </div>
            </div>
        </div>
    );
}