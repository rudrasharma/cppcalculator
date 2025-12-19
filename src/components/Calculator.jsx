// src/components/Calculator.jsx
import React, { useState, useEffect } from 'react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
    Legend, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { 
    CalculatorIcon, TrendingUpIcon, RotateCcwIcon, CheckIcon,
    HomeIcon, DollarSignIcon, BookOpenIcon, HelpCircleIcon, 
    ArrowRightIcon, ExternalLinkIcon, XIcon, UserGroupIcon, 
    ChevronDownIcon, LightbulbIcon, HeartHandshakeIcon, WandIcon, 
    BarChartIcon, MousePointerIcon, LinkIcon, FileTextIcon, 
    UploadIcon, FilterIcon, CheckCircleIcon, InfoIcon, ScaleIcon 
} from './Icons'; 
import { CURRENT_YEAR, getYMPE, getYAMPE } from '../utils/constants';
import { useRetirementMath } from '../hooks/useRetirementMath';
import { parseMscaData } from '../utils/mscaParser';
import { compressEarnings, decompressEarnings } from '../utils/compression'; 

// ==========================================
//              UI HELPERS
// ==========================================
const Tooltip = ({ text }) => (
    <div className="group relative inline-flex items-center ml-1">
        <button type="button" className="text-slate-400 hover:text-indigo-600 transition-colors cursor-help">
            <HelpCircleIcon size={16} />
        </button>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 text-slate-50 text-xs rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 text-center leading-relaxed">
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
//           MAIN COMPONENT
// ==========================================
export default function Calculator() {
    // --- 1. CORE STATE ---
    const [children, setChildren] = useState([]); 
    const [dob, setDob] = useState('1985-01-01');
    const [retirementAge, setRetirementAge] = useState(65);
    const [yearsInCanada, setYearsInCanada] = useState(40);
    const [earnings, setEarnings] = useState({});
    const [activeTab, setActiveTab] = useState('input');

    // --- 2. INPUT STATE ---
    const [avgSalaryInput, setAvgSalaryInput] = useState('');
    const [otherIncome, setOtherIncome] = useState(''); 
    const [isMarried, setIsMarried] = useState(false);
    const [spouseDob, setSpouseDob] = useState('1985-01-01');
    const [spouseIncome, setSpouseIncome] = useState('');
    const [forceAllowance, setForceAllowance] = useState(false);

    // --- 3. UI STATE ---
    const [showAbout, setShowAbout] = useState(false);
    const [compactGrid, setCompactGrid] = useState(false);
    const [useFutureDollars, setUseFutureDollars] = useState(false);
    const [showImport, setShowImport] = useState(false);
    const [importText, setImportText] = useState("");
    const [importError, setImportError] = useState("");
    
    // --- 4. CHART & COMPARISON STATE ---
    const [chartSelection, setChartSelection] = useState(null);
    const [lineVisibility, setLineVisibility] = useState({
        Early: true, Standard: true, Deferred: true, Selected: true
    });
    const [copySuccess, setCopySuccess] = useState(false);
    const [comparisonSnapshot, setComparisonSnapshot] = useState(null);

    const birthYear = parseInt(dob.split('-')[0]);

    // --- 5. LOGIC HOOK ---
    const results = useRetirementMath({
        earnings, dob, retirementAge, yearsInCanada, otherIncome,
        isMarried, spouseDob, spouseIncome, forceAllowance, children
    });

    // --- 6. HANDLERS ---
    
    // Load from URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.toString()) {
            if (params.get('d')) setDob(params.get('d').replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));
            if (params.get('r')) setRetirementAge(parseInt(params.get('r')));
            if (params.get('y')) setYearsInCanada(parseInt(params.get('y')));
            if (params.get('s')) setAvgSalaryInput(parseInt(params.get('s'), 36).toString());
            if (params.get('o')) setOtherIncome(parseInt(params.get('o'), 36).toString());
            if (params.get('m') === '1') setIsMarried(true);
            if (params.get('sd')) setSpouseDob(params.get('sd').replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));
            if (params.get('si')) setSpouseIncome(parseInt(params.get('si'), 36).toString());
            if (params.get('fa') === '1') setForceAllowance(true);

            const earningsStr = params.get('e');
            const dobParam = params.get('d');
            if (earningsStr && dobParam) {
                const bYear = parseInt(dobParam.substring(0, 4));
                setEarnings(decompressEarnings(earningsStr, bYear));
            }
        }
    }, []);

    const copyLink = () => {
        const params = new URLSearchParams();
        params.set('d', dob.replace(/-/g,'')); 
        params.set('r', retirementAge);
        params.set('y', yearsInCanada);
        if (avgSalaryInput) params.set('s', parseInt(avgSalaryInput).toString(36));
        if (otherIncome) params.set('o', parseInt(otherIncome).toString(36));
        if (isMarried) {
            params.set('m', '1');
            params.set('sd', spouseDob.replace(/-/g,''));
            if (spouseIncome) params.set('si', parseInt(spouseIncome).toString(36));
            if (forceAllowance) params.set('fa', '1');
        }
        const compressedEarn = compressEarnings(earnings, birthYear);
        if (compressedEarn) params.set('e', compressedEarn);

        const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
        navigator.clipboard.writeText(url).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        });
    };

    const handleImport = () => {
        const { error, data } = parseMscaData(importText);
        if (error) { setImportError(error); } 
        else { setEarnings(prev => ({ ...prev, ...data })); setShowImport(false); setImportText(""); }
    };

    const handleEarningChange = (year, value) => setEarnings(prev => ({ ...prev, [year]: value }));
    
    const toggleMax = (year, isMax) => {
        const newEarnings = { ...earnings };
        if (isMax) delete newEarnings[year];
        else {
            const ympe = getYMPE(year);
            const yampe = getYAMPE(year);
            newEarnings[year] = yampe > 0 ? yampe : ympe;
        }
        setEarnings(newEarnings);
    };

    const applyAverageSalary = () => {
        if (!avgSalaryInput || avgSalaryInput <= 0) return;
        const currentYMPE = getYMPE(CURRENT_YEAR);
        const ratio = parseFloat(avgSalaryInput) / currentYMPE;
        setEarnings(prev => {
            const newEarnings = { ...prev };
            results.years.forEach(y => {
                if (y >= CURRENT_YEAR || newEarnings[y] === undefined) {
                    const yYMPE = getYMPE(y);
                    newEarnings[y] = Math.round(yYMPE * ratio);
                }
            });
            return newEarnings;
        });
    };

    const handleLegendClick = (e) => {
        const { dataKey } = e;
        setLineVisibility(prev => ({ ...prev, [dataKey]: !prev[dataKey] }));
    };

    // --- 7. COMPARISON LOGIC ---
    const saveComparison = () => {
        setComparisonSnapshot({
            age: retirementAge,
            monthly: results.grandTotal,
            breakevenData: results.breakevenData 
        });
    };
    
    const clearComparison = () => setComparisonSnapshot(null);

    // Dynamic Crossover Calculation
    let comparisonMsg = null;

    if (comparisonSnapshot && comparisonSnapshot.age !== retirementAge) {
        const currentData = results.breakevenData;
        const snapshotData = comparisonSnapshot.breakevenData;
        
        // Determine which scenario is "Early" and which is "Late"
        const isCurrentLater = retirementAge > comparisonSnapshot.age;
        const lateAge = isCurrentLater ? retirementAge : comparisonSnapshot.age;
        const earlyAge = isCurrentLater ? comparisonSnapshot.age : retirementAge;
        
        let foundCrossover = null;

        for (let i = 0; i < currentData.length; i++) {
            const age = currentData[i].age;
            if (age <= lateAge) continue; 
            
            const currentTotal = currentData[i].Selected;
            const snapshotTotal = snapshotData.find(d => d.age === age)?.Selected || 0;
            
            if (isCurrentLater) {
                if (currentTotal > snapshotTotal) {
                    foundCrossover = age;
                    break;
                }
            } else {
                if (snapshotTotal > currentTotal) {
                    foundCrossover = age;
                    break;
                }
            }
        }

        if (foundCrossover) {
            comparisonMsg = (
                <span className="text-slate-700">
                    <strong>Age {lateAge}</strong> beats <strong>Age {earlyAge}</strong> if you live past <span className="text-lg font-bold text-indigo-700">{foundCrossover}</span>.
                </span>
            );
        } else {
            comparisonMsg = (
                <span className="text-slate-400 italic">
                    <strong>Age {lateAge}</strong> never catches up to <strong>Age {earlyAge}</strong> by age 95.
                </span>
            );
        }
    }

    // --- 8. RENDER HELPERS ---
    const inflationFactor = useFutureDollars ? Math.pow(1.025, retirementAge - (CURRENT_YEAR - birthYear)) : 1;
    const displayTotal = results.grandTotal * inflationFactor;
    const displayCPP = results.cpp.total * inflationFactor;
    const displayOAS = results.oas.total * inflationFactor;
    const displayGIS = results.gis.total * inflationFactor;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700 pb-16">
            
            {/* ABOUT MODAL */}
            {showAbout && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowAbout(false)}>
                    <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl relative border border-slate-100" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setShowAbout(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"><XIcon size={24} /></button>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600"><UserGroupIcon size={28} /></div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">About CPP Forecast</h2>
                                <p className="text-sm text-slate-500">Transparent Financial Planning</p>
                            </div>
                        </div>
                        <div className="space-y-4 text-slate-600 leading-relaxed">
                            <p><strong>Born in Canada, Built for Privacy.</strong></p>
                            <p>Existing government calculators can be cumbersome. This tool handles the new <strong>Enhanced CPP (Tier 2)</strong> rules introduced in 2024/2025 with an easy-to-use interface.</p>
                            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-emerald-800 text-sm flex gap-3">
                                <span>🔒</span>
                                <div><strong>Privacy First:</strong> This entire calculator runs in your browser. No data is sent to our servers. Your financial information stays on your device.</div>
                            </div>
                            <p className="text-xs text-slate-400 mt-4 text-center">Built by Canadian financial enthusiasts in Ontario.</p>
                        </div>
                        <button onClick={() => setShowAbout(false)} className="mt-8 w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-slate-900/20">Close</button>
                    </div>
                </div>
            )}

            {/* IMPORT MODAL */}
            {showImport && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowImport(false)}>
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl relative border border-slate-100" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setShowImport(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"><XIcon size={24} /></button>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600"><UploadIcon size={24} /></div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Import from Service Canada</h2>
                                <p className="text-sm text-slate-500">Paste your "Statement of Contributions" data below.</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="text-sm text-slate-600 space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <p><strong>How to get your data:</strong></p>
                                <ol className="list-decimal pl-5 space-y-1">
                                    <li>Log in to <a href="https://www.canada.ca/en/employment-social-development/services/my-account.html" target="_blank" className="text-indigo-600 hover:underline">My Service Canada Account</a>.</li>
                                    <li>Go to <strong>CPP</strong> {'>'} <strong>Contributions</strong>.</li>
                                    <li>Select the entire table of years and amounts.</li>
                                    <li>Copy and paste it into the box below.</li>
                                </ol>
                            </div>
                            <textarea value={importText} onChange={(e) => setImportText(e.target.value)} placeholder="Paste here (e.g. 2018  $55,900 ...)" className="w-full h-40 p-4 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-xs transition-shadow shadow-sm resize-none" />
                            {importError && <div className="text-rose-600 text-sm font-bold flex items-center gap-2 animate-fade-in"><XIcon size={16}/> {importError}</div>}
                            <div className="flex justify-end gap-3 pt-2">
                                <button onClick={() => setShowImport(false)} className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-100 rounded-lg transition">Cancel</button>
                                <button onClick={handleImport} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition shadow-lg shadow-indigo-200">Parse & Import</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* HEADER */}
            <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-6 py-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 text-white p-2 rounded-lg shadow-lg shadow-indigo-500/30">
                            <CalculatorIcon size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900">CPP & OAS Estimator</h1>
                            <div className="text-xs font-medium text-slate-500 tracking-wide uppercase">2025 Ruleset</div>
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

            {/* MAIN CONTENT */}
            <main className="max-w-5xl mx-auto p-4 md:p-8 w-full">
                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden mb-12">
                    {/* TABS HEADER */}
                    <div className="p-2 bg-slate-50 border-b border-slate-200">
                        <div className="flex bg-slate-200/50 p-1 rounded-xl">
                            <button onClick={() => setActiveTab('input')} className={`flex-1 py-2.5 text-sm font-bold text-center rounded-lg transition-all duration-200 ${activeTab === 'input' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
                                1. Earnings & Inputs
                            </button>
                            <button onClick={() => setActiveTab('results')} className={`flex-1 py-2.5 text-sm font-bold text-center rounded-lg transition-all duration-200 ${activeTab === 'results' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
                                2. View Estimate
                            </button>
                        </div>
                    </div>

                    <div className="p-6 md:p-8">
                        {activeTab === 'input' && (
                            <div className="animate-fade-in space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                                    {/* COLUMN 1: PERSONAL */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-2 text-indigo-600 mb-2">
                                            <UserGroupIcon size={20} />
                                            <h3 className="text-xs font-bold uppercase tracking-wider">Personal Profile</h3>
                                        </div>
                                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-5">
                                            <div>
                                                <label className="flex items-center text-sm font-bold text-slate-700 mb-2">
                                                    Date of Birth <Tooltip text="Used to calculate your age for dropout years and start dates." />
                                                </label>
                                                <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm" />
                                            </div>

                                            <div>
                                                <label className="flex items-center text-sm font-bold text-slate-700 mb-2">
                                                    Marital Status <Tooltip text="Combined income affects GIS eligibility." />
                                                </label>
                                                <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                                                    <button onClick={() => setIsMarried(false)} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isMarried ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>Single</button>
                                                    <button onClick={() => setIsMarried(true)} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isMarried ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>Married / Partnered</button>
                                                </div>
                                            </div>

                                            {isMarried && (
                                                <div className="animate-fade-in space-y-4 pl-4 border-l-2 border-indigo-200">
                                                    <div>
                                                        <label className="flex items-center text-sm font-bold text-indigo-900 mb-2">
                                                            Spouse Date of Birth <Tooltip text="We automatically calculate if your spouse qualifies for OAS or Allowance based on their age when YOU retire." />
                                                        </label>
                                                        <input type="date" value={spouseDob} onChange={(e) => setSpouseDob(e.target.value)} className="w-full p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                                                    </div>
                                                    <div>
                                                        <label className="flex items-center text-sm font-bold text-indigo-900 mb-2">
                                                            Spouse Annual Income <Tooltip text="Total taxable income (CPP, Pension, Investments). Exclude OAS." />
                                                        </label>
                                                        <div className="relative">
                                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                                                            <input type="number" value={spouseIncome} onChange={(e) => setSpouseIncome(e.target.value)} className="w-full pl-7 p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="0" />
                                                        </div>
                                                    </div>
                                                    {(() => {
                                                        const spouseAge = birthYear + retirementAge - parseInt(spouseDob.split('-')[0]);
                                                        if (spouseAge >= 60 && spouseAge < 65) {
                                                            return (
                                                                <label className="flex items-start gap-3 p-3 bg-indigo-100/50 rounded-xl cursor-pointer hover:bg-indigo-100 transition">
                                                                    <input type="checkbox" checked={forceAllowance} onChange={(e) => setForceAllowance(e.target.checked)} className="mt-1 w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
                                                                    <div className="text-xs text-indigo-900">
                                                                        <strong>Apply for Allowance Benefit?</strong><br/>
                                                                        Your spouse will be {spouseAge} when you retire. Check this if you expect to qualify for the low-income Allowance.
                                                                    </div>
                                                                </label>
                                                            );
                                                        }
                                                        return null;
                                                    })()}
                                                </div>
                                            )}

                                            {/* --- CHILD REARING SECTION --- */}
                                            <div>
                                                <label className="flex items-center text-sm font-bold text-slate-700 mb-2">
                                                    Children <Tooltip text="Years raising children under 7 with low income can be dropped from the calculation, boosting your average." />
                                                </label>
                                                
                                                <div className="space-y-3">
                                                    {children.map((childYear, index) => (
                                                        <div key={index} className="flex items-center gap-2 animate-fade-in">
                                                            <span className="text-sm text-slate-500 font-bold w-16">Child {index + 1}:</span>
                                                            <div className="relative flex-1">
                                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">Born</span>
                                                                <input 
                                                                    type="number" 
                                                                    value={childYear} 
                                                                    onChange={(e) => {
                                                                        const newChildren = [...children];
                                                                        newChildren[index] = parseInt(e.target.value) || 0;
                                                                        setChildren(newChildren);
                                                                    }} 
                                                                    className="w-full pl-10 p-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                                                                    placeholder="YYYY"
                                                                />
                                                            </div>
                                                            <button 
                                                                onClick={() => setChildren(children.filter((_, i) => i !== index))}
                                                                className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                                            >
                                                                <XIcon size={16} />
                                                            </button>
                                                        </div>
                                                    ))}

                                                    <button 
                                                        onClick={() => setChildren([...children, 2010])} 
                                                        className="w-full py-2 border-2 border-dashed border-slate-200 text-slate-400 font-bold rounded-xl hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50 transition text-sm flex items-center justify-center gap-2"
                                                    >
                                                        <UserGroupIcon size={16} /> Add Child
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <label className="flex items-center text-sm font-bold text-slate-700">
                                                        Retirement Age <Tooltip text="65 is standard. 60 is min (-36%). 70 is max (+42%)." />
                                                    </label>
                                                    <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-md">{retirementAge}</span>
                                                </div>
                                                <input type="range" min="60" max="70" step="1" value={retirementAge} onChange={(e) => setRetirementAge(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                                                <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium"><span>60</span><span>65</span><span>70</span></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* COLUMN 2: FINANCIAL */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-2 text-emerald-600 mb-2">
                                            <DollarSignIcon size={20} />
                                            <h3 className="text-xs font-bold uppercase tracking-wider">Financial Profile</h3>
                                        </div>
                                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-5">
                                            <div>
                                                <label className="flex items-center text-sm font-bold text-slate-700 mb-2">
                                                    Years in Canada (18-65) <Tooltip text="40 years required for full OAS." />
                                                </label>
                                                <input type="number" min="0" max="47" value={yearsInCanada} onChange={(e) => setYearsInCanada(parseInt(e.target.value) || 0)} className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm" />
                                            </div>
                                            <div>
                                                <label className="flex items-center text-sm font-bold text-slate-700 mb-2">
                                                    Other Retirement Income <Tooltip text="Pension, RRSP, etc. Triggers OAS Clawback." />
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                                                    <input type="number" placeholder="0" value={otherIncome} onChange={(e) => setOtherIncome(e.target.value)} className="w-full pl-7 p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm" />
                                                </div>
                                                <p className="text-xs text-slate-400 mt-2 ml-1">Required for accurate GIS/Clawback results.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 my-8"></div>

                                {/* EARNINGS GRID */}
                                <div>
                                    <div className="flex flex-col gap-6 mb-6">
                                        <div className="flex items-center gap-2 text-slate-700">
                                            <TrendingUpIcon size={20} />
                                            <h3 className="text-sm font-bold uppercase tracking-wider">Earnings History</h3>
                                        </div>
                                        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-wrap gap-4 items-end">
                                            <div className="flex-1 min-w-[240px]">
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Quick Fill: Estimate from Salary <Tooltip text="Only fills future or empty years. Does not overwrite imported data." /></label>
                                                <div className="flex gap-2">
                                                    <div className="relative w-full">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                                                        <input type="number" placeholder="65000" value={avgSalaryInput} onChange={(e) => setAvgSalaryInput(e.target.value)} className="w-full pl-7 p-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                                                    </div>
                                                    <button onClick={applyAverageSalary} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-1 transition-all shadow-sm whitespace-nowrap"><WandIcon size={16} /> Fill Future</button>
                                                </div>
                                            </div>
                                            <div className="w-px bg-slate-200 self-stretch mx-2 hidden md:block"></div>
                                            <div className="flex-1 min-w-[180px]">
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Bulk Import</label>
                                                <button onClick={() => setShowImport(true)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm"><FileTextIcon size={16} /> Import from MSCA</button>
                                            </div>
                                            <button onClick={() => setEarnings({})} className="text-xs font-bold text-rose-500 hover:bg-rose-50 hover:text-rose-700 px-4 py-2.5 rounded-lg border border-transparent hover:border-rose-200 transition flex items-center gap-1 self-end ml-auto"><RotateCcwIcon size={14} /> Reset</button>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500 mb-3 px-1">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded border border-slate-300 bg-white"></div>
                                            <span>Tier 1 (Base)</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded border border-purple-400 bg-purple-50"></div>
                                            <span>Tier 2 (Enhanced)</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded border border-emerald-500 bg-emerald-100"></div>
                                            <span>Maxed Out</span>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                                        <div className="flex items-center justify-between bg-slate-50/80 backdrop-blur p-3 border-b border-slate-200">
                                            <div className="grid grid-cols-12 w-full text-xs font-bold text-slate-500 uppercase tracking-wider">
                                                <div className="col-span-2">Year</div>
                                                <div className="hidden sm:block col-span-2">Age</div>
                                                <div className="hidden sm:block col-span-3 text-right pr-6">YMPE</div>
                                                <div className="col-span-10 sm:col-span-5">Earnings</div>
                                            </div>
                                            <button onClick={() => setCompactGrid(!compactGrid)} className={`ml-2 p-1.5 rounded hover:bg-slate-200 transition ${compactGrid ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'}`} title={compactGrid ? "Show all years" : "Hide empty past years"}><FilterIcon size={16} /></button>
                                        </div>
                                        
                                        <div className="max-h-[350px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                                            {results.years
                                                .filter(year => {
                                                    if (!compactGrid) return true;
                                                    return year >= CURRENT_YEAR || (earnings[year] && earnings[year] > 0);
                                                })
                                                .map(year => {
                                                    const isFuture = year > CURRENT_YEAR;
                                                    const ympe = getYMPE(year);
                                                    const yampe = getYAMPE(year);
                                                    const maxVal = yampe > 0 ? yampe : ympe;
                                                    const val = earnings[year] || '';
                                                    const valNum = parseFloat(val) || 0;
                                                    const isMax = valNum >= maxVal && val !== '';
                                                    let status = 'base';
                                                    if (isMax) status = 'max';
                                                    else if (yampe > 0 && valNum > ympe) status = 'tier2';

                                                    let rowBg = isFuture ? 'bg-slate-50/50' : '';
                                                    let inputClass = "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"; 
                                                    if (status === 'tier2') { rowBg = "bg-purple-50/20"; inputClass = "border-purple-300 bg-purple-50 text-purple-700 focus:border-purple-500 focus:ring-purple-500"; }
                                                    if (status === 'max') { rowBg = "bg-emerald-50/20"; inputClass = "border-emerald-300 bg-emerald-50 text-emerald-700 font-bold focus:border-emerald-500 focus:ring-emerald-500"; }

                                                    return (
                                                        <div key={year} className={`grid grid-cols-12 p-2 border-b border-slate-50 last:border-0 items-center hover:bg-slate-50 transition group ${rowBg}`}>
                                                            <div className="col-span-2 text-sm font-semibold text-slate-700">{year}</div>
                                                            <div className="hidden sm:block col-span-2 text-sm text-slate-400 group-hover:text-slate-600">{year - birthYear}</div>
                                                            <div className="hidden sm:block col-span-3 text-right pr-6 text-sm text-slate-400 font-mono">
                                                                ${ympe.toLocaleString()}
                                                                {yampe > 0 && <div className="text-[10px] text-purple-400 leading-none mt-0.5">Tier 2: ${yampe.toLocaleString()}</div>}
                                                            </div>
                                                            <div className="col-span-10 sm:col-span-5 flex items-center gap-2">
                                                                <div className="relative flex-1">
                                                                    <span className={`absolute left-2.5 top-1/2 -translate-y-1/2 text-xs ${status === 'max' ? 'text-emerald-500' : 'text-slate-400'}`}>$</span>
                                                                    <input type="number" value={val} onChange={(e) => handleEarningChange(year, e.target.value)} className={`w-full pl-6 pr-2 py-1.5 text-sm border rounded-lg outline-none transition-all ${inputClass}`} placeholder="0" />
                                                                </div>
                                                                <button onClick={() => toggleMax(year, isMax)} className={`px-2 py-1 text-[10px] font-bold rounded-md border transition-all uppercase tracking-wide ${isMax ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'}`}>Max</button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                    <div className="mt-8 flex justify-center pb-4">
                                        <button onClick={() => setActiveTab('results')} className="bg-slate-900 hover:bg-slate-800 text-white text-lg font-bold py-4 px-10 rounded-2xl shadow-xl shadow-slate-900/20 transform transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-3">Calculate Estimate <ArrowRightIcon size={20} /></button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'results' && (
                            <div className="space-y-8 animate-fade-in">
                                
                                {/* HERO CARD with COMPARE BUTTON */}
                                <div className="bg-slate-900 rounded-2xl shadow-2xl p-8 text-white relative overflow-hidden isolate transition-all duration-500">
                                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                                    
                                    <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                                        {/* LEFT SIDE: NUMBERS */}
                                        <div>
                                            <h2 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Estimated Monthly Income</h2>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-5xl md:text-6xl font-bold tracking-tight">
                                                    ${displayTotal.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </span>
                                                <span className="text-slate-400 text-lg">/ mo</span>
                                            </div>
                                            
                                            {/* INFLATION TOGGLE */}
                                            <div className="flex items-center gap-3 mt-4">
                                                <button 
                                                    onClick={() => setUseFutureDollars(!useFutureDollars)} 
                                                    className={`px-3 py-1 text-xs font-bold rounded-full transition-all border ${useFutureDollars ? 'bg-indigo-500 border-indigo-400 text-white' : 'border-slate-600 text-slate-400 hover:text-white hover:border-slate-400'}`}
                                                >
                                                    {useFutureDollars ? 'Future Dollars' : "Today's Dollars"}
                                                </button>
                                            </div>
                                        </div>

                                        {/* RIGHT SIDE: CONTROLS */}
                                        <div className="bg-white/5 rounded-xl p-5 border border-white/10 backdrop-blur-sm">
                                            <div className="flex justify-between items-center mb-4">
                                                <label className="text-sm font-bold text-slate-200">Retirement Age</label>
                                                <span className="bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                                                    Age {retirementAge}
                                                </span>
                                            </div>

                                            {/* QUICK SLIDER */}
                                            <input 
                                                type="range" 
                                                min="60" 
                                                max="70" 
                                                step="1" 
                                                value={retirementAge} 
                                                onChange={(e) => setRetirementAge(parseInt(e.target.value))} 
                                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-400 mb-2" 
                                            />
                                            <div className="flex justify-between text-xs text-slate-500 font-medium mb-6">
                                                <span>60</span><span>65</span><span>70</span>
                                            </div>

                                            {/* COMPARE ACTIONS */}
                                            <div className="flex flex-col gap-2">
                                                {!comparisonSnapshot ? (
                                                    <button 
                                                        onClick={saveComparison} 
                                                        className="w-full py-2.5 text-sm font-bold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20"
                                                    >
                                                        <ScaleIcon size={16} /> Compare this Age
                                                    </button>
                                                ) : (
                                                    <div className="space-y-2">
                                                        {/* INSTRUCTIONAL BADGE */}
                                                        {comparisonSnapshot.age === retirementAge && (
                                                            <div className="text-center text-xs text-emerald-300 font-bold bg-emerald-500/10 py-1.5 rounded animate-pulse border border-emerald-500/20">
                                                                Snapshot saved! Now move the slider above.
                                                            </div>
                                                        )}
                                                        <button 
                                                            onClick={clearComparison} 
                                                            className="w-full py-2.5 text-sm font-bold rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 transition-all flex items-center justify-center gap-2"
                                                        >
                                                            <XIcon size={16} /> Clear Comparison
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* SUMMARY BOXES */}
                                    <div className="mt-8 flex gap-3 flex-wrap justify-center md:justify-start border-t border-white/10 pt-6">
                                        <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                                            <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">CPP</div>
                                            <div className="text-lg font-bold">${displayCPP.toLocaleString(undefined, {maximumFractionDigits:0})}</div>
                                        </div>
                                        <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                                            <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">OAS</div>
                                            <div className="text-lg font-bold">${displayOAS.toLocaleString(undefined, {maximumFractionDigits:0})}</div>
                                        </div>
                                        {displayGIS > 0 && (
                                            <div className="bg-emerald-500/20 px-4 py-2 rounded-lg border border-emerald-500/30 text-emerald-100">
                                                <div className="text-emerald-300 text-[10px] uppercase font-bold tracking-wider">GIS</div>
                                                <div className="text-lg font-bold">${displayGIS.toLocaleString(undefined, {maximumFractionDigits:0})}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* --- COMPARISON TABLE (Only shows if snapshot exists) --- */}
                                {comparisonSnapshot && (
                                    <div className="bg-indigo-50/50 rounded-2xl border border-indigo-100 p-6 animate-fade-in">
                                        <div className="flex items-center gap-2 mb-4 text-indigo-800">
                                            <ScaleIcon size={20} />
                                            <h3 className="font-bold">Scenario Comparison</h3>
                                        </div>
                                        
                                        <div className="grid grid-cols-3 gap-4 text-sm">
                                            {/* Header */}
                                            <div className="font-bold text-slate-400 uppercase text-xs self-end pb-2">Metric</div>
                                            <div className="bg-white p-3 rounded-t-xl border-x border-t border-slate-200 font-bold text-slate-600 text-center">
                                                Snapshot (Age {comparisonSnapshot.age})
                                            </div>
                                            <div className="bg-indigo-600 p-3 rounded-t-xl border-x border-t border-indigo-600 font-bold text-white text-center shadow-lg">
                                                Current (Age {retirementAge})
                                            </div>

                                            {/* Monthly Income Row */}
                                            <div className="font-bold text-slate-700 py-3 border-b border-slate-200">Monthly Income</div>
                                            <div className="bg-white p-3 border-x border-b border-slate-200 text-center font-mono text-slate-600">
                                                ${(comparisonSnapshot.monthly * inflationFactor).toLocaleString(undefined, {maximumFractionDigits:0})}
                                            </div>
                                            <div className="bg-white p-3 border-x border-b border-slate-200 text-center font-mono font-bold text-indigo-700 shadow-sm relative z-10">
                                                ${displayTotal.toLocaleString(undefined, {maximumFractionDigits:0})}
                                                {/* Diff Badge */}
                                                <div className={`text-[10px] mt-1 font-sans font-bold ${results.grandTotal >= comparisonSnapshot.monthly ? 'text-emerald-600' : 'text-rose-500'}`}>
                                                    {results.grandTotal >= comparisonSnapshot.monthly ? '+' : ''}
                                                    ${((results.grandTotal - comparisonSnapshot.monthly) * inflationFactor).toFixed(0)}
                                                </div>
                                            </div>

                                            {/* Breakeven Row */}
                                            <div className="font-bold text-slate-700 py-3 self-center">
                                                Breakeven Age
                                                <Tooltip text="The age where the scenario with the higher monthly payment catches up in total lifetime cash received." />
                                            </div>
                                            <div className="col-span-2 flex items-center justify-center bg-slate-100 rounded-xl p-3 text-center border border-slate-200">
                                                {comparisonSnapshot.age === retirementAge ? (
                                                    <span className="text-slate-400 italic">Same Age Selected</span>
                                                ) : (
                                                    <div>{comparisonMsg}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* DETAIL CARDS */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
                                        <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><TrendingUpIcon size={20} className="text-indigo-600"/> CPP Details</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm"><span className="text-slate-500">Base</span><span className="font-mono font-medium">${(results.cpp.base * inflationFactor).toFixed(2)}</span></div>
                                            <div className="flex justify-between text-sm"><span className="text-slate-500">Enhanced</span><span className="font-mono font-medium text-emerald-600">+${(results.cpp.enhanced * inflationFactor).toFixed(2)}</span></div>
                                            <div className="pt-3 border-t border-slate-100 flex justify-between text-sm font-bold"><span className="text-slate-800">Total CPP</span><span>${displayCPP.toFixed(2)}</span></div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
                                        <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><HomeIcon size={20} className="text-amber-600"/> OAS Details</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm"><span className="text-slate-500">Gross</span><span className="font-mono font-medium">${(results.oas.gross * inflationFactor).toFixed(2)}</span></div>
                                            {results.oas.clawback > 0 && <div className="flex justify-between text-sm text-rose-600 bg-rose-50 px-2 py-1 rounded"><span>Recovery Tax</span><span className="font-mono">-${(results.oas.clawback * inflationFactor).toFixed(2)}</span></div>}
                                            <div className="pt-3 border-t border-slate-100 flex justify-between text-sm font-bold"><span className="text-slate-800">Net OAS</span><span>${displayOAS.toFixed(2)}</span></div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                                        <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><HeartHandshakeIcon size={20} className="text-emerald-600"/> GIS Details</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm"><span className="text-slate-500">Supplement</span><span className="font-mono font-medium text-emerald-600">${displayGIS.toFixed(2)}</span></div>
                                            {results.gis.note && (<div className="text-xs text-slate-400 mt-2 bg-slate-50 p-2 rounded">{results.gis.note}</div>)}
                                            <div className="pt-3 border-t border-slate-100 flex justify-between text-sm font-bold"><span className="text-slate-800">Total GIS</span><span>${displayGIS.toFixed(2)}</span></div>
                                        </div>
                                    </div>
                                </div>

                                {/* CUMULATIVE INCOME CHART */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mt-8">
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><BarChartIcon size={20}/></div>
                                            <div>
                                                <h3 className="font-bold text-slate-800 text-lg">Cumulative Lifetime Income</h3>
                                                <p className="text-xs text-slate-500 font-medium mb-1">Total cash received from CPP & OAS over time.</p>
                                                
                                                {results.crossovers.age70 && (
                                                    <p className="text-sm text-slate-600">
                                                        Waiting until 70 yields more total money if you live past <span className="font-bold text-indigo-700 bg-indigo-50 px-1 rounded">{results.crossovers.age70}</span>.
                                                    </p>
                                                )}
                                                {!results.crossovers.age70 && results.crossovers.age65 && (
                                                    <p className="text-sm text-slate-600">
                                                        Waiting until 65 yields more total money if you live past <span className="font-bold text-indigo-700 bg-indigo-50 px-1 rounded">{results.crossovers.age65}</span>.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="h-[300px] w-full cursor-pointer relative group">
                                        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="bg-slate-900/10 p-4 rounded-full"><MousePointerIcon size={32} className="text-slate-400"/></div>
                                        </div>

                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={results.breakevenData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }} onClick={(e) => { if(e && e.activeLabel) setChartSelection(e.activeLabel) }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                                <XAxis dataKey="age" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                                                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                                                <RechartsTooltip 
                                                    cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }}
                                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#f8fafc', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                                    itemStyle={{ color: '#f8fafc', fontSize: '12px', padding: '2px 0' }}
                                                    formatter={(value, name) => [`$${value.toLocaleString()}`, name]}
                                                    labelFormatter={(label) => <span className="font-bold text-slate-300 mb-2 block border-b border-slate-700 pb-1">At Age {label}</span>}
                                                />
                                                <Legend wrapperStyle={{ paddingTop: '15px', fontSize: '12px', cursor: 'pointer' }} iconType="circle" onClick={handleLegendClick} />
                                                
                                                <Line type="monotone" dataKey="Early" name="Start at 60" stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 6 }} hide={!lineVisibility.Early} />
                                                <Line type="monotone" dataKey="Standard" name="Start at 65" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 6 }} hide={!lineVisibility.Standard} />
                                                <Line type="monotone" dataKey="Deferred" name="Start at 70" stroke="#f59e0b" strokeWidth={2} dot={false} activeDot={{ r: 6 }} hide={!lineVisibility.Deferred} />
                                                
                                                {results.userIsDistinct && (
                                                    <Line type="monotone" dataKey="Selected" name={`Start at ${results.selectedAge} (Selected)`} stroke="#8b5cf6" strokeWidth={3} strokeDasharray="5 5" dot={false} activeDot={{ r: 8 }} hide={!lineVisibility.Selected} />
                                                )}

                                                {results.crossovers.age65 && lineVisibility.Early && lineVisibility.Standard && <ReferenceLine x={results.crossovers.age65} stroke="#3b82f6" strokeDasharray="3 3" label={{ position: 'top', value: '65 beats 60', fill: '#3b82f6', fontSize: 10, fontWeight: 'bold' }} />}
                                                {results.crossovers.age70 && lineVisibility.Standard && lineVisibility.Deferred && <ReferenceLine x={results.crossovers.age70} stroke="#f59e0b" strokeDasharray="3 3" label={{ position: 'top', value: '70 beats 65', fill: '#f59e0b', fontSize: 10, fontWeight: 'bold' }} />}
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* CLICK DETAIL PANEL */}
                                    {chartSelection && (
                                        <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-4 animate-fade-in">
                                            <div className="flex justify-between items-center mb-3">
                                                <h4 className="font-bold text-slate-800 flex items-center gap-2"><MousePointerIcon size={16} className="text-indigo-500"/> Deep Dive: Age {chartSelection}</h4>
                                                <button onClick={() => setChartSelection(null)} className="text-xs text-slate-400 hover:text-slate-600">Close</button>
                                            </div>
                                            <div className={`grid gap-2 text-center ${results.userIsDistinct ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-3'}`}>
                                                {results.breakevenData.filter(d => d.age === chartSelection).map(d => (
                                                    <React.Fragment key={d.age}>
                                                        {lineVisibility.Early && <div className="bg-emerald-50 border border-emerald-100 p-2 rounded-lg"><div className="text-[10px] text-emerald-600 font-bold uppercase">Start 60</div><div className="font-bold text-emerald-800">${d.Early.toLocaleString()}</div></div>}
                                                        {lineVisibility.Standard && <div className="bg-blue-50 border border-blue-100 p-2 rounded-lg"><div className="text-[10px] text-blue-600 font-bold uppercase">Start 65</div><div className="font-bold text-blue-800">${d.Standard.toLocaleString()}</div></div>}
                                                        {lineVisibility.Deferred && <div className="bg-amber-50 border border-amber-100 p-2 rounded-lg"><div className="text-[10px] text-amber-600 font-bold uppercase">Start 70</div><div className="font-bold text-amber-800">${d.Deferred.toLocaleString()}</div></div>}
                                                        {results.userIsDistinct && lineVisibility.Selected && <div className="bg-violet-50 border border-violet-100 p-2 rounded-lg"><div className="text-[10px] text-violet-600 font-bold uppercase">Start {results.selectedAge}</div><div className="font-bold text-violet-800">${d.Selected.toLocaleString()}</div></div>}
                                                    </React.Fragment>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex justify-center pt-8">
                                    <button onClick={() => setActiveTab('input')} className="text-slate-500 hover:text-indigo-600 text-sm font-semibold flex items-center gap-2 transition-colors"><RotateCcwIcon size={16} /> Edit Inputs</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="max-w-3xl mx-auto space-y-4">
                    <Accordion title="Guide to 2025 CPP & OAS Changes" icon={BookOpenIcon}>
                        <p className="mb-4">In 2025, the Canada Pension Plan (CPP) completes a major transition into 'Phase 2' of the enhancement strategy.</p>
                        <p>If you earn up to <strong>$71,300</strong> (the 2025 YMPE), you contribute at the base rate. However, if you earn <em>between</em> $71,300 and approximately <strong>$81,200</strong> (the YAMPE), you make additional <strong>Tier 2 contributions</strong>.</p>
                    </Accordion>
                    <Accordion title="Government Sources" icon={ExternalLinkIcon}>
                         <ul className="text-sm space-y-2 text-indigo-600 pl-4 font-medium">
                            <li><a href="https://www.canada.ca/en/services/benefits/publicpensions/cpp/payment-amounts.html" target="_blank" className="hover:underline flex items-center gap-1">CPP Payment Amounts <ExternalLinkIcon size={12} /></a></li>
                        </ul>
                    </Accordion>
                </div>
            </main>
        </div>
    );
}