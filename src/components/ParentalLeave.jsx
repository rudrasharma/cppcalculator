import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
// --- 1. IMPORT THE AI COPILOT ---
import AICopilot from './AICopilot';

import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
    ResponsiveContainer, Cell
} from 'recharts';

// ==========================================
//              ICONS
// ==========================================
const IconBase = ({ size = 20, className = "", children }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>{children}</svg>
);

const UsersIcon = (props) => (<IconBase {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></IconBase>);
const MapPinIcon = (props) => (<IconBase {...props}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></IconBase>);
const ArrowRightIcon = (props) => (<IconBase {...props}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></IconBase>);
const SlidersIcon = (props) => (<IconBase {...props}><line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="2" x2="6" y1="14" y2="14"/><line x1="10" x2="14" y1="8" y2="8"/><line x1="18" x2="22" y1="16" y2="16"/></IconBase>);
const CheckCircleIcon = (props) => (<IconBase {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></IconBase>);
const SparklesIcon = (props) => (<IconBase {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></IconBase>);
const CalendarIcon = (props) => (<IconBase {...props}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></IconBase>);
const WalletIcon = (props) => (<IconBase {...props}><path d="M20 7h-7"/><path d="M14 11h6"/><path d="m20 7 2 2-2 2"/><path d="M5 20h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3"/><path d="M7 2v16"/><path d="M3 11h4"/></IconBase>);
const LinkIcon = (props) => (<IconBase {...props}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></IconBase>);
const CheckIcon = (props) => (<IconBase {...props}><polyline points="20 6 9 17 4 12"/></IconBase>);

// ==========================================
//              CONSTANTS
// ==========================================
const EI_2025 = {
    MAX_INSURABLE: 66600, // 2025 Projected
    QC_MAX_INSURABLE: 98000, 
    
    STD_RATE: 0.55,
    EXT_RATE: 0.33,
    MAX_WEEKLY_STD: 705, 
    MAX_WEEKLY_EXT: 423, 
    
    // Parental Limits
    STD_INDIVIDUAL_MAX: 35,
    STD_COMBINED_MAX: 40,
    EXT_INDIVIDUAL_MAX: 61,
    EXT_COMBINED_MAX: 69,
};

// ==========================================
//        HOOK: SYNC TABS WITH URL
// ==========================================
function useUrlTab(defaultTab = 'input') {
    const [activeTab, setActiveTabState] = useState(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            return params.get('step') || defaultTab;
        }
        return defaultTab;
    });

    useEffect(() => {
        const handlePopState = () => {
            const params = new URLSearchParams(window.location.search);
            const step = params.get('step');
            setActiveTabState(step || defaultTab);
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [defaultTab]);

    const setActiveTab = (newTab) => {
        setActiveTabState(newTab);
        const url = new URL(window.location);
        if (newTab === defaultTab) url.searchParams.delete('step');
        else url.searchParams.set('step', newTab);
        
        window.history.pushState({}, '', url);
        
        if (newTab === 'results') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return [activeTab, setActiveTab];
}

// ==========================================
//              MAIN COMPONENT
// ==========================================
export default function ParentalLeave({ 
    isVisible = true, 
    initialProvince = 'ON', 
    initialSalary = 70000,
    initialPartner = true,
    initialPlan = 'STANDARD' 
}) {
    
    const getParam = (key) => {
        if (typeof window === 'undefined') return null;
        const params = new URLSearchParams(window.location.search);
        return params.get(key);
    };

    // --- LAZY STATE INITIALIZATION ---
    const [province, setProvince] = useState(() => getParam('prov') || initialProvince);
    
    const [salary, setSalary] = useState(() => {
        const val = getParam('sal');
        return val ? parseInt(val, 36) : initialSalary;
    });

    const [partnerSalary, setPartnerSalary] = useState(() => {
        const val = getParam('psal');
        return val ? parseInt(val, 36) : 60000;
    });

    const [hasPartner, setHasPartner] = useState(() => {
        const val = getParam('part');
        return val ? val === '1' : initialPartner;
    });

    const [planType, setPlanType] = useState(() => {
        const val = getParam('plan');
        if (val) return val === 'ext' ? 'EXTENDED' : 'STANDARD';
        return initialPlan;
    });

    const [p1Maternity, setP1Maternity] = useState(() => {
        const val = getParam('mat');
        return val ? val === '1' : true;
    });

    const [p1Weeks, setP1Weeks] = useState(() => {
        const val = getParam('p1w');
        if (val) return parseInt(val);
        return initialPlan === 'EXTENDED' ? 50 : 30;
    });

    const [p2Weeks, setP2Weeks] = useState(() => {
        const val = getParam('p2w');
        if (val) return parseInt(val);
        return 5;
    });

    const [activeTab, setActiveTab] = useUrlTab('input');
    const [copySuccess, setCopySuccess] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    // Helper: Get Current Max Insurable based on province
    const currentMaxInsurable = province === 'QC' ? EI_2025.QC_MAX_INSURABLE : EI_2025.MAX_INSURABLE;

    // ==========================================
    //    SYNC TO URL (Live Update)
    // ==========================================
    useEffect(() => {
        if (!mounted) return;

        const params = new URLSearchParams(window.location.search);

        params.set('prov', province);
        if (salary > 0) params.set('sal', salary.toString(36)); else params.delete('sal');
        
        if (hasPartner) {
            params.set('part', '1');
            if (partnerSalary > 0) params.set('psal', partnerSalary.toString(36)); else params.delete('psal');
        } else {
            params.set('part', '0');
            params.delete('psal');
        }

        params.set('plan', planType === 'EXTENDED' ? 'ext' : 'std');
        params.set('mat', p1Maternity ? '1' : '0');
        params.set('p1w', p1Weeks);
        if (hasPartner) params.set('p2w', p2Weeks); else params.delete('p2w');

        params.set('view', 'parental');

        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState(null, '', newUrl);
    }, [province, salary, partnerSalary, hasPartner, planType, p1Maternity, p1Weeks, p2Weeks, mounted]);


    // Reset/Adjust weeks when Plan Type or Partner status changes
    useEffect(() => {
        if (!mounted) return;
        const isExtended = planType === 'EXTENDED';
        const indMax = isExtended ? EI_2025.EXT_INDIVIDUAL_MAX : EI_2025.STD_INDIVIDUAL_MAX;
        
        if (p1Weeks > indMax) setP1Weeks(indMax);
        if (p2Weeks > indMax) setP2Weeks(indMax);
        if (!hasPartner) setP2Weeks(0);
    }, [planType, hasPartner]);

    // --- SLIDER LOGIC ---
    const handleWeeksChange = (parent, val) => {
        const isExtended = planType === 'EXTENDED';
        const indMax = isExtended ? EI_2025.EXT_INDIVIDUAL_MAX : EI_2025.STD_INDIVIDUAL_MAX;
        const combinedMax = isExtended ? EI_2025.EXT_COMBINED_MAX : EI_2025.STD_COMBINED_MAX;
        const pool = hasPartner ? combinedMax : indMax;

        let newWeeks = parseInt(val, 10);
        
        if (newWeeks > indMax) newWeeks = indMax;

        if (parent === 1) {
            if (newWeeks + p2Weeks > pool) setP2Weeks(Math.max(0, pool - newWeeks));
            setP1Weeks(newWeeks);
        } else {
            if (newWeeks + p1Weeks > pool) setP1Weeks(Math.max(0, pool - newWeeks));
            setP2Weeks(newWeeks);
        }
    };

    // ==========================================
    //    2. HANDLE AI UPDATES (COPILOT)
    // ==========================================
    const handleAIUpdate = (args) => {
        if (args.province) setProvince(args.province);
        if (args.annual_income) setSalary(args.annual_income);
        if (args.partner_income) {
            setPartnerSalary(args.partner_income);
            setHasPartner(true); // If AI sets partner income, assume partner exists
        }
        if (typeof args.has_partner !== 'undefined') {
            setHasPartner(args.has_partner);
        }
        if (args.plan_type) {
            setPlanType(args.plan_type);
        }
    };

    // --- CALCULATION LOGIC ---
    const results = useMemo(() => {
        const isQuebec = province === 'QC';
        let data = {
            maternityWeekly: 0, maternityWeeks: p1Maternity ? (isQuebec ? 18 : 15) : 0, maternityTotal: 0,
            p1Weekly: 0, p1Weeks: p1Weeks, p1Total: 0,
            p2Weekly: 0, p2Weeks: p2Weeks, p2Total: 0,
            totalDuration: 0, totalValue: 0
        };

        const insurableCap = isQuebec ? EI_2025.QC_MAX_INSURABLE : EI_2025.MAX_INSURABLE;
        const p1Insurable = Math.min(salary, insurableCap);
        const p2Insurable = Math.min(partnerSalary, insurableCap);
        const isExtended = planType === 'EXTENDED';

        if (!isQuebec) {
            // Maternity
            data.maternityWeekly = Math.min(EI_2025.MAX_WEEKLY_STD, (p1Insurable * EI_2025.STD_RATE) / 52);
            data.maternityTotal = data.maternityWeekly * data.maternityWeeks;

            // Parental
            const pRate = isExtended ? EI_2025.EXT_RATE : EI_2025.STD_RATE;
            const pMax = isExtended ? EI_2025.MAX_WEEKLY_EXT : EI_2025.MAX_WEEKLY_STD;

            data.p1Weekly = Math.min(pMax, (p1Insurable * pRate) / 52);
            data.p1Total = data.p1Weekly * data.p1Weeks;

            data.p2Weekly = Math.min(pMax, (p2Insurable * pRate) / 52);
            data.p2Total = data.p2Weekly * data.p2Weeks;
        } else {
            // Simplified QC
            data.maternityWeekly = (p1Insurable * 0.70) / 52;
            data.maternityTotal = data.maternityWeekly * data.maternityWeeks;
            data.p1Weekly = (p1Insurable * 0.70) / 52;
            data.p1Total = data.p1Weekly * data.p1Weeks;
            data.p2Weekly = (p2Insurable * 0.70) / 52;
            data.p2Total = data.p2Weekly * data.p2Weeks;
        }

        data.totalDuration = data.maternityWeeks + data.p1Weeks + data.p2Weeks;
        data.totalValue = data.maternityTotal + data.p1Total + data.p2Total;
        return data;
    }, [province, salary, partnerSalary, hasPartner, planType, p1Weeks, p2Weeks, p1Maternity]);

    // Helpers
    const getMaxWeeks = () => {
        if (province === 'QC') return 32 + 5; 
        return planType === 'EXTENDED' ? 69 : 40;
    };
    const getIndividualMax = () => {
         if (province === 'QC') return 32; 
         return planType === 'EXTENDED' ? 61 : 35;
    };
    const combinedWeeks = p1Weeks + p2Weeks;
    const bonusWeeksActive = combinedWeeks > getIndividualMax();

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href).then(() => { 
            setCopySuccess(true); 
            setTimeout(() => setCopySuccess(false), 2000); 
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-rose-100" style={{ paddingBottom: activeTab === 'input' ? '100px' : '40px' }}>
            
            <main className="max-w-5xl mx-auto p-4 md:p-8 w-full mt-6">
                <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden mb-12">
                    {/* TABS */}
                    <div className="p-2 bg-slate-50 border-b">
                        <div className="flex bg-slate-200/50 p-1 rounded-2xl">
                            <button onClick={() => setActiveTab('input')} className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'input' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>1. Configure</button>
                            <button onClick={() => setActiveTab('results')} className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'results' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>2. Your Results</button>
                        </div>
                    </div>

                    <div className="p-4 md:p-10">
                        {activeTab === 'input' && (
                            <div className="animate-fade-in space-y-10">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                                    
                                    {/* --- SETTINGS --- */}
                                    <div className="space-y-8">
                                        
                                    {/* LOCATION */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-rose-600 font-black uppercase text-[10px] tracking-widest"><MapPinIcon size={16} /> Location & Plan</div>
                                        <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                                            <div>
                                                <label className="text-xs font-black text-slate-700 block mb-1.5 uppercase tracking-tighter">Province</label>
                                                <select value={province} onChange={(e) => setProvince(e.target.value)} className="w-full p-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-rose-500 outline-none shadow-sm font-medium">
                                                    <option value="ON">Ontario (EI)</option>
                                                    <option value="BC">British Columbia (EI)</option>
                                                    <option value="AB">Alberta (EI)</option>
                                                    <option value="QC">Quebec (QPIP)</option>
                                                    <option value="NS">Nova Scotia (EI)</option>
                                                    <option value="NB">New Brunswick (EI)</option>
                                                    <option value="MB">Manitoba (EI)</option>
                                                    <option value="SK">Saskatchewan (EI)</option>
                                                    <option value="PE">PEI (EI)</option>
                                                    <option value="NL">Newfoundland (EI)</option>
                                                    <option value="OTHER">Territories / Other (EI)</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-xs font-black text-slate-700 block mb-1.5 uppercase tracking-tighter">Plan Type</label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <button onClick={() => setPlanType('STANDARD')} className={`p-3 text-center rounded-2xl border-2 transition-all relative ${planType === 'STANDARD' ? 'border-rose-500 bg-rose-50 text-rose-900 shadow-sm' : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300'}`}>
                                                        {planType === 'STANDARD' && <div className="absolute top-2 right-2 text-rose-500"><CheckCircleIcon size={14}/></div>}
                                                        <div className="font-bold text-sm">Standard</div>
                                                        <div className="text-[10px] opacity-70 font-medium">12 Months (55%)</div>
                                                    </button>
                                                    <button onClick={() => setPlanType('EXTENDED')} className={`p-3 text-center rounded-2xl border-2 transition-all relative ${planType === 'EXTENDED' ? 'border-rose-500 bg-rose-50 text-rose-900 shadow-sm' : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300'}`}>
                                                        {planType === 'EXTENDED' && <div className="absolute top-2 right-2 text-rose-500"><CheckCircleIcon size={14}/></div>}
                                                        <div className="font-bold text-sm">Extended</div>
                                                        <div className="text-[10px] opacity-70 font-medium">18 Months (33%)</div>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* INCOMES */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-indigo-600 font-black uppercase text-[10px] tracking-widest"><UsersIcon size={16} /> Annual Income</div>
                                        
                                        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                                            {/* P1 */}
                                            <div>
                                                <div className="flex justify-between items-end mb-1.5">
                                                    <label className="text-xs font-bold text-slate-400 uppercase">Parent 1 (Birth)</label>
                                                    <button onClick={() => setSalary(currentMaxInsurable)} className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md font-bold hover:bg-indigo-100 transition-colors">
                                                        Set Max (${currentMaxInsurable.toLocaleString()})
                                                    </button>
                                                </div>
                                                <div className="relative group">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold group-focus-within:text-indigo-500 transition-colors">$</span>
                                                    <input type="number" value={salary} onChange={(e) => setSalary(parseInt(e.target.value)||0)} className="w-full pl-8 p-3 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-lg font-black focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                                                </div>
                                            </div>
                                            {/* P2 */}
                                            <div className="pt-4 border-t border-slate-100">
                                                <label className="flex items-center gap-3 cursor-pointer mb-4 select-none">
                                                    <div className={`w-12 h-6 rounded-full transition-colors relative ${hasPartner ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                                                        <input type="checkbox" checked={hasPartner} onChange={(e) => setHasPartner(e.target.checked)} className="sr-only" />
                                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${hasPartner ? 'left-7' : 'left-1'}`}></div>
                                                    </div>
                                                    <span className="font-bold text-slate-700 text-sm">Include Partner?</span>
                                                </label>
                                                
                                                {hasPartner && (
                                                    <div className="animate-fade-in">
                                                        <div className="flex justify-between items-end mb-1.5">
                                                            <label className="text-xs font-bold text-slate-400 uppercase">Parent 2 (Non-Birth)</label>
                                                            <button onClick={() => setPartnerSalary(currentMaxInsurable)} className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md font-bold hover:bg-emerald-100 transition-colors">
                                                                Set Max (${currentMaxInsurable.toLocaleString()})
                                                            </button>
                                                        </div>
                                                        <div className="relative group">
                                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold group-focus-within:text-emerald-500 transition-colors">$</span>
                                                            <input type="number" value={partnerSalary} onChange={(e) => setPartnerSalary(parseInt(e.target.value)||0)} className="w-full pl-8 p-3 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-lg font-black focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    </div>

                                    {/* --- ALLOCATION SLIDERS --- */}
                                    <div className="space-y-6">
                                         <div className="flex items-center gap-2 text-emerald-600 font-black uppercase text-[10px] tracking-widest"><SlidersIcon size={16} /> Strategy & Allocation</div>
                                         
                                         <div className="bg-slate-900 text-white p-6 md:p-8 rounded-[2rem] shadow-2xl space-y-8 relative overflow-hidden ring-1 ring-white/10">
                                            {/* Glow Effect */}
                                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

                                            {/* Maternity Toggle */}
                                            <div className="relative z-10 flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
                                                <div>
                                                    <div className="font-bold text-sm text-rose-300">Maternity Leave</div>
                                                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Exclusive to Parent 1</div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-xl font-black tabular-nums ${p1Maternity ? 'text-white' : 'text-slate-600'}`}>{p1Maternity ? (province === 'QC' ? 18 : 15) : 0} <span className="text-xs font-bold text-slate-500">Wks</span></span>
                                                    <button onClick={() => setP1Maternity(!p1Maternity)} className={`w-12 h-6 rounded-full transition-colors relative ${p1Maternity ? 'bg-rose-500' : 'bg-slate-700'}`}>
                                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${p1Maternity ? 'left-7' : 'left-1'}`}></div>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Parental Sliders */}
                                            <div className="relative z-10 space-y-8">
                                                
                                                {/* Visual Pool Meter */}
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-end">
                                                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Shared Pool</span>
                                                        {bonusWeeksActive ? (
                                                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500 text-slate-900 flex items-center gap-1 animate-fade-in">
                                                                <SparklesIcon size={10} /> Bonus Weeks Active!
                                                            </span>
                                                        ) : (
                                                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                                                                Standard Pool
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="h-3 bg-slate-800 rounded-full overflow-hidden flex border border-white/5 relative">
                                                        {/* Marker for the Bonus Threshold */}
                                                        <div className="absolute top-0 bottom-0 w-0.5 bg-slate-900 z-20 opacity-50" style={{ left: `${(getIndividualMax() / getMaxWeeks()) * 100}%` }}></div>
                                                        <div style={{ width: `${(p1Weeks / getMaxWeeks()) * 100}%` }} className="bg-indigo-500 transition-all duration-300 z-10"></div>
                                                        <div style={{ width: `${(p2Weeks / getMaxWeeks()) * 100}%` }} className={`transition-all duration-300 z-10 ${bonusWeeksActive ? 'bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)]' : 'bg-emerald-600'}`}></div>
                                                    </div>
                                                </div>

                                                <div className="space-y-6">
                                                    {/* Parent 1 Slider */}
                                                    <div className="space-y-3">
                                                        <div className="flex justify-between text-sm items-end">
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-indigo-300">Parent 1 (Birth)</span>
                                                                <span className="text-[10px] text-indigo-300/60 uppercase font-bold tracking-wider">Parental Weeks</span>
                                                            </div>
                                                            <span className="font-black text-2xl tabular-nums">{p1Weeks}</span>
                                                        </div>
                                                        <input 
                                                            type="range" 
                                                            min="0" 
                                                            max={getIndividualMax()} 
                                                            value={p1Weeks} 
                                                            onChange={(e) => handleWeeksChange(1, e.target.value)}
                                                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all"
                                                        />
                                                    </div>

                                                    {/* Parent 2 Slider */}
                                                    <div className={`space-y-3 transition-all duration-300 ${!hasPartner ? 'opacity-30 pointer-events-none blur-sm grayscale' : ''}`}>
                                                        <div className="flex justify-between text-sm items-end">
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-emerald-300">Parent 2 (Non-Birth)</span>
                                                                <span className="text-[10px] text-emerald-300/60 uppercase font-bold tracking-wider">Parental Weeks</span>
                                                            </div>
                                                            <span className="font-black text-2xl tabular-nums">{p2Weeks}</span>
                                                        </div>
                                                        <input 
                                                            type="range" 
                                                            min="0" 
                                                            max={getIndividualMax()} 
                                                            value={p2Weeks} 
                                                            onChange={(e) => handleWeeksChange(2, e.target.value)}
                                                            className={`w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer hover:accent-emerald-400 transition-all ${bonusWeeksActive ? 'accent-emerald-400' : 'accent-emerald-600'}`}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Total Check */}
                                                <div className="bg-white/5 rounded-xl p-4 flex justify-between items-center text-xs border border-white/5">
                                                    <span className="text-slate-400 font-bold">Total Shared Weeks</span>
                                                    <span className={`font-black text-base ${p1Weeks + p2Weeks === getMaxWeeks() ? 'text-emerald-400' : 'text-white'}`}>
                                                        {p1Weeks + p2Weeks} / {getMaxWeeks()}
                                                    </span>
                                                </div>
                                            </div>
                                         </div>
                                    </div>
                                </div>

                                {/* --- HYBRID: DESKTOP INLINE ACTION BAR (UPDATED) --- */}
                                <div className="hidden md:flex justify-between items-center bg-slate-50 p-6 rounded-3xl border border-slate-200 mt-8">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Estimated Total Benefit</span>
                                        <div className="text-4xl font-black text-slate-900 tracking-tighter">
                                            ${Math.round(results.totalValue).toLocaleString()} <span className="text-sm text-slate-400 font-bold">Total</span>
                                        </div>
                                    </div>
                                    
                                    {/* ADDED: Action Buttons Container */}
                                    <div className="flex items-center gap-3">
                                        {/* SHARE BUTTON */}
                                        <button 
                                            onClick={copyLink}
                                            className="bg-white text-rose-600 py-4 px-6 rounded-2xl border border-rose-100 shadow-sm hover:shadow-md hover:bg-rose-50 transition-all flex items-center gap-2 font-bold text-xs uppercase tracking-wider active:scale-95"
                                        >
                                            {copySuccess ? <CheckIcon size={18}/> : <LinkIcon size={18}/>}
                                            {copySuccess ? 'Copied!' : 'Share'}
                                        </button>

                                        {/* VIEW PLAN BUTTON */}
                                        <button 
                                            onClick={() => { setActiveTab('results'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                                            className="bg-rose-600 hover:bg-rose-700 text-white font-black py-4 px-12 rounded-2xl shadow-xl shadow-rose-200 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center gap-3 uppercase tracking-widest text-xs"
                                        >
                                            View Your Plan <ArrowRightIcon size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'results' && (
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
                        )}
                    </div>
                </div>
            </main>

            {/* HYBRID: MOBILE FLOATING FOOTER */}
            {isVisible && activeTab === 'input' && mounted && createPortal(
                <div 
                    className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 p-4 z-[9999] animate-slide-up shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]" 
                    style={{ width: '100%' }}
                >
                    <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Benefit</span>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-3xl font-black text-slate-900 tracking-tighter">${Math.round(results.totalValue).toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                             <button onClick={copyLink} className="bg-white text-indigo-600 p-3 md:py-4 md:px-6 rounded-[1.2rem] md:rounded-[1.5rem] border border-indigo-100 shadow-lg shadow-indigo-100/50 transition-all hover:bg-indigo-50 active:scale-95 flex items-center justify-center gap-2">
                               {copySuccess ? <CheckIcon size={20}/> : <LinkIcon size={20}/>}
                               <span className="hidden md:inline font-bold text-xs uppercase tracking-wider">{copySuccess ? 'Copied' : 'Share'}</span>
                             </button>
                            
                            <button onClick={() => { setActiveTab('results'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="bg-rose-600 hover:bg-rose-700 text-white font-black py-3.5 px-6 rounded-2xl shadow-lg shadow-rose-200 transition-all flex items-center gap-2 transform active:scale-95 whitespace-nowrap text-sm">
                                See My Results <ArrowRightIcon size={18} />
                            </button>
                        </div>
                    </div>
                </div>,
                document.body 
            )}

            {/* --- 3. THE AI COPILOT FLOATING WIDGET (PORTAL FIX) --- */}
            {mounted && createPortal(
                <AICopilot 
                    context={{
                        province,
                        salary,
                        partnerSalary,
                        planType,
                        hasPartner,
                        p1Weeks,
                        p2Weeks
                    }}
                    onUpdateCalculator={handleAIUpdate}
                />,
                document.body
            )}
        </div>
    );
}