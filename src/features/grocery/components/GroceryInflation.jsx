import React, { useState, useMemo, useEffect } from 'react';
import PurchasingPowerGauge from './PurchasingPowerGauge';
import { STAPLES, PROVINCIAL_FACTORS } from '../data/groceryData';

export default function GroceryInflation({ 
    isVisible = true,
    initialProvince = 'ON',
    initialYears = 5,
    initialCartIds = [] 
}) {
    // 1. Initialize State
    const [province, setProvince] = useState(initialProvince);
    const [years, setYears] = useState(initialYears);
    const [activeCategory, setActiveCategory] = useState('All');
    const [cart, setCart] = useState([]); // Start empty, useEffect will fill it

    // 2. DEBUG & SYNC: Force cart update and log IDs
    useEffect(() => {
        // Log the IDs so you can find the correct numbers for seo-scenarios.js
        console.log("Available Grocery IDs:", STAPLES.map(s => `${s.name}: ${s.id}`));

        if (initialCartIds && initialCartIds.length > 0) {
            // "Loose" equality check (==) allows matching string "1" with number 1
            const foundItems = STAPLES.filter(item => 
                initialCartIds.some(id => id == item.id)
            );
            setCart(foundItems);
        }
    }, [initialCartIds]);

    const categories = ['All', 'Meat', 'Dairy', 'Produce', 'Pantry'];

    // Filter items based on active category
    const filteredItems = useMemo(() => 
        activeCategory === 'All' ? STAPLES : STAPLES.filter(i => i.category === activeCategory)
    , [activeCategory]);

    // Calculate totals and blended inflation
    const totals = useMemo(() => {
        const provData = PROVINCIAL_FACTORS[province];
        const current = cart.reduce((sum, item) => sum + (item.price * provData.factor), 0);
        
        const future = cart.reduce((sum, item) => {
            // Blended rate of item-specific and provincial inflation trends
            const combinedRate = (item.inflation + provData.inflation) / 2 / 100;
            return sum + (item.price * provData.factor * Math.pow(1 + combinedRate, years));
        }, 0);
        
        const avgInflation = cart.length > 0 
            ? cart.reduce((sum, i) => sum + i.inflation, 0) / cart.length 
            : 4.7;

        return { 
            current: current || 0, 
            future: future || 0, 
            avgInflation,
            increasePercent: current > 0 ? ((future / current - 1) * 100) : 0
        };
    }, [cart, years, province]);

    if (!isVisible) return null;

    const scrollToReceipt = () => {
        const receipt = document.getElementById('future-receipt');
        if (receipt) receipt.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-4 md:py-12 animate-fade-in">
            
            {/* --- MOBILE STICKY SUMMARY (SOLVES "ABOVE THE FOLD" ISSUE) --- */}
            <div className="md:hidden sticky top-[56px] z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 -mx-4 px-4 py-3 mb-6 shadow-sm flex justify-between items-center">
                <div onClick={scrollToReceipt} className="cursor-pointer">
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Future Total ({2025 + years})</div>
                    <div className="text-2xl font-black text-slate-900 tabular-nums tracking-tighter">
                        ${totals.future.toFixed(2)}
                    </div>
                </div>
                <button 
                    onClick={scrollToReceipt}
                    className="bg-indigo-600 text-white px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2"
                >
                    View Receipt
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                
                {/* --- SELECTION AREA (LEFT COLUMN) --- */}
                <div className="space-y-6">
                    <header className="flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight italic">Budget Defense</h2>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Tap items to audit your bill</p>
                            </div>
                            <div className="flex gap-2">
                                <select 
                                    value={province} 
                                    onChange={(e) => setProvince(e.target.value)} 
                                    className="bg-white border-2 border-slate-200 rounded-xl px-2 py-1 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-indigo-500"
                                >
                                    {Object.keys(PROVINCIAL_FACTORS).map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                                <select 
                                    value={years} 
                                    onChange={(e) => setYears(Number(e.target.value))} 
                                    className="bg-white border-2 border-slate-200 rounded-xl px-2 py-1 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-indigo-500"
                                >
                                    {[1, 3, 5, 10, 20].map(y => <option key={y} value={y}>{y}Y</option>)}
                                </select>
                            </div>
                        </div>

                        {/* CATEGORY TABS */}
                        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4 md:mx-0 md:px-0">
                            {categories.map(cat => (
                                <button 
                                    key={cat} 
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                                        activeCategory === cat 
                                        ? 'bg-indigo-600 text-white shadow-lg' 
                                        : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-300'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </header>

                    {/* DYNAMIC ITEM GRID */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
                        {filteredItems.map(item => {
                            const isSelected = cart.some(i => i.id === item.id);
                            const regionalPrice = item.price * PROVINCIAL_FACTORS[province].factor;
                            return (
                                <button 
                                    key={item.id} 
                                    onClick={() => setCart(prev => isSelected ? prev.filter(i => i.id !== item.id) : [...prev, item])}
                                    className={`p-3 md:p-5 rounded-[2rem] border-2 text-left transition-all relative group ${
                                        isSelected 
                                        ? 'border-indigo-600 bg-indigo-50/50 shadow-sm' 
                                        : 'border-slate-50 bg-white hover:border-slate-200 shadow-sm shadow-slate-100'
                                    }`}
                                >
                                    <span className="text-2xl md:text-3xl mb-1 md:mb-2 block group-hover:scale-110 transition-transform">{item.icon}</span>
                                    <div className="font-bold text-[10px] md:text-[11px] text-slate-800 leading-tight uppercase tracking-tighter mb-1">{item.name}</div>
                                    <div className="text-[9px] md:text-[10px] font-black text-slate-400">${regionalPrice.toFixed(2)}</div>
                                    {item.inflation > 15 && (
                                        <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* --- FUTURE RECEIPT & PURCHASING POWER (RIGHT COLUMN) --- */}
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
                                    const provData = PROVINCIAL_FACTORS[province];
                                    const combinedRate = (item.inflation + provData.inflation) / 2 / 100;
                                    const futurePrice = item.price * provData.factor * Math.pow(1 + combinedRate, years);
                                    
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
            </div>
        </div>
    );
}