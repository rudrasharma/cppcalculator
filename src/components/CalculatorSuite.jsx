import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Calculator from '../features/retirement/components';
import HouseholdBenefits from '../features/child-benefit/components/HouseholdBenefits';
import ParentalLeave from '../features/parental-leave/components/ParentalLeave'; 
import GroceryInflation from '../features/grocery/components/GroceryInflation'; 
import '../styles/global.css'

// ICONS
const ChartIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>;
const BabyIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>;
const HomeIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const ShieldIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const ArrowRight = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>;

// CONFIGURATION
const TABS = [
  { 
    id: 'cpp', 
    label: 'CPP & OAS',
    title: 'Government Retirement Benefits',
    subtitle: 'Estimates for CPP, Old Age Security (OAS), and GIS',
    icon: ChartIcon, 
    color: 'text-indigo-600', 
    bg: 'bg-indigo-50',
    description: 'Calculate your future monthly income from government pensions.'
  },
  { 
    id: 'parental', 
    label: 'Mat. Leave',
    title: 'Maternity & Parental Leave',
    subtitle: 'Plan your EI payments and family budget',
    icon: BabyIcon, 
    color: 'text-rose-600', 
    bg: 'bg-rose-50',
    description: 'Estimate your EI weekly payments and total leave duration.'
  },
  { 
    id: 'ccb', 
    label: 'Family Cash',
    title: 'Household Benefits Estimator',
    subtitle: 'CCB, Trillium, Carbon Rebate & GST Credits',
    icon: HomeIcon, 
    color: 'text-emerald-600', 
    bg: 'bg-emerald-50',
    description: 'Maximize your Child Benefits and quarterly tax rebates.'
  },
  { 
    id: 'budget', 
    label: 'Budget Def.',
    title: 'Budget Defense & Purchasing Power',
    subtitle: 'Forecast grocery inflation and shrinking money value',
    icon: ShieldIcon, 
    color: 'text-amber-600', 
    bg: 'bg-amber-50',
    description: 'Protect your spending power against rising Canadian food costs.'
  },
];

export default function CalculatorSuite() {
  const [view, setView] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const v = params.get('view');
      if (v && TABS.find(t => t.id === v)) return v;
      return localStorage.getItem('loonie_pref_view') || 'landing';
    }
    return 'landing';
  }); 

  const activeTabInfo = useMemo(() => TABS.find(t => t.id === view), [view]);

  useEffect(() => {
    const handlePopState = () => {
        const p = new URLSearchParams(window.location.search);
        const backView = p.get('view') || 'landing';
        setView(backView);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const changeView = useCallback((newView) => {
    setView(newView);
    localStorage.setItem('loonie_pref_view', newView);
    const url = new URL(window.location);
    if (newView === 'landing') url.searchParams.delete('view');
    else url.searchParams.set('view', newView);
    window.history.pushState({}, '', url);
  }, []);

  return (
    // FIX 1: Removed 'min-h-screen'. Added 'flex flex-col h-full' to allow Index.astro to manage height.
    <div className="flex flex-col h-full bg-slate-50 pb-24 md:pb-0"> 
      
      {/* --- DESKTOP HEADER --- */}
      <nav className="hidden md:block bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => changeView('landing')} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src="/android-chrome-192x192.png" alt="Loonie Fi" className="h-8 w-8 rounded-full shadow-sm" />
            <div className="text-lg font-bold tracking-tight">
              <span className="text-amber-500">Loonie</span><span className="text-slate-900">Fi</span>
            </div>
          </button>

          {view !== 'landing' && (
            <div className="flex gap-1 bg-slate-100/50 p-1 rounded-xl border border-slate-200/50 animate-fade-in">
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
          )}
        </div>
      </nav>

      {/* --- MOBILE HEADER --- */}
      <nav className={`md:hidden bg-white/90 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-40 px-4 flex flex-col items-center justify-center text-center transition-all ${view === 'landing' ? 'py-6' : 'py-3'}`}>
         <button onClick={() => changeView('landing')} className="flex items-center gap-1.5 mb-1">
            <img src="/android-chrome-192x192.png" alt="Loonie Fi" className="h-5 w-5 rounded-full" />
            <span className="font-bold text-slate-900 tracking-tight text-sm">Loonie<span className="text-amber-500">Fi</span></span>
         </button>
         {view !== 'landing' && (
           <div className="animate-fade-in">
               <h1 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{activeTabInfo?.title}</h1>
           </div>
         )}
      </nav>

      {/* --- LANDING VIEW --- */}
      {view === 'landing' && (
        // FIX 2: Added flex-grow and justify-center to center landing content
        <main className="flex-grow flex flex-col justify-center max-w-6xl mx-auto px-6 py-12 md:py-20 animate-fade-in text-center">
          <div className="mb-12 md:mb-16">
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
              What are we planning <br className="hidden md:block" /> for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-amber-500 italic">today?</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-xl mx-auto font-medium">
              Select a tool below to get instant, privacy-first estimates of your Canadian government benefits and purchasing power.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TABS.map((tool) => (
              <button 
                key={tool.id}
                onClick={() => changeView(tool.id)}
                className="group relative flex flex-col items-start p-8 bg-white border border-slate-200 rounded-[2.5rem] transition-all duration-300 hover:border-transparent hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-2 text-left"
              >
                <div className={`p-4 rounded-2xl mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3 ${tool.bg}`}>
                  <tool.icon className={`w-8 h-8 ${tool.color}`} />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">{tool.label}</h3>
                <p className="text-slate-500 mb-8 text-sm leading-relaxed font-medium">{tool.description}</p>
                <div className="mt-auto flex items-center font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Start Calculating <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </main>
      )}

      {/* --- CALCULATOR VIEWS --- */}
      {view !== 'landing' && (
        <>
          <div className="hidden md:block max-w-5xl mx-auto px-8 pt-8 pb-2 animate-fade-in text-center md:text-left">
            <h1 className="text-2xl font-black text-slate-900">{activeTabInfo?.title}</h1>
            <p className="text-slate-500 text-sm font-medium">{activeTabInfo?.subtitle}</p>
          </div>

          {/* FIX 3: Added flex-grow and justify-center to center the active calculator */}
          <main className="flex-grow flex flex-col justify-center w-full animate-fade-in transition-all duration-300">
            <div style={{ display: view === 'cpp' ? 'block' : 'none' }}>
                <Calculator isVisible={view === 'cpp'} />
            </div>
            <div style={{ display: view === 'ccb' ? 'block' : 'none' }}>
                <HouseholdBenefits isVisible={view === 'ccb'} />
            </div>
            <div style={{ display: view === 'parental' ? 'block' : 'none' }}>
                <ParentalLeave isVisible={view === 'parental'} />
            </div>
            <div style={{ display: view === 'budget' ? 'block' : 'none' }}>
                <GroceryInflation isVisible={view === 'budget'} />
            </div>
          </main>

          {/* MOBILE BOTTOM NAV */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe z-[10000] flex justify-around items-center h-16 px-2 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.05)] animate-slide-up">
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
        </>
      )}
    </div>
  );
}