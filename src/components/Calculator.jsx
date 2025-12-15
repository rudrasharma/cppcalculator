// src/components/Calculator.jsx
import React, { useState, useMemo } from 'react';

// --- ICONS ---
const IconBase = ({ size = 24, className = "", children }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>{children}</svg>
);
// ... (Keep your existing Icon components exactly the same)
const CalculatorIcon = (props) => (<IconBase {...props}><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></IconBase>);
const TrendingUpIcon = (props) => (<IconBase {...props}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></IconBase>);
const CheckCircleIcon = (props) => (<IconBase {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/></IconBase>);
const RotateCcwIcon = (props) => (<IconBase {...props}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></IconBase>);
const InfoIcon = (props) => (<IconBase {...props}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></IconBase>);
const HomeIcon = (props) => (<IconBase {...props}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></IconBase>);
const DollarSignIcon = (props) => (<IconBase {...props}><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></IconBase>);
const BookOpenIcon = (props) => (<IconBase {...props}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></IconBase>);
const HelpCircleIcon = (props) => (<IconBase {...props}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></IconBase>);
const MailIcon = (props) => (<IconBase {...props}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></IconBase>);
const ArrowRightIcon = (props) => (<IconBase {...props}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></IconBase>);
const ExternalLinkIcon = (props) => (<IconBase {...props}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></IconBase>);
const XIcon = (props) => (<IconBase {...props}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></IconBase>);
const UserGroupIcon = (props) => (<IconBase {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></IconBase>);
const ChevronDownIcon = (props) => (<IconBase {...props}><polyline points="6 9 12 15 18 9"/></IconBase>);
const LightbulbIcon = (props) => (<IconBase {...props}><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2 1.5-3.5 0-2.2-1.8-4-4-4a4 4 0 0 0-4 4c0 1.5.5 2.5 1.5 3.5.8.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></IconBase>);
// --- NEW GIS ICON ---
const HeartHandshakeIcon = (props) => (<IconBase {...props}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></IconBase>);


// --- CONSTANTS ---
const YMPE_DATA = {
    2030:80600, 2029:78700, 2028:76800, 2027:74900, 2026:73100,
    2025:71300, 2024:68500, 2023:66600, 2022:64900, 2021:61600,
    2020:58700, 2019:57400, 2018:55900, 2017:55300, 2016:54900,
    2015:53600, 2014:52500, 2013:51100, 2012:50100, 2011:48300,
    2010:47200, 2009:46300, 2008:44900, 2007:43700, 2006:42100,
    2005:41100, 2004:40500, 2003:39900, 2002:39100, 2001:38300
};
const CURRENT_YEAR = new Date().getFullYear();
const MAX_BASE_CPP_2025 = 1364.60;
const MAX_OAS_2025 = 727.67;
const OAS_CLAWBACK_THRESHOLD_2025 = 93454;
// --- NEW GIS CONSTANTS ---
const MAX_GIS_SINGLE_2025 = 1085.00; // Estimated 2025 Single rate
const GIS_CLAWBACK_RATE = 0.50; // 50 cents for every dollar of income

const getYAMPE = (year) => {
    if (year < 2024) return 0;
    if (year === 2024) return 73200;
    if (year === 2025) return 81200;
    const ympe = YMPE_DATA[year] || (71300 * Math.pow(1.025, year - 2025));
    return Math.round(ympe * 1.14);
};
const getYMPE = (year) => {
    if (YMPE_DATA[year]) return YMPE_DATA[year];
    if (year > 2025) return Math.round(71300 * Math.pow(1.025, year - 2025));
    if (year < 2011) return Math.round(48300 * Math.pow(0.975, 2011 - year));
    return 5000;
};

// --- COMPONENTS ---
// (Keep Tooltip and Accordion exactly as they were)
const Tooltip = ({ text }) => (
    <div className="group relative inline-flex items-center ml-2">
        <button className="text-gray-400 hover:text-blue-500 transition-colors"><HelpCircleIcon size={16} /></button>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-center leading-tight">
            {text}<div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
        </div>
    </div>
);

const Accordion = ({ title, icon: Icon, children, defaultOpen = false }) => {
    return (
        <details className="group bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-4" open={defaultOpen}>
            <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition select-none">
                <div className="flex items-center gap-3">
                    <div className="text-blue-600 bg-blue-50 p-2 rounded-lg"><Icon size={20} /></div>
                    <h3 className="font-bold text-gray-800">{title}</h3>
                </div>
                <div className="text-gray-400 transition-transform group-open:rotate-180"><ChevronDownIcon size={20} /></div>
            </summary>
            <div className="p-4 pt-0 border-t border-gray-100 mt-2 text-sm text-gray-600 leading-relaxed animate-fade-in">{children}</div>
        </details>
    );
};

export default function Calculator() {
    const [dob, setDob] = useState('1985-01-01');
    const [retirementAge, setRetirementAge] = useState(65);
    const [yearsInCanada, setYearsInCanada] = useState(40);
    const [earnings, setEarnings] = useState({});
    const [activeTab, setActiveTab] = useState('input');
    const [avgSalaryInput, setAvgSalaryInput] = useState('');
    const [showClawback, setShowClawback] = useState(false);
    const [otherIncome, setOtherIncome] = useState('');
    const [showAbout, setShowAbout] = useState(false);
    // --- NEW MARITAL STATUS STATE ---
    const [maritalStatus, setMaritalStatus] = useState('single');

    const birthYear = parseInt(dob.split('-')[0]);
    const startYear = birthYear + 18;
    const endYear = birthYear + retirementAge;
    const years = useMemo(() => {
        const list = [];
        for (let y = startYear; y < endYear; y++) list.push(y);
        return list;
    }, [startYear, endYear]);

    // (Keep helper functions like handleEarningChange, toggleMax, fillAll, applyAverageSalary)
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
    const fillAll = (type, time) => {
        const newEarnings = { ...earnings };
        years.forEach(y => {
            if ((time === 'future' && y >= CURRENT_YEAR) || (time === 'past' && y < CURRENT_YEAR)) {
                if (type === 'max') {
                    const ympe = getYMPE(y);
                    const yampe = getYAMPE(y);
                    newEarnings[y] = yampe > 0 ? yampe : ympe;
                } else if (type === 'clear') {
                    delete newEarnings[y];
                }
            }
        });
        setEarnings(newEarnings);
    };
    const applyAverageSalary = () => {
        if (!avgSalaryInput || avgSalaryInput <= 0) return;
        const currentYMPE = getYMPE(CURRENT_YEAR);
        const ratio = parseFloat(avgSalaryInput) / currentYMPE;
        const newEarnings = {};
        years.forEach(y => {
            const yYMPE = getYMPE(y);
            newEarnings[y] = Math.round(yYMPE * ratio);
        });
        setEarnings(newEarnings);
    };

    const calculateBenefits = () => {
        // --- 1. CPP CALCULATION (UNCHANGED) ---
        const currentYMPE = getYMPE(CURRENT_YEAR);
        const yearData = years.map(year => {
            const ympe = getYMPE(year);
            const yampe = getYAMPE(year);
            let rawIncome = parseFloat(earnings[year] || 0);
            const baseIncome = Math.min(rawIncome, ympe);
            const ratio = baseIncome / ympe;
            const adjustedEarnings = ratio * currentYMPE;
            const isEnhancedYear = year >= 2019;
            const tier1Income = baseIncome;
            const tier2Income = Math.max(0, Math.min(rawIncome, yampe) - ympe);
            return { year, ratio, adjustedEarnings, isEnhancedYear, tier1Income, tier2Income, ympe, yampe };
        });

        const sortedByRatio = [...yearData].sort((a, b) => a.ratio - b.ratio);
        const totalMonths = years.length * 12;
        const monthsToDrop = Math.floor(totalMonths * 0.17);
        const retainedYears = sortedByRatio.slice(Math.floor(monthsToDrop / 12));
        const avgRatio = retainedYears.length > 0 ? retainedYears.reduce((sum, y) => sum + y.ratio, 0) / retainedYears.length : 0;
        const baseBenefit = MAX_BASE_CPP_2025 * avgRatio;

        let enhancedTier1Total = 0, enhancedTier2Total = 0;
        yearData.forEach(d => {
            if (d.isEnhancedYear) {
                const t1Credit = (d.tier1Income / d.ympe) * (0.0833 / 40) * currentYMPE;
                enhancedTier1Total += t1Credit;
                if (d.year >= 2024) {
                    const spread = d.yampe - d.ympe;
                    if (spread > 0) {
                        const currentSpread = currentYMPE * 0.14;
                        enhancedTier2Total += (d.tier2Income / spread) * (0.3333 / 40) * currentSpread;
                    }
                }
            }
        });

        const enhancedBenefit = (enhancedTier1Total / 12) + (enhancedTier2Total / 12);
        const monthsDiff = (retirementAge - 65) * 12;
        let cppAdjustmentPercent = 0;
        if (monthsDiff < 0) cppAdjustmentPercent = monthsDiff * 0.6;
        else if (monthsDiff > 0) cppAdjustmentPercent = Math.min(monthsDiff, 60) * 0.7;

        const finalCPP = (baseBenefit + enhancedBenefit) * (1 + (cppAdjustmentPercent / 100));

        // --- 2. OAS CALCULATION (UNCHANGED) ---
        const validYears = Math.min(Math.max(0, yearsInCanada), 40);
        let baseOAS = MAX_OAS_2025 * (validYears / 40);
        let oasGross = 0;
        if (retirementAge >= 65) {
            const oasMonthsDeferred = Math.min((retirementAge - 65) * 12, 60);
            oasGross = baseOAS * (1 + (oasMonthsDeferred * 0.6 / 100));
        }

        // --- 3. CLAWBACK & GIS LOGIC (MODIFIED) ---
        const annualCPP = finalCPP * 12;
        const annualOAS = oasGross * 12;
        const annualOther = parseFloat(otherIncome) || 0;
        
        // OAS Recovery Tax
        let oasClawbackMonthly = 0;
        const totalNetWorldIncome = annualOther + annualCPP + annualOAS;
        if (showClawback && retirementAge >= 65) {
            if (totalNetWorldIncome > OAS_CLAWBACK_THRESHOLD_2025) {
                oasClawbackMonthly = ((totalNetWorldIncome - OAS_CLAWBACK_THRESHOLD_2025) * 0.15) / 12;
            }
        }
        const finalOAS = Math.max(0, oasGross - oasClawbackMonthly);

        // --- NEW GIS CALCULATION ---
        // GIS rules:
        // 1. Must be receiving OAS (so Age >= 65).
        // 2. Income for GIS = Net World Income MINUS OAS.
        // 3. For Single: GIS reduced by 50 cents for every dollar of income.
        // 4. Partnered is complex, so we will estimate based on Single rate or show N/A.
        
        let gisAmount = 0;
        let gisNote = "";
        
        if (retirementAge >= 65) {
             // Income definition for GIS excludes OAS, includes CPP + Other
            const incomeForGIS = annualCPP + annualOther;
            
            if (maritalStatus === 'single') {
                // GIS reduces by 50% of income
                const gisReduction = Math.max(0, incomeForGIS) * GIS_CLAWBACK_RATE;
                const monthlyReduction = gisReduction / 12;
                gisAmount = Math.max(0, MAX_GIS_SINGLE_2025 - monthlyReduction);
            } else {
                // Fallback for partnered (too complex for single input)
                gisNote = "Requires partner income data";
                gisAmount = 0; 
            }
        } else {
            gisNote = "Starts at 65";
        }

        // --- 4. INSIGHTS (UPDATED) ---
        const generateInsights = () => {
            const insights = [];
            // CPP Insight
            if (retirementAge < 65) {
                insights.push({
                    type: 'opportunity',
                    text: `Retiring at ${retirementAge} reduces your CPP by ${Math.abs(cppAdjustmentPercent).toFixed(1)}%.`
                });
            } else if (retirementAge > 65) {
                insights.push({
                    type: 'success',
                    text: `By delaying to ${retirementAge}, you boosted CPP by ${cppAdjustmentPercent.toFixed(1)}% and OAS by ${(Math.min((retirementAge - 65) * 12, 60) * 0.6).toFixed(1)}%.`
                });
            }
            // GIS Insight
            if (gisAmount > 0) {
                 insights.push({
                    type: 'success',
                    text: `Low Income Support: You qualify for an estimated $${gisAmount.toFixed(0)}/mo in GIS.`
                });
            } else if (retirementAge >= 65 && maritalStatus === 'single' && (annualCPP + annualOther) > 22000) {
                 insights.push({
                    type: 'warning',
                    text: `GIS is fully clawed back because your annual income (excluding OAS) exceeds ~$22k.`
                });
            }
            
            if (oasClawbackMonthly > 0) {
                insights.push({
                    type: 'danger',
                    text: `OAS Recovery Tax triggered. You are losing $${oasClawbackMonthly.toFixed(0)}/mo of OAS.`
                });
            }
            return insights;
        };

        return {
            cpp: { base: baseBenefit || 0, enhanced: enhancedBenefit || 0, total: finalCPP || 0, adjustmentPercent: cppAdjustmentPercent },
            oas: { amount: finalOAS, gross: oasGross, clawback: oasClawbackMonthly, yearsUsed: validYears, note: retirementAge < 65 ? "Starts at 65" : "" },
            gis: { amount: gisAmount, note: gisNote }, // NEW GIS OBJECT
            grandTotal: (finalCPP || 0) + finalOAS + gisAmount,
            insights: generateInsights()
        };
    };

    const results = calculateBenefits();

    return (
        <div className="flex flex-col relative">
            {/* ... (ABOUT MODAL - Keep same) ... */}
            {/* ... (HEADER - Keep same) ... */}

            {/* MAIN CONTENT */}
            <main className="max-w-4xl mx-auto p-4 md:p-6 w-full flex-grow">

                {/* CALCULATOR CARD */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-8">
                    {/* ... (Keep Header) ... */}
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                        <h2 className="text-lg font-bold text-gray-800">Calculator Inputs</h2>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* COLUMN 1 */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">1. Personal Details</h3>
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Date of Birth</label>
                                <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                             {/* --- NEW MARITAL STATUS INPUT --- */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Marital Status (For GIS)</label>
                                <select value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                                    <option value="single">Single / Widowed / Divorced</option>
                                    <option value="partnered">Married / Common-law</option>
                                </select>
                                {maritalStatus === 'partnered' && <p className="text-[10px] text-gray-400 mt-1">Note: This tool currently only estimates GIS for single individuals.</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Retirement Age: <span className="text-blue-600 font-bold">{retirementAge}</span></label>
                                <input type="range" min="60" max="70" step="1" value={retirementAge} onChange={(e) => setRetirementAge(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>60</span><span>65</span><span>70</span></div>
                            </div>
                        </div>

                        {/* COLUMN 2 */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">2. Financial Profile</h3>
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Estimate of Total Years in Canada (Ages 18 to 65)</label>
                                <input type="number" min="0" max="47" value={yearsInCanada} onChange={(e) => setYearsInCanada(parseInt(e.target.value) || 0)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Est. Annual Salary (Current $)</label>
                                {/* ... (Keep Avg Salary Input) ... */}
                                <div className="flex gap-2">
                                    <div className="relative flex-grow">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                        <input type="number" placeholder="e.g. 65000" value={avgSalaryInput} onChange={(e) => setAvgSalaryInput(e.target.value)} className="w-full pl-7 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <button onClick={applyAverageSalary} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">Apply</button>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Auto-populates earnings history based on 2025 YMPE.</p>
                            </div>

                            <div className="pt-2 border-t border-gray-100">
                                <label className="flex items-center gap-2 cursor-pointer mb-2">
                                    <input type="checkbox" checked={showClawback} onChange={(e) => setShowClawback(e.target.checked)} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                                    <span className="text-sm font-semibold text-gray-600">Include Other Income (OAS/GIS Clawback)</span>
                                </label>
                                {showClawback && (
                                    <div className="animate-fade-in pl-6">
                                        <label className="block text-xs font-semibold text-gray-500 mb-1">Other Annual Retirement Income (Excluding CPP/OAS)</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">$</span>
                                            <input type="number" placeholder="e.g. Pension, RRIF, Gains" value={otherIncome} onChange={(e) => setOtherIncome(e.target.value)} className="w-full pl-6 p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50" />
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-1">Triggers OAS clawback >$93k and reduces GIS immediately.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* TABS */}
                    {/* ... (Keep Tabs) ... */}
                    <div className="flex border-t border-gray-200 bg-gray-50">
                        <button onClick={() => setActiveTab('input')} className={`flex-1 py-3 text-sm font-bold text-center transition-colors ${activeTab === 'input' ? 'bg-white text-blue-600 border-t-2 border-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Earnings History</button>
                        <button onClick={() => setActiveTab('results')} className={`flex-1 py-3 text-sm font-bold text-center transition-colors ${activeTab === 'results' ? 'bg-white text-blue-600 border-t-2 border-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Estimate Results</button>
                    </div>

                    <div className="p-6">
                        {/* ... (Keep Earnings History Tab Input) ... */}
                        {activeTab === 'input' && (
                             <div className="animate-fade-in">
                                 {/* (Copy existing input tab content here - no changes needed inside) */}
                                 {/* ... (Existing code for buttons, table, etc) ... */}
                                 <div className="flex flex-wrap gap-2 mb-4 justify-between items-center">
                                    <div className="space-x-2 flex items-center">
                                        <div className="flex items-center bg-gray-100 rounded-full border border-gray-300 px-3 py-1 transition">
                                            <button onClick={() => fillAll('max', 'past')} className="text-xs text-gray-700 font-medium">Set Past to Max</button>
                                        </div>
                                        <div className="flex items-center bg-blue-50 rounded-full border border-blue-200 px-3 py-1 transition">
                                            <button onClick={() => fillAll('max', 'future')} className="text-xs text-blue-700 font-medium">Set Future to Max</button>
                                        </div>
                                    </div>
                                    <button onClick={() => setEarnings({})} className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1 transition"><RotateCcwIcon size={12} /> Clear All</button>
                                </div>
                                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                                    <div className="grid grid-cols-12 bg-gray-50 p-3 text-xs font-bold text-gray-500 uppercase tracking-wider border-b">
                                        <div className="col-span-2">Year</div><div className="col-span-2">Age</div><div className="col-span-3 text-right pr-4">YMPE</div><div className="col-span-5">Earnings</div>
                                    </div>
                                    <div className="max-h-[300px] overflow-y-auto">
                                    {years.map(year => {
                                        const isFuture = year > CURRENT_YEAR;
                                        const ympe = getYMPE(year);
                                        const yampe = getYAMPE(year);
                                        const maxVal = yampe > 0 ? yampe : ympe;
                                        const val = earnings[year] || '';
                                        const isMax = val >= maxVal && val !== '';
                                        return (
                                        <div key={year} className={`grid grid-cols-12 p-2 border-b last:border-0 items-center hover:bg-gray-50 transition ${isFuture ? 'bg-blue-50/30' : ''}`}>
                                            <div className="col-span-2 text-sm font-medium text-gray-700">{year}</div>
                                            <div className="col-span-2 text-sm text-gray-500">{year - birthYear}</div>
                                            <div className="col-span-3 text-right pr-4 text-sm text-gray-400 font-mono">${ympe.toLocaleString()}</div>
                                            <div className="col-span-5 flex items-center gap-2">
                                                <div className="relative flex-1"><span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span><input type="number" value={val} onChange={(e) => handleEarningChange(year, e.target.value)} className={`w-full pl-5 pr-2 py-1 text-sm border rounded focus:ring-1 focus:ring-blue-500 outline-none ${isMax ? 'text-green-700 font-semibold' : ''}`} placeholder="0" /></div>
                                                <button onClick={() => toggleMax(year, isMax)} className={`px-2 py-1 text-xs font-bold rounded border transition-colors ${isMax ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>MAX</button>
                                            </div>
                                        </div>
                                        );
                                    })}
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-center">
                                    <button onClick={() => setActiveTab('results')} className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105 flex items-center gap-2">Calculate My Estimate <ArrowRightIcon size={20} /></button>
                                </div>
                             </div>
                        )}

                        {activeTab === 'results' && (
                            <div className="space-y-6 animate-fade-in">
                                {/* INSIGHTS (Already updated via results.insights) */}
                                {results.insights.length > 0 && (
                                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 p-5 rounded-xl">
                                        <h3 className="flex items-center gap-2 text-indigo-800 font-bold mb-3">
                                            <LightbulbIcon size={20} /> Smart Analysis
                                        </h3>
                                        <div className="space-y-3">
                                            {results.insights.map((insight, idx) => (
                                                <div key={idx} className={`text-sm p-3 rounded-lg border ${
                                                    insight.type === 'danger' ? 'bg-red-50 border-red-100 text-red-800' :
                                                    insight.type === 'warning' ? 'bg-orange-50 border-orange-100 text-orange-800' :
                                                    insight.type === 'success' ? 'bg-green-50 border-green-100 text-green-800' :
                                                    'bg-white border-indigo-100 text-indigo-700'
                                                }`}>
                                                    {insight.text}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* TOTAL PAYOUT CARD */}
                                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10"><DollarSignIcon size={150} /></div>
                                    <div className="relative z-10">
                                        <h2 className="text-blue-100 text-sm font-semibold uppercase tracking-widest mb-1">Total Estimated Monthly Payout</h2>
                                        <div className="flex items-baseline gap-2"><span className="text-5xl font-bold">${results.grandTotal.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span><span className="text-blue-200">/ mo</span></div>
                                        <div className="mt-4 flex gap-4 text-sm flex-wrap">
                                            <div className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full"><span className="opacity-75">CPP:</span><span className="font-bold">${results.cpp.total.toLocaleString(undefined, {minimumFractionDigits:0, maximumFractionDigits:0})}</span></div>
                                            <div className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full"><span className="opacity-75">OAS:</span><span className="font-bold">${results.oas.amount.toLocaleString(undefined, {minimumFractionDigits:0, maximumFractionDigits:0})}</span></div>
                                            {/* --- ADD GIS TO TOTAL --- */}
                                            {results.gis.amount > 0 && <div className="flex items-center gap-1 bg-teal-500/20 px-3 py-1 rounded-full border border-teal-400/30"><span className="opacity-75">GIS:</span><span className="font-bold text-teal-200">${results.gis.amount.toLocaleString(undefined, {minimumFractionDigits:0, maximumFractionDigits:0})}</span></div>}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                     {/* (Previous breakdown cards) */}
                                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                                        <div className="flex items-center gap-2 mb-4 text-gray-700"><TrendingUpIcon size={20} className="text-blue-600"/><h3 className="font-bold">Base CPP</h3></div>
                                        <div className="flex justify-between text-sm"><span className="text-gray-500">Base Entitlement</span><span className="font-medium">${results.cpp.base.toFixed(2)}</span></div>
                                    </div>
                                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                                        <div className="flex items-center gap-2 mb-4 text-gray-700"><CheckCircleIcon size={20} className="text-green-600"/><h3 className="font-bold">Enhanced CPP</h3></div>
                                        <div className="flex justify-between text-sm"><span className="text-gray-500">Enhancement</span><span className="font-medium text-green-600">+${results.cpp.enhanced.toFixed(2)}</span></div>
                                    </div>
                                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                                        <div className="flex items-center gap-2 mb-4 text-gray-700"><HomeIcon size={20} className="text-orange-500"/><h3 className="font-bold">OAS</h3></div>
                                        <div className="flex justify-between text-sm"><span className="text-gray-500">Amount</span><span className="font-medium text-orange-600">${results.oas.amount.toFixed(2)}</span></div>
                                        {results.oas.clawback > 0 && (<div className="flex justify-between text-xs text-red-500 animate-pulse"><span>Recovery Tax</span><span>-${results.oas.clawback.toFixed(2)}</span></div>)}
                                        {results.oas.note && (<div className="text-xs text-red-500 font-medium">{results.oas.note}</div>)}
                                    </div>
                                    
                                    {/* --- NEW GIS CARD --- */}
                                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                                        <div className="flex items-center gap-2 mb-4 text-gray-700"><HeartHandshakeIcon size={20} className="text-teal-600"/><h3 className="font-bold">GIS</h3></div>
                                        <div className="flex justify-between text-sm"><span className="text-gray-500">Supplement</span><span className="font-medium text-teal-600">${results.gis.amount.toFixed(2)}</span></div>
                                        {results.gis.note && (<div className="text-xs text-gray-400 font-medium mt-1">{results.gis.note}</div>)}
                                    </div>
                                </div>
                                {/* ... (Keep Age Adjustments) ... */}
                            </div>
                        )}
                    </div>
                </div>

                {/* ACCORDION SECTIONS */}
                <div className="max-w-3xl mx-auto mb-12">
                   {/* ... (Existing accordions) ... */}
                   
                   {/* --- NEW GIS EXPLANATION --- */}
                   <Accordion title="Understanding GIS (Guaranteed Income Supplement)" icon={HeartHandshakeIcon}>
                        <p className="mb-4">GIS is a monthly non-taxable benefit to Old Age Security (OAS) pension recipients who have a low income and are living in Canada.</p>
                        <p className="mb-4"><strong>Key Rules:</strong></p>
                        <ul className="list-disc pl-5 space-y-2 mb-4">
                            <li>You must be receiving OAS to get GIS (Age 65+).</li>
                            <li>For single individuals, GIS is reduced by <strong>50 cents</strong> for every dollar of income you earn (excluding OAS).</li>
                            <li>Your CPP payments count as income for GIS calculations. This often means high CPP payments can eliminate your GIS eligibility.</li>
                        </ul>
                   </Accordion>
                </div>

            </main>
            {/* ... (Footer - Keep same) ... */}
    </div>
    );
};
