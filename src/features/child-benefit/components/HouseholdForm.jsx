import React from 'react';
import { createPortal } from 'react-dom';
import {
    TrashIcon,
    DollarSignIcon,
    UsersIcon,
    ArrowRightIcon,
    CheckIcon,
    LinkIcon,
    Tooltip,
    MoneyInput,
    NativeSelect,
    RangeSlider
} from '../../../components/shared';

export default function HouseholdForm({
    province,
    setProvince,
    maritalStatus,
    setMaritalStatus,
    grossAfni,
    setGrossAfni,
    sharedCustody,
    setSharedCustody,
    isRural,
    setIsRural,
    children,
    addChild,
    removeChild,
    updateChild,
    results,
    copyLink,
    copySuccess,
    setActiveTab,
    isVisible,
    mounted
}) {
    return (
        <>
            <div className="animate-fade-in space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-indigo-600 font-black uppercase text-[10px] tracking-widest"><DollarSignIcon size={16} /> Household Profile</div>
                        <div className="bg-slate-50 p-5 md:p-6 rounded-3xl space-y-5 border border-slate-100 shadow-sm">
                            <NativeSelect
                                label="Province"
                                value={province}
                                onChange={(e) => setProvince(e.target.value)}
                                options={[
                                    { label: 'Ontario (ON)', value: 'ON' },
                                    { label: 'Alberta (AB)', value: 'AB' },
                                    { label: 'British Columbia (BC)', value: 'BC' },
                                    { label: 'Quebec (QC)', value: 'QC' },
                                    { label: 'Saskatchewan (SK)', value: 'SK' },
                                    { label: 'Manitoba (MB)', value: 'MB' },
                                    { label: 'Nova Scotia (NS)', value: 'NS' },
                                    { label: 'New Brunswick (NB)', value: 'NB' },
                                    { label: 'Newfoundland (NL)', value: 'NL' },
                                    { label: 'Prince Edward Island (PE)', value: 'PE' },
                                    { label: 'Other Provinces', value: 'OTHER' }
                                ]}
                            />
                            <NativeSelect
                                label="Marital Status"
                                value={maritalStatus}
                                onChange={(e) => setMaritalStatus(e.target.value)}
                                options={[
                                    { label: 'Married / Common-Law', value: 'MARRIED' },
                                    { label: 'Single Parent', value: 'SINGLE' }
                                ]}
                            />
                            <MoneyInput
                                label="Net Household Income"
                                value={grossAfni || ''}
                                onChange={(value) => setGrossAfni(parseInt(value) || 0)}
                            />
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
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[9px] md:text-[10px] font-black uppercase tracking-tighter shadow-inner border border-emerald-100">
                                                {child.age < 6 ? "Max Rate" : "Std Rate"}
                                            </div>
                                        </div>
                                        <RangeSlider
                                            label="Child Age"
                                            value={child.age}
                                            onChange={(e) => updateChild(child.id, 'age', parseInt(e.target.value))}
                                            min={0}
                                            max={18}
                                            step={1}
                                            accentColor="emerald-500"
                                        />
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

                {/* --- HYBRID: DESKTOP INLINE ACTION --- */}
                <div className="hidden md:flex justify-between items-center bg-slate-50 p-6 rounded-3xl border border-slate-200">
                    <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Estimated Annual Benefit</span>
                        <div className="text-4xl font-black text-slate-900 tracking-tighter">
                            ${Math.round(results.total).toLocaleString()} <span className="text-sm text-slate-400 font-bold">/ yr</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {/* ADDED SHARE BUTTON */}
                        <button 
                            onClick={copyLink}
                            className="bg-white text-indigo-600 py-4 px-6 rounded-2xl border border-indigo-100 shadow-sm hover:shadow-md hover:bg-indigo-50 transition-all flex items-center gap-2 font-bold text-xs uppercase tracking-wider active:scale-95"
                        >
                            {copySuccess ? <CheckIcon size={18}/> : <LinkIcon size={18}/>}
                            {copySuccess ? 'Copied!' : 'Share'}
                        </button>

                        <button 
                            onClick={() => { setActiveTab('results'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 px-12 rounded-2xl shadow-xl shadow-indigo-200 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center gap-3 uppercase tracking-widest text-xs"
                        >
                            View Full Breakdown <ArrowRightIcon size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* HYBRID: MOBILE FLOATING FOOTER */}
            {isVisible && mounted && createPortal(
                <div 
                    className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 md:p-5 z-[9999] animate-slide-up shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]" 
                    style={{ width: '100%' }}
                >
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
        </>
    );
}
