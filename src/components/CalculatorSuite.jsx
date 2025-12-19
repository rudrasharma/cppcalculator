import React, { useState, useEffect } from 'react';
import Calculator from './Calculator';
import HouseholdBenefits from './HouseHoldBenefits';
import ParentalLeave from './ParentalLeave'; // Import the new file

// --- ICON DEFINITION (CalculatorIcon) ---
const CalculatorIcon = ({ size = 20, className = "", strokeWidth = 2 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>
);

export default function CalculatorSuite() {
  const [view, setView] = useState('cpp'); 

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const v = params.get('view');
    if (v === 'ccb') setView('ccb');
    if (v === 'parental') setView('parental'); // Handle new view
  }, []);

  return (
    <div>
      <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="font-bold text-lg tracking-tight flex items-center gap-2 select-none">
             <span className="text-2xl">🇨🇦</span> 
             <span className="hidden sm:inline bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                LoonieSense
             </span>
          </div>
          
          {/* NAVIGATION BUTTONS */}
          <div className="flex gap-1 bg-slate-800 p-1 rounded-lg overflow-x-auto max-w-full">
            <button 
              onClick={() => setView('cpp')}
              className={`px-3 py-1.5 rounded-md text-sm font-bold whitespace-nowrap transition-all ${view === 'cpp' ? 'bg-indigo-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Retirement
            </button>
            <button 
              onClick={() => setView('parental')}
              className={`px-3 py-1.5 rounded-md text-sm font-bold whitespace-nowrap transition-all ${view === 'parental' ? 'bg-rose-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Parental Leave
            </button>
            <button 
              onClick={() => setView('ccb')}
              className={`px-3 py-1.5 rounded-md text-sm font-bold whitespace-nowrap transition-all ${view === 'ccb' ? 'bg-emerald-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}
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