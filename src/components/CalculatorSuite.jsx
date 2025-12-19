import React, { useState, useEffect } from 'react';
import Calculator from './Calculator';
import HouseholdBenefits from './HouseHoldBenefits'; 

export default function CalculatorSuite() {
  const [view, setView] = useState('cpp'); 

  // Check URL on load to see if we should switch to CCB
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'ccb') {
      setView('ccb');
    }
  }, []);

  return (
    <div>
      {/* GLOBAL NAVIGATION BAR */}
      <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          
          {/* BRANDING: LoonieLens with Flag */}
          <div className="font-bold text-lg tracking-tight flex items-center gap-2 select-none">
             <span className="text-2xl">🇨🇦</span> 
             <span className="hidden sm:inline bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                LoonieLens
             </span>
          </div>
          
          {/* SWITCHER */}
          <div className="flex gap-2 bg-slate-800 p-1 rounded-lg">
            <button 
              onClick={() => setView('cpp')}
              className={`px-3 sm:px-4 py-1.5 rounded-md text-sm font-bold transition-all ${view === 'cpp' ? 'bg-indigo-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              CPP / OAS
            </button>
            <button 
              onClick={() => setView('ccb')}
              className={`px-3 sm:px-4 py-1.5 rounded-md text-sm font-bold transition-all ${view === 'ccb' ? 'bg-emerald-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Benefits
            </button>
          </div>
        </div>
      </nav>

      {/* RENDER THE SELECTED CALCULATOR */}
      <div className="animate-fade-in">
        {view === 'cpp' ? <Calculator /> : <HouseholdBenefits />}
      </div>
    </div>
  );
}