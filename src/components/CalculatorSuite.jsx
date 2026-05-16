import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Calculator from '../features/retirement/components';
import HouseholdBenefits from '../features/child-benefit/components/HouseholdBenefits';
import ParentalLeave from '../features/parental-leave/components/ParentalLeave'; 
import RESPCalculator from '../features/resp/components/RESPCalculator';
import CAGRCalculator from '../features/cagr/components/CAGRCalculator';
import MortgageCalculator from '../features/mortgage/components/MortgageCalculator';
import { ALL_TOOLS, TOOL_CATEGORIES } from '../config/navigation';
import { ToolDrawer } from './shared/ui/ToolDrawer';
import { DesktopToolSwitcher } from './shared/ui/DesktopToolSwitcher';
import '../styles/global.css'

// ICONS
const ArrowRight = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>;
const MenuIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;

// CONFIGURATION MAPS FOR ICONS
const ChartIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>;
const BabyIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>;
const HomeIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const UsersIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const GraduationCapIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>;
const TrendingUpIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;

const ICON_MAP = {
  ChartIcon,
  BabyIcon,
  HomeIcon,
  UsersIcon,
  GraduationCapIcon,
  TrendingUpIcon
};

export default function CalculatorSuite() {
  const [view, setView] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const v = params.get('view');
      if (v && ALL_TOOLS.find(t => t.id === v)) return v;
      return localStorage.getItem('loonie_pref_view') || 'landing';
    }
    return 'landing';
  }); 

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const activeTool = useMemo(() => ALL_TOOLS.find(t => t.id === view), [view]);

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

  const handleToolSelect = (tool) => {
    const suiteToolIds = ['cpp', 'ccb', 'parental', 'resp', 'cagr', 'mortgage'];
    if (!suiteToolIds.includes(tool.id)) {
        window.location.href = tool.href;
    } else {
        changeView(tool.id);
        if (isDrawerOpen) setIsDrawerOpen(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 pb-24 md:pb-0"> 
      
      {/* --- DESKTOP HEADER --- */}
      <nav className="hidden md:block bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => changeView('landing')} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src="/android-chrome-192x192.png" alt="Loonie Fi" className="h-8 w-8 rounded-full shadow-sm" />
            <div className="text-lg font-bold tracking-tight">
              <span className="text-amber-700">Loonie</span><span className="text-slate-900">Fi</span>
            </div>
          </button>

          {view !== 'landing' && (
            <DesktopToolSwitcher 
                activeId={view} 
                onSelect={handleToolSelect} 
                isSuite={true}
            />
          )}
        </div>
      </nav>

      {/* --- MOBILE HEADER --- */}
      <nav className={`md:hidden bg-white/90 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-40 px-4 flex items-center justify-between transition-all ${view === 'landing' ? 'py-6' : 'py-3'}`}>
         <button onClick={() => changeView('landing')} className="flex items-center gap-1.5">
            <img src="/android-chrome-192x192.png" alt="Loonie Fi" className="h-5 w-5 rounded-full" />
            <span className="font-bold text-slate-900 tracking-tight text-sm">Loonie<span className="text-amber-700">Fi</span></span>
         </button>
         
         {view !== 'landing' && (
           <button 
             onClick={() => setIsDrawerOpen(true)}
             className="p-2 rounded-xl bg-slate-100 text-slate-600 active:scale-95 transition-transform"
           >
             <MenuIcon className="w-5 h-5" />
           </button>
         )}
      </nav>

      {/* --- LANDING VIEW --- */}
      {view === 'landing' && (
        <main className="flex-grow flex flex-col justify-center max-w-6xl mx-auto px-6 py-12 md:py-20 animate-fade-in text-center">
          <div className="mb-12 md:mb-16">
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
              What are we planning <br className="hidden md:block" /> for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-amber-500 italic">today?</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-xl mx-auto font-medium">
              Select a tool below to get instant, privacy-first estimates of your Canadian government benefits and purchasing power.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ALL_TOOLS.map((tool) => {
              const category = TOOL_CATEGORIES.find(c => c.id === tool.categoryId);
              const Icon = ICON_MAP[tool.icon];
              return (
                <button 
                    key={tool.id}
                    onClick={() => handleToolSelect(tool)}
                    className="group relative flex flex-col items-start p-8 bg-white border border-slate-200 rounded-[2.5rem] transition-all duration-300 hover:border-transparent hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-2 text-left"
                >
                    <div className={`p-4 rounded-2xl mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3 ${category?.bg}`}>
                    <Icon className={`w-8 h-8 ${category?.color}`} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">{tool.label}</h3>
                    <p className="text-slate-500 mb-8 text-sm leading-relaxed font-medium">{tool.description}</p>
                    <div className="mt-auto flex items-center font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    Start Calculating <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                </button>
              );
            })}
          </div>
        </main>
      )}

      {/* --- CALCULATOR VIEWS --- */}
      {view !== 'landing' && (
        <>
          <div className="hidden md:block max-w-5xl mx-auto px-8 pt-8 pb-2 animate-fade-in text-center md:text-left">
            <h1 className="text-2xl font-black text-slate-900">{activeTool?.title}</h1>
            <h2 className="text-slate-500 text-sm font-medium">{activeTool?.subtitle}</h2>
          </div>

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
            <div style={{ display: view === 'resp' ? 'block' : 'none' }}>
                <RESPCalculator isVisible={view === 'resp'} />
            </div>
            <div style={{ display: view === 'cagr' ? 'block' : 'none' }}>
                <CAGRCalculator isVisible={view === 'cagr'} />
            </div>
            <div style={{ display: view === 'mortgage' ? 'block' : 'none' }}>
                <MortgageCalculator isVisible={view === 'mortgage'} />
            </div>
          </main>

          {/* MOBILE TOOL DRAWER TRIGGER */}
          <div className="md:hidden fixed bottom-6 right-6 z-40">
            <button 
                onClick={() => setIsDrawerOpen(true)}
                className="bg-indigo-600 text-white p-4 rounded-full shadow-2xl active:scale-95 transition-transform"
            >
                <MenuIcon className="w-6 h-6" />
            </button>
          </div>
        </>
      )}

      <ToolDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeId={view}
        onSelect={handleToolSelect}
        isSuite={true}
      />
    </div>
  );
}