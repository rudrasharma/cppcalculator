// src/components/ParentalLeave.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
    ResponsiveContainer, Legend, ReferenceLine, Cell
} from 'recharts';

// ==========================================
//              ICONS
// ==========================================
const IconBase = ({ size = 20, className = "", children }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>{children}</svg>
);

const BabyIcon = (props) => (<IconBase {...props}><path d="M9 12h.01"/><path d="M15 12h.01"/><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 4 .7 5.6 1.8"/><path d="M12 3v2"/></IconBase>);
const DollarSignIcon = (props) => (<IconBase {...props}><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></IconBase>);
const CalendarIcon = (props) => (<IconBase {...props}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></IconBase>);
const UsersIcon = (props) => (<IconBase {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></IconBase>);
const HelpCircleIcon = (props) => (<IconBase {...props}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></IconBase>);
const MapPinIcon = (props) => (<IconBase {...props}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></IconBase>);
const ArrowRightIcon = (props) => (<IconBase {...props}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></IconBase>);

// ==========================================
//              CONSTANTS
// ==========================================
const EI_2025 = {
    MAX_INSURABLE: 65700, 
    STD_RATE: 0.55,
    EXT_RATE: 0.33,
    MAX_WEEKLY_STD: 695, 
    MAX_WEEKLY_EXT: 417, 
    MATERNITY_WEEKS: 15,
    STD_PARENTAL_WEEKS: 35,
    EXT_PARENTAL_WEEKS: 61,
    STD_SHARED_BONUS: 5,
    EXT_SHARED_BONUS: 8
};

const Tooltip = ({ text }) => (
    <div className="group/tooltip relative inline-flex items-center ml-1">
        <button type="button" className="text-slate-400 hover:text-rose-600 transition-colors cursor-help">
            <HelpCircleIcon size={16} />
        </button>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 text-slate-50 text-xs rounded-xl shadow-xl opacity-0 group-hover/tooltip:opacity-100 transition-all duration-200 pointer-events-none z-50 text-center leading-relaxed border border-slate-700">
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
        </div>
    </div>
);

export default function ParentalLeave() {
    const [province, setProvince] = useState('ON');
    const [salary, setSalary] = useState(65000);
    const [partnerSalary, setPartnerSalary] = useState(55000);
    const [hasPartner, setHasPartner] = useState(true);
    const [planType, setPlanType] = useState('STANDARD'); 
    
    const [activeTab, setActiveTab] = useState('input');
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    // --- CALCULATION logic ---
    const results = useMemo(() => {
        const isQuebec = province === 'QC';
        let data = {
            maternityWeekly: 0, maternityWeeks: 15, maternityTotal: 0,
            parentalWeekly: 0, parentalWeeks: 0, parentalTotal: 0,
            bonusWeeks: 0, bonusTotal: 0,
            totalDuration: 0, totalValue: 0,
            isQuebec
        };

        if (!isQuebec) {
            const insurable = Math.min(salary, EI_2025.MAX_INSURABLE);
            const isExtended = planType === 'EXTENDED';
            
            // Maternity (Fixed)
            data.maternityWeekly = Math.min(EI_2025.MAX_WEEKLY_STD, (insurable * EI_2025.STD_RATE) / 52);
            data.maternityTotal = data.maternityWeekly * data.maternityWeeks;

            // Parental
            const pRate = isExtended ? EI_2025.EXT_RATE : EI_2025.STD_RATE;
            const pMax = isExtended ? EI_2025.MAX_WEEKLY_EXT : EI_2025.MAX_WEEKLY_STD;
            data.parentalWeekly = Math.min(pMax, (insurable * pRate) / 52);
            data.parentalWeeks = isExtended ? EI_2025.EXT_PARENTAL_WEEKS : EI_2025.STD_PARENTAL_WEEKS;
            data.parentalTotal = data.parentalWeekly * data.parentalWeeks;

            // Bonus Reserved Weeks (Sharing Benefit)
            if (hasPartner) {
                const partnerInsurable = Math.min(partnerSalary, EI_2025.MAX_INSURABLE);
                const partnerWeekly = Math.min(pMax, (partnerInsurable * pRate) / 52);
                data.bonusWeeks = isExtended ? EI_2025.EXT_SHARED_BONUS : EI_2025.STD_SHARED_BONUS;
                data.bonusTotal = partnerWeekly * data.bonusWeeks;
            }
        } else {
            // Simplified Quebec Logic for this UI improvement
            const insurable = Math.min(salary, 98000);
            data.maternityWeekly = (insurable * 0.70) / 52;
            data.maternityWeeks = 18;
            data.maternityTotal = data.maternityWeekly * data.maternityWeeks;
            data.parentalWeekly = (insurable * 0.70) / 52;
            data.parentalWeeks = 32;
            data.parentalTotal = data.parentalWeekly * data.parentalWeeks;
            if (hasPartner) {
                const pInsurable = Math.min(partnerSalary, 98000);
                data.bonusWeeks = 5;
                data.bonusTotal = ((pInsurable * 0.70) / 52) * 5;
            }
        }

        data.totalDuration = data.maternityWeeks + data.parentalWeeks + data.bonusWeeks;
        data.totalValue = data.maternityTotal + data.parentalTotal + data.bonusTotal;
        return data;
    }, [province, salary, partnerSalary, hasPartner, planType]);

    const chartData = [
        { name: 'Maternity', value: Math.round(results.maternityTotal), color: '#f43f5e' },
        { name: 'Parental', value: Math.round(results.parentalTotal), color: '#6366f1' },
        { name: 'Reserved Bonus', value: Math.round(results.bonusTotal), color: '#10b981' }
    ].filter(d => d.value > 0);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-rose-100" style={{ paddingBottom: activeTab === 'input' ? '180px' : '40px' }}>
            
            <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-6 py-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-rose-600 text-white p-2 rounded-lg shadow-lg shadow-rose-500/20">
                            <BabyIcon size={24} />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight">Parental Leave Estimator</h1>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto p-4 md:p-8 w-full">
                <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden mb-12">
                    <div className="p-2 bg-slate-50 border-b">
                        <div className="flex bg-slate-200/50 p-1 rounded-2xl">
                            <button onClick={() => setActiveTab('input')} className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'input' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'}`}>1. Personal Setup</button>
                            <button onClick={() => setActiveTab('results')} className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'results' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'}`}>2. View Entitlement</button>
                        </div>
                    </div>

                    <div className="p-6 md:p-10">
                        {activeTab === 'input' && (
                            <div className="animate-fade-in space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                    
                                    {/* SECTION 1: CONFIG */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-2 text-rose-600 font-black uppercase text-[10px] tracking-widest"><MapPinIcon size={16} /> Location & Plan</div>
                                        <div className="bg-slate-50 p-6 rounded-3xl space-y-5 border border-slate-100 shadow-sm">
                                            <div>
                                                <label className="text-xs font-black text-slate-700 block mb-1 uppercase tracking-tighter">Province</label>
                                                <select value={province} onChange={(e) => setProvince(e.target.value)} className="w-full p-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-rose-500 outline-none shadow-sm">
                                                    <option value="ON">Ontario (EI)</option>
                                                    <option value="BC">BC (EI)</option>
                                                    <option value="AB">Alberta (EI)</option>
                                                    <option value="QC">Quebec (QPIP)</option>
                                                    <option value="OTHER">Other Provinces (EI)</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-xs font-black text-slate-700 block mb-1 uppercase tracking-tighter">Plan Duration</label>
                                                <div className="grid grid-cols-1 gap-2">
                                                    <button onClick={() => setPlanType('STANDARD')} className={`p-3 text-left rounded-2xl border-2 transition-all ${planType === 'STANDARD' ? 'border-rose-500 bg-rose-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                                                        <div className="font-bold text-sm">Standard</div>
                                                        <div className="text-[10px] text-slate-500 uppercase">12 Months (55% pay)</div>
                                                    </button>
                                                    <button onClick={() => setPlanType('EXTENDED')} className={`p-3 text-left rounded-2xl border-2 transition-all ${planType === 'EXTENDED' ? 'border-rose-500 bg-rose-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                                                        <div className="font-bold text-sm">Extended</div>
                                                        <div className="text-[10px] text-slate-500 uppercase">18 Months (33% pay)</div>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* SECTION 2: SHARING & INCOME */}
                                    <div className="md:col-span-2 space-y-6">
                                        <div className="flex items-center gap-2 text-indigo-600 font-black uppercase text-[10px] tracking-widest"><UsersIcon size={16} /> Parental Sharing</div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* PRIMARY PARENT */}
                                            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                                                <div className="font-bold text-slate-800 text-sm border-b pb-2">Parent 1 (Birth Parent)</div>
                                                <div>
                                                    <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Annual Gross Salary</label>
                                                    <div className="relative">
                                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold">$</span>
                                                        <input type="number" value={salary} onChange={(e) => setSalary(parseInt(e.target.value)||0)} className="w-full pl-8 p-3 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-xl font-black focus:ring-2 focus:ring-rose-500 outline-none" />
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-slate-50 rounded-xl">
                                                    <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Entitlements</div>
                                                    <ul className="text-xs space-y-1 font-bold text-slate-600">
                                                        <li className="flex justify-between"><span>Maternity Leave:</span> <span className="text-rose-600">15 Weeks</span></li>
                                                        <li className="flex justify-between"><span>Parental Leave:</span> <span className="text-indigo-600">Up to 35 Weeks</span></li>
                                                    </ul>
                                                </div>
                                            </div>

                                            {/* SECOND PARENT */}
                                            <div className={`p-6 rounded-3xl border transition-all shadow-sm space-y-4 ${hasPartner ? 'bg-white border-slate-200' : 'bg-slate-50 border-dashed border-slate-300'}`}>
                                                <label className="flex items-center gap-3 cursor-pointer group">
                                                    <input type="checkbox" checked={hasPartner} onChange={(e) => setHasPartner(e.target.checked)} className="w-6 h-6 text-rose-600 rounded-lg border-slate-300" />
                                                    <span className="font-bold text-slate-800 text-sm">Parent 2 (Non-Birth)</span>
                                                </label>

                                                {hasPartner ? (
                                                    <div className="animate-fade-in space-y-4">
                                                        <div>
                                                            <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Annual Gross Salary</label>
                                                            <div className="relative">
                                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold">$</span>
                                                                <input type="number" value={partnerSalary} onChange={(e) => setPartnerSalary(parseInt(e.target.value)||0)} className="w-full pl-8 p-3 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-xl font-black focus:ring-2 focus:ring-rose-500 outline-none" />
                                                            </div>
                                                        </div>
                                                        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                                                            <div className="text-[10px] font-black text-emerald-600 uppercase mb-1 flex items-center gap-1">Sharing Bonus <Tooltip text="Reserved for the second parent only. If not taken, these extra weeks are lost." /></div>
                                                            <div className="text-xs font-bold text-emerald-800 flex justify-between">
                                                                <span>Extra Reserved Weeks:</span>
                                                                <span>+{results.bonusWeeks} Weeks</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-xs text-slate-400 italic py-8 text-center px-4 leading-relaxed">
                                                        Sharing benefits with a partner unlocks extra paid weeks.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'results' && (
                            <div className="animate-fade-in space-y-10">
                                {/* SUMMARY HERO */}
                                <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
                                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-rose-500/20 rounded-full blur-[100px]"></div>
                                    <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                                        <div className="text-center md:text-left">
                                            <h2 className="text-rose-400 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Estimated Claim Value</h2>
                                            <div className="flex items-baseline justify-center md:justify-start gap-2">
                                                <span className="text-7xl font-black tracking-tighter">${Math.round(results.totalValue).toLocaleString()}</span>
                                                <span className="text-slate-400 text-xl font-bold">total</span>
                                            </div>
                                            <p className="text-slate-400 text-sm mt-4 font-bold tracking-tight">Across {results.totalDuration} combined weeks of pay</p>
                                        </div>
                                        <div className="bg-white/5 rounded-3xl p-8 border border-white/10 backdrop-blur-xl space-y-6">
                                            <div className="flex justify-between items-center"><span className="text-slate-400 text-xs font-black uppercase tracking-widest">Weekly Cap</span><span className="text-3xl font-black text-rose-400 tracking-tighter">${Math.round(results.parentalWeekly).toLocaleString()}<span className="text-xs font-medium text-slate-500">/wk</span></span></div>
                                            <div className="flex h-5 w-full rounded-full overflow-hidden bg-white/10 p-1">
                                                <div style={{ width: `${(results.maternityTotal/results.totalValue)*100}%` }} className="bg-rose-500 rounded-full mr-0.5"></div>
                                                <div style={{ width: `${(results.parentalTotal/results.totalValue)*100}%` }} className="bg-indigo-500 rounded-full mr-0.5"></div>
                                                <div style={{ width: `${(results.bonusTotal/results.totalValue)*100}%` }} className="bg-emerald-500 rounded-full"></div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-tighter"><div className="w-2 h-2 rounded-full bg-rose-500"></div> Maternity</div>
                                                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-tighter"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> Parental</div>
                                                {hasPartner && <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-tighter"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Sharing Bonus</div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* BREAKDOWN SECTION */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col">
                                        <h3 className="font-black text-slate-800 mb-8 flex items-center gap-2 uppercase tracking-widest text-[10px]"><CalendarIcon size={18} className="text-rose-600"/> Specific Entitlements</h3>
                                        <div className="space-y-4 flex-1">
                                            {/* Pool 1: Exclusive Maternity */}
                                            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 group transition-all hover:bg-slate-100 flex justify-between items-center">
                                                <div>
                                                    <div className="font-black text-slate-800 text-sm">Maternity Benefits</div>
                                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Exclusive to Parent 1</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-black text-rose-600 text-lg">${Math.round(results.maternityTotal).toLocaleString()}</div>
                                                    <div className="text-[10px] font-bold text-slate-400 tracking-tighter">{results.maternityWeeks} Wks @ ${Math.round(results.maternityWeekly)}/wk</div>
                                                </div>
                                            </div>

                                            {/* Pool 2: Shareable Parental */}
                                            <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100 group transition-all hover:bg-indigo-50 flex justify-between items-center">
                                                <div>
                                                    <div className="font-black text-slate-800 text-sm">Shareable Parental</div>
                                                    <div className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mt-1">Either Parent can use</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-black text-indigo-600 text-lg">${Math.round(results.parentalTotal).toLocaleString()}</div>
                                                    <div className="text-[10px] font-bold text-slate-400 tracking-tighter">{results.parentalWeeks} Wks @ ${Math.round(results.parentalWeekly)}/wk</div>
                                                </div>
                                            </div>

                                            {/* Pool 3: Reserved Bonus */}
                                            {hasPartner && (
                                                <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 group transition-all hover:bg-emerald-100 flex justify-between items-center animate-fade-in shadow-sm">
                                                    <div>
                                                        <div className="font-black text-emerald-800 text-sm">Sharing Bonus</div>
                                                        <div className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-1">Reserved for Parent 2</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-black text-emerald-600 text-lg">${Math.round(results.bonusTotal).toLocaleString()}</div>
                                                        <div className="text-[10px] font-bold text-emerald-400 tracking-tighter">{results.bonusWeeks} Wks • Use or lose</div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* VISUAL CHART AREA */}
                                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                                        <h3 className="font-black text-slate-800 mb-8 flex items-center gap-2 uppercase tracking-widest text-[10px]"><DollarSignIcon size={18} className="text-emerald-600"/> Benefit Allocation</h3>
                                        <div className="h-[280px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}} />
                                                    <YAxis hide />
                                                    <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '15px', color: '#f8fafc', fontWeight: 'bold' }} />
                                                    <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={50}>
                                                        {chartData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                                        ))}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center">
                                                Benefits are taxable and paid bi-weekly via direct deposit.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* PORTAL FOOTER */}
            {activeTab === 'input' && mounted && createPortal(
                <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-5 z-[9999] animate-slide-up" style={{ position: 'fixed', bottom: 0, width: '100%' }}>
                    <div className="max-w-5xl mx-auto flex items-center justify-between gap-6">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Claim Estimate</span>
                            <div className="flex items-baseline gap-1.5"><span className="text-4xl font-black text-slate-900 tracking-tighter">${Math.round(results.totalValue).toLocaleString()}</span><span className="text-sm font-bold text-slate-400">total</span></div>
                        </div>
                        <button onClick={() => { setActiveTab('results'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="bg-rose-600 hover:bg-rose-700 text-white font-black py-4 px-10 rounded-2xl shadow-xl shadow-rose-200 transition-all flex items-center gap-2 transform active:scale-95 whitespace-nowrap">View Breakdown <ArrowRightIcon size={20} /></button>
                    </div>
                </div>,
                document.body 
            )}
        </div>
    );
}