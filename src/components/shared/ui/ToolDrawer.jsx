import React, { useState, useEffect, useRef } from 'react';
import { TOOL_CATEGORIES, ALL_TOOLS } from '../../../config/navigation';

// ICONS
const ChartIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>;
const BabyIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>;
const HomeIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const UsersIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const GraduationCapIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>;
const TrendingUpIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
const XIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const ArrowDownIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>;

const ICON_MAP = {
    ChartIcon,
    BabyIcon,
    HomeIcon,
    UsersIcon,
    GraduationCapIcon,
    TrendingUpIcon
};

export const ToolDrawer = ({ isOpen, onClose, activeId, onSelect, isSuite = false }) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [showScrollHint, setShowScrollHint] = useState(true);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true);
            document.body.style.overflow = 'hidden';
            document.body.style.touchAction = 'none';
            setShowScrollHint(true);
        } else {
            const timer = setTimeout(() => setIsAnimating(false), 300);
            document.body.style.overflow = 'unset';
            document.body.style.touchAction = 'unset';
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleScroll = (e) => {
        if (e.target.scrollTop > 20) {
            setShowScrollHint(false);
        }
    };

    const handleSelect = (e, tool) => {
        if (isSuite && onSelect) {
            const suiteToolIds = ['cpp', 'ccb', 'parental', 'resp', 'cagr', 'mortgage'];
            if (suiteToolIds.includes(tool.id)) {
                e.preventDefault();
                onSelect(tool);
                onClose();
            }
        }
    };

    if (!isOpen && !isAnimating) return null;

    return (
        <div className="fixed inset-0 z-[10001] md:hidden flex flex-col justify-end">
            {/* Backdrop - Darker for better focus */}
            <div 
                className={`absolute inset-0 bg-slate-900/80 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />

            {/* Bottom Sheet Container */}
            <div 
                className={`relative w-full bg-white rounded-t-[2.5rem] shadow-2xl transition-transform duration-300 ease-out flex flex-col h-[85dvh] ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header / Handle area - Sticky for constant close access */}
                <div className="flex flex-col items-center pt-3 pb-4 border-b border-slate-100 bg-white rounded-t-[2.5rem] shrink-0 shadow-sm z-20">
                    <div className="w-12 h-1.5 bg-slate-200 rounded-full mb-4 active:bg-slate-300 transition-colors" onClick={onClose} />
                    <div className="w-full px-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">Financial Tools</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">Select a calculator to begin</p>
                        </div>
                        <button 
                            onClick={onClose}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 active:scale-90 active:bg-slate-200 transition-all border border-slate-200/50"
                            aria-label="Close menu"
                        >
                            <XIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div 
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="overflow-y-auto flex-grow p-6 pb-12 overscroll-contain bg-white relative"
                >
                    <div className="space-y-12">
                        {TOOL_CATEGORIES.map(category => {
                            const categoryTools = ALL_TOOLS.filter(t => t.categoryId === category.id);
                            return (
                                <div key={category.id} className="space-y-4">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 px-2 flex items-center gap-2">
                                        <span className={`w-1.5 h-1.5 rounded-full ${category.color.replace('text', 'bg')}`}></span>
                                        {category.label}
                                    </h3>
                                    <div className="grid grid-cols-1 gap-3">
                                        {categoryTools.map(tool => {
                                            const Icon = ICON_MAP[tool.icon];
                                            const isActive = activeId === tool.id;
                                            return (
                                                <a
                                                    key={tool.id}
                                                    href={tool.href}
                                                    onClick={(e) => handleSelect(e, tool)}
                                                    className={`flex items-center gap-4 p-5 rounded-[1.5rem] transition-all ${
                                                        isActive 
                                                        ? 'bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-100' 
                                                        : 'bg-slate-50 border border-slate-100 active:bg-slate-100 active:scale-[0.98]'
                                                    }`}
                                                >
                                                    <div className={`p-3 rounded-2xl ${isActive ? 'bg-white/20' : 'bg-white shadow-sm'}`}>
                                                        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : category.color}`} />
                                                    </div>
                                                    <div className="text-left min-w-0 flex-grow">
                                                        <p className={`text-sm font-black leading-none mb-1 ${isActive ? 'text-white' : 'text-slate-900'}`}>
                                                            {tool.label}
                                                        </p>
                                                        <p className={`text-[10px] font-bold uppercase tracking-tight truncate ${isActive ? 'text-indigo-100' : 'text-slate-400'}`}>
                                                            {tool.subtitle}
                                                        </p>
                                                    </div>
                                                </a>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Fading Bottom Mask for Scroll Affordance */}
                    <div className="sticky bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
                </div>

                {/* Footer Action - For redundant closeability */}
                <div className="p-6 pt-2 border-t border-slate-50 bg-white shrink-0">
                    <button 
                        onClick={onClose}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs active:scale-95 transition-all shadow-xl shadow-slate-200"
                    >
                        Close Tools
                    </button>
                    <div className="pb-safe" />
                </div>

                {/* Floating Scroll Hint */}
                {showScrollHint && (
                    <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 animate-bounce pointer-events-none bg-indigo-600 text-white px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg z-30">
                        <span className="text-[9px] font-black uppercase tracking-widest">Scroll for more</span>
                        <ArrowDownIcon className="w-3 h-3" />
                    </div>
                )}
            </div>
        </div>
    );
};
