// src/components/HouseholdBenefits.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine, Legend
} from 'recharts';

// ==========================================
//              ICONS
// ==========================================
const IconBase = ({ size = 20, className = "", children }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>{children}</svg>
);

const BabyIcon = (props) => (<IconBase {...props}><path d="M9 12h.01"/><path d="M15 12h.01"/><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 4 .7 5.6 1.8"/><path d="M12 3v2"/></IconBase>);
const UserPlusIcon = (props) => (<IconBase {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></IconBase>);
const TrashIcon = (props) => (<IconBase {...props}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></IconBase>);
const CalculatorIcon = (props) => (<IconBase {...props}><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></IconBase>);
const CheckIcon = (props) => (<IconBase {...props}><polyline points="20 6 9 17 4 12"/></IconBase>);
const LinkIcon = (props) => (<IconBase {...props}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></IconBase>);
const HelpCircleIcon = (props) => (<IconBase {...props}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></IconBase>);
const XIcon = (props) => (<IconBase {...props}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></IconBase>);
const ChevronDownIcon = (props) => (<IconBase {...props}><polyline points="6 9 12 15 18 9"/></IconBase>);
const DollarSignIcon = (props) => (<IconBase {...props}><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></IconBase>);
const TrendingDownIcon = (props) => (<IconBase {...props}><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></IconBase>);
const UsersIcon = (props) => (<IconBase {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></IconBase>);
const BriefcaseIcon = (props) => (<IconBase {...props}><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></IconBase>);
const LeafIcon = (props) => (<IconBase {...props}><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.77 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></IconBase>);
const HomeIcon = (props) => (<IconBase {...props}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></IconBase>);
const ArrowRightIcon = (props) => (<IconBase {...props}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></IconBase>);
const BarChartIcon = (props) => (<IconBase {...props}><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></IconBase>);
const CalendarIcon = (props) => (<IconBase {...props}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></IconBase>);
const ExternalLinkIcon = (props) => (<IconBase {...props}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></IconBase>);

// ==========================================
//              CONSTANTS
// ==========================================
const CCB_PARAMS = {
    MAX_UNDER_6: 7787,
    MAX_6_TO_17: 6570,
    THRESHOLD_1: 36502,
    THRESHOLD_2: 79051,
    PHASE_OUT: {
        1: { t1: 0.07, t2: 0.032 },
        2: { t1: 0.135, t2: 0.057 },
        3: { t1: 0.19, t2: 0.08 },
        4: { t1: 0.23, t2: 0.095 }
    }
};

const CDB_PARAMS = { MAX_AMOUNT: 3322, THRESHOLD: 79051 };

const GST_PARAMS = {
    ADULT_AMOUNT: 356, CHILD_AMOUNT: 187, SUPPLEMENT_MAX: 187,
    SUPPLEMENT_THRESHOLD: 11544, THRESHOLD: 45358, REDUCTION_RATE: 0.05
};

const PROV_PARAMS = {
    ON: { NAME: "Ontario Child Benefit", MAX_PER_CHILD: 1727, THRESHOLD: 25646, REDUCTION_RATE: 0.08, CAIP: { ADULT: 140, SPOUSE: 70, CHILD: 35 } },
    AB: { NAME: "Alberta Child Benefit", AMOUNTS: [1469, 735, 735, 735], THRESHOLD: 27024, REDUCTION_RATES: [0.0312, 0.0935, 0.1559, 0.2183], CAIP: { ADULT: 225, SPOUSE: 112.5, CHILD: 56.25 } },
    BC: { NAME: "BC Family Benefit", AMOUNTS: [2188, 1375, 1125], THRESHOLD: 35902, REDUCTION_RATE: 0.04, CAIP: { ADULT: 126, SPOUSE: 63, CHILD: 31.5 } },
    OTHER: { NAME: "Provincial Benefit", CAIP: null }
};

// ==========================================
//              COMPONENTS
// ==========================================
const Tooltip = ({ text }) => (
    <div className="group relative inline-flex items-center ml-1">
        <button type="button" className="text-slate-400 hover:text-indigo-600 transition-colors cursor-help">
            <HelpCircleIcon size={16} />
        </button>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-4 bg-slate-800 text-slate-50 text-xs rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 text-center leading-relaxed font-normal border border-slate-700">
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
        </div>
    </div>
);

const Accordion = ({ title, icon: Icon, children, defaultOpen = false }) => (
    <details className="group bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-4 transition-all duration-300" open={defaultOpen}>
        <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition select-none">
            <div className="flex items-center gap-4">
                <div className="text-indigo-600 bg-indigo-50 p-2.5 rounded-lg"><Icon size={20} /></div>
                <h3 className="font-bold text-slate-800">{title}</h3>
            </div>
            <div className="text-slate-400 transition-transform duration-300 group-open:rotate-180"><ChevronDownIcon size={20} /></div>
        </summary>
        <div className="p-6 pt-2 border-t border-slate-100 text-sm text-slate-600 leading-relaxed">{children}</div>
    </details>
);

export default function HouseholdBenefits() {
    const [grossAfni, setGrossAfni] = useState(65000); 
    const [workingIncome, setWorkingIncome] = useState(65000); 
    const [deductions, setDeductions] = useState(0); 
    const [children, setChildren] = useState([{ id: 1, age: 2, disability: false }]);
    const [sharedCustody, setSharedCustody] = useState(false);
    const [maritalStatus, setMaritalStatus] = useState('MARRIED'); 
    const [province, setProvince] = useState('ON');
    const [isRural, setIsRural] = useState(false);
    
    const [activeTab, setActiveTab] = useState('input');
    const [copySuccess, setCopySuccess] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    const afni = Math.max(0, (grossAfni || 0) - (deductions || 0));

    const addChild = () => {
        setChildren([...children, { id: Date.now(), age: 0, disability: false }]);
    };

    const removeChild = (id) => {
        setChildren(children.filter(c => c.id !== id));
    };

    const updateChild = (id, field, value) => {
        setChildren(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    const calculateAll = (netInc = 0, workInc = 0, childList = [], isShared = false, provCode = 'ON', status = 'MARRIED', rural = false) => {
        const totalChildren = childList.length;

        // CCB
        let fedMax = 0;
        childList.forEach(c => {
            if (c.age < 6) fedMax += CCB_PARAMS.MAX_UNDER_6;
            else if (c.age < 18) fedMax += CCB_PARAMS.MAX_6_TO_17;
            
            // Child Disability Benefit Logic
            if (c.disability && c.age < 18) {
                let db = CDB_PARAMS.MAX_AMOUNT;
                if (netInc > CDB_PARAMS.THRESHOLD) {
                    db = Math.max(0, db - (netInc - CDB_PARAMS.THRESHOLD) * 0.02);
                }
                fedMax += db;
            }
        });

        let fedReduction = 0;
        if (totalChildren > 0) {
            const rateKey = Math.min(totalChildren, 4);
            const { t1, t2 } = CCB_PARAMS.PHASE_OUT[rateKey];
            if (netInc > CCB_PARAMS.THRESHOLD_2) fedReduction = ((CCB_PARAMS.THRESHOLD_2 - CCB_PARAMS.THRESHOLD_1) * t1) + ((netInc - CCB_PARAMS.THRESHOLD_2) * t2);
            else if (netInc > CCB_PARAMS.THRESHOLD_1) fedReduction = (netInc - CCB_PARAMS.THRESHOLD_1) * t1;
        }
        let federalNet = Math.max(0, fedMax - fedReduction);

        // GST
        let gstAdd = (status === 'MARRIED') ? (GST_PARAMS.ADULT_AMOUNT + (totalChildren * GST_PARAMS.CHILD_AMOUNT)) : (totalChildren > 0 ? (GST_PARAMS.ADULT_AMOUNT + (totalChildren - 1) * GST_PARAMS.CHILD_AMOUNT) : Math.max(0, Math.min(GST_PARAMS.SUPPLEMENT_MAX, (netInc - GST_PARAMS.SUPPLEMENT_THRESHOLD) * 0.02)));
        let gstTotal = Math.max(0, (GST_PARAMS.ADULT_AMOUNT + gstAdd) - (netInc > GST_PARAMS.THRESHOLD ? (netInc - GST_PARAMS.THRESHOLD) * GST_PARAMS.REDUCTION_RATE : 0));

        // CAIP
        let caip = 0;
        if (PROV_PARAMS[provCode]?.CAIP) {
            const rates = PROV_PARAMS[provCode].CAIP;
            let quarterly = rates.ADULT + (status === 'MARRIED' ? rates.SPOUSE : 0) + (totalChildren * rates.CHILD);
            if (rural) quarterly *= 1.20;
            caip = quarterly * 4;
        }

        // Provincial
        let provNet = 0;
        let provName = PROV_PARAMS[provCode]?.NAME || "Provincial Benefit";
        if (totalChildren > 0 && provCode !== 'OTHER') {
            const p = PROV_PARAMS[provCode];
            if (provCode === 'ON') provNet = Math.max(0, (p.MAX_PER_CHILD * totalChildren) - (netInc > p.THRESHOLD ? (netInc - p.THRESHOLD) * p.REDUCTION_RATE : 0));
            else {
                let max = 0; p.AMOUNTS.forEach((amt, i) => { if(i < totalChildren) max += amt; });
                const rate = (provCode === 'AB') ? p.REDUCTION_RATES[Math.min(totalChildren, 4) - 1] : p.REDUCTION_RATE;
                provNet = Math.max(0, max - (netInc > p.THRESHOLD ? (netInc - p.THRESHOLD) * rate : 0));
            }
        }

        if (isShared) { federalNet *= 0.5; provNet *= 0.5; }
        const total = federalNet + provNet + gstTotal + caip;
        return { federal: federalNet, provincial: provNet, gst: gstTotal, caip, total, monthly: total / 12, provName };
    };

    const results = useMemo(() => calculateAll(afni, workingIncome, children, sharedCustody, province, maritalStatus, isRural), [afni, workingIncome, children, sharedCustody, province, maritalStatus, isRural]);

    const paymentCalendar = useMemo(() => {
        const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"];
        return months.map(m => {
            const isQuarterly = ["Jul", "Oct", "Jan", "Apr"].includes(m);
            const ccbMonthly = (results.federal + results.provincial) / 12;
            const quarterlyBonus = isQuarterly ? (results.gst / 4) + (results.caip / 4) : 0;
            return { month: m, total: ccbMonthly + quarterlyBonus, isQuarterly };
        });
    }, [results]);

    const chartData = useMemo(() => {
        const data = [];
        for (let inc = 0; inc <= 160000; inc += 5000) {
            const res = calculateAll(inc, inc, children, sharedCustody, province, maritalStatus, isRural);
            data.push({ income: inc, CCB: Math.round(res.federal), Provincial: Math.round(res.provincial), GST: Math.round(res.gst), Carbon: Math.round(res.caip) });
        }
        return data;
    }, [children, sharedCustody, province, maritalStatus, isRural]);

    const copyLink = () => {
        const params = new URLSearchParams();
        params.set('view', 'ccb');
        params.set('i', grossAfni.toString(36));
        const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
        navigator.clipboard.writeText(url).then(() => { setCopySuccess(true); setTimeout(() => setCopySuccess(false), 2000); });
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100" style={{ paddingBottom: activeTab === 'input' ? '180px' : '40px' }}>
            <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-6 py-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-tr from-emerald-500 to-teal-500 text-white p-2 rounded-lg shadow-lg"><BabyIcon size={24} /></div>
                        <div><h1 className="text-xl font-bold text-slate-900">Child & Family Benefits</h1><div className="text-xs font-medium text-slate-500 uppercase">2024-2025 Rules</div></div>
                    </div>
                    <button onClick={copyLink} className="text-sm font-bold text-indigo-600 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-indigo-50 transition-all border border-transparent hover:border-indigo-100">
                        {copySuccess ? <CheckIcon size={16} /> : <LinkIcon size={16} />}
                        {copySuccess ? "Copied" : "Share"}
                    </button>
                </div>
            </header>

            <main className="max-w-5xl mx-auto p-4 md:p-8 w-full">
                <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden mb-12">
                    <div className="p-2 bg-slate-50 border-b border-slate-200">
                        <div className="flex bg-slate-200/50 p-1 rounded-2xl">
                            <button onClick={() => setActiveTab('input')} className={`flex-1 py-2.5 text-sm font-bold text-center rounded-xl transition-all ${activeTab === 'input' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>1. Details</button>
                            <button onClick={() => setActiveTab('results')} className={`flex-1 py-2.5 text-sm font-bold text-center rounded-xl transition-all ${activeTab === 'results' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>2. Breakdown</button>
                        </div>
                    </div>

                    <div className="p-6 md:p-10">
                        {activeTab === 'input' && (
                            <div className="animate-fade-in space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                    <div className="md:col-span-1 space-y-6">
                                        <div className="flex items-center gap-2 text-indigo-600 font-black uppercase text-[10px] tracking-widest"><DollarSignIcon size={16} /> Financial Profile</div>
                                        <div className="bg-slate-50 p-6 rounded-3xl space-y-5 border border-slate-100 shadow-sm">
                                            <div>
                                                <label className="text-xs font-black text-slate-700 block mb-1 uppercase">Province</label>
                                                <select value={province} onChange={(e) => setProvince(e.target.value)} className="w-full p-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                                                    <option value="ON">Ontario</option><option value="AB">Alberta</option><option value="BC">British Columbia</option><option value="OTHER">Other</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-xs font-black text-slate-700 block mb-1 uppercase">Marital Status</label>
                                                <select value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)} className="w-full p-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                                                    <option value="MARRIED">Married / Common-Law</option><option value="SINGLE">Single Parent</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-1">Net Income <Tooltip text="Line 23600 of your tax return. For a couple, this is your combined income." /></label>
                                                <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span><input type="number" value={grossAfni} onChange={(e) => setGrossAfni(parseInt(e.target.value)||0)} className="w-full pl-9 p-3 bg-white border border-slate-200 rounded-2xl font-mono text-xl font-black text-slate-800" /></div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="flex items-center gap-3 cursor-pointer bg-white p-3 rounded-2xl border border-slate-200 text-sm font-bold text-slate-700 shadow-sm transition-all hover:border-indigo-200"><input type="checkbox" checked={isRural} onChange={(e) => setIsRural(e.target.checked)} className="w-5 h-5 text-emerald-600 rounded-lg" /><div className="flex flex-col"><span className="leading-none">Rural?</span><span className="text-[10px] text-slate-400 font-medium">+20% Carbon Rebate</span></div></label>
                                                <label className="flex items-center gap-3 cursor-pointer bg-white p-3 rounded-2xl border border-slate-200 text-sm font-bold text-slate-700 shadow-sm transition-all hover:border-indigo-200"><input type="checkbox" checked={sharedCustody} onChange={(e) => setSharedCustody(e.target.checked)} className="w-5 h-5 text-indigo-600 rounded-lg" /><span>Shared Custody?</span></label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-emerald-600 font-black uppercase text-[10px] tracking-widest"><UsersIcon size={16} /> Children</div>
                                            <button onClick={addChild} className="bg-emerald-600 text-white font-black px-5 py-2 rounded-2xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 flex items-center gap-2 text-sm">+ Add Child</button>
                                        </div>
                                        <div className="grid gap-4">
                                            {children.map((child, idx) => (
                                                <div key={child.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-6 items-center group hover:border-emerald-300 transition-all">
                                                    <div className="bg-emerald-50 text-emerald-600 w-12 h-12 rounded-full flex items-center justify-center font-black text-lg shrink-0 border border-emerald-100">{idx + 1}</div>
                                                    <div className="flex-1 w-full">
                                                        <div className="flex justify-between mb-3">
                                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Age: <span className="text-slate-900 text-lg">{child.age}</span></label>
                                                            <span className="text-[10px] font-black px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600 uppercase tracking-tighter">{child.age < 6 ? "Under 6 Rate" : "Standard Rate"}</span>
                                                        </div>
                                                        <input type="range" min="0" max="18" value={child.age} onChange={(e) => updateChild(child.id, 'age', parseInt(e.target.value))} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                                                    </div>
                                                    <div className="flex items-center gap-4 shrink-0">
                                                        <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl hover:bg-slate-50 transition group/check">
                                                            <input type="checkbox" checked={child.disability} onChange={(e) => updateChild(child.id, 'disability', e.target.checked)} className="w-5 h-5 text-emerald-600 rounded-lg" />
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-bold text-slate-700 group-hover/check:text-indigo-600 transition-colors flex items-center">
                                                                    Child Disability Benefit (DTC)
                                                                    <Tooltip text="Requires an approved Form T2201 (Disability Tax Credit Certificate) on file with the CRA. This adds up to $3,322 per year per child." />
                                                                </span>
                                                                <span className="text-[10px] text-slate-400 font-medium">Form T2201 required</span>
                                                            </div>
                                                        </label>
                                                        <button onClick={() => removeChild(child.id)} className="text-slate-300 hover:text-rose-500 p-2 transition-colors"><TrashIcon size={20}/></button>
                                                    </div>
                                                </div>
                                            ))}
                                            {children.length === 0 && <div className="text-center p-16 border-2 border-dashed rounded-3xl text-slate-400 font-bold bg-slate-50/50">Add a child to see CCB estimates.</div>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'results' && (
                            <div className="animate-fade-in space-y-10">
                                <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
                                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px]"></div>
                                    <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
                                        <div>
                                            <h2 className="text-emerald-400 text-xs font-black uppercase tracking-[0.2em] mb-2">Estimated Support</h2>
                                            <div className="flex items-baseline gap-2"><span className="text-7xl font-black tracking-tighter">${results.total.toLocaleString(undefined, {maximumFractionDigits: 0})}</span><span className="text-slate-400 text-xl font-bold">/ yr</span></div>
                                        </div>
                                        <div className="bg-white/5 rounded-3xl p-8 border border-white/10 backdrop-blur-xl space-y-6">
                                            <div className="flex justify-between items-center"><span className="text-slate-400 text-xs font-black uppercase tracking-widest">Monthly Average</span><span className="text-3xl font-black text-emerald-400 tracking-tighter">${Math.round(results.monthly).toLocaleString()}</span></div>
                                            <div className="flex h-5 w-full rounded-full overflow-hidden bg-white/10 p-1">
                                                <div style={{ width: `${(results.federal/results.total)*100}%` }} className="bg-blue-500 rounded-full mr-0.5 shadow-lg shadow-blue-500/50"></div>
                                                <div style={{ width: `${(results.provincial/results.total)*100}%` }} className="bg-emerald-500 rounded-full mr-0.5"></div>
                                                <div style={{ width: `${(results.gst/results.total)*100}%` }} className="bg-purple-500 rounded-full mr-0.5"></div>
                                                <div style={{ width: `${(results.caip/results.total)*100}%` }} className="bg-teal-500 rounded-full"></div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-tighter"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Federal CCB</div>
                                                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-tighter"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Prov Child</div>
                                                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-tighter"><div className="w-2 h-2 rounded-full bg-purple-500"></div> GST Credit</div>
                                                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-tighter"><div className="w-2 h-2 rounded-full bg-teal-500"></div> Carbon Rebate</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                                        <h3 className="font-black text-slate-800 mb-8 flex items-center gap-2 uppercase tracking-widest text-[10px]"><TrendingDownIcon size={18} className="text-indigo-600"/> Phase-out Curve</h3>
                                        <div className="h-[280px]">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={chartData}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                    <XAxis dataKey="income" hide />
                                                    <YAxis fontSize={10} axisLine={false} tickLine={false} />
                                                    <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '15px', color: '#f8fafc', fontWeight: 'bold' }} formatter={v => `$${v.toLocaleString()}`} />
                                                    <Area type="monotone" dataKey="CCB" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                                                    <Area type="monotone" dataKey="Provincial" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                                                    <Area type="monotone" dataKey="GST" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                                                    <ReferenceLine x={afni} stroke="#6366f1" strokeDasharray="8 8" label={{ position: 'top', value: 'YOU', fill: '#6366f1', fontSize: 10, fontWeight: '900' }} />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                                        <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-widest text-[10px]"><CalendarIcon size={18} className="text-indigo-600"/> Payment Schedule</h3>
                                        <div className="grid grid-cols-4 gap-2">
                                            {paymentCalendar.map((item, idx) => (
                                                <div key={idx} className={`p-3 rounded-2xl border text-center transition-all ${item.isQuarterly ? 'bg-indigo-50 border-indigo-100 ring-1 ring-indigo-200' : 'bg-slate-50 border-slate-100'}`}>
                                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{item.month}</div>
                                                    <div className={`text-sm font-black ${item.isQuarterly ? 'text-indigo-600' : 'text-slate-800'}`}>${Math.round(item.total)}</div>
                                                    {item.isQuarterly && <div className="text-[8px] font-bold text-indigo-400 uppercase leading-none mt-1">+Bonus</div>}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-6 p-4 bg-slate-50 rounded-2xl text-[10px] text-slate-500 font-bold italic border border-slate-100 text-center uppercase tracking-widest">* Payments depend on CRA schedule</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <Accordion title="Understanding the AFNI" icon={HelpCircleIcon}>
                                        Your <strong>Adjusted Family Net Income</strong> is the most important factor. It drives the reduction of benefits. For July 2024–June 2025, it uses your 2023 Line 23600 minus UCCB/RDSP.
                                    </Accordion>
                                    <Accordion title="Shared Custody" icon={UsersIcon}>
                                        If you have 40-60% shared custody, CRA pays each parent exactly 50% of the benefit they would get if the child lived with them full time.
                                    </Accordion>
                                    <Accordion title="Resources" icon={ExternalLinkIcon}>
                                        <ul className="space-y-2 text-indigo-600 font-bold">
                                            <li><a href="https://www.canada.ca/en/revenue-agency/services/child-family-benefits/canada-child-benefit-overview.html" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">CRA - CCB Overview <ExternalLinkIcon size={12}/></a></li>
                                            <li><a href="https://www.canada.ca/en/revenue-agency/services/child-family-benefits/cai-payment.html" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">Carbon Rebate <ExternalLinkIcon size={12}/></a></li>
                                        </ul>
                                    </Accordion>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* === PORTAL FOOTER === */}
            {activeTab === 'input' && mounted && createPortal(
                <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-5 z-[9999] animate-slide-up" style={{ position: 'fixed', bottom: 0, width: '100%' }}>
                    <div className="max-w-5xl mx-auto flex items-center justify-between gap-6">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Est. Annual Benefit</span>
                            <div className="flex items-baseline gap-1.5"><span className="text-4xl font-black text-slate-900 tracking-tighter">${Math.round(results.total).toLocaleString()}</span><span className="text-sm font-bold text-slate-400">/ yr</span></div>
                        </div>
                        <button onClick={() => { setActiveTab('results'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 px-10 rounded-2xl shadow-xl shadow-indigo-200 transition-all flex items-center gap-2 transform active:scale-95 whitespace-nowrap">View Details <ArrowRightIcon size={20} /></button>
                    </div>
                </div>,
                document.body 
            )}
        </div>
    );
}