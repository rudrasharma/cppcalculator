import React, { useState, useEffect } from 'react';

// This import automatically finds './Calculator/index.jsx' in the new folder structure
import Calculator from './RetirementCalculator';
import HouseholdBenefits from './HouseHoldBenefits';
import ParentalLeave from './ParentalLeave'; 
import '../styles/global.css'

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
      {/* HEADER: bg-white/90 backdrop-blur */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200 p-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* LOGO SECTION: Updated to use your new image */}
          <div className="font-bold text-lg tracking-tight flex items-center gap-3 select-none text-slate-900">
             <img 
                /* This file comes from the favicon zip you put in 'public' */
                src="/android-chrome-192x192.png" 
                alt="Loonie Sense Logo"
                className="h-10 w-10 object-contain" 
             />
             <span>LoonieSense</span>
          </div>
          
          {/* NAVIGATION BUTTONS */}
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