import React from 'react';
import { STAPLES, PROVINCIAL_FACTORS } from '../data/groceryData';
import { calculateRegionalPrice } from '../utils/groceryEngine';

export default function GroceryInflationForm({
    province,
    setProvince,
    years,
    setYears,
    activeCategory,
    setActiveCategory,
    cart,
    setCart,
    totals,
    scrollToReceipt
}) {
    const categories = ['All', 'Meat', 'Dairy', 'Produce', 'Pantry'];

    // Filter items based on active category
    const filteredItems = activeCategory === 'All' 
        ? STAPLES 
        : STAPLES.filter(i => i.category === activeCategory);

    return (
        <>
            {/* --- MOBILE STICKY SUMMARY --- */}
            <div className="md:hidden sticky top-[56px] z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 -mx-4 px-4 py-3 mb-6 shadow-sm flex justify-between items-center">
                <div onClick={scrollToReceipt} className="cursor-pointer" role="button" tabIndex={0}>
                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Future Total ({2025 + years})</div>
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

            {/* --- SELECTION AREA (LEFT COLUMN) --- */}
            <div className="space-y-6">
                <header className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight italic">Budget Defense</h2>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Tap items to audit your bill</p>
                        </div>
                        <div className="flex gap-2">
                            <select 
                                value={province} 
                                onChange={(e) => setProvince(e.target.value)} 
                                className="bg-white border-2 border-slate-200 rounded-xl px-2 py-1 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-indigo-500 text-slate-700"
                                aria-label="Select Province"
                            >
                                {Object.keys(PROVINCIAL_FACTORS).map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                            <select 
                                value={years} 
                                onChange={(e) => setYears(Number(e.target.value))} 
                                className="bg-white border-2 border-slate-200 rounded-xl px-2 py-1 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-indigo-500 text-slate-700"
                                aria-label="Select Time Horizon"
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
                                    : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'
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
                        const regionalPrice = calculateRegionalPrice(item, province);
                        return (
                            <button 
                                key={item.id} 
                                onClick={() => setCart(prev => isSelected ? prev.filter(i => i.id !== item.id) : [...prev, item])}
                                className={`p-3 md:p-5 rounded-[2rem] border-2 text-left transition-all relative group ${
                                    isSelected 
                                    ? 'border-indigo-600 bg-indigo-50/50 shadow-sm' 
                                    : 'border-slate-100 bg-white hover:border-slate-200 shadow-sm shadow-slate-100'
                                }`}
                                aria-pressed={isSelected}
                            >
                                <span className="text-2xl md:text-3xl mb-1 md:mb-2 block group-hover:scale-110 transition-transform" aria-hidden="true">{item.icon}</span>
                                <div className="font-bold text-[10px] md:text-[11px] text-slate-900 leading-tight uppercase tracking-tighter mb-1">{item.name}</div>
                                <div className="text-[9px] md:text-[10px] font-black text-slate-500">${regionalPrice.toFixed(2)}</div>
                                {item.inflation > 15 && (
                                    <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" aria-label="High Inflation" title="High Inflation Item" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </>
    );
}