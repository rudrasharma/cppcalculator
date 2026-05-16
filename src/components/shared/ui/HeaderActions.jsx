import React, { useState } from 'react';
import { ToolDrawer } from './ToolDrawer';

const MenuIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;

export default function HeaderActions({ activeId }) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <>
            <button 
                onClick={() => setIsDrawerOpen(true)}
                className="p-3 rounded-xl bg-slate-100 text-slate-700 active:scale-90 transition-transform shadow-sm border border-slate-200"
                aria-label="Open tool menu"
            >
                <MenuIcon className="w-6 h-6" />
            </button>

            <ToolDrawer 
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                activeId={activeId}
                isSuite={false}
            />
        </>
    );
}
