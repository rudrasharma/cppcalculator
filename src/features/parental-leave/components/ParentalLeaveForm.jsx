import React from 'react';
import { createPortal } from 'react-dom';
import { 
    ArrowRightIcon, CheckIcon, LinkIcon, SparklesIcon, UsersIcon, CheckCircleIcon,
    MoneyInput, NativeSelect, RangeSlider
} from '../../../components/shared';
import { IconBase } from '../../../components/shared/IconBase';

// Additional icons specific to this component
const MapPinIcon = React.memo((props) => (
    <IconBase {...props}>
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
        <circle cx="12" cy="10" r="3"/>
    </IconBase>
));

const SlidersIcon = React.memo((props) => (
    <IconBase {...props}>
        <line x1="4" x2="4" y1="21" y2="14"/>
        <line x1="4" x2="4" y1="10" y2="3"/>
        <line x1="12" x2="12" y1="21" y2="12"/>
        <line x1="12" x2="12" y1="8" y2="3"/>
        <line x1="20" x2="20" y1="21" y2="16"/>
        <line x1="20" x2="20" y1="12" y2="3"/>
        <line x1="2" x2="6" y1="14" y2="14"/>
        <line x1="10" x2="14" y1="8" y2="8"/>
        <line x1="18" x2="22" y1="16" y2="16"/>
    </IconBase>
));

MapPinIcon.displayName = 'MapPinIcon';
SlidersIcon.displayName = 'SlidersIcon';

export default function ParentalLeaveForm({
    province,
    setProvince,
    salary,
    setSalary,
    partnerSalary,
    setPartnerSalary,
    hasPartner,
    setHasPartner,
    planType,
    setPlanType,
    p1Maternity,
    setP1Maternity,
    p1Weeks,
    p2Weeks,
    handleWeeksChange,
    currentMaxInsurable,
    individualMax,
    maxWeeks,
    combinedWeeks,
    bonusWeeksActive,
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                    
                    {/* --- SETTINGS --- */}
                    <div className="space-y-8">
                        
                    {/* LOCATION */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-rose-600 font-black uppercase text-[10px] tracking-widest"><MapPinIcon size={16} /> Location & Plan</div>
                        <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                            <NativeSelect
                                label="Province"
                                value={province}
                                onChange={(e) => setProvince(e.target.value)}
                                options={[
                                    { label: 'Ontario (EI)', value: 'ON' },
                                    { label: 'British Columbia (EI)', value: 'BC' },
                                    { label: 'Alberta (EI)', value: 'AB' },
                                    { label: 'Quebec (QPIP)', value: 'QC' },
                                    { label: 'Nova Scotia (EI)', value: 'NS' },
                                    { label: 'New Brunswick (EI)', value: 'NB' },
                                    { label: 'Manitoba (EI)', value: 'MB' },
                                    { label: 'Saskatchewan (EI)', value: 'SK' },
                                    { label: 'PEI (EI)', value: 'PE' },
                                    { label: 'Newfoundland (EI)', value: 'NL' },
                                    { label: 'Territories / Other (EI)', value: 'OTHER' }
                                ]}
                            />
                            <div>
                                <label className="text-xs font-black text-slate-700 block mb-1.5 uppercase tracking-tighter">Plan Type</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button onClick={() => setPlanType('STANDARD')} className={`p-3 text-center rounded-2xl border-2 transition-all relative ${planType === 'STANDARD' ? 'border-rose-500 bg-rose-50 text-rose-900 shadow-sm' : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300'}`}>
                                        {planType === 'STANDARD' && <div className="absolute top-2 right-2 text-rose-500"><CheckCircleIcon size={14}/></div>}
                                        <div className="font-bold text-sm">Standard</div>
                                        <div className="text-[10px] opacity-70 font-medium">12 Months (55%)</div>
                                    </button>
                                    <button onClick={() => setPlanType('EXTENDED')} className={`p-3 text-center rounded-2xl border-2 transition-all relative ${planType === 'EXTENDED' ? 'border-rose-500 bg-rose-50 text-rose-900 shadow-sm' : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300'}`}>
                                        {planType === 'EXTENDED' && <div className="absolute top-2 right-2 text-rose-500"><CheckCircleIcon size={14}/></div>}
                                        <div className="font-bold text-sm">Extended</div>
                                        <div className="text-[10px] opacity-70 font-medium">18 Months (33%)</div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* INCOMES */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-indigo-600 font-black uppercase text-[10px] tracking-widest"><UsersIcon size={16} /> Annual Income</div>
                        
                        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                            {/* P1 */}
                            <div>
                                <div className="flex justify-between items-end mb-1.5">
                                    <div></div>
                                    <button onClick={() => setSalary(currentMaxInsurable)} className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md font-bold hover:bg-indigo-100 transition-colors">
                                        Set Max (${currentMaxInsurable.toLocaleString()})
                                    </button>
                                </div>
                                <MoneyInput
                                    label="Parent 1 (Birth)"
                                    value={salary || ''}
                                    onChange={(value) => setSalary(parseInt(value) || 0)}
                                />
                            </div>
                            {/* P2 */}
                            <div className="pt-4 border-t border-slate-100">
                                <label className="flex items-center gap-3 cursor-pointer mb-4 select-none">
                                    <div className={`w-12 h-6 rounded-full transition-colors relative ${hasPartner ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                                        <input type="checkbox" checked={hasPartner} onChange={(e) => setHasPartner(e.target.checked)} className="sr-only" />
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${hasPartner ? 'left-7' : 'left-1'}`}></div>
                                    </div>
                                    <span className="font-bold text-slate-700 text-sm">Include Partner?</span>
                                </label>
                                
                                {hasPartner && (
                                    <div className="animate-fade-in">
                                        <div className="flex justify-between items-end mb-1.5">
                                            <div></div>
                                            <button onClick={() => setPartnerSalary(currentMaxInsurable)} className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md font-bold hover:bg-emerald-100 transition-colors">
                                                Set Max (${currentMaxInsurable.toLocaleString()})
                                            </button>
                                        </div>
                                        <MoneyInput
                                            label="Parent 2 (Non-Birth)"
                                            value={partnerSalary || ''}
                                            onChange={(value) => setPartnerSalary(parseInt(value) || 0)}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    </div>

                    {/* --- ALLOCATION SLIDERS --- */}
                    <div className="space-y-6">
                         <div className="flex items-center gap-2 text-emerald-600 font-black uppercase text-[10px] tracking-widest"><SlidersIcon size={16} /> Strategy & Allocation</div>
                         
                         <div className="bg-slate-900 text-white p-6 md:p-8 rounded-[2rem] shadow-2xl space-y-8 relative overflow-hidden ring-1 ring-white/10">
                            {/* Glow Effect */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

                            {/* Maternity Toggle */}
                            <div className="relative z-10 flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
                                <div>
                                    <div className="font-bold text-sm text-rose-300">Maternity Leave</div>
                                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Exclusive to Parent 1</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`text-xl font-black tabular-nums ${p1Maternity ? 'text-white' : 'text-slate-600'}`}>{p1Maternity ? (province === 'QC' ? 18 : 15) : 0} <span className="text-xs font-bold text-slate-500">Wks</span></span>
                                    <button onClick={() => setP1Maternity(!p1Maternity)} className={`w-12 h-6 rounded-full transition-colors relative ${p1Maternity ? 'bg-rose-500' : 'bg-slate-700'}`}>
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${p1Maternity ? 'left-7' : 'left-1'}`}></div>
                                    </button>
                                </div>
                            </div>

                            {/* Parental Sliders */}
                            <div className="relative z-10 space-y-8">
                                
                                {/* Visual Pool Meter */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Shared Pool</span>
                                        {bonusWeeksActive ? (
                                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500 text-slate-900 flex items-center gap-1 animate-fade-in">
                                                <SparklesIcon size={10} /> Bonus Weeks Active!
                                            </span>
                                        ) : (
                                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                                                Standard Pool
                                            </span>
                                        )}
                                    </div>
                                    <div className="h-3 bg-slate-800 rounded-full overflow-hidden flex border border-white/5 relative">
                                        {/* Marker for the Bonus Threshold */}
                                        <div className="absolute top-0 bottom-0 w-0.5 bg-slate-900 z-20 opacity-50" style={{ left: `${(individualMax / maxWeeks) * 100}%` }}></div>
                                        <div style={{ width: `${(p1Weeks / maxWeeks) * 100}%` }} className="bg-indigo-500 transition-all duration-300 z-10"></div>
                                        <div style={{ width: `${(p2Weeks / maxWeeks) * 100}%` }} className={`transition-all duration-300 z-10 ${bonusWeeksActive ? 'bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)]' : 'bg-emerald-600'}`}></div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {/* Parent 1 Slider */}
                                    <div>
                                        <RangeSlider
                                            label="Parent 1 (Birth)"
                                            subLabel="Parental Weeks"
                                            value={p1Weeks}
                                            onChange={(e) => handleWeeksChange(1, e.target.value)}
                                            min={0}
                                            max={individualMax}
                                            step={1}
                                            accentColor="indigo-500"
                                            className="[&_label]:text-indigo-300 [&_label]:text-sm [&_div>div>div]:text-indigo-300/60 [&_div>div>div]:text-[10px] [&_span:last-child]:text-white [&_span:last-child]:text-2xl [&_input]:bg-slate-700 [&_input]:h-2"
                                        />
                                    </div>

                                    {/* Parent 2 Slider */}
                                    <div className={`transition-all duration-300 ${!hasPartner ? 'opacity-30 pointer-events-none blur-sm grayscale' : ''}`}>
                                        <RangeSlider
                                            label="Parent 2 (Non-Birth)"
                                            subLabel="Parental Weeks"
                                            value={p2Weeks}
                                            onChange={(e) => handleWeeksChange(2, e.target.value)}
                                            min={0}
                                            max={individualMax}
                                            step={1}
                                            accentColor={bonusWeeksActive ? 'emerald-400' : 'emerald-600'}
                                            className="[&_label]:text-emerald-300 [&_label]:text-sm [&_div>div>div]:text-emerald-300/60 [&_div>div>div]:text-[10px] [&_span:last-child]:text-white [&_span:last-child]:text-2xl [&_input]:bg-slate-700 [&_input]:h-2"
                                        />
                                    </div>
                                </div>

                                {/* Total Check */}
                                <div className="bg-white/5 rounded-xl p-4 flex justify-between items-center text-xs border border-white/5">
                                    <span className="text-slate-400 font-bold">Total Shared Weeks</span>
                                    <span className={`font-black text-base ${combinedWeeks === maxWeeks ? 'text-emerald-400' : 'text-white'}`}>
                                        {combinedWeeks} / {maxWeeks}
                                    </span>
                                </div>
                            </div>
                         </div>
                    </div>
                </div>

                {/* --- HYBRID: DESKTOP INLINE ACTION BAR (UPDATED) --- */}
                <div className="hidden md:flex justify-between items-center bg-slate-50 p-6 rounded-3xl border border-slate-200 mt-8">
                    <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Estimated Total Benefit</span>
                        <div className="text-4xl font-black text-slate-900 tracking-tighter">
                            ${Math.round(results.totalValue).toLocaleString()} <span className="text-sm text-slate-400 font-bold">Total</span>
                        </div>
                    </div>
                    
                    {/* ADDED: Action Buttons Container */}
                    <div className="flex items-center gap-3">
                        {/* SHARE BUTTON */}
                        <button 
                            onClick={copyLink}
                            className="bg-white text-rose-600 py-4 px-6 rounded-2xl border border-rose-100 shadow-sm hover:shadow-md hover:bg-rose-50 transition-all flex items-center gap-2 font-bold text-xs uppercase tracking-wider active:scale-95"
                        >
                            {copySuccess ? <CheckIcon size={18}/> : <LinkIcon size={18}/>}
                            {copySuccess ? 'Copied!' : 'Share'}
                        </button>

                        {/* VIEW PLAN BUTTON */}
                        <button 
                            onClick={() => { setActiveTab('results'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                            className="bg-rose-600 hover:bg-rose-700 text-white font-black py-4 px-12 rounded-2xl shadow-xl shadow-rose-200 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center gap-3 uppercase tracking-widest text-xs"
                        >
                            View Your Plan <ArrowRightIcon size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* HYBRID: MOBILE FLOATING FOOTER */}
            {isVisible && mounted && createPortal(
                <div 
                    className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 p-4 z-[9999] animate-slide-up shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]" 
                    style={{ width: '100%' }}
                >
                    <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Benefit</span>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-3xl font-black text-slate-900 tracking-tighter">${Math.round(results.totalValue).toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                             <button onClick={copyLink} className="bg-white text-indigo-600 p-3 md:py-4 md:px-6 rounded-[1.2rem] md:rounded-[1.5rem] border border-indigo-100 shadow-lg shadow-indigo-100/50 transition-all hover:bg-indigo-50 active:scale-95 flex items-center justify-center gap-2">
                               {copySuccess ? <CheckIcon size={20}/> : <LinkIcon size={20}/>}
                               <span className="hidden md:inline font-bold text-xs uppercase tracking-wider">{copySuccess ? 'Copied' : 'Share'}</span>
                             </button>
                            
                            <button onClick={() => { setActiveTab('results'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="bg-rose-600 hover:bg-rose-700 text-white font-black py-3.5 px-6 rounded-2xl shadow-lg shadow-rose-200 transition-all flex items-center gap-2 transform active:scale-95 whitespace-nowrap text-sm">
                                See My Results <ArrowRightIcon size={18} />
                            </button>
                        </div>
                    </div>
                </div>,
                document.body 
            )}
        </>
    );
}

