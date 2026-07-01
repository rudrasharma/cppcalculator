import React, { useState, useRef, useEffect } from 'react';
import { TOOL_CATEGORIES, ALL_TOOLS } from '../../../config/navigation';

// ICONS
const ChartIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>;
const BabyIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>;
const HomeIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const UsersIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const GraduationCapIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>;
const TrendingUpIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
const ChevronDown = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="6 9 12 15 18 9"></polyline></svg>;
import { WandIcon, PiggyBankIcon, BarChartIcon } from '../Icons';

const ICON_MAP = {
    ChartIcon,
    BabyIcon,
    HomeIcon,
    UsersIcon,
    GraduationCapIcon,
    TrendingUpIcon,
    WandIcon,
    PiggyBankIcon,
    BarChartIcon
};

export const DesktopToolSwitcher = ({ activeId, onSelect, isSuite = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const activeTool = ALL_TOOLS.find(t => t.id === activeId);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (e, tool) => {
        if (isSuite && onSelect) {
            // Check if tool is part of the suite
            const suiteToolIds = ['cpp', 'ccb', 'parental', 'resp', 'cagr', 'mortgage'];
            if (suiteToolIds.includes(tool.id)) {
                e.preventDefault();
                onSelect(tool);
                setIsOpen(false);
            }
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-4 py-2 bg-slate-100/50 hover:bg-slate-200/50 border border-slate-200/50 rounded-xl transition-all group"
            >
                {activeTool ? (
                    <>
                        <div className={`p-1.5 rounded-lg bg-white shadow-sm ring-1 ring-black/5`}>
                            {React.createElement(ICON_MAP[activeTool.icon], { className: "w-4 h-4 text-indigo-600" })}
                        </div>
                        <span className="text-sm font-bold text-slate-900">{activeTool.label}</span>
                    </>
                ) : (
                    <span className="text-sm font-bold text-slate-600">Select Tool</span>
                )}
                <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-[480px] bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 z-50 animate-fade-in">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-8">
                        {TOOL_CATEGORIES.map(category => (
                            <div key={category.id} className="space-y-3">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50 pb-2">
                                    {category.label}
                                </h3>
                                <div className="space-y-1">
                                    {ALL_TOOLS.filter(t => t.categoryId === category.id).map(tool => {
                                        const isActive = activeId === tool.id;
                                        const Icon = ICON_MAP[tool.icon];
                                        return (
                                            <a
                                                key={tool.id}
                                                href={tool.href}
                                                onClick={(e) => handleSelect(e, tool)}
                                                className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all text-left ${
                                                    isActive 
                                                    ? 'bg-indigo-50 text-indigo-900' 
                                                    : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'
                                                }`}
                                            >
                                                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                                                <span className="text-xs font-bold">{tool.label}</span>
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
