import React, { useState, useEffect } from 'react';
import Calculator from './RetirementCalculator';
import HouseholdBenefits from './HouseHoldBenefits';
import ParentalLeave from './ParentalLeave'; 
import '../styles/global.css'

// ICONS
const ChartIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>;
const BabyIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>;
const HomeIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;

const TABS = [
  { id: 'cpp', label: 'Retirement', icon: ChartIcon, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { id: 'parental', label: 'Parental', icon: BabyIcon, color: 'text-rose-600', bg: 'bg-rose-50' },
  { id: 'ccb', label: 'Benefits', icon: HomeIcon, color: 'text-emerald-600', bg: 'bg-emerald-50' },
];

export default function CalculatorSuite() {
  const [view, setView] = useState('cpp'); 

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const v = params.get('view');
    if (v && TABS.find(t => t.id === v)) setView(v);

    const handlePopState = () => {
        const p = new URLSearchParams(window.location.search);
        const backView = p.get('view');
        if (backView) setView(backView);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const changeView = (newView) => {
      setView(newView);
      
      const url = new URL(window.location);
      
      // 1. Update the Main View
      url.searchParams.set('view', newView);
      
      // 2. THE FIX: Remove the 'step' (or 'tab') parameter
      // This forces the new calculator to default back to 'input'
      url.searchParams.delete('step'); 
      
      // 3. Push the clean URL state
      window.history.pushState({}, '', url);
      
      // 4. Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-0"> 
      
      {/* DESKTOP NAV */}
      <nav className="hidden md:block bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/android-chrome-192x192.png" alt="Loonie Fi" className="h-8 w-8 rounded-full shadow-sm" />
            <div className="text-lg font-bold tracking-tight">
              <span className="text-amber-500">Loonie</span><span className="text-slate-900">Fi</span>
            </div>
          </div>
          <div className="flex gap-1 bg-slate-100/50 p-1 rounded-xl border border-slate-200/50">
            {TABS.map((tab) => (
              <button 
                key={tab.id}
                onClick={() => changeView(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                  view === tab.id 
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-black/5' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                }`}
              >
                <tab.icon className={`w-4 h-4 ${view === tab.id ? tab.color : 'text-slate-400'}`} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* MOBILE TOP LOGO */}
      <nav className="md:hidden bg-white/90 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-40 px-4 h-14 flex items-center justify-center">
         <div className="flex items-center gap-2">
            <img src="/android-chrome-192x192.png" alt="Loonie Fi" className="h-6 w-6 rounded-full" />
            <span className="font-bold text-slate-900 tracking-tight">Loonie<span className="text-amber-500">Fi</span></span>
         </div>
      </nav>

      <main className="animate-fade-in transition-all duration-300">
        {view === 'cpp' && <Calculator />}
        {view === 'ccb' && <HouseholdBenefits />}
        {view === 'parental' && <ParentalLeave />}
      </main>

      {/* MOBILE BOTTOM NAV - FIXED HERE */}
      {/* CHANGED z-50 TO z-[10000] */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe z-[10000] flex justify-around items-center h-16 px-2 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.05)]">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
                changeView(tab.id);
                window.scrollTo({ top: 0, behavior: 'smooth' }); 
            }}
            className="flex-1 flex flex-col items-center justify-center h-full gap-1 active:scale-95 transition-transform"
          >
            <div className={`p-1.5 rounded-xl transition-colors ${view === tab.id ? tab.bg : 'bg-transparent'}`}>
                <tab.icon className={`w-6 h-6 ${view === tab.id ? tab.color : 'text-slate-400'}`} />
            </div>
            <span className={`text-[10px] font-bold tracking-wide ${view === tab.id ? 'text-slate-900' : 'text-slate-400'}`}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>

    </div>
  );
}