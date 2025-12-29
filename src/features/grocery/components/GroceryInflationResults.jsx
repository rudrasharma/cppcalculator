import React from 'react';
import PurchasingPowerGauge from './PurchasingPowerGauge';
import { PROVINCIAL_FACTORS } from '../data/groceryData';
import { calculateItemFuturePrice } from '../utils/groceryEngine';

export default function GroceryInflationResults({
    cart,
    province,
    years,
    totals
}) {
    return (
        <div id="future-receipt" className="space-y-8 lg:sticky lg:top-24">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 relative overflow-hidden">
                
                {/* Receipt Aesthetic Decoration */}
                <div className="text-center border-b-2 border-dashed border-slate-200 pb-6 mb-8 uppercase tracking-tighter">
                    <h3 className="text-2xl font-black italic text-slate-900 tracking-tighter">LoonieFi Market</h3>
                    <p className="text-[9px] font-black text-slate-400 mt-1 uppercase tracking-widest italic">
                        {PROVINCIAL_FACTORS[province].label} Snapshot • {2025 + years}
                    </p>
                </div>

                {/* List Items */}
                <div className="space-y-4 mb-10 max-h-64 overflow-y-auto pr-2 no-scrollbar border-b border-slate-50 pb-4">
                    {cart.length === 0 ? (
                        <div className="py-12 text-center text-slate-300 font-bold italic text-sm">Tap items on the left to build your basket...</div>
                    ) : (
                        cart.map(item => {
                            const futurePrice = calculateItemFuturePrice(item, years, province);
                            
                            return (
                                <div key={item.id} className="flex justify-between items-end border-b border-slate-50 pb-2">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-tight">{item.category}</span>
                                        <span className="text-xs font-bold text-slate-700">{item.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-black text-slate-900 tabular-nums">${futurePrice.toFixed(2)}</div>
                                        <div className="text-[8px] font-black text-rose-500">+{item.inflation}% ANN.</div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Totals Section */}
                <div className="border-t-4 border-double border-slate-900 pt-6">
                    <div className="flex justify-between items-baseline mb-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grand Total</span>
                        <span className="text-5xl font-black text-slate-900 tabular-nums tracking-tighter">
                            ${totals.future.toFixed(2)}
                        </span>
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <span>Basket Cost Today</span>
                        <span>${totals.current.toFixed(2)}</span>
                    </div>
                </div>
                
                {/* Visual Receipt "Jagged" Bottom */}
                <div className="absolute -bottom-2 left-0 right-0 flex">
                    {[...Array(30)].map((_, i) => (
                        <div key={i} className="w-4 h-4 bg-slate-50 rotate-45 transform origin-top-left border border-slate-100" />
                    ))}
                </div>
            </div>

            {/* Purchasing Power Visual */}
            {cart.length > 0 && (
                <PurchasingPowerGauge years={years} rate={totals.avgInflation} />
            )}
        </div>
    );
}

