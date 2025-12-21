import React from 'react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { 
    CheckIcon, LinkIcon, ScaleIcon, XIcon, TrendingUpIcon, HomeIcon, HeartHandshakeIcon, BarChartIcon, RotateCcwIcon, InfoIcon,
    CalculatorIcon, FilterIcon, BookOpenIcon, ExternalLinkIcon 
} from './Icons'; 
import { Tooltip, Accordion } from './SharedUI';

export default function ResultsTab({ 
    results, hasEarnings, setActiveTab, copyLink, copySuccess, 
    displayTotal = 0, displayCPP = 0, displayOAS = 0, displayGIS = 0, 
    cppPerc = 0, oasPerc = 0, gisPerc = 0, 
    retirementAge, setRetirementAge, 
    comparisonSnapshot, saveComparison, clearComparison, comparisonMsg, 
    inflationFactor = 1, taxFactor = 1,
    chartSelection, setChartSelection, lineVisibility, setLineVisibility,
    birthYear // <--- 1. ADDED BIRTHYEAR PROP
}) {
    
    const handleLegendClick = (e) => {
        const { dataKey } = e;
        setLineVisibility(prev => ({ ...prev, [dataKey]: !prev[dataKey] }));
    };

    // --- SAFETY GUARDS ---
    const safeResults = results || {};
    const cpp = safeResults.cpp || { base: 0, enhanced: 0, total: 0 };
    const oas = safeResults.oas || { gross: 0, clawback: 0, total: 0 };
    const gis = safeResults.gis || { total: 0, note: '' };
    // const crossovers = safeResults.crossovers || {}; // Unused currently
    const breakevenData = safeResults.breakevenData || [];

    const SafeCalculatorIcon = CalculatorIcon || (() => null);
    const SafeFilterIcon = FilterIcon || (() => null);
    const SafeBookOpenIcon = BookOpenIcon || (() => null);

    // Helper for formatting large currency numbers on chart
    const formatYAxis = (value) => {
        if (value === 0) return '$0';
        // Use 'M' for millions
        if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
        // Use 'k' for thousands
        if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
        // For small numbers (e.g., $500), display raw value without 'k'
        return `$${value.toFixed(0)}`;
    };
    return (
        <div className="space-y-6 md:space-y-8 animate-fade-in">
            {!hasEarnings && (
                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 md:p-5 rounded-2xl flex items-start gap-4 shadow-sm">
                    {InfoIcon && <InfoIcon className="text-amber-500 mt-1 shrink-0" size={24} />}
                    <div>
                        <h4 className="font-bold text-amber-900">Data Missing</h4>
                        <p className="text-amber-800 text-sm mt-1 leading-relaxed">Forecast is currently <strong>$0</strong>. <button onClick={() => setActiveTab('input')} className="font-black underline decoration-2 underline-offset-2 hover:text-amber-950 transition-colors">Go to Step 1</button> to add earnings.</p>
                    </div>
                </div>
            )}

            {/* HERO CARD - OPTIMIZED FOR MOBILE */}
            <div className="bg-slate-900 rounded-3xl shadow-2xl p-5 md:p-8 text-white relative overflow-hidden isolate transition-all duration-500 transform border border-slate-800">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-60 h-60 md:w-80 md:h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 md:w-80 md:h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                
                <div className="relative z-10">
                    <div className="flex justify-end mb-4 md:mb-6">
                        <button 
                            onClick={copyLink}
                            className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-[10px] md:text-xs font-bold transition-all shadow-lg active:scale-95"
                        >
                            {copySuccess ? (CheckIcon && <CheckIcon size={14} className="text-emerald-400" />) : (LinkIcon && <LinkIcon size={14} />)}
                            {copySuccess ? "Copied!" : "Share"}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
                        <div>
                            <h2 className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-2 leading-none">Monthly Forecast</h2>
                            <div className="flex items-baseline gap-2 flex-wrap">
                                {/* Adjusted Font Size for Mobile */}
                                <span className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-slate-400">
                                    ${displayTotal.toLocaleString('en-CA', { maximumFractionDigits: 0 })}
                                </span>
                                <span className="text-slate-400 text-lg md:text-xl font-medium">/ mo</span>
                            </div>
                            
                            {displayTotal > 0 && (
                                <div className="mt-6 md:mt-8">
                                    <div className="flex h-3 md:h-4 w-full rounded-full overflow-hidden bg-white/10 p-0.5 border border-white/5 ring-4 ring-white/5">
                                        <div style={{ width: `${cppPerc}%` }} className="bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-l-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(99,102,241,0.4)]" />
                                        <div style={{ width: `${oasPerc}%` }} className="bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-1000 shadow-[0_0_15px_rgba(245,158,11,0.4)]" />
                                        <div style={{ width: `${gisPerc}%` }} className="bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-r-full transition-all duration-1000 shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
                                    </div>
                                    <div className="flex gap-4 md:gap-6 mt-3 md:mt-4 text-[9px] md:text-[10px] font-black tracking-[0.1em] uppercase text-slate-400">
                                        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div> CPP</div>
                                        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div> OAS</div>
                                        {gisPerc > 0 && <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> GIS</div>}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Scenarios Card: Reduced padding for mobile */}
                        <div className="bg-white/5 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8 border border-white/10 backdrop-blur-md shadow-2xl">
                            <div className="flex justify-between items-center mb-4 md:mb-6">
                                <label className="text-xs md:text-sm font-bold text-slate-200">Test Scenarios</label>
                                <div className="bg-indigo-500 text-white text-[9px] md:text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider shadow-lg ring-2 ring-indigo-500/20">
                                    Age: {retirementAge}
                                </div>
                            </div>
                            
                            <div className="space-y-6 md:space-y-8">
                                <input 
                                    type="range" min="60" max="70" step="1" value={retirementAge} 
                                    onChange={(e) => setRetirementAge(parseInt(e.target.value))} 
                                    className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-400" 
                                />
                                
                                <div className="flex flex-col gap-3">
                                    {!comparisonSnapshot ? (
                                        <button 
                                            onClick={saveComparison} 
                                            className="w-full py-3 md:py-4 text-xs md:text-sm font-black rounded-xl md:rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-900/40 active:scale-95 uppercase tracking-widest"
                                        >
                                            {ScaleIcon && <ScaleIcon size={18} />} Snapshot Age {retirementAge}
                                        </button>
                                    ) : (
                                        <div className="grid grid-cols-6 gap-2">
                                            <button onClick={clearComparison} className="col-span-1 p-3 md:p-4 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl md:rounded-2xl hover:bg-rose-500/30 transition-all flex justify-center items-center" title="Clear Comparison">{XIcon && <XIcon size={20} />}</button>
                                            <div className="col-span-5 bg-indigo-500/10 border border-indigo-500/20 p-3 md:p-4 rounded-xl md:rounded-2xl text-center flex flex-col justify-center">
                                                <div className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest leading-none mb-1">Comparing to Baseline</div>
                                                <div className="text-xs md:text-sm font-black text-white">Age {comparisonSnapshot.age}</div>
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
                    <div className="bg-indigo-600 p-4 md:p-5 flex items-center gap-3 text-white">
                        {ScaleIcon && <ScaleIcon size={24} />}
                        <h3 className="font-black text-xs md:text-sm uppercase tracking-[0.1em]">Comparison</h3>
                    </div>
                    <div className="p-4 md:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                             {/* Mobile: Use simple stacking, Desktop: 3 cols */}
                             {/* ... Using simplified Mobile layout for the comparison card ... */}
                            <div className="space-y-4 md:pt-10">
                                <div className="font-bold text-slate-400 text-[10px] md:text-xs uppercase tracking-widest pb-2 border-b border-slate-50">Estimated Check</div>
                                <div className="font-bold text-slate-400 text-[10px] md:text-xs uppercase tracking-widest">Total Wealth Crossover</div>
                            </div>
                            <div className="bg-slate-50 rounded-3xl p-4 md:p-6 text-center border border-slate-100 flex flex-col items-center">
                                <div className="bg-white px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 md:mb-4 shadow-sm border border-slate-100">Scenario A</div>
                                <div className="text-[10px] md:text-xs font-bold text-slate-400 uppercase mb-1">Start @ Age {comparisonSnapshot.age}</div>
                                <div className="text-2xl md:text-3xl font-black text-slate-700 py-2 md:py-3 border-b border-white w-full font-mono">${(comparisonSnapshot.monthly * inflationFactor * taxFactor).toLocaleString(undefined, {maximumFractionDigits:0})}</div>
                            </div>
                            <div className="bg-indigo-50 rounded-3xl p-4 md:p-6 text-center border border-indigo-100 ring-4 ring-indigo-500/5 relative overflow-hidden flex flex-col items-center">
                                <div className="bg-indigo-600 px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black text-white uppercase tracking-widest mb-3 md:mb-4 shadow-lg border border-indigo-500">Scenario B</div>
                                <div className="text-[10px] md:text-xs font-bold text-indigo-400 uppercase mb-1">Start @ Age {retirementAge}</div>
                                <div className="text-2xl md:text-3xl font-black text-indigo-700 py-2 md:py-3 border-b border-indigo-100/50 w-full font-mono">
                                    ${displayTotal.toLocaleString(undefined, {maximumFractionDigits:0})}
                                    <div className={`text-[9px] md:text-[10px] mt-1 font-sans font-black ${safeResults.grandTotal >= comparisonSnapshot.monthly ? 'text-emerald-600' : 'text-rose-500'}`}>
                                        {safeResults.grandTotal >= comparisonSnapshot.monthly ? '+' : ''}
                                        ${((safeResults.grandTotal - comparisonSnapshot.monthly) * inflationFactor * taxFactor).toFixed(0)}/mo
                                    </div>
                                </div>
                                <div className="py-4 md:py-6 font-bold text-indigo-900 leading-tight text-xs md:text-sm">
                                    {comparisonSnapshot.age === retirementAge ? "Identical Scenarios" : comparisonMsg}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* BREAKDOWN CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div className="bg-white p-5 md:p-6 rounded-3xl border border-slate-200 relative overflow-hidden group shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-500"></div>
                    <h3 className="font-black text-slate-800 mb-4 md:mb-6 flex items-center gap-2 uppercase text-xs tracking-widest leading-none">
                        {TrendingUpIcon && <TrendingUpIcon size={18} className="text-indigo-600"/>} CPP Projection
                    </h3>
                    <div className="space-y-3 md:space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500 font-bold uppercase text-[10px]">Base (Core)</span>
                            <span className="font-mono font-black text-slate-800">${(cpp.base * inflationFactor * taxFactor).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500 font-bold uppercase text-[10px] flex items-center gap-1">Enhanced</span>
                            <span className="font-mono font-black text-emerald-600">+${(cpp.enhanced * inflationFactor * taxFactor).toFixed(2)}</span>
                        </div>
                        <div className="pt-4 md:pt-5 border-t-2 border-slate-50 flex justify-between items-end">
                            <span className="text-slate-900 font-black text-[10px] uppercase tracking-widest">Gross Monthly</span>
                            <span className="text-xl md:text-2xl font-black text-slate-900 font-mono tracking-tighter">${displayCPP.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-5 md:p-6 rounded-3xl border border-slate-200 relative overflow-hidden group shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-amber-500"></div>
                    <h3 className="font-black text-slate-800 mb-4 md:mb-6 flex items-center gap-2 uppercase text-xs tracking-widest leading-none">
                        {HomeIcon && <HomeIcon size={18} className="text-amber-600"/>} OAS Projection
                    </h3>
                    <div className="space-y-3 md:space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500 font-bold uppercase text-[10px]">OAS Amount</span>
                            <span className="font-mono font-black text-slate-800">${(oas.gross * inflationFactor * taxFactor).toFixed(2)}</span>
                        </div>
                        {oas.clawback > 0 && (
                            <div className="flex justify-between items-center text-[10px] bg-rose-50 p-2 md:p-3 rounded-2xl border border-rose-100 text-rose-700 font-black uppercase tracking-tighter animate-fade-in shadow-inner">
                                <span>Recovery Tax</span>
                                <span className="font-mono">-${(oas.clawback * inflationFactor * taxFactor).toFixed(2)}</span>
                            </div>
                        )}
                        <div className="pt-4 md:pt-5 border-t-2 border-slate-50 flex justify-between items-end">
                            <span className="text-slate-900 font-black text-[10px] uppercase tracking-widest">Estimated Net</span>
                            <span className="text-xl md:text-2xl font-black text-slate-900 font-mono tracking-tighter">${displayOAS.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 md:p-6 rounded-3xl border border-slate-200 relative overflow-hidden group shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500"></div>
                    <h3 className="font-black text-slate-800 mb-4 md:mb-6 flex items-center gap-2 uppercase text-xs tracking-widest leading-none">
                        {HeartHandshakeIcon && <HeartHandshakeIcon size={18} className="text-emerald-600"/>} Low Income
                    </h3>
                    <div className="space-y-3 md:space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500 font-bold uppercase text-[10px]">GIS Supplement</span>
                            <span className="font-mono font-black text-emerald-600">${displayGIS.toFixed(2)}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-bold leading-relaxed italic p-3 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
                            {gis.note || "Analysis based on provided taxable household retirement income figures."}
                        </div>
                        <div className="pt-4 md:pt-5 border-t-2 border-slate-50 flex justify-between items-end">
                            <span className="text-slate-900 font-black text-[10px] uppercase tracking-widest">Total Monthly</span>
                            <span className="text-xl md:text-2xl font-black text-slate-900 font-mono tracking-tighter">${displayGIS.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* CHART SECTION - OPTIMIZED FOR MOBILE */}
            <div className="bg-white p-4 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-slate-200 shadow-2xl mt-8">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:gap-6 mb-6 md:mb-10">
                    <div className="flex items-center gap-4 md:gap-5">
                        <div className="p-3 md:p-4 bg-indigo-50 text-indigo-600 rounded-[1rem] md:rounded-[1.5rem] shadow-inner">{BarChartIcon && <BarChartIcon size={24}/>}</div>
                        <div>
                            <h3 className="font-black text-slate-800 text-xl md:text-2xl tracking-tighter leading-none mb-1 md:mb-2">Lifetime Crossover</h3>
                            <p className="text-[9px] md:text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] leading-none">Cumulative cash flow by age</p>
                        </div>
                    </div>
                    {comparisonSnapshot && (
                        <div className="bg-indigo-600 px-4 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl text-white text-[10px] md:text-xs font-black shadow-xl shadow-indigo-900/20 animate-slide-in border-2 border-indigo-400">
                            AGE {comparisonSnapshot.age} VS {retirementAge}
                        </div>
                    )}
                </div>
                
                {/* Mobile: 300px height, Desktop: 450px */}
                <div className="h-[300px] md:h-[450px] w-full cursor-crosshair relative -ml-2 md:ml-0"> 
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={breakevenData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }} onClick={(e) => { if(e && e.activeLabel) setChartSelection(e.activeLabel) }}>
                            <CartesianGrid strokeDasharray="6 6" stroke="#f1f5f9" vertical={false} />
                            
                            {/* 2. FIXED X-AXIS: Added Year display using birthYear */}
                            <XAxis 
                                dataKey="age" 
                                stroke="#94a3b8" 
                                fontSize={10} 
                                fontWeight="900" 
                                tickLine={false} 
                                axisLine={false} 
                                tickMargin={10} 
                                tickFormatter={(age) => birthYear ? `${age} (${birthYear + age})` : age}
                            />

                            {/* 3. FIXED Y-AXIS: Added width and improved formatter (k vs M) */}
                            <YAxis 
                                width={66} 
                                stroke="#94a3b8" 
                                fontSize={10} 
                                fontWeight="900" 
                                tickLine={false} 
                                axisLine={false} 
                                tickFormatter={formatYAxis} 
                                tickMargin={5} 
                                allowDecimals={false}
                            />
                            
                            <RechartsTooltip 
                                cursor={{ stroke: '#6366f1', strokeWidth: 3, strokeDasharray: '8 8' }}
                                contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '1rem', padding: '1rem', color: '#f8fafc', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)' }}
                                itemStyle={{ fontSize: '12px', fontWeight: '800', padding: '4px 0' }}
                                // Update Tooltip label to match X-Axis
                                labelFormatter={(age) => `Age ${age} ${birthYear ? `(${birthYear + age})` : ''}`}
                                labelStyle={{ color: '#94a3b8', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '0.5rem', borderBottom: '1px solid #1e293b', paddingBottom: '0.5rem' }}
                                formatter={(v, n) => [`$${v.toLocaleString()}`, n]}
                            />
                            {/* Adjusted Legend Padding for mobile */}
                            <Legend wrapperStyle={{ paddingTop: '1.5rem', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }} iconType="circle" onClick={handleLegendClick} />
                            
                            <Line type="monotone" dataKey="Early" name="Start 60" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }} hide={!lineVisibility.Early} />
                            <Line type="monotone" dataKey="Standard" name="Start 65" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }} hide={!lineVisibility.Standard} />
                            <Line type="monotone" dataKey="Deferred" name="Start 70" stroke="#f59e0b" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0, fill: '#f59e0b' }} hide={!lineVisibility.Deferred} />
                            
                            {safeResults.userIsDistinct && (
                                <Line type="monotone" dataKey="Selected" name={`Start ${safeResults.selectedAge}`} stroke="#8b5cf6" strokeWidth={4} strokeDasharray="12 6" dot={false} activeDot={{ r: 8, strokeWidth: 0, fill: '#8b5cf6' }} hide={!lineVisibility.Selected} />
                            )}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="flex justify-center pt-8 md:pt-12">
                <button onClick={() => {setActiveTab('input'); window.scrollTo(0,0)}} className="text-slate-400 hover:text-indigo-600 text-[10px] font-black flex items-center gap-3 transition-all uppercase tracking-[0.3em] group">
                    {RotateCcwIcon && <RotateCcwIcon size={24} className="group-hover:rotate-[-360deg] transition-transform duration-700"/>} Return to Parameters
                </button>
            </div>

            {/* ACCORDIONS SECTION */}
            <div className="max-w-3xl mx-auto space-y-4 md:space-y-6 pb-20">
                <Accordion title="Understanding CPP Phase 2 (Enhanced)" icon={SafeCalculatorIcon}>
                    <p className="mb-4">Between 2019 and 2023, the Canada Pension Plan began 'Phase 1' of its modernization, increasing the base contribution percentage.</p>
                    <p className="mb-4 font-bold text-slate-800">Beginning in 2024 and reaching full threshold in 2025, 'Phase 2' introduces the YAMPE (Year’s Additional Maximum Pensionable Earnings).</p>
                    <div className="bg-indigo-50 p-4 md:p-5 rounded-3xl border-2 border-indigo-100 text-indigo-900 font-bold leading-relaxed text-sm shadow-inner">
                        If you earn more than $71,300 in 2025, you now contribute an extra 4% on the 'Tier 2' slice of your income (up to approx $81,200). 
                    </div>
                    <p className="mt-4">LoonieFi models these tiered contributions to accurately forecast the 'Enhanced' portion of your future monthly check.</p>
                </Accordion>

                <Accordion title="OAS Recovery Tax (Clawbacks)" icon={SafeFilterIcon}>
                    <p className="mb-4">The Old Age Security (OAS) pension is subject to a 'Recovery Tax' if your total annual retirement income exceeds the threshold established by the CRA ($90,997 for the 2024 tax year).</p>
                    <p className="font-bold text-slate-800">For every dollar your net income exceeds this threshold, your monthly OAS payment is reduced by 15 cents.</p>
                    <p className="mt-2 text-slate-500 font-medium">LoonieFi automatically calculates this reduction based on the 'Personal Retirement Income' you provide in Step 1.</p>
                </Accordion>

                <Accordion title="Government Resources & Links" icon={SafeBookOpenIcon}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <a href="https://www.canada.ca/en/services/benefits/publicpensions/cpp/payment-amounts.html" target="_blank" rel="noreferrer" className="text-indigo-600 font-black text-xs uppercase tracking-widest flex items-center justify-between bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 hover:bg-indigo-100 transition-all">CPP Rates {ExternalLinkIcon && <ExternalLinkIcon size={16}/>}</a>
                        <a href="https://www.canada.ca/en/services/benefits/publicpensions/old-age-security/payments.html" target="_blank" rel="noreferrer" className="text-indigo-600 font-black text-xs uppercase tracking-widest flex items-center justify-between bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 hover:bg-indigo-100 transition-all">OAS Thresholds {ExternalLinkIcon && <ExternalLinkIcon size={16}/>}</a>
                        <a href="https://www.canada.ca/en/employment-social-development/services/my-account.html" target="_blank" rel="noreferrer" className="text-indigo-600 font-black text-xs uppercase tracking-widest flex items-center justify-between bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 hover:bg-indigo-100 transition-all">My Service Canada {ExternalLinkIcon && <ExternalLinkIcon size={16}/>}</a>
                        <a href="https://www.canada.ca/en/services/benefits/publicpensions/cpp/cpp-enhancement.html" target="_blank" rel="noreferrer" className="text-indigo-600 font-black text-xs uppercase tracking-widest flex items-center justify-between bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 hover:bg-indigo-100 transition-all">Enhancement Guide {ExternalLinkIcon && <ExternalLinkIcon size={16}/>}</a>
                    </div>
                </Accordion>
            </div>
        </div>
    );
}