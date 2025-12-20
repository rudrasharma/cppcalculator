import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
//               UI HELPERS
// ==========================================
const Tooltip = ({ text }) => (
    <div className="group relative inline-flex items-center ml-1 align-middle text-left">
        <button type="button" className="text-slate-400 hover:text-indigo-600 transition-colors cursor-help">
            <HelpCircleIcon size={16} />
        </button>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 text-slate-50 text-xs rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 text-center leading-relaxed font-normal">
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
//            MAIN COMPONENT
// ==========================================
export default function Calculator() {
    // --- 1. CORE STATE ---
    const [children, setChildren] = useState([]); 
    const [dob, setDob] = useState('1985-01-01');
    const [retirementAge, setRetirementAge] = useState(65);
    const [yearsInCanada, setYearsInCanada] = useState(40);
    const [earnings, setEarnings] = useState({});
    const [activeTab, setActiveTab] = useState('input');
    const [mounted, setMounted] = useState(false); 

    // --- 2. INPUT STATE & TOGGLES ---
    const [avgSalaryInput, setAvgSalaryInput] = useState('');
    const [otherIncome, setOtherIncome] = useState(''); 
    
    // UX Toggles
    const [livedInCanadaAllLife, setLivedInCanadaAllLife] = useState(true); 
    const [isMarried, setIsMarried] = useState(false);
    const [showChildren, setShowChildren] = useState(false);
    
    // Feature: Grid & Tax
    const [showGrid, setShowGrid] = useState(false);
    const [showNet, setShowNet] = useState(false);
    const TAX_RATE = 0.15; 

    // Spouse Data
    const [spouseDob, setSpouseDob] = useState('1985-01-01');
    const [spouseIncome, setSpouseIncome] = useState('');
    const [forceAllowance, setForceAllowance] = useState(false);

    // --- 3. UI STATE ---
    const [showAbout, setShowAbout] = useState(false);
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
    useEffect(() => { setMounted(true); }, []);
    useEffect(() => { if (livedInCanadaAllLife) setYearsInCanada(40); }, [livedInCanadaAllLife]);
    useEffect(() => { if (!showChildren) setChildren([]); }, [showChildren]);

    // Load from URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.toString()) {
            if (params.get('d')) setDob(params.get('d').replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));
            if (params.get('r')) setRetirementAge(parseInt(params.get('r')));
            const yic = params.get('y');
            if (yic) {
                const yicVal = parseInt(yic);
                setYearsInCanada(yicVal);
                if (yicVal < 40) setLivedInCanadaAllLife(false);
            }
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
                const isEmpty = Object.keys(prev).length === 0;
                if (isEmpty || y >= CURRENT_YEAR || newEarnings[y] === undefined) {
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

    const saveComparison = () => {
        setComparisonSnapshot({
            age: retirementAge,
            monthly: results.grandTotal,
            breakevenData: results.breakevenData 
        });
    };
    
    const clearComparison = () => setComparisonSnapshot(null);

    let comparisonMsg = null;
    if (comparisonSnapshot && comparisonSnapshot.age !== retirementAge) {
        const currentData = results.breakevenData;
        const snapshotData = comparisonSnapshot.breakevenData;
        const isCurrentLater = retirementAge > comparisonSnapshot.age;
        const lateAge = isCurrentLater ? retirementAge : comparisonSnapshot.age;
        const earlyAge = isCurrentLater ? comparisonSnapshot.age : retirementAge;
        let foundCrossover = null;

        for (let i = 0; i < currentData.length; i++) {
            const age = currentData[i].age;
            if (age <= lateAge) continue; 
            const currentTotal = currentData[i].Selected;
            const snapshotTotal = snapshotData.find(d => d.age === age)?.Selected || 0;
            if (isCurrentLater) { if (currentTotal > snapshotTotal) { foundCrossover = age; break; } } 
            else { if (snapshotTotal > currentTotal) { foundCrossover = age; break; } }
        }

        if (foundCrossover) {
            comparisonMsg = <span className="text-slate-700"><strong>Age {lateAge}</strong> beats <strong>Age {earlyAge}</strong> if you live past <span className="text-lg font-bold text-indigo-700">{foundCrossover}</span>.</span>;
        } else {
            comparisonMsg = <span className="text-slate-400 italic"><strong>Age {lateAge}</strong> never catches up to <strong>Age {earlyAge}</strong> by age 95.</span>;
        }
    }

    const inflationFactor = useFutureDollars ? Math.pow(1.025, retirementAge - (CURRENT_YEAR - birthYear)) : 1;
    const taxFactor = showNet ? (1 - TAX_RATE) : 1; 
    
    const displayTotal = results.grandTotal * inflationFactor * taxFactor;
    const displayCPP = results.cpp.total * inflationFactor * taxFactor;
    const displayOAS = results.oas.total * inflationFactor * taxFactor;
    const displayGIS = results.gis.total * inflationFactor * taxFactor;

    const totalRaw = displayTotal || 1; 
    const cppPerc = (displayCPP / totalRaw) * 100;
    const oasPerc = (displayOAS / totalRaw) * 100;
    const gisPerc = (displayGIS / totalRaw) * 100;

    const hasEarnings = Object.keys(earnings).length > 0;

    return (
        <div 
            className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700"
            style={{ paddingBottom: activeTab === 'input' ? '200px' : '60px' }}
        > 
            
            {/* ABOUT MODAL */}
            {showAbout && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowAbout(false)}>
                    <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl relative border border-slate-100" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setShowAbout(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"><XIcon size={24} /></button>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
                                <CalculatorIcon size={28} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">About LoonieSense</h2>
                                <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Privacy-First Pension Forecasting</p>
                            </div>
                        </div>
                        <div className="space-y-4 text-slate-600 leading-relaxed">
                            <p><strong>Born in Canada, Built for Privacy.</strong></p>
                            <p>This tool was designed to help Canadians navigate the complex math behind the Canada Pension Plan (CPP) and Old Age Security (OAS).</p>
                            <p>It handles the new <strong>Enhanced CPP (Tier 2)</strong> rules introduced in 2024/2025, which can significantly change your future benefits if you are currently working.</p>
                            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-emerald-800 text-sm flex gap-3">
                                <CheckCircleIcon className="text-emerald-500 shrink-0" size={20} />
                                <div><strong>Privacy First:</strong> No data is sent to servers. Your earnings history and dates of birth never leave your computer. Everything runs locally in your browser.</div>
                            </div>
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
                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><UploadIcon className="text-indigo-600"/> Import from Service Canada</h2>
                        <div className="space-y-4">
                            <div className="text-sm text-slate-600 space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed">
                                <p><strong>How to get your data:</strong></p>
                                <ol className="list-decimal pl-5 space-y-2">
                                    <li>Log in to <a href="https://www.canada.ca/en/employment-social-development/services/my-account.html" target="_blank" className="text-indigo-600 font-bold hover:underline">My Service Canada Account</a>.</li>
                                    <li>Navigate to <strong>CPP</strong> {'>'} <strong>Contributions</strong>.</li>
                                    <li>Select the entire table of years and amounts (it's okay to include headers).</li>
                                    <li>Copy (Ctrl+C) and paste it into the box below.</li>
                                </ol>
                            </div>
                            <textarea 
                                value={importText} 
                                onChange={(e) => setImportText(e.target.value)} 
                                placeholder="Paste here (e.g. 2018  $55,900 ...)" 
                                className="w-full h-44 p-4 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-xs transition-all shadow-inner resize-none" 
                            />
                            {importError && <div className="text-rose-600 text-sm font-bold flex items-center gap-2 animate-fade-in bg-rose-50 p-2 rounded-lg border border-rose-100"><XIcon size={16}/> {importError}</div>}
                            <div className="flex justify-end gap-3 pt-2">
                                <button onClick={() => setShowImport(false)} className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-100 rounded-lg transition">Cancel</button>
                                <button onClick={handleImport} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-lg shadow-indigo-200 flex items-center gap-2"><CheckIcon size={18}/> Parse & Import</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MAIN CONTENT */}
            <main className="max-w-5xl mx-auto p-4 md:p-8 w-full">
                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden mb-12">
                    {/* TABS HEADER */}
                    <div className="p-2 bg-slate-50 border-b border-slate-200">
                        <div className="flex bg-slate-200/50 p-1 rounded-xl">
                            <button onClick={() => setActiveTab('input')} className={`flex-1 py-2.5 text-sm font-bold text-center rounded-lg transition-all duration-200 ${activeTab === 'input' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>1. Earnings & Inputs</button>
                            <button onClick={() => setActiveTab('results')} className={`flex-1 py-2.5 text-sm font-bold text-center rounded-lg transition-all duration-200 ${activeTab === 'results' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>2. View Estimate</button>
                        </div>
                    </div>

                    <div className="p-6 md:p-8">
                        {activeTab === 'input' && (
                            <div className="animate-fade-in space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                                    
                                    {/* COLUMN 1: PROFILE & FAMILY */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-2 text-indigo-600 mb-2">
                                            <UserGroupIcon size={20} />
                                            <h3 className="text-xs font-bold uppercase tracking-wider">Profile & Family</h3>
                                        </div>
                                        
                                        <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                                            <div>
                                                <label className="flex items-center text-sm font-bold text-slate-700 mb-2 leading-none">Date of Birth</label>
                                                <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm" />
                                            </div>
                                            
                                            <div>
                                                <div className="flex justify-between items-center mb-3">
                                                    <label className="text-sm font-bold text-slate-700">Target Retirement Age <Tooltip text="The age you plan to start collecting CPP and OAS. Start as early as 60 or as late as 70." /></label>
                                                    <span className="bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">Age {retirementAge}</span>
                                                </div>
                                                <input type="range" min="60" max="70" step="1" value={retirementAge} onChange={(e) => setRetirementAge(parseInt(e.target.value))} className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                                                <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest px-1"><span>Early (60)</span><span>Standard (65)</span><span>Deferred (70)</span></div>
                                            </div>
                                        </div>

                                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                                            <label className="flex items-center gap-4 p-4 border rounded-2xl cursor-pointer hover:bg-slate-50 transition-all group">
                                                <input type="checkbox" checked={isMarried} onChange={(e) => setIsMarried(e.target.checked)} className="w-5 h-5 text-indigo-600 rounded-lg focus:ring-indigo-500 border-slate-300" />
                                                <div className="flex-1">
                                                    <span className="font-bold text-slate-800 block text-sm">I have a Spouse / Partner</span>
                                                    <span className="text-xs text-slate-500 leading-none">Helps estimate household GIS supplement eligibility.</span>
                                                </div>
                                            </label>

                                            {isMarried && (
                                                <div className="animate-fade-in space-y-5 pl-5 border-l-2 border-indigo-100 ml-2">
                                                    <div>
                                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Spouse Birth Date</label>
                                                        <input type="date" value={spouseDob} onChange={(e) => setSpouseDob(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
                                                            Spouse Annual Retirement Income
                                                            <Tooltip text="Estimate their total annual taxable income in retirement (CPP, Pensions, RRIF). Exclude OAS and GIS. Helps determine household GIS." />
                                                        </label>
                                                        <div className="relative">
                                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-mono">$</span>
                                                            <input type="number" value={spouseIncome} onChange={(e) => setSpouseIncome(e.target.value)} className="w-full pl-8 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono" placeholder="0" />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <label className="flex items-center gap-4 p-4 border rounded-2xl cursor-pointer hover:bg-slate-50 transition-all group">
                                                <input type="checkbox" checked={showChildren} onChange={(e) => setShowChildren(e.target.checked)} className="w-5 h-5 text-indigo-600 rounded-lg focus:ring-indigo-500 border-slate-300" />
                                                <div className="flex-1">
                                                    <span className="font-bold text-slate-800 block text-sm">Raised Children (Child-Rearing Provision)</span>
                                                    <span className="text-xs text-slate-500">Drops low-income years while kids were under 7.</span>
                                                </div>
                                            </label>

                                            {showChildren && (
                                                <div className="animate-fade-in space-y-3 pl-5 border-l-2 border-indigo-100 ml-2">
                                                    {children.map((childYear, index) => (
                                                        <div key={index} className="flex items-center gap-2 group/child">
                                                            <span className="text-[10px] text-slate-400 font-bold uppercase w-14">Birth {index + 1}</span>
                                                            <input type="number" value={childYear} onChange={(e) => { const newC = [...children]; newC[index] = parseInt(e.target.value)||0; setChildren(newC); }} className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-400" placeholder="YYYY" />
                                                            <button onClick={() => setChildren(children.filter((_, i) => i !== index))} className="p-2 text-rose-300 hover:text-rose-600 transition-colors opacity-0 group-hover/child:opacity-100"><XIcon size={16}/></button>
                                                        </div>
                                                    ))}
                                                    <button onClick={() => setChildren([...children, 2010])} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-indigo-50 transition-colors">+ Add Child</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* COLUMN 2: FINANCIALS */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-2 text-emerald-600 mb-2">
                                            <DollarSignIcon size={20} />
                                            <h3 className="text-xs font-bold uppercase tracking-wider">Financial & Residency</h3>
                                        </div>
                                        
                                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                                            <label className="flex items-center justify-between cursor-pointer p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all">
                                                <div className="flex-1">
                                                    <span className="text-sm font-bold text-slate-800 block">Canadian Resident Entire Adult Life?</span>
                                                    <span className="text-xs text-slate-500">Age 18 to present / 65.</span>
                                                </div>
                                                <div className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${livedInCanadaAllLife ? 'bg-emerald-500 shadow-inner' : 'bg-slate-300'}`}>
                                                    <input type="checkbox" checked={livedInCanadaAllLife} onChange={(e) => setLivedInCanadaAllLife(e.target.checked)} className="hidden" />
                                                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${livedInCanadaAllLife ? 'translate-x-6' : ''}`}></div>
                                                </div>
                                            </label>

                                            {!livedInCanadaAllLife && (
                                                <div className="animate-fade-in bg-white p-4 rounded-xl border border-slate-100">
                                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Total Years Residing in Canada (After Age 18)</label>
                                                    <input type="number" min="0" max="47" value={yearsInCanada} onChange={(e) => setYearsInCanada(parseInt(e.target.value) || 0)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono" />
                                                    <p className="text-[10px] text-slate-400 mt-2 font-medium italic">* OAS requires 40 years for full payment. 10 years minimum to qualify at age 65.</p>
                                                </div>
                                            )}

                                            <div>
                                                <label className="flex items-center text-sm font-bold text-slate-700 mb-2 leading-none gap-1">
                                                    Personal Retirement Income (Taxable)
                                                    <Tooltip text="Estimate your annual taxable income in retirement (excluding OAS/GIS). Includes workplace pensions, RRSP/RRIF withdrawals, and interest. Used for the OAS Recovery Tax calculation." />
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-mono">$</span>
                                                    <input type="number" placeholder="0" value={otherIncome} onChange={(e) => setOtherIncome(e.target.value)} className="w-full pl-8 p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm font-mono" />
                                                </div>
                                                <p className="text-[10px] text-slate-400 mt-2 font-medium">Do not include TFSA withdrawals.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 my-8"></div>

                                {/* EARNINGS SECTION */}
                                <div className="space-y-6">
                                    <div className="flex flex-col gap-6">
                                        <div className="flex items-center gap-2 text-slate-700">
                                            <TrendingUpIcon size={20} />
                                            <h3 className="text-sm font-bold uppercase tracking-wider">Earnings History</h3>
                                        </div>

                                        {!hasEarnings && (
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="bg-indigo-50/50 border border-indigo-100 p-8 rounded-3xl hover:border-indigo-300 transition-all cursor-pointer group shadow-sm" onClick={() => document.getElementById('salary-input').focus()}>
                                                    <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform"><WandIcon className="text-indigo-500" size={28}/></div>
                                                    <h4 className="font-bold text-slate-800 text-lg">Quick Estimate</h4>
                                                    <p className="text-sm text-slate-500 mt-2 leading-relaxed font-medium">Just enter your current salary. We'll automatically project it backward and forward for a fast calculation.</p>
                                                </div>
                                                <div className="bg-emerald-50/50 border border-emerald-100 p-8 rounded-3xl hover:border-emerald-300 transition-all cursor-pointer group shadow-sm" onClick={() => setShowImport(true)}>
                                                    <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform"><UploadIcon className="text-emerald-500" size={28}/></div>
                                                    <h4 className="font-bold text-slate-800 text-lg">Official Data Import</h4>
                                                    <p className="text-sm text-slate-500 mt-2 leading-relaxed font-medium">Paste your Service Canada data for the most accurate results possible, accounting for gap years and tiered contributions.</p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="bg-slate-50 border border-slate-200 p-5 rounded-3xl flex flex-wrap gap-6 items-end shadow-sm">
                                            <div className="flex-1 min-w-[280px]">
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2.5">Generate Forecast from Salary</label>
                                                <div className="flex gap-3">
                                                    <div className="relative w-full">
                                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-mono">$</span>
                                                        <input id="salary-input" type="number" placeholder="65000" value={avgSalaryInput} onChange={(e) => setAvgSalaryInput(e.target.value)} className="w-full pl-8 p-3 bg-white border border-slate-300 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none shadow-inner font-mono" />
                                                    </div>
                                                    <button onClick={applyAverageSalary} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-100 whitespace-nowrap"><WandIcon size={18} /> {hasEarnings ? "Fill History" : "Generate All"}</button>
                                                </div>
                                            </div>
                                            <div className="w-px bg-slate-200 self-stretch mx-1 hidden md:block"></div>
                                            <div className="flex gap-2">
                                                <button onClick={() => setShowImport(true)} className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-all"><FileTextIcon size={18} /> Import</button>
                                                <button onClick={() => setEarnings({})} className="px-4 py-3 text-rose-500 hover:bg-rose-50 rounded-xl border border-transparent hover:border-rose-200 transition-colors" title="Clear all earnings"><RotateCcwIcon size={20} /></button>
                                            </div>
                                        </div>
                                    </div>

                                    {hasEarnings && (
                                        <div className="animate-fade-in bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-md">
                                            <div 
                                                className="flex items-center justify-between p-5 bg-slate-50/80 backdrop-blur border-b border-slate-200 cursor-pointer hover:bg-slate-100 transition select-none"
                                                onClick={() => setShowGrid(!showGrid)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-white p-2 rounded-lg border border-slate-200 text-slate-500 shadow-sm"><BarChartIcon size={20}/></div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-800 text-sm">Detailed Annual History</h4>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Click to expand and edit individual years</p>
                                                    </div>
                                                </div>
                                                <div className="text-indigo-600 font-bold text-sm flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors">
                                                    {showGrid ? 'Hide Table' : 'Show Table'} <ChevronDownIcon size={18} className={`transition-transform duration-300 ${showGrid ? 'rotate-180' : ''}`}/>
                                                </div>
                                            </div>

                                            {showGrid && (
                                                <div className="max-h-[600px] overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                                                    <div className="grid grid-cols-12 w-full text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-3 text-left">
                                                        <div className="col-span-3">Year <span className="font-normal text-slate-300">(Age)</span></div>
                                                        <div className="col-span-9">Reported Earnings</div>
                                                    </div>
                                                    {results.years.map(year => {
                                                        const ympe = getYMPE(year);
                                                        const yampe = getYAMPE(year);
                                                        const maxVal = yampe > 0 ? yampe : ympe;
                                                        const val = earnings[year] || '';
                                                        const valNum = parseFloat(val) || 0;
                                                        const isMax = valNum >= maxVal && val !== '';
                                                        const isTier2 = yampe > 0 && valNum > ympe && !isMax;
                                                        
                                                        let inputStyle = "border-slate-200 focus:ring-indigo-500";
                                                        if (isMax) inputStyle = "border-emerald-300 bg-emerald-50/30 text-emerald-800 font-bold focus:ring-emerald-500";
                                                        else if (isTier2) inputStyle = "border-purple-300 bg-purple-50/30 text-purple-800 focus:ring-purple-500";

                                                        return (
                                                            <div key={year} className="p-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors grid grid-cols-12 items-center rounded-xl">
                                                                <div className="col-span-3 text-xs font-bold text-slate-700">
                                                                    {year} <span className="text-[10px] text-slate-400 font-medium ml-1">({year - birthYear})</span>
                                                                </div>
                                                                <div className="col-span-9 flex gap-3">
                                                                    <div className="relative flex-1 group">
                                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-mono group-focus-within:text-indigo-500 transition-colors">$</span>
                                                                        <input type="number" value={val} onChange={(e) => handleEarningChange(year, e.target.value)} className={`w-full pl-6 pr-3 py-2 text-sm border rounded-xl outline-none focus:ring-2 transition-all font-mono ${inputStyle}`} placeholder="0" />
                                                                    </div>
                                                                    <button onClick={() => toggleMax(year, isMax)} className={`px-3 py-2 text-[10px] font-black rounded-xl border transition-all uppercase tracking-tighter shadow-sm ${isMax ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300 hover:text-slate-600'}`}>Max</button>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'results' && (
                            <div className="space-y-8 animate-fade-in">
                                {!hasEarnings && (
                                    <div className="bg-amber-50 border-l-4 border-amber-400 p-5 rounded-2xl flex items-start gap-4 shadow-sm">
                                        <InfoIcon className="text-amber-500 mt-1 shrink-0" size={24} />
                                        <div>
                                            <h4 className="font-bold text-amber-900">Data Missing</h4>
                                            <p className="text-amber-800 text-sm mt-1 leading-relaxed">Forecast is currently <strong>$0</strong>. <button onClick={() => setActiveTab('input')} className="font-black underline decoration-2 underline-offset-2 hover:text-amber-950 transition-colors">Go to Step 1</button> to add earnings.</p>
                                        </div>
                                    </div>
                                )}

                                {/* HERO CARD */}
                                <div className="bg-slate-900 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden isolate transition-all duration-500 transform border border-slate-800">
                                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                                    
                                    <div className="relative z-10">
                                        <div className="flex justify-end mb-6">
                                            <button 
                                                onClick={copyLink}
                                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-bold transition-all shadow-lg active:scale-95"
                                            >
                                                {copySuccess ? <CheckIcon size={16} className="text-emerald-400" /> : <LinkIcon size={16} />}
                                                {copySuccess ? "Link Copied!" : "Share Estimate"}
                                            </button>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-12 items-center">
                                            <div>
                                                <h2 className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-2 leading-none">Monthly Forecast</h2>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-6xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-slate-400">
                                                        ${displayTotal.toLocaleString('en-CA', { maximumFractionDigits: 0 })}
                                                    </span>
                                                    <span className="text-slate-400 text-xl font-medium">/ mo</span>
                                                </div>
                                                
                                                {displayTotal > 0 && (
                                                    <div className="mt-8">
                                                        <div className="flex h-4 w-full rounded-full overflow-hidden bg-white/10 p-0.5 border border-white/5 ring-4 ring-white/5">
                                                            <div style={{ width: `${cppPerc}%` }} className="bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-l-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(99,102,241,0.4)]" />
                                                            <div style={{ width: `${oasPerc}%` }} className="bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-1000 shadow-[0_0_15px_rgba(245,158,11,0.4)]" />
                                                            <div style={{ width: `${gisPerc}%` }} className="bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-r-full transition-all duration-1000 shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
                                                        </div>
                                                        <div className="flex gap-6 mt-4 text-[10px] font-black tracking-[0.1em] uppercase text-slate-400">
                                                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-indigo-500"></div> CPP</div>
                                                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500"></div> OAS</div>
                                                            {gisPerc > 0 && <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> GIS</div>}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="bg-white/5 rounded-[2rem] p-8 border border-white/10 backdrop-blur-md shadow-2xl">
                                                <div className="flex justify-between items-center mb-6">
                                                    <label className="text-sm font-bold text-slate-200">Test Scenarios</label>
                                                    <div className="bg-indigo-500 text-white text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider shadow-lg ring-2 ring-indigo-500/20">
                                                        Age: {retirementAge}
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-8">
                                                    <input 
                                                        type="range" 
                                                        min="60" 
                                                        max="70" 
                                                        step="1" 
                                                        value={retirementAge} 
                                                        onChange={(e) => setRetirementAge(parseInt(e.target.value))} 
                                                        className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-400" 
                                                    />
                                                    
                                                    <div className="flex flex-col gap-3">
                                                        {!comparisonSnapshot ? (
                                                            <button 
                                                                onClick={saveComparison} 
                                                                className="w-full py-4 text-sm font-black rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-900/40 active:scale-95 uppercase tracking-widest"
                                                            >
                                                                <ScaleIcon size={20} /> Snapshot Age {retirementAge}
                                                            </button>
                                                        ) : (
                                                            <div className="grid grid-cols-6 gap-2">
                                                                <button onClick={clearComparison} className="col-span-1 p-4 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-2xl hover:bg-rose-500/30 transition-all flex justify-center items-center" title="Clear Comparison"><XIcon size={24} /></button>
                                                                <div className="col-span-5 bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-2xl text-center flex flex-col justify-center">
                                                                    <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest leading-none mb-1">Comparing to Baseline</div>
                                                                    <div className="text-sm font-black text-white">Age {comparisonSnapshot.age}</div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {comparisonSnapshot && (
                                    <div className="bg-white rounded-[2rem] border-2 border-indigo-50 overflow-hidden animate-fade-in shadow-xl">
                                        <div className="bg-indigo-600 p-5 flex items-center gap-3 text-white">
                                            <ScaleIcon size={24} />
                                            <h3 className="font-black text-sm uppercase tracking-[0.1em]">Scenario Comparative Logic</h3>
                                        </div>
                                        <div className="p-8">
                                            <div className="grid grid-cols-3 gap-8">
                                                <div className="space-y-6 pt-10">
                                                    <div className="font-bold text-slate-400 text-xs uppercase tracking-widest py-4 border-b border-slate-50">Estimated Check</div>
                                                    <div className="font-bold text-slate-400 text-xs uppercase tracking-widest py-4">Total Wealth Crossover</div>
                                                </div>
                                                <div className="bg-slate-50 rounded-3xl p-6 text-center border border-slate-100 flex flex-col items-center">
                                                    <div className="bg-white px-3 py-1 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 shadow-sm border border-slate-100">Scenario A</div>
                                                    <div className="text-xs font-bold text-slate-400 uppercase mb-1">Start @ Age {comparisonSnapshot.age}</div>
                                                    <div className="text-3xl font-black text-slate-700 py-3 border-b border-white w-full font-mono">${(comparisonSnapshot.monthly * inflationFactor * taxFactor).toLocaleString(undefined, {maximumFractionDigits:0})}</div>
                                                    <div className="py-6 text-slate-300 italic text-xs font-bold uppercase tracking-widest">Baseline</div>
                                                </div>
                                                <div className="bg-indigo-50 rounded-3xl p-6 text-center border border-indigo-100 ring-4 ring-indigo-500/5 relative overflow-hidden flex flex-col items-center">
                                                    <div className="bg-indigo-600 px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-widest mb-4 shadow-lg border border-indigo-500">Scenario B</div>
                                                    <div className="text-xs font-bold text-indigo-400 uppercase mb-1">Start @ Age {retirementAge}</div>
                                                    <div className="text-3xl font-black text-indigo-700 py-3 border-b border-indigo-100/50 w-full font-mono">
                                                        ${displayTotal.toLocaleString(undefined, {maximumFractionDigits:0})}
                                                        <div className={`text-[10px] mt-1 font-sans font-black ${results.grandTotal >= comparisonSnapshot.monthly ? 'text-emerald-600' : 'text-rose-500'}`}>
                                                            {results.grandTotal >= comparisonSnapshot.monthly ? '+' : ''}
                                                            ${((results.grandTotal - comparisonSnapshot.monthly) * inflationFactor * taxFactor).toFixed(0)}/mo
                                                        </div>
                                                    </div>
                                                    <div className="py-6 font-bold text-indigo-900 leading-tight text-sm">
                                                        {comparisonSnapshot.age === retirementAge ? "Identical Scenarios Selected" : comparisonMsg}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* BREAKDOWN CARDS */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-white p-6 rounded-3xl border border-slate-200 relative overflow-hidden group shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                                        <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-500"></div>
                                        <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2 uppercase text-xs tracking-widest leading-none">
                                            <TrendingUpIcon size={20} className="text-indigo-600"/> CPP Projection
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-500 font-bold uppercase text-[10px]">Base (Core)</span>
                                                <span className="font-mono font-black text-slate-800">${(results.cpp.base * inflationFactor * taxFactor).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-500 font-bold uppercase text-[10px] flex items-center gap-1">Enhanced <Tooltip text="Forecasted results from 2019-2025 Tier 1 and Tier 2 contributions." /></span>
                                                <span className="font-mono font-black text-emerald-600">+${(results.cpp.enhanced * inflationFactor * taxFactor).toFixed(2)}</span>
                                            </div>
                                            <div className="pt-5 border-t-2 border-slate-50 flex justify-between items-end">
                                                <span className="text-slate-900 font-black text-[10px] uppercase tracking-widest">Gross Monthly</span>
                                                <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter">${displayCPP.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-white p-6 rounded-3xl border border-slate-200 relative overflow-hidden group shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                                        <div className="absolute top-0 left-0 w-full h-1.5 bg-amber-500"></div>
                                        <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2 uppercase text-xs tracking-widest leading-none">
                                            <HomeIcon size={20} className="text-amber-600"/> OAS Projection
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-500 font-bold uppercase text-[10px]">OAS Amount</span>
                                                <span className="font-mono font-black text-slate-800">${(results.oas.gross * inflationFactor * taxFactor).toFixed(2)}</span>
                                            </div>
                                            {results.oas.clawback > 0 && (
                                                <div className="flex justify-between items-center text-[10px] bg-rose-50 p-3 rounded-2xl border border-rose-100 text-rose-700 font-black uppercase tracking-tighter animate-fade-in shadow-inner">
                                                    <span>Recovery Tax (Line 23500)</span>
                                                    <span className="font-mono">-${(results.oas.clawback * inflationFactor * taxFactor).toFixed(2)}</span>
                                                </div>
                                            )}
                                            <div className="pt-5 border-t-2 border-slate-50 flex justify-between items-end">
                                                <span className="text-slate-900 font-black text-[10px] uppercase tracking-widest">Estimated Net</span>
                                                <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter">${displayOAS.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-3xl border border-slate-200 relative overflow-hidden group shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                                        <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500"></div>
                                        <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2 uppercase text-xs tracking-widest leading-none">
                                            <HeartHandshakeIcon size={20} className="text-emerald-600"/> Low Income
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-500 font-bold uppercase text-[10px]">GIS Supplement</span>
                                                <span className="font-mono font-black text-emerald-600">${displayGIS.toFixed(2)}</span>
                                            </div>
                                            <div className="text-[10px] text-slate-400 font-bold leading-relaxed italic p-3 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
                                                {results.gis.note || "Analysis based on provided taxable household retirement income figures."}
                                            </div>
                                            <div className="pt-5 border-t-2 border-slate-50 flex justify-between items-end">
                                                <span className="text-slate-900 font-black text-[10px] uppercase tracking-widest">Total Monthly</span>
                                                <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter">${displayGIS.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* CHART SECTION */}
                                <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-2xl mt-8">
                                    <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
                                        <div className="flex items-center gap-5">
                                            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-[1.5rem] shadow-inner"><BarChartIcon size={32}/></div>
                                            <div>
                                                <h3 className="font-black text-slate-800 text-2xl tracking-tighter leading-none mb-2">Lifetime Wealth Crossover</h3>
                                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] leading-none">Total cumulative cash flow by starting age</p>
                                            </div>
                                        </div>
                                        {comparisonSnapshot && (
                                            <div className="bg-indigo-600 px-6 py-3 rounded-2xl text-white text-xs font-black shadow-xl shadow-indigo-900/20 animate-slide-in border-2 border-indigo-400">
                                                ANALYZING: AGE {comparisonSnapshot.age} VS {retirementAge}
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="h-[450px] w-full cursor-crosshair relative">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={results.breakevenData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }} onClick={(e) => { if(e && e.activeLabel) setChartSelection(e.activeLabel) }}>
                                                <CartesianGrid strokeDasharray="6 6" stroke="#f1f5f9" vertical={false} />
                                                <XAxis dataKey="age" stroke="#94a3b8" fontSize={11} fontWeight="900" tickLine={false} axisLine={false} tickMargin={15} />
                                                <YAxis stroke="#94a3b8" fontSize={11} fontWeight="900" tickLine={false} axisLine={false} tickFormatter={(v) => `$${v/1000}k`} tickMargin={15} />
                                                <RechartsTooltip 
                                                    cursor={{ stroke: '#6366f1', strokeWidth: 3, strokeDasharray: '8 8' }}
                                                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '1.5rem', padding: '1.5rem', color: '#f8fafc', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)' }}
                                                    itemStyle={{ fontSize: '13px', fontWeight: '800', padding: '6px 0' }}
                                                    labelStyle={{ color: '#94a3b8', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '1rem', borderBottom: '1px solid #1e293b', paddingBottom: '0.75rem' }}
                                                    formatter={(v, n) => [`$${v.toLocaleString()}`, n]}
                                                />
                                                <Legend wrapperStyle={{ paddingTop: '3rem', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }} iconType="circle" onClick={handleLegendClick} />
                                                
                                                <Line type="monotone" dataKey="Early" name="Start 60" stroke="#10b981" strokeWidth={4} dot={false} activeDot={{ r: 8, strokeWidth: 0, fill: '#10b981' }} hide={!lineVisibility.Early} />
                                                <Line type="monotone" dataKey="Standard" name="Start 65" stroke="#3b82f6" strokeWidth={4} dot={false} activeDot={{ r: 8, strokeWidth: 0, fill: '#3b82f6' }} hide={!lineVisibility.Standard} />
                                                <Line type="monotone" dataKey="Deferred" name="Start 70" stroke="#f59e0b" strokeWidth={4} dot={false} activeDot={{ r: 8, strokeWidth: 0, fill: '#f59e0b' }} hide={!lineVisibility.Deferred} />
                                                
                                                {results.userIsDistinct && (
                                                    <Line type="monotone" dataKey="Selected" name={`Start ${results.selectedAge}`} stroke="#8b5cf6" strokeWidth={5} strokeDasharray="12 6" dot={false} activeDot={{ r: 10, strokeWidth: 0, fill: '#8b5cf6' }} hide={!lineVisibility.Selected} />
                                                )}

                                                {results.crossovers.age65 && lineVisibility.Early && lineVisibility.Standard && <ReferenceLine x={results.crossovers.age65} stroke="#3b82f6" strokeDasharray="6 6" label={{ position: 'top', value: `65 beats 60 at ${results.crossovers.age65}`, fill: '#3b82f6', fontSize: 11, fontWeight: '900' }} />}
                                                {results.crossovers.age70 && lineVisibility.Standard && lineVisibility.Deferred && <ReferenceLine x={results.crossovers.age70} stroke="#f59e0b" strokeDasharray="6 6" label={{ position: 'top', value: `70 beats 65 at ${results.crossovers.age70}`, fill: '#f59e0b', fontSize: 11, fontWeight: '900' }} />}
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div className="flex justify-center pt-12">
                                    <button onClick={() => {setActiveTab('input'); window.scrollTo(0,0)}} className="text-slate-400 hover:text-indigo-600 text-[10px] font-black flex items-center gap-3 transition-all uppercase tracking-[0.3em] group">
                                        <RotateCcwIcon size={24} className="group-hover:rotate-[-360deg] transition-transform duration-700"/> Return to Parameters
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ACCORDIONS SECTION */}
                <div className="max-w-3xl mx-auto space-y-6 pb-20">
                    <Accordion title="Understanding CPP Phase 2 (Enhanced)" icon={CalculatorIcon}>
                        <p className="mb-4">Between 2019 and 2023, the Canada Pension Plan began 'Phase 1' of its modernization, increasing the base contribution percentage.</p>
                        <p className="mb-4 font-bold text-slate-800">Beginning in 2024 and reaching full threshold in 2025, 'Phase 2' introduces the YAMPE (Year’s Additional Maximum Pensionable Earnings).</p>
                        <div className="bg-indigo-50 p-5 rounded-3xl border-2 border-indigo-100 text-indigo-900 font-bold leading-relaxed text-sm shadow-inner">
                            If you earn more than $71,300 in 2025, you now contribute an extra 4% on the 'Tier 2' slice of your income (up to approx $81,200). 
                        </div>
                        <p className="mt-4">LoonieSense models these tiered contributions to accurately forecast the 'Enhanced' portion of your future monthly check.</p>
                    </Accordion>

                    <Accordion title="OAS Recovery Tax (Clawbacks)" icon={FilterIcon}>
                        <p className="mb-4">The Old Age Security (OAS) pension is subject to a 'Recovery Tax' if your total annual retirement income exceeds the threshold established by the CRA ($90,997 for the 2024 tax year).</p>
                        <p className="font-bold text-slate-800">For every dollar your net income exceeds this threshold, your monthly OAS payment is reduced by 15 cents.</p>
                        <p className="mt-2 text-slate-500 font-medium">LoonieSense automatically calculates this reduction based on the 'Personal Retirement Income' you provide in Step 1.</p>
                    </Accordion>

                    <Accordion title="Government Resources & Links" icon={BookOpenIcon}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <a href="https://www.canada.ca/en/services/benefits/publicpensions/cpp/payment-amounts.html" target="_blank" className="text-indigo-600 font-black text-xs uppercase tracking-widest flex items-center justify-between bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 hover:bg-indigo-100 transition-all">CPP Rates <ExternalLinkIcon size={16}/></a>
                            <a href="https://www.canada.ca/en/services/benefits/publicpensions/old-age-security/payments.html" target="_blank" className="text-indigo-600 font-black text-xs uppercase tracking-widest flex items-center justify-between bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 hover:bg-indigo-100 transition-all">OAS Thresholds <ExternalLinkIcon size={16}/></a>
                            <a href="https://www.canada.ca/en/employment-social-development/services/my-account.html" target="_blank" className="text-indigo-600 font-black text-xs uppercase tracking-widest flex items-center justify-between bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 hover:bg-indigo-100 transition-all">My Service Canada <ExternalLinkIcon size={16}/></a>
                            <a href="https://www.canada.ca/en/services/benefits/publicpensions/cpp/cpp-enhancement.html" target="_blank" className="text-indigo-600 font-black text-xs uppercase tracking-widest flex items-center justify-between bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 hover:bg-indigo-100 transition-all">Enhancement Guide <ExternalLinkIcon size={16}/></a>
                        </div>
                    </Accordion>
                </div>
                
                <div style={{ height: '140px' }}></div> 
            </main>

            {/* === OPTION 1: COMPACT MOBILE-FRIENDLY FOOTER === */}
            {activeTab === 'input' && mounted && createPortal(
                <div 
                    className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 p-3 shadow-[0_-15px_40px_-10px_rgba(0,0,0,0.15)] z-[9999] animate-slide-up"
                    style={{ position: 'fixed', bottom: 0, width: '100%' }}
                >
                    <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
                        
                        {/* Summary View */}
                        <div className="flex flex-col pl-2">
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-3xl font-black text-slate-900 leading-none tracking-tighter">
                                    ${displayTotal.toLocaleString('en-CA', { maximumFractionDigits: 0 })}
                                </span>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">/mo</span>
                            </div>
                            <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest leading-none mt-2 drop-shadow-sm">Forecast @ Age {retirementAge}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            {/* Icon-only Share for Mobile to Save Space */}
                            <button 
                                onClick={copyLink}
                                className="p-4 rounded-2xl border-2 border-slate-100 text-slate-500 hover:bg-slate-50 active:bg-slate-200 transition-all flex items-center justify-center shadow-sm"
                            >
                                {copySuccess ? <CheckIcon size={22} className="text-emerald-500" /> : <LinkIcon size={22} />}
                            </button>

                            {/* View Analysis Button */}
                            <button 
                                onClick={() => {
                                    setActiveTab('results');
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }} 
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center gap-3 active:scale-95"
                            >
                                <span className="text-[10px] uppercase tracking-[0.2em] font-black">Analyze</span>
                                <ArrowRightIcon size={20} />
                            </button>
                        </div>
                    </div>
                </div>,
                document.body 
            )}
        </div>
    );
}