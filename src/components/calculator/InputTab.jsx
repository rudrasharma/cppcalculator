import React from 'react';
import { 
    UserGroupIcon, DollarSignIcon, TrendingUpIcon, WandIcon, UploadIcon, FileTextIcon, RotateCcwIcon, BarChartIcon, ChevronDownIcon, XIcon
} from './Icons'; // Adjust path
import { Tooltip } from './SharedUI';
import { CURRENT_YEAR, getYMPE, getYAMPE } from '../../utils/constants';

export default function InputTab({ 
    dob, setDob, retirementAge, setRetirementAge, isMarried, setIsMarried, 
    spouseDob, setSpouseDob, spouseIncome, setSpouseIncome, 
    showChildren, setShowChildren, children, setChildren,
    livedInCanadaAllLife, setLivedInCanadaAllLife, yearsInCanada, setYearsInCanada,
    otherIncome, setOtherIncome,
    earnings, avgSalaryInput, setAvgSalaryInput, applyAverageSalary,
    setShowImport, setEarnings, hasEarnings,
    showGrid, setShowGrid, results, birthYear
}) {

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

    return (
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
    );
}