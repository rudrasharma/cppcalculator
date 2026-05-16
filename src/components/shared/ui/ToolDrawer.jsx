import React, { useState, useEffect } from 'react';
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

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true);
            document.body.style.overflow = 'hidden';
            document.body.style.touchAction = 'none'; // Prevent scroll chaining
        } else {
            const timer = setTimeout(() => setIsAnimating(false), 300);
            document.body.style.overflow = 'unset';
            document.body.style.touchAction = 'unset';
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

    return (
        <div className="fixed inset-0 z-[10001] md:hidden flex flex-col justify-end">
            {/* Backdrop */}
            <div 
                className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />

            {/* Bottom Sheet Container */}
            <div 
                className={`relative w-full bg-white rounded-t-[2.5rem] shadow-2xl transition-transform duration-300 ease-out flex flex-col max-h-[92%] ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header / Handle area */}
                <div className="flex flex-col items-center pt-3 pb-2 border-b border-slate-50">
                    <div className="w-12 h-1.5 bg-slate-200 rounded-full mb-4" />
                    <div className="w-full px-6 flex items-center justify-between">
                        <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">Financial Tools</h2>
                        <button 
                            onClick={onClose}
                            className="p-2 rounded-full bg-slate-100 text-slate-500 active:scale-90 transition-transform"
                        >
                            <XIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto flex-grow p-6 pb-24 overscroll-contain">
                    <div className="space-y-10">
                        {TOOL_CATEGORIES.map(category => {
                            const categoryTools = ALL_TOOLS.filter(t => t.categoryId === category.id);
                            return (
                                <div key={category.id} className="space-y-4">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 px-2">
                                        {category.label}
                                    </h3>
                                    <div className="grid grid-cols-1 gap-2">
                                        {categoryTools.map(tool => {
                                            const Icon = ICON_MAP[tool.icon];
                                            const isActive = activeId === tool.id;
                                            return (
                                                <a
                                                    key={tool.id}
                                                    href={tool.href}
                                                    onClick={(e) => handleSelect(e, tool)}
                                                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                                                        isActive 
                                                        ? 'bg-indigo-50 border-indigo-100 ring-1 ring-indigo-200 shadow-sm' 
                                                        : 'bg-white border border-slate-100 active:bg-slate-50'
                                                    }`}
                                                >
                                                    <div className={`p-2.5 rounded-xl ${isActive ? 'bg-white shadow-sm' : category.bg}`}>
                                                        <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : category.color}`} />
                                                    </div>
                                                    <div className="text-left min-w-0 flex-grow">
                                                        <p className={`text-sm font-black truncate ${isActive ? 'text-indigo-900' : 'text-slate-900'}`}>
                                                            {tool.label}
                                                        </p>
                                                        <p className="text-[10px] font-medium text-slate-500 uppercase tracking-tight truncate">
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
                </div>

                {/* Safe Area Spacer */}
                <div className="pb-safe bg-white" />
            </div>
        </div>
    );
};
