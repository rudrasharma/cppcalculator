import React, { useState, useEffect } from 'react';
import Calculator from './Calculator';
import HouseholdBenefits from './HouseHoldBenefits';
import ParentalLeave from './ParentalLeave'; 
import '../styles/global.css'

// --- ICON DEFINITION ---
const CalculatorIcon = ({ size = 20, className = "", strokeWidth = 2 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>
);

export default function CalculatorSuite() {
  const [view, setView] = useState('cpp'); 

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const v = params.get('view');
    if (v === 'ccb') setView('ccb');
    if (v === 'parental') setView('parental'); 
  }, []);

  return (
    <div>
      {/* HEADER: Changed bg-slate-900 to bg-white/80 backdrop-blur */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200 p-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* LOGO: Changed text to dark slate */}
          <div className="font-bold text-lg tracking-tight flex items-center gap-2 select-none text-slate-900">
             <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
                <CalculatorIcon size={18} />
             </div>
             <span>LoonieSense</span>
          </div>
          
          {/* NAVIGATION BUTTONS: Changed container to light gray, Active buttons to white */}
          <div className="flex gap-1 bg-slate-100 p-1.5 rounded-xl border border-slate-200 overflow-x-auto max-w-full">
            <button 
              onClick={() => setView('cpp')}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                view === 'cpp' 
                ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              Retirement
            </button>
            <button 
              onClick={() => setView('parental')}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                view === 'parental' 
                ? 'bg-white text-rose-600 shadow-sm ring-1 ring-black/5' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              Parental Leave
            </button>
            <button 
              onClick={() => setView('ccb')}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                view === 'ccb' 
                ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-black/5' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              Child Benefits
            </button>
          </div>
        </div>
      </nav>

      <div className="animate-fade-in">
        {view === 'cpp' && <Calculator />}
        {view === 'ccb' && <HouseholdBenefits />}
        {view === 'parental' && <ParentalLeave />}
      </div>
    </div>
  );
}