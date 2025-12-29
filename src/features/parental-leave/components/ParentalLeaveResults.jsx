import React from 'react';
import { CalendarIcon } from '../../../components/shared';
import { IconBase } from '../../../components/shared/IconBase';

const WalletIcon = React.memo((props) => (
    <IconBase {...props}>
        <path d="M20 7h-7"/>
        <path d="M14 11h6"/>
        <path d="m20 7 2 2-2 2"/>
        <path d="M5 20h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3"/>
        <path d="M7 2v16"/>
        <path d="M3 11h4"/>
    </IconBase>
));

WalletIcon.displayName = 'WalletIcon';

export default function ParentalLeaveResults({
    results,
    hasPartner,
    province
}) {
    return (
        <div className="animate-fade-in space-y-12">
            
            {/* HERO CARD: TOTAL HOUSEHOLD */}
            <div className="bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl flex flex-col items-center text-center">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900/40 via-slate-900 to-slate-900"></div>
                <div className="relative z-10">
                    <div className="inline-block bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 mb-6">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">Total Household Benefit</span>
                    </div>
                    <div className="flex items-start justify-center gap-2 mb-2">
                        <span className="text-6xl md:text-8xl font-black tracking-tighter drop-shadow-2xl">${Math.round(results.totalValue).toLocaleString()}</span>
                    </div>
                    <div className="text-slate-400 font-bold text-sm bg-black/20 px-3 py-1 rounded-lg inline-block">Pre-Tax Estimate (Gross)</div>
                </div>
            </div>

            {/* PERSON BREAKDOWN GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* PARENT 1 CARD */}
                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden flex flex-col">
                    <div className="p-6 bg-indigo-50/50 border-b border-indigo-100 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-sm">
                            <span className="font-black text-lg">P1</span>
                        </div>
                        <div>
                            <div className="font-black text-slate-800 text-lg">Parent 1 (Birth)</div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Maternity + Parental</div>
                        </div>
                    </div>
                    <div className="p-8 space-y-8 flex-1">
                        <div className="flex justify-between items-end">
                            <div className="space-y-1">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Off</div>
                                <div className="text-3xl font-black text-slate-800">{results.maternityWeeks + results.p1Weeks} <span className="text-sm text-slate-400 font-bold">Weeks</span></div>
                            </div>
                            <div className="text-right space-y-1">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Pay</div>
                                <div className="text-3xl font-black text-indigo-600">${Math.round(results.maternityTotal + results.p1Total).toLocaleString()}</div>
                            </div>
                        </div>

                        {/* Visual Bar P1 */}
                        <div className="space-y-2">
                            <div className="flex h-4 w-full rounded-full overflow-hidden bg-slate-100">
                                <div style={{ width: `${(results.maternityWeeks / (results.maternityWeeks + results.p1Weeks)) * 100}%` }} className="bg-rose-400"></div>
                                <div style={{ width: `${(results.p1Weeks / (results.maternityWeeks + results.p1Weeks)) * 100}%` }} className="bg-indigo-500"></div>
                            </div>
                            <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400">
                                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-400"></div> Maternity ({results.maternityWeeks}w)</span>
                                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> Parental ({results.p1Weeks}w)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* PARENT 2 CARD */}
                <div className={`bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden flex flex-col ${!hasPartner ? 'opacity-50 grayscale' : ''}`}>
                    <div className="p-6 bg-emerald-50/50 border-b border-emerald-100 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm">
                            <span className="font-black text-lg">P2</span>
                        </div>
                        <div>
                            <div className="font-black text-slate-800 text-lg">Parent 2 (Non-Birth)</div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Parental Only</div>
                        </div>
                    </div>
                    {hasPartner ? (
                        <div className="p-8 space-y-8 flex-1">
                            <div className="flex justify-between items-end">
                                <div className="space-y-1">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Off</div>
                                    <div className="text-3xl font-black text-slate-800">{results.p2Weeks} <span className="text-sm text-slate-400 font-bold">Weeks</span></div>
                                </div>
                                <div className="text-right space-y-1">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Pay</div>
                                    <div className="text-3xl font-black text-emerald-600">${Math.round(results.p2Total).toLocaleString()}</div>
                                </div>
                            </div>

                            {/* Visual Bar P2 */}
                            <div className="space-y-2">
                                <div className="flex h-4 w-full rounded-full overflow-hidden bg-slate-100">
                                    <div className="w-full bg-emerald-500"></div>
                                </div>
                                <div className="flex justify-start text-[10px] font-bold uppercase text-slate-400">
                                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Standard Parental</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-8 flex items-center justify-center flex-1 text-slate-400 font-bold italic">
                            No partner selected
                        </div>
                    )}
                </div>
            </div>

            {/* BI-WEEKLY PAYCHECK ESTIMATE */}
            <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-8 md:p-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-white p-3 rounded-xl shadow-sm text-slate-900"><WalletIcon size={24} /></div>
                    <div>
                        <h3 className="font-black text-slate-800 text-lg">The "Paycheck" View</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">What hits your bank account every 2 weeks</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
                        <span className="font-bold text-slate-600">Parent 1 receives:</span>
                        <span className="font-black text-xl text-slate-900">${Math.round((results.p1Weekly || results.maternityWeekly) * 2).toLocaleString()} <span className="text-xs text-slate-400 font-medium">/ 2 wks</span></span>
                    </div>
                    {hasPartner && results.p2Weeks > 0 && (
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
                            <span className="font-bold text-slate-600">Parent 2 receives:</span>
                            <span className="font-black text-xl text-slate-900">${Math.round(results.p2Weekly * 2).toLocaleString()} <span className="text-xs text-slate-400 font-medium">/ 2 wks</span></span>
                        </div>
                    )}
                </div>
                <p className="mt-6 text-center text-xs text-slate-400 font-medium max-w-2xl mx-auto">
                    * Note: Service Canada pays bi-weekly. This is a pre-tax estimate. Actual net amount will be lower depending on your tax bracket.
                </p>
            </div>

        </div>
    );
}

