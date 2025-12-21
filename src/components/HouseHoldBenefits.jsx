// src/components/HouseholdBenefits.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine, Legend, Label
} from 'recharts';

// ==========================================
//              ICONS
// ==========================================
const IconBase = ({ size = 20, className = "", children }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>{children}</svg>
);

const TrashIcon = (props) => (<IconBase {...props}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></IconBase>);
const HelpCircleIcon = (props) => (<IconBase {...props}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></IconBase>);
const ChevronDownIcon = (props) => (<IconBase {...props}><polyline points="6 9 12 15 18 9"/></IconBase>);
const DollarSignIcon = (props) => (<IconBase {...props}><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></IconBase>);
const TrendingDownIcon = (props) => (<IconBase {...props}><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></IconBase>);
const UsersIcon = (props) => (<IconBase {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></IconBase>);
const ArrowRightIcon = (props) => (<IconBase {...props}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></IconBase>);
const CalendarIcon = (props) => (<IconBase {...props}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></IconBase>);
const ExternalLinkIcon = (props) => (<IconBase {...props}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></IconBase>);
const InfoIcon = (props) => (<IconBase {...props}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></IconBase>);
const LinkIcon = (props) => (<IconBase {...props}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></IconBase>);
const CheckIcon = (props) => (<IconBase {...props}><polyline points="20 6 9 17 4 12"/></IconBase>);

// ==========================================
//              CONSTANTS (2025/2026 Benefit Year)
// ==========================================
const CCB_PARAMS = {
    MAX_UNDER_6: 7997, // Indexed for July 2025
    MAX_6_TO_17: 6748, // Indexed for July 2025
    THRESHOLD_1: 37487,
    THRESHOLD_2: 81222,
    PHASE_OUT: {
        1: { t1: 0.07, t2: 0.032 },
        2: { t1: 0.135, t2: 0.057 },
        3: { t1: 0.19, t2: 0.08 },
        4: { t1: 0.23, t2: 0.095 }
    }
};

const CDB_PARAMS = { MAX_AMOUNT: 3411, THRESHOLD: 81222 };

const GST_PARAMS = {
    // July 2025 Estimates
    ADULT_AMOUNT: 366, CHILD_AMOUNT: 192, SUPPLEMENT_MAX: 192,
    SUPPLEMENT_THRESHOLD: 11856, THRESHOLD: 46582, REDUCTION_RATE: 0.05
};

const PROV_PARAMS = {
    ON: { 
        NAME: "Ontario Child & Trillium", 
        // Ontario Child Benefit
        OCB: { MAX: 1803, THRESHOLD: 26343, RATE: 0.08 },
        // Ontario Sales Tax Credit (Trillium)
        OSTC: { MAX: 371, THRESHOLD_SINGLE: 28506, THRESHOLD_FAM: 35632, RATE: 0.04 },
        CAIP: { ADULT: 140, SPOUSE: 70, CHILD: 35 } 
    },
    AB: { 
        NAME: "Alberta Child & Family", 
        // Base Component (July 2025)
        BASE: { AMOUNTS: [1499, 749, 749, 749], THRESHOLD: 27565, RATES: [0.0312, 0.0935, 0.1559, 0.2183] },
        // Working Component
        WORKING: { AMOUNTS: [767, 698, 418, 138], THRESHOLD: 2760, CAP: 46191, RATE_IN: 0.15, RATE_OUT: 0.15 }, 
        CAIP: { ADULT: 225, SPOUSE: 112.5, CHILD: 56.25 } 
    },
    BC: { 
        NAME: "BC Family Benefit", 
        AMOUNTS: [2188, 1375, 1125], THRESHOLD: 35902, REDUCTION_RATE: 0.04, 
        CAIP: { ADULT: 126, SPOUSE: 63, CHILD: 31.5 } 
    },
    QC: {
        NAME: "Family Allowance",
        // Retraite Québec (2025 Indexed)
        FAM_ALLOW: { MAX: 3006, SINGLE_SUPP: 1055, THRESHOLD_COUPLE: 59369, THRESHOLD_SINGLE: 43280, RATE: 0.04 },
        CAIP: null // QC has no federal carbon rebate
    },
    OTHER: { NAME: "Provincial Benefit", CAIP: null }
};

// ==========================================
//              UI HELPERS
// ==========================================
const Tooltip = ({ text }) => (
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

const Accordion = ({ title, icon: Icon, children, defaultOpen = false }) => (
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
);

// ==========================================
//              MAIN COMPONENT
// ==========================================
export default function HouseholdBenefits() {
    const [grossAfni, setGrossAfni] = useState(65000); 
    const [children, setChildren] = useState([{ id: 1, age: 2, disability: false }]);
    const [sharedCustody, setSharedCustody] = useState(false);
    const [maritalStatus, setMaritalStatus] = useState('MARRIED'); 
    const [province, setProvince] = useState('ON');
    const [isRural, setIsRural] = useState(false);
    
    const [activeTab, setActiveTab] = useState('input');
    const [copySuccess, setCopySuccess] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isInputFocused, setIsInputFocused] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    // Mobile Keyboard Detection
    useEffect(() => {
        const handleFocus = (e) => {
            const tag = e.target.tagName; const type = e.target.type;
            if (tag === 'TEXTAREA' || (tag === 'INPUT' && !['checkbox', 'radio', 'range', 'submit', 'button', 'file', 'color'].includes(type))) setIsInputFocused(true);
        };
        const handleBlur = () => { setTimeout(() => setIsInputFocused(false), 100); };
        window.addEventListener('focus', handleFocus, true); window.addEventListener('blur', handleBlur, true);
        return () => { window.removeEventListener('focus', handleFocus, true); window.removeEventListener('blur', handleBlur, true); };
    }, []);

    const afni = Math.max(0, grossAfni || 0);

    // URL Loading Logic
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.toString()) {
            if (params.get('i')) setGrossAfni(parseInt(params.get('i'), 36));
            if (params.get('p')) setProvince(params.get('p'));
            if (params.get('ms')) setMaritalStatus(params.get('ms'));
            if (params.get('sc')) setSharedCustody(params.get('sc') === '1');
            if (params.get('r')) setIsRural(params.get('r') === '1');
            if (params.get('c')) {
                try {
                    const childData = params.get('c').split('_').map((str, idx) => {
                        const [age, dis] = str.split('-');
                        return { id: Date.now() + idx, age: parseInt(age) || 0, disability: dis === '1' };
                    });
                    setChildren(childData);
                } catch (e) { console.error("URL Load Error", e); }
            }
        }
    }, []);

    // Child Handlers
    const addChild = () => setChildren([...children, { id: Date.now(), age: 0, disability: false }]);
    const removeChild = (id) => setChildren(children.filter(c => c.id !== id));
    const updateChild = (id, field, value) => {
        setChildren(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    // Calculation Engine
    const calculateAll = (netInc = 0, childList = [], isShared = false, provCode = 'ON', status = 'MARRIED', rural = false) => {
        const totalChildren = childList.length;

        // 1. Federal CCB
        let fedMax = 0;
        childList.forEach(c => {
            if (c.age < 6) fedMax += CCB_PARAMS.MAX_UNDER_6;
            else if (c.age < 18) fedMax += CCB_PARAMS.MAX_6_TO_17;
            if (c.disability && c.age < 18) {
                let db = CDB_PARAMS.MAX_AMOUNT;
                if (netInc > CDB_PARAMS.THRESHOLD) db = Math.max(0, db - (netInc - CDB_PARAMS.THRESHOLD) * 0.02);
                fedMax += db;
            }
        });

        let fedReduction = 0;
        if (totalChildren > 0) {
            const rateKey = Math.min(totalChildren, 4);
            const rateData = CCB_PARAMS.PHASE_OUT[rateKey] || CCB_PARAMS.PHASE_OUT[4];
            const { t1, t2 } = rateData;
            if (netInc > CCB_PARAMS.THRESHOLD_2) fedReduction = ((CCB_PARAMS.THRESHOLD_2 - CCB_PARAMS.THRESHOLD_1) * t1) + ((netInc - CCB_PARAMS.THRESHOLD_2) * t2);
            else if (netInc > CCB_PARAMS.THRESHOLD_1) fedReduction = (netInc - CCB_PARAMS.THRESHOLD_1) * t1;
        }
        let federalNet = Math.max(0, fedMax - fedReduction);

        // 2. GST
        let gstAdd = (status === 'MARRIED') ? (GST_PARAMS.ADULT_AMOUNT + (totalChildren * GST_PARAMS.CHILD_AMOUNT)) : (totalChildren > 0 ? (GST_PARAMS.ADULT_AMOUNT + (totalChildren - 1) * GST_PARAMS.CHILD_AMOUNT) : Math.max(0, Math.min(GST_PARAMS.SUPPLEMENT_MAX, (netInc - GST_PARAMS.SUPPLEMENT_THRESHOLD) * 0.02)));
        let gstTotal = Math.max(0, (GST_PARAMS.ADULT_AMOUNT + gstAdd) - (netInc > GST_PARAMS.THRESHOLD ? (netInc - GST_PARAMS.THRESHOLD) * GST_PARAMS.REDUCTION_RATE : 0));

        // 3. Carbon (CAIP) - QC gets 0
        let caip = 0;
        if (provCode !== 'QC') {
            const provData = PROV_PARAMS[provCode] || PROV_PARAMS['OTHER'];
            if (provData && provData.CAIP) {
                const rates = provData.CAIP;
                let quarterly = rates.ADULT + (status === 'MARRIED' ? rates.SPOUSE : 0) + (totalChildren * rates.CHILD);
                if (rural) quarterly *= 1.20;
                caip = quarterly * 4;
            }
        }

        // 4. Provincial Benefits
        let provNet = 0;
        let provName = PROV_PARAMS[provCode]?.NAME || "Provincial Support";

        if (provCode === 'ON') {
            // Ontario Child Benefit
            if (totalChildren > 0) {
                const ocb = (PROV_PARAMS.ON.OCB.MAX * totalChildren);
                const ocbRed = netInc > PROV_PARAMS.ON.OCB.THRESHOLD ? (netInc - PROV_PARAMS.ON.OCB.THRESHOLD) * PROV_PARAMS.ON.OCB.RATE : 0;
                provNet += Math.max(0, ocb - ocbRed);
            }
            // Ontario Sales Tax Credit (OSTC)
            const ostcRate = PROV_PARAMS.ON.OSTC;
            let ostcMax = ostcRate.MAX; // Claimant
            if (status === 'MARRIED') ostcMax += ostcRate.MAX; // Spouse
            ostcMax += (totalChildren * ostcRate.MAX); // Children
            
            const ostcThreshold = (status === 'SINGLE' && totalChildren === 0) ? ostcRate.THRESHOLD_SINGLE : ostcRate.THRESHOLD_FAM;
            const ostcRed = netInc > ostcThreshold ? (netInc - ostcThreshold) * ostcRate.RATE : 0;
            
            // Add OSTC to provincial total (often paid via OTB)
            provNet += Math.max(0, ostcMax - ostcRed);

        } else if (provCode === 'AB') {
            // Alberta Child and Family Benefit
            if (totalChildren > 0) {
                const p = PROV_PARAMS.AB;
                // Base Component
                let baseMax = 0;
                p.BASE.AMOUNTS.forEach((amt, i) => { if(i < totalChildren) baseMax += amt; });
                const baseRate = p.BASE.RATES[Math.min(totalChildren, 4) - 1];
                const baseNet = Math.max(0, baseMax - (netInc > p.BASE.THRESHOLD ? (netInc - p.BASE.THRESHOLD) * baseRate : 0));

                // Working Component (Hump)
                // Proxy: Using Net Household Income as Working Income for estimate
                let workingMax = 0;
                p.WORKING.AMOUNTS.forEach((amt, i) => { if(i < totalChildren) workingMax += amt; });
                
                let workingNet = 0;
                if (netInc > p.WORKING.THRESHOLD) {
                     // Phase IN
                     let phasedIn = (netInc - p.WORKING.THRESHOLD) * p.WORKING.RATE_IN;
                     workingNet = Math.min(phasedIn, workingMax);
                     // Phase OUT
                     if (netInc > p.WORKING.CAP) {
                        const reduction = (netInc - p.WORKING.CAP) * p.WORKING.RATE_OUT;
                        workingNet = Math.max(0, workingNet - reduction);
                     }
                }
                provNet = baseNet + workingNet;
            }

        } else if (provCode === 'QC') {
            // Quebec Family Allowance
            if (totalChildren > 0) {
                const q = PROV_PARAMS.QC.FAM_ALLOW;
                let qMax = (totalChildren * q.MAX);
                if (status === 'SINGLE') qMax += q.SINGLE_SUPP;

                const qThreshold = status === 'SINGLE' ? q.THRESHOLD_SINGLE : q.THRESHOLD_COUPLE;
                const qRed = netInc > qThreshold ? (netInc - qThreshold) * q.RATE : 0;
                provNet = Math.max(0, qMax - qRed);
            }

        } else if (provCode === 'BC') {
            // BC Family Benefit
            if (totalChildren > 0) {
                const p = PROV_PARAMS.BC;
                let max = 0; p.AMOUNTS.forEach((amt, i) => { if(i < totalChildren) max += amt; });
                provNet = Math.max(0, max - (netInc > p.THRESHOLD ? (netInc - p.THRESHOLD) * p.REDUCTION_RATE : 0));
            }
        }

        if (isShared) { federalNet *= 0.5; provNet *= 0.5; }
        const total = federalNet + provNet + gstTotal + caip;
        return { federal: federalNet, provincial: provNet, gst: gstTotal, caip, total, monthly: total / 12, provName };
    };

    const results = useMemo(() => calculateAll(afni, children, sharedCustody, province, maritalStatus, isRural), [afni, children, sharedCustody, province, maritalStatus, isRural]);

    // Graph Data
    const chartData = useMemo(() => {
        const data = [];
        for (let inc = 0; inc <= 180000; inc += 5000) {
            const res = calculateAll(inc, children, sharedCustody, province, maritalStatus, isRural);
            data.push({ 
                income: inc, 
                CCB: Math.round(res.federal), 
                Provincial: Math.round(res.provincial), 
                Credits: Math.round(res.gst + res.caip) 
            });
        }
        return data;
    }, [children, sharedCustody, province, maritalStatus, isRural]);

    // Schedule logic
    const paymentSchedule = useMemo(() => {
        const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"];
        return months.map(m => {
            const isQuarterly = ["Jul", "Oct", "Jan", "Apr"].includes(m);
            // Monthly base
            let base = (results.federal) / 12;
            
            // Provincial Schedules
            if (province === 'ON') {
                // OTB is usually monthly if > $360, but simplified here to monthly spread for UI cleanliness
                base += (results.provincial / 12);
            } else if (province === 'AB' || province === 'QC') {
                // AB ACFB is Quarterly (Aug, Nov, Feb, May)
                const isAbQuarter = ["Aug", "Nov", "Feb", "May"].includes(m);
                if (province === 'QC') isAbQuarter ? base += (results.provincial / 4) : base += 0; // QC is quarterly
                else isAbQuarter ? base += (results.provincial / 4) : base += 0; // AB is quarterly
            } else {
                base += (results.provincial / 12); // BC is monthly
            }

            // GST/Carbon
            const extra = isQuarterly ? (results.gst / 4) + (results.caip / 4) : 0;
            
            return { month: m, total: base + extra, isQuarterly: (isQuarterly || (["Aug", "Nov", "Feb", "May"].includes(m) && (province === 'AB' || province === 'QC'))) };
        });
    }, [results, province]);

    const copyLink = () => {
        const params = new URLSearchParams();
        params.set('view', 'ccb');
        params.set('i', grossAfni.toString(36));
        params.set('p', province);
        params.set('ms', maritalStatus);
        params.set('sc', sharedCustody ? '1' : '0');
        params.set('r', isRural ? '1' : '0');
        params.set('c', children.map(c => `${c.age}-${c.disability ? 1 : 0}`).join('_'));
        const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
        navigator.clipboard.writeText(url).then(() => { setCopySuccess(true); setTimeout(() => setCopySuccess(false), 2000); });
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100" style={{ paddingBottom: activeTab === 'input' ? '180px' : '40px' }}>
            
            <main className="max-w-5xl mx-auto p-4 md:p-8 w-full mt-6">
                <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden mb-12">
                    {/* TABS */}
                    <div className="p-2 bg-slate-50 border-b">
                        <div className="flex bg-slate-200/50 p-1 rounded-2xl">
                            <button onClick={() => setActiveTab('input')} className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'input' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>1. Household Inputs</button>
                            <button onClick={() => setActiveTab('results')} className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'results' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>2. View Entitlement</button>
                        </div>
                    </div>

                    <div className="p-4 md:p-10">
                        {activeTab === 'input' && (
                            <div className="animate-fade-in space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-2 text-indigo-600 font-black uppercase text-[10px] tracking-widest"><DollarSignIcon size={16} /> Household Profile</div>
                                        <div className="bg-slate-50 p-5 md:p-6 rounded-3xl space-y-5 border border-slate-100 shadow-sm">
                                            <div>
                                                <label className="text-xs font-black text-slate-700 block mb-1.5 uppercase tracking-tighter">Province</label>
                                                <select value={province} onChange={(e) => setProvince(e.target.value)} className="w-full p-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all font-medium">
                                                    <option value="ON">Ontario (ON)</option>
                                                    <option value="AB">Alberta (AB)</option>
                                                    <option value="BC">British Columbia (BC)</option>
                                                    <option value="QC">Quebec (QC)</option>
                                                    <option value="OTHER">Other Provinces</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-xs font-black text-slate-700 block mb-1.5 uppercase tracking-tighter">Marital Status</label>
                                                <select value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)} className="w-full p-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all font-medium">
                                                    <option value="MARRIED">Married / Common-Law</option><option value="SINGLE">Single Parent</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Net Household Income</label>
                                                <div className="relative group">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold group-focus-within:text-indigo-500 transition-colors">$</span>
                                                    <input type="number" value={grossAfni} onChange={(e) => setGrossAfni(parseInt(e.target.value)||0)} className="w-full pl-9 p-3 bg-white border border-slate-200 rounded-2xl font-mono text-xl font-black text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                                                </div>
                                            </div>
                                            <div className="space-y-3 pt-2">
                                                <label className="flex items-center gap-3 cursor-pointer bg-white p-3 rounded-2xl border border-slate-200 text-sm font-bold transition-all hover:border-indigo-200 shadow-sm group">
                                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${sharedCustody ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-slate-50'}`}>
                                                        <input type="checkbox" checked={sharedCustody} onChange={(e) => setSharedCustody(e.target.checked)} className="sr-only" />
                                                        {sharedCustody && <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg>}
                                                    </div>
                                                    <div className="flex flex-col"><span className="leading-none group-hover:text-indigo-600 transition-colors">Shared Custody?</span><span className="text-[9px] text-slate-400 uppercase font-black tracking-wider mt-1">40-60% split</span></div>
                                                </label>
                                                {province !== 'QC' && (
                                                <label className="flex items-center gap-3 cursor-pointer bg-white p-3 rounded-2xl border border-slate-200 text-sm font-bold transition-all hover:border-emerald-200 shadow-sm group">
                                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isRural ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-slate-50'}`}>
                                                        <input type="checkbox" checked={isRural} onChange={(e) => setIsRural(e.target.checked)} className="sr-only" />
                                                        {isRural && <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg>}
                                                    </div>
                                                    <div className="flex flex-col"><span className="leading-none group-hover:text-emerald-600 transition-colors">Rural Area?</span><span className="text-[9px] text-slate-400 uppercase font-black tracking-wider mt-1">+20% Carbon Rebate</span></div>
                                                </label>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Children Column */}
                                    <div className="md:col-span-2 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-emerald-600 font-black uppercase text-[10px] tracking-widest"><UsersIcon size={16} /> Children</div>
                                            <button onClick={addChild} className="bg-emerald-600 text-white font-black px-4 py-2 md:px-6 md:py-2.5 rounded-2xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 text-xs md:text-sm flex items-center gap-2 transform active:scale-95">+ Add Child</button>
                                        </div>
                                        <div className="grid gap-5">
                                            {children.map((child, idx) => (
                                                <div key={child.id} className="bg-white p-5 md:p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-6 md:gap-8 items-center group hover:border-emerald-300 transition-all relative">
                                                    <div className="bg-emerald-50 text-emerald-600 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-black text-lg md:text-xl shrink-0 border-2 border-emerald-100">{idx + 1}</div>
                                                    <div className="flex-1 w-full">
                                                        <div className="flex justify-between mb-4">
                                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Child Age: <span className="text-slate-900 text-xl">{child.age}</span></label>
                                                            <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[9px] md:text-[10px] font-black uppercase tracking-tighter shadow-inner border border-emerald-100">
                                                                {child.age < 6 ? "Max Rate" : "Std Rate"}
                                                            </div>
                                                        </div>
                                                        <input type="range" min="0" max="18" value={child.age} onChange={(e) => updateChild(child.id, 'age', parseInt(e.target.value))} className="w-full h-2.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 bg-slate-50/50 p-3 rounded-2xl border border-slate-100 w-full sm:w-auto">
                                                        <label className="flex items-center gap-3 cursor-pointer select-none group/dis w-full sm:w-auto">
                                                            <input type="checkbox" checked={child.disability} onChange={(e) => updateChild(child.id, 'disability', e.target.checked)} className="w-6 h-6 text-emerald-600 rounded-lg border-slate-300" />
                                                            <div className="flex flex-col">
                                                                <span className="text-xs font-black text-slate-700 group-hover/dis:text-emerald-600 transition-colors">Disability (DTC)</span>
                                                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Required T2201 <Tooltip text="Requires an approved Form T2201 (Disability Tax Credit Certificate) on file with the CRA. This adds up to $3,411 per year per child." /></span>
                                                            </div>
                                                        </label>
                                                        <div className="w-full h-px sm:w-px sm:h-8 bg-slate-200"></div>
                                                        <button onClick={() => removeChild(child.id)} className="text-slate-300 hover:text-rose-500 p-2 transition-all transform hover:scale-110 active:scale-90 w-full sm:w-auto flex justify-center"><TrashIcon size={22}/></button>
                                                    </div>
                                                </div>
                                            ))}
                                            {children.length === 0 && <div className="text-center p-10 md:p-20 border-2 border-dashed rounded-[2.5rem] text-slate-400 font-black uppercase tracking-widest text-xs bg-slate-50/50">Add a child to begin estimating CCB Support</div>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'results' && (
                            <div className="animate-fade-in space-y-8 md:space-y-10">
                                {/* Result Hero */}
                                <div className="bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 text-white relative overflow-hidden shadow-2xl ring-1 ring-white/10">
                                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-60 h-60 md:w-96 md:h-96 bg-emerald-500/20 rounded-full blur-[80px] md:blur-[100px] pointer-events-none"></div>
                                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 md:w-96 md:h-96 bg-indigo-500/20 rounded-full blur-[80px] md:blur-[100px] pointer-events-none"></div>
                                    
                                    <div className="relative z-10 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                                        <div className="text-center md:text-left">
                                            <h2 className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Total Estimated Support</h2>
                                            <div className="flex items-baseline justify-center md:justify-start gap-2 flex-wrap">
                                                <span className="text-5xl md:text-7xl font-black tracking-tighter drop-shadow-xl">${results.total.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                                                <span className="text-slate-400 text-lg md:text-xl font-bold tracking-tight">/ year</span>
                                            </div>
                                            <div className="mt-6 flex flex-col gap-2">
                                                <p className="text-slate-400 text-sm font-bold tracking-tight flex items-center justify-center md:justify-start gap-2 bg-white/5 inline-flex self-center md:self-start px-4 py-2 rounded-full border border-white/5">
                                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                                    ~${Math.round(results.monthly).toLocaleString()} Average Monthly Support
                                                </p>
                                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest pl-0 md:pl-4 mt-2">Non-taxable federal & provincial assistance</p>
                                            </div>
                                        </div>
                                        <div className="bg-white/5 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8 border border-white/10 backdrop-blur-xl shadow-inner">
                                            <div className="flex h-4 md:h-6 w-full rounded-full overflow-hidden bg-white/10 p-1 mb-4 md:mb-6">
                                                <div style={{ width: `${(results.federal/results.total)*100}%` }} className="bg-blue-500 rounded-full mr-0.5 shadow-lg shadow-blue-500/50"></div>
                                                <div style={{ width: `${(results.provincial/results.total)*100}%` }} className="bg-emerald-500 rounded-full mr-0.5 shadow-lg shadow-emerald-500/50"></div>
                                                <div style={{ width: `${((results.gst + results.caip)/results.total)*100}%` }} className="bg-indigo-500 rounded-full"></div>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                                <div className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-300 tracking-tighter"><div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm"></div> Federal CCB</div>
                                                <div className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-300 tracking-tighter"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm"></div> {results.provName}</div>
                                                <div className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-300 tracking-tighter"><div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-sm"></div> GST & Carbon Credits</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Phase out Chart */}
                                    <div className="bg-white p-4 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
                                        <h3 className="font-black text-slate-800 mb-6 md:mb-8 flex items-center gap-2 uppercase tracking-widest text-[10px]"><TrendingDownIcon size={18} className="text-indigo-600"/> Income Phase-out Curve</h3>
                                        <div className="h-[250px] md:h-[320px] w-full -ml-4 md:ml-0">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 20 }}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                    <XAxis dataKey="income" fontSize={10} tickFormatter={v => `$${v/1000}k`} axisLine={false} tickLine={false}>
                                                        <Label value="Net Income" offset={-15} position="insideBottom" fontSize={10} fontWeight="900" fill="#94a3b8" />
                                                    </XAxis>
                                                    <YAxis fontSize={10} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}k`} />
                                                    <RechartsTooltip 
                                                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '15px', color: '#f8fafc', fontWeight: 'bold', fontSize: '11px' }}
                                                        formatter={(v, name) => [`$${v.toLocaleString()}`, name]} 
                                                        labelFormatter={(l) => `Income: $${l.toLocaleString()}`}
                                                    />
                                                    <Legend verticalAlign="top" align="right" height={36} iconType="circle" wrapperStyle={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', paddingBottom: '10px' }} />
                                                    <Area type="monotone" dataKey="CCB" name="Fed CCB" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                                                    <Area type="monotone" dataKey="Provincial" name="Provincial" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                                                    <Area type="monotone" dataKey="Credits" name="GST/Carbon" stackId="1" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                                                    <ReferenceLine x={afni} stroke="#6366f1" strokeDasharray="8 8" label={{ position: 'top', value: 'YOU', fill: '#6366f1', fontSize: 10, fontWeight: '900' }} />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* Monthly Schedule */}
                                    <div className="bg-white p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col">
                                        <h3 className="font-black text-slate-800 mb-6 md:mb-8 flex items-center gap-2 uppercase tracking-widest text-[10px]"><CalendarIcon size={18} className="text-indigo-600"/> Payment Schedule</h3>
                                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 flex-1">
                                            {paymentSchedule.map((item, idx) => (
                                                <div key={idx} className={`p-3 md:p-4 rounded-[1rem] md:rounded-[1.5rem] border text-center transition-all flex flex-col justify-center items-center shadow-sm ${item.isQuarterly ? 'bg-indigo-50 border-indigo-100 ring-2 ring-indigo-500/10' : 'bg-slate-50 border-slate-100'}`}>
                                                    <div className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.month}</div>
                                                    <div className={`text-sm md:text-base font-black tracking-tighter ${item.isQuarterly ? 'text-indigo-600' : 'text-slate-800'}`}>${Math.round(item.total)}</div>
                                                    {item.isQuarterly && <div className="text-[6px] md:text-[7px] font-black text-indigo-400 uppercase tracking-tighter mt-1">+Bonus</div>}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-6 md:mt-8 p-4 bg-slate-900 rounded-2xl flex items-center gap-3 border-2 border-indigo-500/20">
                                            <div className="p-2 bg-white/10 rounded-lg text-indigo-400"><InfoIcon size={16}/></div>
                                            <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest leading-relaxed">
                                                CCB/Provincial: 20th <br/>
                                                GST: 5th | Carbon: 15th (Quarterly)
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* FAQ Section */}
                                <div className="max-w-3xl mx-auto w-full space-y-4">
                                    <Accordion title="Understanding Net Income (AFNI)" icon={HelpCircleIcon}>
                                        <p>Your <strong>Adjusted Family Net Income</strong> is the primary driver of benefit reductions (clawbacks). For the benefit year of July 2025 to June 2026, the government looks at your <strong>2024 Tax Return</strong>. Specifically, it uses <strong>Line 23600</strong> (Net Income) minus any UCCB or RDSP income received.</p>
                                    </Accordion>
                                    <Accordion title="Shared Custody Rules" icon={UsersIcon}>
                                        <p>If you have a 40-60% shared custody arrangement that has been registered with the CRA, each parent receives exactly <strong>50% of the benefit amount</strong> they would have received if the child lived with them full-time. The amount is calculated based on each parent's individual household income.</p>
                                    </Accordion>
                                    <Accordion title="Official CRA Resources" icon={ExternalLinkIcon}>
                                        <div className="flex flex-col gap-4">
                                            <a href="https://www.canada.ca/en/revenue-agency/services/child-family-benefits/canada-child-benefit-overview.html" target="_blank" className="flex items-center justify-between p-4 bg-indigo-50 rounded-2xl group transition-all hover:bg-indigo-100">
                                                <div className="flex items-center gap-3"><DollarSignIcon className="text-indigo-600" /> <span className="font-bold text-indigo-900 text-sm">CRA CCB Overview</span></div>
                                                <ExternalLinkIcon size={16} className="text-indigo-400 group-hover:translate-x-1 transition-transform" />
                                            </a>
                                            <a href="https://www.canada.ca/en/revenue-agency/services/child-family-benefits/goods-services-tax-harmonized-sales-tax-credit.html" target="_blank" className="flex items-center justify-between p-4 bg-emerald-5 rounded-2xl group transition-all hover:bg-emerald-100">
                                                <div className="flex items-center gap-3"><DollarSignIcon className="text-emerald-600" /> <span className="font-bold text-emerald-900 text-sm">GST/HST Credit Rules</span></div>
                                                <ExternalLinkIcon size={16} className="text-emerald-400 group-hover:translate-x-1 transition-transform" />
                                            </a>
                                        </div>
                                    </Accordion>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Live Estimate Portal - Hidden if typing */}
            {activeTab === 'input' && mounted && !isInputFocused && createPortal(
                <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 md:p-5 z-[9999] animate-slide-up shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]" style={{ position: 'fixed', bottom: 0, width: '100%' }}>
                    <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 md:gap-6">
                        <div className="flex flex-col">
                            <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Est. Total Benefits</span>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">
                                    ${Math.round(results.total).toLocaleString()}
                                </span>
                                <span className="text-xs font-black text-slate-400 uppercase">/ yr</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                             <button onClick={copyLink} className="bg-white text-indigo-600 p-3 md:py-4 md:px-6 rounded-[1.2rem] md:rounded-[1.5rem] border border-indigo-100 shadow-lg shadow-indigo-100/50 transition-all hover:bg-indigo-50 active:scale-95 flex items-center justify-center gap-2">
                               {copySuccess ? <CheckIcon size={20}/> : <LinkIcon size={20}/>}
                               <span className="hidden md:inline font-bold text-xs uppercase tracking-wider">{copySuccess ? 'Copied' : 'Share'}</span>
                             </button>
                            
                            <button onClick={() => { setActiveTab('results'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 px-6 md:py-4 md:px-12 rounded-[1.2rem] md:rounded-[1.5rem] shadow-xl shadow-indigo-200 transition-all flex items-center gap-2 transform active:scale-95 whitespace-nowrap uppercase tracking-widest text-[10px]">
                                View Full Breakdown <ArrowRightIcon size={18} />
                            </button>
                        </div>
                    </div>
                </div>,
                document.body 
            )}
        </div>
    );
}