import React, { useState, useEffect, useMemo } from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
    ResponsiveContainer, Legend, ReferenceLine 
} from 'recharts';

// --- ICONS ---
const IconBase = ({ size = 20, className = "", children }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>{children}</svg>
);
const BabyIcon = (props) => (<IconBase {...props}><path d="M9 12h.01"/><path d="M15 12h.01"/><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 4 .7 5.6 1.8"/><path d="M12 3v2"/></IconBase>);
const DollarSignIcon = (props) => (<IconBase {...props}><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></IconBase>);
const CalendarIcon = (props) => (<IconBase {...props}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></IconBase>);
const UsersIcon = (props) => (<IconBase {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></IconBase>);
const HelpCircleIcon = (props) => (<IconBase {...props}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></IconBase>);
const MapPinIcon = (props) => (<IconBase {...props}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></IconBase>);
const ChevronDownIcon = (props) => (<IconBase {...props}><polyline points="6 9 12 15 18 9"/></IconBase>);
const BookOpenIcon = (props) => (<IconBase {...props}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></IconBase>);
const ExternalLinkIcon = (props) => (<IconBase {...props}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></IconBase>);
const CalculatorIcon = (props) => (<IconBase {...props}><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></IconBase>);

// --- CONSTANTS (2025 RATES) ---
const EI_2025 = {
    MAX_INSURABLE: 65700, 
    STD_RATE: 0.55,
    EXT_RATE: 0.33,
    MAX_WEEKLY_STD: 695, 
    MAX_WEEKLY_EXT: 417, 
    MATERNITY_WEEKS: 15,
    STD_PARENTAL_WEEKS: 35, // 40 shared
    EXT_PARENTAL_WEEKS: 61, // 69 shared
    STD_SHARED_BONUS: 5,
    EXT_SHARED_BONUS: 8
};

const QPIP_2025 = {
    MAX_INSURABLE: 98000, 
    BASIC: {
        MATERNITY: { weeks: 18, rate: 0.70 },
        PATERNITY: { weeks: 5, rate: 0.70 },
        PARENTAL_1: { weeks: 7, rate: 0.70 }, // First 7 weeks
        PARENTAL_2: { weeks: 25, rate: 0.55 }, // Remaining 25 weeks
        ADOPTION: { weeks: 37, rate: 0.70 } // Simplified for this view
    },
    SPECIAL: {
        MATERNITY: { weeks: 15, rate: 0.75 },
        PATERNITY: { weeks: 3, rate: 0.75 },
        PARENTAL: { weeks: 25, rate: 0.75 }
    }
};

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

export default function ParentalLeave() {
    const [province, setProvince] = useState('ON');
    const [salary, setSalary] = useState(65000);
    const [partnerSalary, setPartnerSalary] = useState(0);
    const [hasPartner, setHasPartner] = useState(false);
    const [planType, setPlanType] = useState('STANDARD'); // STANDARD vs EXTENDED (or BASIC vs SPECIAL for QC)

    // --- CALCULATION LOGIC ---
    const results = useMemo(() => {
        const isQuebec = province === 'QC';
        let data = {
            maternityWeekly: 0, maternityWeeks: 0, maternityTotal: 0,
            parentalWeekly: 0, parentalWeeks: 0, parentalTotal: 0,
            partnerWeeks: 0, partnerTotal: 0,
            totalDuration: 0, totalValue: 0
        };

        if (!isQuebec) {
            // --- FEDERAL EI LOGIC ---
            const insurable = Math.min(salary, EI_2025.MAX_INSURABLE);
            const isExtended = planType === 'EXTENDED';
            
            // Maternity (Always Standard Rate)
            data.maternityWeekly = Math.min(EI_2025.MAX_WEEKLY_STD, insurable * EI_2025.STD_RATE);
            data.maternityWeeks = EI_2025.MATERNITY_WEEKS;
            data.maternityTotal = data.maternityWeekly * data.maternityWeeks;

            // Parental
            const pRate = isExtended ? EI_2025.EXT_RATE : EI_2025.STD_RATE;
            const pMax = isExtended ? EI_2025.MAX_WEEKLY_EXT : EI_2025.MAX_WEEKLY_STD;
            data.parentalWeekly = Math.min(pMax, insurable * pRate);
            data.parentalWeeks = isExtended ? EI_2025.EXT_PARENTAL_WEEKS : EI_2025.STD_PARENTAL_WEEKS;
            data.parentalTotal = data.parentalWeekly * data.parentalWeeks;

            // Partner Sharing Bonus
            if (hasPartner) {
                const partnerInsurable = Math.min(partnerSalary, EI_2025.MAX_INSURABLE);
                const partnerWeekly = Math.min(pMax, partnerInsurable * pRate);
                const bonusWeeks = isExtended ? EI_2025.EXT_SHARED_BONUS : EI_2025.STD_SHARED_BONUS;
                data.partnerWeeks = bonusWeeks;
                data.partnerTotal = partnerWeekly * bonusWeeks;
            }

            data.totalDuration = data.maternityWeeks + data.parentalWeeks + (hasPartner ? data.partnerWeeks : 0);
            data.totalValue = data.maternityTotal + data.parentalTotal + data.partnerTotal;

        } else {
            // --- QUEBEC QPIP LOGIC ---
            const insurable = Math.min(salary, QPIP_2025.MAX_INSURABLE);
            const isSpecial = planType === 'SPECIAL'; // Mapping EXTENDED UI state to SPECIAL for QC
            const plan = isSpecial ? QPIP_2025.SPECIAL : QPIP_2025.BASIC;

            // Maternity
            data.maternityWeekly = (insurable * plan.MATERNITY.rate) / 52;
            data.maternityWeeks = plan.MATERNITY.weeks;
            data.maternityTotal = data.maternityWeekly * data.maternityWeeks;

            // Parental
            // Note: QC Basic has split rates (7w @ 70%, 25w @ 55%). Simplified for estimation.
            let pWeekly = 0;
            let pWeeks = 0;
            let pTotal = 0;

            if (!isSpecial) {
                // Basic Plan Mix
                const rate1 = (insurable * 0.70) / 52;
                const rate2 = (insurable * 0.55) / 52;
                const w1 = 7; 
                const w2 = 25;
                pWeekly = rate1; // Display the higher starting rate
                pTotal = (rate1 * w1) + (rate2 * w2);
                pWeeks = w1 + w2;
            } else {
                // Special Plan (Flat 75%)
                pWeekly = (insurable * 0.75) / 52;
                pWeeks = plan.PARENTAL.weeks;
                pTotal = pWeekly * pWeeks;
            }
            data.parentalWeekly = pWeekly;
            data.parentalWeeks = pWeeks;
            data.parentalTotal = pTotal;

            // Paternity (Partner)
            if (hasPartner) {
                const pInsurable = Math.min(partnerSalary, QPIP_2025.MAX_INSURABLE);
                const patRate = plan.PATERNITY.rate;
                const patWeeks = plan.PATERNITY.weeks;
                data.partnerWeeks = patWeeks;
                data.partnerTotal = ((pInsurable * patRate) / 52) * patWeeks;
            }

            data.totalDuration = data.maternityWeeks + data.parentalWeeks + (hasPartner ? data.partnerWeeks : 0);
            data.totalValue = data.maternityTotal + data.parentalTotal + data.partnerTotal;
        }

        return data;
    }, [province, salary, partnerSalary, hasPartner, planType]);

    // --- CHART DATA ---
    const chartData = [
        { name: 'Maternity', value: Math.round(results.maternityTotal), weeks: results.maternityWeeks },
        { name: 'Parental', value: Math.round(results.parentalTotal), weeks: results.parentalWeeks },
        ...(hasPartner ? [{ name: 'Partner Bonus', value: Math.round(results.partnerTotal), weeks: results.partnerWeeks }] : [])
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-16 animate-fade-in">
            
            {/* HEADER */}
            <div className="bg-white border-b border-slate-200 px-6 py-8">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-rose-100 text-rose-600 p-2 rounded-lg">
                            <BabyIcon size={24} />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900">Parental Leave Estimator</h1>
                    </div>
                    <p className="text-slate-500 max-w-2xl">
                        Compare <strong>Standard</strong> (12 months) vs. <strong>Extended</strong> (18 months) benefits. Updated for 2025 rates (Max Insurable: ${province === 'QC' ? '98,000' : '65,700'}).
                    </p>
                </div>
            </div>

            <main className="max-w-5xl mx-auto p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* LEFT COLUMN: INPUTS */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <UsersIcon size={18} className="text-indigo-600"/> Your Details
                            </h3>
                            
                            {/* Province */}
                            <div className="mb-4">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Province</label>
                                <div className="relative">
                                    <select 
                                        value={province} 
                                        onChange={(e) => {
                                            setProvince(e.target.value);
                                            // Reset plan type if switching to/from Quebec
                                            setPlanType(e.target.value === 'QC' ? 'BASIC' : 'STANDARD');
                                        }}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                                    >
                                        <option value="ON">Ontario (EI)</option>
                                        <option value="BC">British Columbia (EI)</option>
                                        <option value="AB">Alberta (EI)</option>
                                        <option value="QC">Quebec (QPIP)</option>
                                        <option value="OTHER">Rest of Canada (EI)</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"><MapPinIcon size={16}/></div>
                                </div>
                            </div>

                            {/* Income */}
                            <div className="mb-4">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Annual Gross Salary</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                                    <input 
                                        type="number" 
                                        value={salary} 
                                        onChange={(e) => setSalary(parseInt(e.target.value) || 0)} 
                                        className="w-full pl-7 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-lg"
                                    />
                                </div>
                            </div>

                            {/* Partner Toggle */}
                            <div className="mb-4">
                                <label className="flex items-center gap-2 cursor-pointer p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition">
                                    <input type="checkbox" checked={hasPartner} onChange={(e) => setHasPartner(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded" />
                                    <span className="text-sm font-medium text-slate-700">I have a partner (Sharing Bonus)</span>
                                </label>
                            </div>

                            {hasPartner && (
                                <div className="mb-4 animate-fade-in">
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Partner's Income</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                                        <input 
                                            type="number" 
                                            value={partnerSalary} 
                                            onChange={(e) => setPartnerSalary(parseInt(e.target.value) || 0)} 
                                            className="w-full pl-7 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-lg"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* PLAN SELECTION */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <CalendarIcon size={18} className="text-indigo-600"/> Duration Plan
                            </h3>
                            
                            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                                {province === 'QC' ? (
                                    <>
                                        <button onClick={() => setPlanType('BASIC')} className={`py-2 text-sm font-bold rounded-lg transition ${planType === 'BASIC' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Basic Plan</button>
                                        <button onClick={() => setPlanType('SPECIAL')} className={`py-2 text-sm font-bold rounded-lg transition ${planType === 'SPECIAL' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Special Plan</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => setPlanType('STANDARD')} className={`py-2 text-sm font-bold rounded-lg transition ${planType === 'STANDARD' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Standard (12mo)</button>
                                        <button onClick={() => setPlanType('EXTENDED')} className={`py-2 text-sm font-bold rounded-lg transition ${planType === 'EXTENDED' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Extended (18mo)</button>
                                    </>
                                )}
                            </div>
                            
                            <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                                {province === 'QC' 
                                    ? (planType === 'BASIC' ? "Longer leave with lower pay rates (70% then 55%)." : "Shorter leave with higher pay rates (75%).")
                                    : (planType === 'STANDARD' ? "55% of income up to $695/wk. Best for total cash flow." : "33% of income up to $417/wk. Spreads payments over 18 months.")
                                }
                            </p>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: RESULTS */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* HERO TOTAL */}
                        <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500 rounded-full mix-blend-overlay filter blur-3xl opacity-10 -mr-16 -mt-16"></div>
                            
                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div>
                                    <div className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Weekly Benefit (Parental)</div>
                                    <div className="text-5xl font-bold tracking-tight">
                                        ${Math.round(results.parentalWeekly).toLocaleString()}
                                    </div>
                                    <div className="text-sm text-slate-400 mt-2">
                                        Maternity weeks pay: <span className="text-white font-semibold">${Math.round(results.maternityWeekly)}/wk</span>
                                    </div>
                                </div>
                                <div className="text-left md:text-right">
                                    <div className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Total Claim Value</div>
                                    <div className="text-3xl font-bold text-emerald-400">
                                        ${Math.round(results.totalValue).toLocaleString()}
                                    </div>
                                    <div className="text-sm text-slate-400 mt-1">
                                        Over {results.totalDuration} combined weeks
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CHART & DETAILS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* BREAKDOWN LIST */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <h3 className="font-bold text-slate-900 mb-4">Payment Breakdown</h3>
                                <div className="space-y-4">
                                    
                                    {/* Maternity */}
                                    <div className="flex justify-between items-start pb-4 border-b border-slate-50">
                                        <div>
                                            <div className="font-bold text-slate-700">Maternity</div>
                                            <div className="text-xs text-slate-400">{results.maternityWeeks} weeks • Mom only</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-slate-900">${Math.round(results.maternityTotal).toLocaleString()}</div>
                                            <div className="text-xs text-slate-500">${Math.round(results.maternityWeekly)}/wk</div>
                                        </div>
                                    </div>

                                    {/* Parental */}
                                    <div className="flex justify-between items-start pb-4 border-b border-slate-50">
                                        <div>
                                            <div className="font-bold text-slate-700">Parental</div>
                                            <div className="text-xs text-slate-400">{results.parentalWeeks} weeks • Shareable</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-slate-900">${Math.round(results.parentalTotal).toLocaleString()}</div>
                                            <div className="text-xs text-slate-500">${Math.round(results.parentalWeekly)}/wk</div>
                                        </div>
                                    </div>

                                    {/* Partner Bonus */}
                                    {hasPartner && (
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="font-bold text-indigo-600">Partner Weeks</div>
                                                <div className="text-xs text-slate-400">{results.partnerWeeks} weeks • "Use it or lose it"</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-indigo-600">${Math.round(results.partnerTotal).toLocaleString()}</div>
                                                <div className="text-xs text-slate-500">Based on partner income</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* CHART */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center">
                                <div className="h-[200px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                            <XAxis type="number" hide />
                                            <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 11}} />
                                            <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                            <Bar dataKey="value" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={30} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="text-center text-xs text-slate-400 mt-4">
                                    Total Benefit Value by Type
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- NEW SECTION: METHODOLOGY & SOURCES --- */}
                <div className="max-w-3xl mx-auto space-y-4 mt-12">
                    <Accordion title="How Calculations Are Done" icon={CalculatorIcon}>
                        <p className="mb-4">This calculator uses the <strong>2025 Maximum Insurable Earnings (MIE)</strong> limits to estimate your weekly benefit.</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <div className="font-bold text-slate-800 text-sm">Federal EI (Rest of Canada)</div>
                                <div className="text-xs text-slate-600 mt-1">
                                    Based on 2025 MIE of <strong>$65,700</strong>.
                                    <ul className="list-disc pl-4 mt-1 space-y-1">
                                        <li>Standard: 55% of income up to ~$695/week.</li>
                                        <li>Extended: 33% of income up to ~$417/week.</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <div className="font-bold text-slate-800 text-sm">Quebec (QPIP)</div>
                                <div className="text-xs text-slate-600 mt-1">
                                    Based on 2025 MIE of <strong>$98,000</strong>.
                                    <ul className="list-disc pl-4 mt-1 space-y-1">
                                        <li>Basic Plan: 70% for 18 weeks, then 55%.</li>
                                        <li>Special Plan: 75% for shorter duration.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500">
                            <strong>Note:</strong> "Partner Weeks" are additional weeks available only when parents share benefits. If you don't use them, you lose them.
                        </p>
                    </Accordion>

                    <Accordion title="Official Government Sources" icon={BookOpenIcon}>
                        <ul className="text-sm space-y-2 text-indigo-600 pl-4 font-medium">
                            <li>
                                <a href="https://www.canada.ca/en/services/benefits/ei/ei-maternity-parental.html" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                                    Canada.ca - EI Maternity & Parental Benefits <ExternalLinkIcon size={12} />
                                </a>
                            </li>
                            <li>
                                <a href="https://www.rqap.gouv.qc.ca/en" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                                    RQAP - Quebec Parental Insurance Plan <ExternalLinkIcon size={12} />
                                </a>
                            </li>
                            <li>
                                <a href="https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/payroll-deductions-contributions/employment-insurance-ei/ei-premium-rates-maximums.html" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                                    2025 EI Premium Rates & Maximums <ExternalLinkIcon size={12} />
                                </a>
                            </li>
                        </ul>
                    </Accordion>
                </div>

            </main>
        </div>
    );
}