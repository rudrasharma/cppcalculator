import React, { useState, useEffect, useMemo } from 'react';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip as RechartsTooltip, 
    ResponsiveContainer, 
    ReferenceLine,
    Legend
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
const MapPinIcon = (props) => (<IconBase {...props}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></IconBase>);
const BriefcaseIcon = (props) => (<IconBase {...props}><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></IconBase>);
const LeafIcon = (props) => (<IconBase {...props}><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.77 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></IconBase>);
const HomeIcon = (props) => (<IconBase {...props}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></IconBase>);
const RotateCcwIcon = (props) => (<IconBase {...props}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></IconBase>);
const ArrowRightIcon = (props) => (<IconBase {...props}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></IconBase>);
const BookOpenIcon = (props) => (<IconBase {...props}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></IconBase>);
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

const CWB_PARAMS = {
    SINGLE: { MAX: 1518, THRESHOLD_MIN: 3000, THRESHOLD_MAX: 24569, REDUCTION_START: 24569, REDUCTION_RATE: 0.12 },
    FAMILY: { MAX: 2616, THRESHOLD_MIN: 3000, THRESHOLD_MAX: 28494, REDUCTION_START: 28494, REDUCTION_RATE: 0.12 },
    PHASE_IN_RATE: 0.26
};

const PROV_PARAMS = {
    ON: {
        NAME: "Ontario Child Benefit", MAX_PER_CHILD: 1727, THRESHOLD: 25646, REDUCTION_RATE: 0.08,
        CAIP: { ADULT: 140, SPOUSE: 70, CHILD: 35 }
    },
    AB: {
        NAME: "Alberta Child & Family Benefit", AMOUNTS: [1469, 735, 735, 735], THRESHOLD: 27024,
        REDUCTION_RATES: [0.0312, 0.0935, 0.1559, 0.2183],
        CAIP: { ADULT: 225, SPOUSE: 112.5, CHILD: 56.25 }
    },
    OTHER: {
        NAME: "Provincial Benefit (Not Calculated)",
        CAIP: null 
    }
};

// ==========================================
//              UI COMPONENTS
// ==========================================

const Tooltip = ({ text }) => (
    <div className="group/tooltip relative inline-flex items-center ml-1">
        <button type="button" className="text-slate-400 hover:text-indigo-600 transition-colors cursor-help">
            <HelpCircleIcon size={16} />
        </button>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 text-slate-50 text-xs rounded-xl shadow-xl opacity-0 group-hover/tooltip:opacity-100 transition-all duration-200 pointer-events-none z-50 text-center leading-relaxed">
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
        </div>
    </div>
);

const Accordion = ({ title, icon: Icon, children, defaultOpen = false }) => {
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

// ==========================================
//              MAIN COMPONENT
// ==========================================

export default function HouseholdBenefits() {
    try {
        const [grossAfni, setGrossAfni] = useState(65000); 
        const [workingIncome, setWorkingIncome] = useState(65000); 
        const [deductions, setDeductions] = useState(0); 
        const [children, setChildren] = useState([{ id: 1, age: 2, disability: false }]);
        const [sharedCustody, setSharedCustody] = useState(false);
        const [maritalStatus, setMaritalStatus] = useState('MARRIED'); 
        const [province, setProvince] = useState('ON');
        const [isRural, setIsRural] = useState(false);
        
        const [activeTab, setActiveTab] = useState('input');
        const [showAbout, setShowAbout] = useState(false);
        const [copySuccess, setCopySuccess] = useState(false);

        const afni = Math.max(0, (grossAfni || 0) - (deductions || 0));

        useEffect(() => {
            const params = new URLSearchParams(window.location.search);
            if (params.toString()) {
                if (params.get('i')) {
                    const inc = parseInt(params.get('i'), 36);
                    setGrossAfni(inc);
                    setWorkingIncome(inc); 
                }
                if (params.get('wi')) setWorkingIncome(parseInt(params.get('wi'), 36));
                if (params.get('d')) setDeductions(parseInt(params.get('d'), 36));
                if (params.get('sc')) setSharedCustody(params.get('sc') === '1');
                if (params.get('r')) setIsRural(params.get('r') === '1');
                if (params.get('ms')) setMaritalStatus(params.get('ms')); 
                if (params.get('p')) setProvince(params.get('p'));
                if (params.get('c')) {
                    try {
                        const childData = params.get('c').split('_').map((str, idx) => {
                            const [age, dis] = str.split('-');
                            return { id: idx + 1, age: parseInt(age) || 0, disability: dis === '1' };
                        });
                        setChildren(childData);
                    } catch (e) { console.error("URL parse error", e); }
                }
            }
        }, []);

        const copyLink = () => {
            const params = new URLSearchParams();
            params.set('view', 'ccb'); 
            
            params.set('i', parseInt(grossAfni || 0).toString(36));
            params.set('wi', parseInt(workingIncome || 0).toString(36));
            if (deductions > 0) params.set('d', parseInt(deductions).toString(36));
            if (sharedCustody) params.set('sc', '1');
            if (isRural) params.set('r', '1');
            params.set('ms', maritalStatus);
            params.set('p', province);
            const childStr = children.map(c => `${c.age}-${c.disability ? 1 : 0}`).join('_');
            params.set('c', childStr);
            
            const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
            navigator.clipboard.writeText(url).then(() => {
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 2000);
            });
        };

        const addChild = () => {
            const newId = children.length > 0 ? Math.max(...children.map(c => c.id)) + 1 : 1;
            setChildren([...children, { id: newId, age: 0, disability: false }]);
        };
        const removeChild = (id) => {
            setChildren(children.filter(c => c.id !== id));
        };
        const updateChild = (id, field, value) => {
            setChildren(children.map(c => c.id === id ? { ...c, [field]: value } : c));
        };

        const calculateAll = (netInc = 0, workInc = 0, childList = [], isShared = false, provCode = 'ON', status = 'MARRIED', rural = false) => {
            const countUnder6 = childList.filter(c => c.age < 6).length;
            const countOver6 = childList.filter(c => c.age >= 6 && c.age < 18).length;
            const totalChildren = countUnder6 + countOver6;

            // 1. FEDERAL CCB
            let fedMax = 0;
            childList.forEach(c => {
                if (c.age < 6) fedMax += CCB_PARAMS.MAX_UNDER_6;
                else if (c.age < 18) fedMax += CCB_PARAMS.MAX_6_TO_17;
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
                if (CCB_PARAMS.PHASE_OUT[rateKey]) {
                    const { t1, t2 } = CCB_PARAMS.PHASE_OUT[rateKey];
                    if (netInc > CCB_PARAMS.THRESHOLD_2) {
                        fedReduction = ((CCB_PARAMS.THRESHOLD_2 - CCB_PARAMS.THRESHOLD_1) * t1) + ((netInc - CCB_PARAMS.THRESHOLD_2) * t2);
                    } else if (netInc > CCB_PARAMS.THRESHOLD_1) {
                        fedReduction = (netInc - CCB_PARAMS.THRESHOLD_1) * t1;
                    }
                }
            }
            let federalNet = Math.max(0, fedMax - fedReduction);

            // 2. GST/HST
            let gstBase = GST_PARAMS.ADULT_AMOUNT; 
            let gstAdd = 0;
            if (status === 'MARRIED') {
                gstAdd += GST_PARAMS.ADULT_AMOUNT + (totalChildren * GST_PARAMS.CHILD_AMOUNT); 
            } else {
                if (totalChildren > 0) {
                    gstAdd += GST_PARAMS.ADULT_AMOUNT + ((totalChildren - 1) * GST_PARAMS.CHILD_AMOUNT);
                } else {
                    const supp = Math.min(GST_PARAMS.SUPPLEMENT_MAX, (netInc - GST_PARAMS.SUPPLEMENT_THRESHOLD) * 0.02);
                    gstAdd += Math.max(0, supp);
                }
            }
            let gstTotal = Math.max(0, (gstBase + gstAdd) - (netInc > GST_PARAMS.THRESHOLD ? (netInc - GST_PARAMS.THRESHOLD) * GST_PARAMS.REDUCTION_RATE : 0));

            // 3. CWB
            let cwb = 0;
            if (workInc > 3000) {
                const params = (status === 'MARRIED' || totalChildren > 0) ? CWB_PARAMS.FAMILY : CWB_PARAMS.SINGLE;
                let baseCWB = Math.min(params.MAX, (workInc - params.THRESHOLD_MIN) * CWB_PARAMS.PHASE_IN_RATE);
                let reduction = 0;
                if (netInc > params.REDUCTION_START) {
                    reduction = (netInc - params.REDUCTION_START) * params.REDUCTION_RATE;
                }
                cwb = Math.max(0, baseCWB - reduction);
            }

            // 4. CARBON REBATE
            let caip = 0;
            const validProvs = ['ON', 'AB'];
            if (validProvs.includes(provCode) && PROV_PARAMS[provCode]?.CAIP) {
                const rates = PROV_PARAMS[provCode].CAIP;
                let quarterly = rates.ADULT;
                if (status === 'MARRIED') quarterly += rates.SPOUSE;
                if (status === 'SINGLE' && totalChildren > 0) {
                    quarterly += rates.SPOUSE; 
                    quarterly += (totalChildren - 1) * rates.CHILD;
                } else {
                    quarterly += totalChildren * rates.CHILD;
                }
                if (rural) quarterly *= 1.20;
                caip = quarterly * 4; 
            }

            // 5. PROVINCIAL
            let provNet = 0;
            let provName = "Provincial";
            if (totalChildren > 0) {
                if (provCode === 'ON') {
                    provName = PROV_PARAMS.ON.NAME;
                    const provMax = PROV_PARAMS.ON.MAX_PER_CHILD * totalChildren;
                    const provRed = Math.max(0, (netInc - PROV_PARAMS.ON.THRESHOLD) * PROV_PARAMS.ON.REDUCTION_RATE);
                    provNet = Math.max(0, provMax - provRed);
                } 
                else if (provCode === 'AB') {
                    provName = PROV_PARAMS.AB.NAME;
                    let provMax = 0;
                    PROV_PARAMS.AB.AMOUNTS.forEach((amt, idx) => {
                        if (idx < totalChildren) provMax += amt;
                    });
                    const rateIndex = Math.min(totalChildren, 4) - 1;
                    if (rateIndex >= 0 && PROV_PARAMS.AB.REDUCTION_RATES[rateIndex]) {
                        const abRate = PROV_PARAMS.AB.REDUCTION_RATES[rateIndex];
                        const provRed = Math.max(0, (netInc - PROV_PARAMS.AB.THRESHOLD) * abRate);
                        provNet = Math.max(0, provMax - provRed);
                    }
                }
            }

            if (isShared && totalChildren > 0) {
                federalNet *= 0.5;
                provNet *= 0.5;
            }

            const total = federalNet + provNet + gstTotal + cwb + caip;

            return {
                federal: federalNet, provincial: provNet, gst: gstTotal, cwb: cwb, caip: caip,
                provName, total, monthly: total / 12, countUnder6, countOver6
            };
        };

        const results = useMemo(() => calculateAll(afni, workingIncome, children, sharedCustody, province, maritalStatus, isRural), [afni, workingIncome, children, sharedCustody, province, maritalStatus, isRural]);

        const chartData = useMemo(() => {
            const data = [];
            for (let inc = 0; inc <= 140000; inc += 5000) {
                const res = calculateAll(inc, inc, children, sharedCustody, province, maritalStatus, isRural);
                data.push({
                    income: inc,
                    Federal: Math.round(res.federal),
                    Provincial: Math.round(res.provincial),
                    GST: Math.round(res.gst),
                    CWB: Math.round(res.cwb),
                    CAIP: Math.round(res.caip),
                    isUser: Math.abs(inc - afni) < 2500 
                });
            }
            const userRes = calculateAll(afni, workingIncome, children, sharedCustody, province, maritalStatus, isRural);
            const userPoint = { 
                income: afni, 
                Federal: Math.round(userRes.federal), 
                Provincial: Math.round(userRes.provincial), 
                GST: Math.round(userRes.gst), 
                CWB: Math.round(userRes.cwb),
                CAIP: Math.round(userRes.caip),
                isUser: true, 
                label: "You" 
            };
            const finalData = [...data, userPoint].sort((a,b) => a.income - b.income);
            return finalData.filter((item, index, array) => {
                if (index === 0) return true;
                return item.income - array[index - 1].income > 1000 || item.isUser;
            });
        }, [afni, workingIncome, children, sharedCustody, province, maritalStatus, isRural]);

        return (
            <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700 pb-16">
                {showAbout && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowAbout(false)}>
                        <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl relative border border-slate-100" onClick={e => e.stopPropagation()}>
                            <button onClick={() => setShowAbout(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"><XIcon size={24} /></button>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600"><HomeIcon size={28} /></div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">Household Benefit Estimator</h2>
                                    <p className="text-sm text-slate-500">2024-2025 Rules</p>
                                </div>
                            </div>
                            <div className="space-y-4 text-slate-600 leading-relaxed text-sm">
                                <p>This tool estimates 5 major Canadian government benefits based on your household profile.</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li><strong>CCB & Provincial:</strong> Monthly child support.</li>
                                    <li><strong>GST/HST Credit:</strong> Quarterly tax-free payment.</li>
                                    <li><strong>Carbon Rebate (CAIP):</strong> Quarterly payment (ON, AB, etc).</li>
                                    <li><strong>Workers Benefit (CWB):</strong> Tax credit for low-income workers.</li>
                                </ul>
                                <button onClick={() => setShowAbout(false)} className="mt-8 w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-slate-900/20">Close</button>
                            </div>
                        </div>
                    </div>
                )}

                <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-6 py-4">
                    <div className="max-w-5xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-tr from-emerald-500 to-teal-500 text-white p-2 rounded-lg shadow-lg shadow-emerald-500/30">
                                <HomeIcon size={24} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-slate-900">Household Benefit Estimator</h1>
                                <div className="text-xs font-medium text-slate-500 tracking-wide uppercase">CCB • GST • CWB • Carbon Rebate</div>
                            </div>
                        </div>
                        <div className="flex gap-4 items-center">
                            <button onClick={copyLink} className="text-sm font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-all flex items-center gap-2 border border-transparent hover:border-indigo-100">
                                {copySuccess ? <CheckIcon size={16} /> : <LinkIcon size={16} />}
                                {copySuccess ? "Copied!" : "Copy Link"}
                            </button>
                            <button onClick={() => setShowAbout(true)} className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors hidden sm:block">About</button>
                        </div>
                    </div>
                </header>

                <main className="max-w-5xl mx-auto p-4 md:p-8 w-full">
                    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden mb-12">
                        <div className="p-2 bg-slate-50 border-b border-slate-200">
                            <div className="flex bg-slate-200/50 p-1 rounded-xl">
                                <button onClick={() => setActiveTab('input')} className={`flex-1 py-2.5 text-sm font-bold text-center rounded-lg transition-all duration-200 ${activeTab === 'input' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>1. Household Details</button>
                                <button onClick={() => setActiveTab('results')} className={`flex-1 py-2.5 text-sm font-bold text-center rounded-lg transition-all duration-200 ${activeTab === 'results' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>2. View Benefits</button>
                            </div>
                        </div>

                        <div className="p-6 md:p-8">
                            {activeTab === 'input' && (
                                <div className="animate-fade-in space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                                        <div className="md:col-span-1 space-y-6">
                                            <div className="flex items-center gap-2 text-indigo-600 mb-2">
                                                <DollarSignIcon size={20} />
                                                <h3 className="text-xs font-bold uppercase tracking-wider">Financial Profile</h3>
                                            </div>
                                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-5">
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="col-span-1">
                                                        <label className="text-xs font-bold text-slate-700 block mb-1">
                                                            Province 
                                                            <Tooltip text="Determines provincial benefits (OCB, ACFB) and Carbon Rebate eligibility." />
                                                        </label>
                                                        <div className="relative">
                                                            <select value={province} onChange={(e) => setProvince(e.target.value)} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                                                                <option value="ON">ON</option>
                                                                <option value="AB">AB</option>
                                                                <option value="OTHER">Other</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="col-span-1">
                                                        <label className="text-xs font-bold text-slate-700 block mb-1">
                                                            Status
                                                            <Tooltip text="Marital status affects GST/HST credit eligibility and CWB calculations." />
                                                        </label>
                                                        <div className="relative">
                                                            <select value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                                                                <option value="MARRIED">Married</option>
                                                                <option value="SINGLE">Single</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="flex items-center text-sm font-bold text-slate-700 mb-2">Family Net Income <Tooltip text="Line 23600 (Combined). Includes wages, EI, pensions, and TAXABLE capital gains. Used to calculate clawbacks." /></label>
                                                    <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span><input type="number" value={grossAfni} onChange={(e) => { const val = parseInt(e.target.value) || 0; setGrossAfni(val); if (workingIncome === grossAfni) setWorkingIncome(val); }} className="w-full pl-7 p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-lg" /></div>
                                                </div>
                                                <div>
                                                    <label className="flex items-center text-sm font-bold text-slate-700 mb-2">Working Income <Tooltip text="Employment/Self-employment income ONLY. Excludes EI and Capital Gains. Required for Canada Workers Benefit (CWB)." /></label>
                                                    <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"><BriefcaseIcon size={14}/></span><input type="number" value={workingIncome} onChange={(e) => setWorkingIncome(parseInt(e.target.value) || 0)} className="w-full pl-8 p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-lg" /></div>
                                                </div>
                                                <div>
                                                    <label className="flex items-center text-sm font-bold text-slate-700 mb-2">RDSP / UCCB Deductions <Tooltip text="Income from RDSP or UCCB lump sums is NOT counted for benefit calculations. Enter amount here to lower your effective income." /></label>
                                                    <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">-$</span><input type="number" value={deductions} onChange={(e) => setDeductions(parseInt(e.target.value) || 0)} className="w-full pl-8 p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-lg text-slate-600" /></div>
                                                </div>
                                                <div className="grid grid-cols-1 gap-2">
                                                    <label className="flex items-center gap-2 cursor-pointer bg-white p-2 rounded-lg border border-slate-200"><input type="checkbox" checked={isRural} onChange={(e) => setIsRural(e.target.checked)} className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500" /><div className="text-sm"><span className="font-bold text-slate-700 block flex items-center gap-1"><LeafIcon size={12}/> Rural Resident? <Tooltip text="Residents outside Census Metropolitan Areas (CMAs) get a 20% Carbon Rebate top-up." /></span><span className="text-[10px] text-slate-400">+20% Carbon Rebate</span></div></label>
                                                    {children.length > 0 && <label className="flex items-center gap-2 cursor-pointer bg-white p-2 rounded-lg border border-slate-200"><input type="checkbox" checked={sharedCustody} onChange={(e) => setSharedCustody(e.target.checked)} className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500" /><div className="text-sm"><span className="font-bold text-slate-700 block">Shared Custody? <Tooltip text="For 40-60% custody. You receive exactly 50% of the benefit amount based on your own income." /></span><span className="text-[10px] text-slate-400">50% of Child Benefits</span></div></label>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="md:col-span-2 space-y-6">
                                            <div className="flex items-center justify-between text-emerald-600 mb-2"><div className="flex items-center gap-2"><UserPlusIcon size={20} /><h3 className="text-xs font-bold uppercase tracking-wider">Children</h3></div><button onClick={addChild} className="text-xs bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1"><UserPlusIcon size={14} /> Add Child</button></div>
                                            <div className="space-y-3">
                                                {children.map((child, index) => (
                                                    <div key={child.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center hover:border-emerald-200 transition-colors">
                                                        <div className="bg-emerald-50 text-emerald-600 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0">{index + 1}</div>
                                                        <div className="flex-1 w-full"><div className="flex justify-between mb-2"><label className="text-xs font-bold text-slate-500 uppercase">Age: <span className="text-slate-900 text-base">{child.age}</span> <Tooltip text="Use the age the child will be for the majority of the benefit year (July-June)." /></label><span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-500">{child.age < 6 ? "Under 6" : child.age < 18 ? "6 to 17" : "Ineligible"}</span></div><input type="range" min="0" max="18" value={child.age} onChange={(e) => updateChild(child.id, 'age', parseInt(e.target.value))} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500" /></div>
                                                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end"><label className="flex items-center gap-2 cursor-pointer select-none px-3 py-2 rounded-lg hover:bg-slate-50 transition"><input type="checkbox" checked={child.disability} onChange={(e) => updateChild(child.id, 'disability', e.target.checked)} className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500" /><div className="text-sm text-slate-600"><span className="font-bold block text-slate-800">DTC <Tooltip text="Check if this child has an approved T2201 Disability Tax Credit Certificate on file." /></span><span className="text-[10px] block">Disability</span></div></label><button onClick={() => removeChild(child.id)} className="text-slate-300 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition"><TrashIcon size={18} /></button></div>
                                                    </div>
                                                ))}
                                                {children.length === 0 && <div className="text-center p-8 border-2 border-dashed border-slate-200 rounded-xl text-slate-400">No children? No problem. We'll calculate GST, CWB, and Carbon Rebates.</div>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-8 flex justify-center pb-4 border-t border-slate-100 pt-8"><button onClick={() => setActiveTab('results')} className="bg-slate-900 hover:bg-slate-800 text-white text-lg font-bold py-4 px-10 rounded-2xl shadow-xl shadow-slate-900/20 transform transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-3">Calculate Benefits <ArrowRightIcon size={20} /></button></div>
                                </div>
                            )}
                            {activeTab === 'results' && (
                                <div className="space-y-8 animate-fade-in">
                                    <div className="bg-slate-900 rounded-2xl shadow-2xl p-8 text-white relative overflow-hidden isolate">
                                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                                        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                                        <div className="relative z-10 text-center md:text-left md:flex justify-between items-center gap-8">
                                            <div><h2 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Total Estimated Benefits</h2><div className="flex items-baseline justify-center md:justify-start gap-1"><span className="text-5xl md:text-6xl font-bold tracking-tight">${results.total.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span><span className="text-slate-400 text-lg">/ yr</span></div><div className="text-slate-400 text-sm mt-2 font-medium">Average Monthly: <span className="text-white font-bold">${results.monthly.toLocaleString(undefined, {maximumFractionDigits:0})}</span></div></div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="md:col-span-1 space-y-6">
                                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                                <div className="flex items-center gap-3 mb-4 text-slate-700"><div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><CalculatorIcon size={20}/></div><h3 className="font-bold">Annual Breakdown</h3></div>
                                                <div className="space-y-3 text-sm">
                                                    <div className="flex justify-between"><span className="text-slate-500">Federal CCB</span><span className="font-medium font-mono">${results.federal.toLocaleString(undefined, {maximumFractionDigits: 0})}</span></div>
                                                    <div className="flex justify-between"><span className="text-slate-500">{results.provName}</span><span className="font-medium font-mono text-emerald-600">+${results.provincial.toLocaleString(undefined, {maximumFractionDigits: 0})}</span></div>
                                                    <div className="flex justify-between"><span className="text-slate-500">GST/HST Credit</span><span className="font-medium font-mono text-purple-600">+${results.gst.toLocaleString(undefined, {maximumFractionDigits: 0})}</span></div>
                                                    {results.cwb > 0 && <div className="flex justify-between"><span className="text-slate-500">Workers Benefit</span><span className="font-medium font-mono text-amber-600">+${results.cwb.toLocaleString(undefined, {maximumFractionDigits: 0})}</span></div>}
                                                    {results.caip > 0 && <div className="flex justify-between"><span className="text-slate-500 flex items-center gap-1"><LeafIcon size={10}/> Carbon Rebate</span><span className="font-medium font-mono text-teal-600">+${results.caip.toLocaleString(undefined, {maximumFractionDigits: 0})}</span></div>}
                                                    <div className="pt-3 border-t border-slate-100 flex justify-between font-bold text-slate-900 text-base"><span>Total Annual</span><span>${results.total.toLocaleString(undefined, {maximumFractionDigits: 0})}</span></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                            <div className="flex items-center justify-between mb-6"><div className="flex items-center gap-3"><div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><TrendingDownIcon size={20}/></div><div><h3 className="font-bold text-slate-800">Benefits vs. Income</h3><p className="text-xs text-slate-500">How earnings affect your government support</p></div></div></div>
                                            <div className="h-[250px] w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                                        <XAxis dataKey="income" stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `$${val/1000}k`} axisLine={false} tickLine={false} />
                                                        <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `$${val/1000}k`} axisLine={false} tickLine={false} />
                                                        <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#f8fafc' }} itemStyle={{ color: '#f8fafc', fontSize: '12px' }} formatter={(value) => [`$${value.toLocaleString()}`, "Benefit"]} />
                                                        <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '10px' }}/>
                                                        <Area type="monotone" dataKey="Federal" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="CCB" />
                                                        <Area type="monotone" dataKey="Provincial" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Provincial" />
                                                        <Area type="monotone" dataKey="GST" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} name="GST" />
                                                        <Area type="monotone" dataKey="CWB" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} name="Workers Ben" />
                                                        <Area type="monotone" dataKey="CAIP" stackId="1" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.6} name="Carbon Rebate" />
                                                        <ReferenceLine x={afni} stroke="#6366f1" strokeDasharray="3 3" label={{ position: 'top', value: 'You', fill: '#6366f1', fontSize: 12, fontWeight: 'bold' }} />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-center pt-8"><button onClick={() => setActiveTab('input')} className="text-slate-500 hover:text-indigo-600 text-sm font-semibold flex items-center gap-2 transition-colors"><RotateCcwIcon size={16} /> Edit Inputs</button></div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="max-w-3xl mx-auto space-y-4">
                        <Accordion title="How Calculations Are Done" icon={CalculatorIcon}>
                            <p className="mb-4">This estimator uses the <strong>2024-2025 Benefit Year</strong> rules (effective July 2024 to June 2025).</p>
                            <ul className="list-disc pl-5 space-y-2 mb-4">
                                <li><strong>AFNI (Adjusted Family Net Income):</strong> This is your Line 23600 minus RDSP/UCCB income. It determines the reduction (clawback) of most benefits.</li>
                                <li><strong>Base Year Lag:</strong> Benefits paid from July 2024 to June 2025 are based on your <strong>2023 Tax Return</strong> income.</li>
                                <li><strong>Phase-out Rates:</strong> As income rises, benefits are reduced. CCB has two reduction tiers (over ~$36k and ~$79k). GST/HST fades out over ~$45k.</li>
                            </ul>
                        </Accordion>

                        <Accordion title="Government Sources" icon={BookOpenIcon}>
                            <ul className="text-sm space-y-2 text-indigo-600 pl-4 font-medium">
                                <li><a href="https://www.canada.ca/en/revenue-agency/services/child-family-benefits/canada-child-benefit-overview.html" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">Canada Child Benefit (CCB) <ExternalLinkIcon size={12} /></a></li>
                                <li><a href="https://www.canada.ca/en/revenue-agency/services/child-family-benefits/goods-services-tax-harmonized-sales-tax-credit.html" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">GST/HST Credit <ExternalLinkIcon size={12} /></a></li>
                                <li><a href="https://www.canada.ca/en/revenue-agency/services/child-family-benefits/canada-workers-benefit.html" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">Canada Workers Benefit (CWB) <ExternalLinkIcon size={12} /></a></li>
                                <li><a href="https://www.canada.ca/en/revenue-agency/services/child-family-benefits/cai-payment.html" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">Carbon Rebate (CAIP) <ExternalLinkIcon size={12} /></a></li>
                                <li><a href="https://www.canada.ca/en/revenue-agency/services/child-family-benefits/provincial-territorial-programs.html" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">Provincial Programs <ExternalLinkIcon size={12} /></a></li>
                            </ul>
                        </Accordion>
                    </div>

                </main>
            </div>
        );
    } catch (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8 text-center bg-slate-50">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md">
                    <h2 className="text-2xl font-bold text-rose-600 mb-4">Something went wrong</h2>
                    <p className="text-slate-600 mb-4">We encountered an error while calculating your benefits. Please refresh the page.</p>
                    <code className="block bg-slate-100 p-4 rounded text-xs text-left mb-4 overflow-auto text-slate-800">{error.toString()}</code>
                    <button onClick={() => window.location.href = window.location.pathname} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold">Refresh Page</button>
                </div>
            </div>
        );
    }
}