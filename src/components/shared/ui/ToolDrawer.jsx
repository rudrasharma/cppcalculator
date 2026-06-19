import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { TOOL_CATEGORIES, ALL_TOOLS } from '../../../config/navigation';

// ICONS
const ChartIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>;
const BabyIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>;
const HomeIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const UsersIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const GraduationCapIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>;
const TrendingUpIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
const XIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

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
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true);
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => setIsAnimating(false), 300);
            document.body.style.overflow = 'unset';
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

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
    if (!mounted) return null;

    return createPortal(
        <div 
            className={`fixed inset-0 z-[10001] md:hidden bg-slate-50 flex flex-col transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
            {/* 1. Full-Screen Header */}
            <div className="shrink-0 pt-[env(safe-area-inset-top)] bg-white border-b border-slate-200">
                <div className="h-16 px-6 flex items-center justify-between">
                    <a href="/" className="flex items-center gap-2" onClick={onClose}>
                        <img src="/android-chrome-192x192.png" alt="Loonie Fi" className="h-7 w-7 rounded-full shadow-sm" />
                        <div className="text-lg font-bold tracking-tight">
                            <span className="text-amber-700">Loonie</span><span className="text-slate-900">Fi</span>
                        </div>
                    </a>
                    <button 
                        onClick={onClose}
                        className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-100 text-slate-900 active:scale-90 transition-all border border-slate-200/50"
                        aria-label="Close menu"
                    >
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* 2. Full-Screen Scrollable Content */}
            <div className="flex-grow overflow-y-auto overscroll-contain pb-24">
                <div className="p-6 space-y-10">
                    {TOOL_CATEGORIES.map(category => {
                        const categoryTools = ALL_TOOLS.filter(t => t.categoryId === category.id);
                        return (
                            <div key={category.id} className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1 flex items-center gap-3">
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
                                                className={`flex items-center gap-4 p-5 rounded-[1.8rem] transition-all ${
                                                    isActive 
                                                    ? 'bg-indigo-600 border-indigo-600 shadow-xl shadow-indigo-100' 
                                                    : 'bg-white border border-slate-200 active:bg-slate-50 active:scale-[0.98]'
                                                }`}
                                            >
                                                <div className={`p-3.5 rounded-2xl ${isActive ? 'bg-white/20' : 'bg-slate-50 border border-slate-100 shadow-sm'}`}>
                                                    <Icon className={`w-6 h-6 ${isActive ? 'text-white' : category.color}`} />
                                                </div>
                                                <div className="text-left min-w-0 flex-grow">
                                                    <p className={`text-base font-black leading-none mb-1.5 ${isActive ? 'text-white' : 'text-slate-900'}`}>
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

                {/* 3. Footer Action */}
                <div className="p-6 pt-0">
                    <button 
                        onClick={onClose}
                        className="w-full py-5 bg-white border-2 border-slate-900 text-slate-900 rounded-[1.5rem] font-black uppercase tracking-widest text-xs active:scale-95 transition-all"
                    >
                        Return to Calculator
                    </button>
                    <div className="pb-safe" />
                </div>
            </div>
        </div>,
        document.body
    );
};
