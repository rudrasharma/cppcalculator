import React from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine, Legend, Label
} from 'recharts';
import {
    TrendingDownIcon,
    CalendarIcon,
    InfoIcon,
    HelpCircleIcon,
    UsersIcon,
    ExternalLinkIcon,
    DollarSignIcon,
    Accordion
} from '../../../components/shared';

export default function BenefitResults({
    results,
    chartData,
    paymentSchedule,
    afni
}) {
    return (
        <div className="animate-fade-in space-y-8 md:space-y-10">
            {/* Result Hero */}
            <div className="bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 text-white relative overflow-hidden shadow-2xl ring-1 ring-white/10">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-60 h-60 md:w-96 md:h-96 bg-emerald-500/20 rounded-full blur-[80px] md:blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 md:w-96 md:h-96 bg-indigo-500/20 rounded-full blur-[80px] md:blur-[100px] pointer-events-none"></div>
                
                <div className="relative z-10 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                    <div className="text-center md:text-left">
                        <h2 className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Total Estimated Support</h2>
                        <div className="flex items-baseline justify-center md:justify-start gap-2 flex-wrap">
                            <span className="text-5xl md:text-7xl font-black tracking-tighter drop-shadow-xl">${results.total.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                            <span className="text-slate-400 text-lg md:text-xl font-bold tracking-tight">/ year</span>
                        </div>
                        <div className="mt-6 flex flex-col gap-2">
                            <p className="text-slate-400 text-sm font-bold tracking-tight flex items-center justify-center md:justify-start gap-2 bg-white/5 inline-flex self-center md:self-start px-4 py-2 rounded-full border border-white/5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                ~${Math.round(results.monthly).toLocaleString()} Average Monthly Support
                            </p>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest pl-0 md:pl-4 mt-2">Non-taxable federal & provincial assistance</p>
                        </div>
                    </div>
                    <div className="bg-white/5 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8 border border-white/10 backdrop-blur-xl shadow-inner">
                        <div className="flex h-4 md:h-6 w-full rounded-full overflow-hidden bg-white/10 p-1 mb-4 md:mb-6">
                            <div style={{ width: `${(results.federal/results.total)*100}%` }} className="bg-blue-500 rounded-full mr-0.5 shadow-lg shadow-blue-500/50"></div>
                            <div style={{ width: `${(results.provincial/results.total)*100}%` }} className="bg-emerald-500 rounded-full mr-0.5 shadow-lg shadow-emerald-500/50"></div>
                            <div style={{ width: `${((results.gst + results.caip)/results.total)*100}%` }} className="bg-indigo-500 rounded-full"></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                            <div className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-300 tracking-tighter"><div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm"></div> Federal CCB</div>
                            <div className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-300 tracking-tighter"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm"></div> {results.provName}</div>
                            <div className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-300 tracking-tighter"><div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-sm"></div> GST & Carbon Credits</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Phase out Chart */}
                <div className="bg-white p-4 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
                    <h3 className="font-black text-slate-800 mb-6 md:mb-8 flex items-center gap-2 uppercase tracking-widest text-[10px]"><TrendingDownIcon size={18} className="text-indigo-600"/> Income Phase-out Curve</h3>
                    <div className="h-[250px] md:h-[320px] w-full -ml-4 md:ml-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="income" fontSize={10} tickFormatter={v => `$${v/1000}k`} axisLine={false} tickLine={false}>
                                    <Label value="Net Income" offset={-15} position="insideBottom" fontSize={10} fontWeight="900" fill="#94a3b8" />
                                </XAxis>
                                <YAxis fontSize={10} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}k`} />
                                <RechartsTooltip 
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '15px', color: '#f8fafc', fontWeight: 'bold', fontSize: '11px' }}
                                    formatter={(v, name) => [`$${v.toLocaleString()}`, name]} 
                                    labelFormatter={(l) => `Income: $${l.toLocaleString()}`}
                                />
                                <Legend verticalAlign="top" align="right" height={36} iconType="circle" wrapperStyle={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', paddingBottom: '10px' }} />
                                <Area type="monotone" dataKey="CCB" name="Fed CCB" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                                <Area type="monotone" dataKey="Provincial" name="Provincial" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                                <Area type="monotone" dataKey="Credits" name="GST/Carbon" stackId="1" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                                <ReferenceLine x={afni} stroke="#6366f1" strokeDasharray="8 8" label={{ position: 'top', value: 'YOU', fill: '#6366f1', fontSize: 10, fontWeight: '900' }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Monthly Schedule */}
                <div className="bg-white p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col">
                    <h3 className="font-black text-slate-800 mb-6 md:mb-8 flex items-center gap-2 uppercase tracking-widest text-[10px]"><CalendarIcon size={18} className="text-indigo-600"/> Payment Schedule</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 flex-1">
                        {paymentSchedule.map((item, idx) => (
                            <div key={idx} className={`p-3 md:p-4 rounded-[1rem] md:rounded-[1.5rem] border text-center transition-all flex flex-col justify-center items-center shadow-sm ${item.isQuarterly ? 'bg-indigo-50 border-indigo-100 ring-2 ring-indigo-500/10' : 'bg-slate-50 border-slate-100'}`}>
                                <div className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.month}</div>
                                <div className={`text-sm md:text-base font-black tracking-tighter ${item.isQuarterly ? 'text-indigo-600' : 'text-slate-800'}`}>${Math.round(item.total)}</div>
                                {item.isQuarterly && <div className="text-[6px] md:text-[7px] font-black text-indigo-400 uppercase tracking-tighter mt-1">+Bonus</div>}
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 md:mt-8 p-4 bg-slate-900 rounded-2xl flex items-center gap-3 border-2 border-indigo-500/20">
                        <div className="p-2 bg-white/10 rounded-lg text-indigo-400"><InfoIcon size={16}/></div>
                        <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest leading-relaxed">
                            CCB/Provincial: 20th <br/>
                            GST: 5th | Carbon: 15th (Quarterly)
                        </p>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="max-w-3xl mx-auto w-full space-y-4">
                <Accordion title="Understanding Net Income (AFNI)" icon={HelpCircleIcon}>
                    <p>Your <strong>Adjusted Family Net Income</strong> is the primary driver of benefit reductions (clawbacks). For the benefit year of July 2025 to June 2026, the government looks at your <strong>2024 Tax Return</strong>. Specifically, it uses <strong>Line 23600</strong> (Net Income) minus any UCCB or RDSP income received.</p>
                </Accordion>
                <Accordion title="Shared Custody Rules" icon={UsersIcon}>
                    <p>If you have a 40-60% shared custody arrangement that has been registered with the CRA, each parent receives exactly <strong>50% of the benefit amount</strong> they would have received if the child lived with them full-time. The amount is calculated based on each parent's individual household income.</p>
                </Accordion>
                <Accordion title="Official CRA Resources" icon={ExternalLinkIcon}>
                    <div className="flex flex-col gap-4">
                        <a href="https://www.canada.ca/en/revenue-agency/services/child-family-benefits/canada-child-benefit-overview.html" target="_blank" className="flex items-center justify-between p-4 bg-indigo-50 rounded-2xl group transition-all hover:bg-indigo-100">
                            <div className="flex items-center gap-3"><DollarSignIcon className="text-indigo-600" /> <span className="font-bold text-indigo-900 text-sm">CRA CCB Overview</span></div>
                            <ExternalLinkIcon size={16} className="text-indigo-400 group-hover:translate-x-1 transition-transform" />
                        </a>
                        <a href="https://www.canada.ca/en/revenue-agency/services/child-family-benefits/goods-services-tax-harmonized-sales-tax-credit.html" target="_blank" className="flex items-center justify-between p-4 bg-emerald-5 rounded-2xl group transition-all hover:bg-emerald-100">
                            <div className="flex items-center gap-3"><DollarSignIcon className="text-emerald-600" /> <span className="font-bold text-emerald-900 text-sm">GST/HST Credit Rules</span></div>
                            <ExternalLinkIcon size={16} className="text-emerald-400 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>
                </Accordion>
            </div>
        </div>
    );
}
