import React, { useState } from 'react';
// REMOVED 'TrashIcon' to prevent crash. Using 'XIcon' for delete instead.
import { 
    XIcon, FileTextIcon, UploadIcon, InfoIcon, CheckIcon, RotateCcwIcon 
} from './Icons'; 
// Ensure this path matches your file structure
import { parseMscaData } from '../utils/mscaParser'; 

// --- ABOUT MODAL (Unchanged) ---
export function AboutModal({ onClose }) {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h2 className="text-lg font-black text-slate-800">About LoonieFi</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"><XIcon size={20} /></button>
                </div>
                <div className="p-6 text-sm text-slate-600 leading-relaxed space-y-4">
                    <p>This calculator forecasts your Canadian retirement income by modeling the Canada Pension Plan (CPP), Old Age Security (OAS), and Guaranteed Income Supplement (GIS).</p>
                    <p>It specifically handles complex scenarios like the <strong>Child Rearing Provision</strong>, the new <strong>CPP Enhancement (Phase 2)</strong>, and <strong>OAS Clawbacks</strong>.</p>
                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-indigo-800 text-xs font-bold">
                        Privacy Note: All calculations happen in your browser. No personal data is stored or transmitted.
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- IMPORT MODAL (WITH EDIT/DELETE PREVIEW) ---
export function ImportModal({ onClose, importText, setImportText, onImport }) {
    const [previewData, setPreviewData] = useState(null);
    const [localError, setLocalError] = useState("");

    const handleAnalyze = () => {
        setLocalError("");
        const { error, data } = parseMscaData(importText);
        
        if (error) {
            setLocalError(error);
        } else if (data && Object.keys(data).length > 0) {
            setPreviewData(data);
        } else {
            setLocalError("No valid earnings data found. Please check your text selection.");
        }
    };

    const handleConfirm = () => {
        onImport(previewData);
    };

    const handleReset = () => {
        setPreviewData(null);
        setLocalError("");
    };

    // --- NEW: EDIT HANDLERS ---
    const handleDeleteRow = (yearToDelete) => {
        const newData = { ...previewData };
        delete newData[yearToDelete];
        // If they delete everything, go back to step 1
        if (Object.keys(newData).length === 0) {
            handleReset();
        } else {
            setPreviewData(newData);
        }
    };

    const handleEditEarnings = (year, value) => {
        const val = parseInt(value) || 0;
        setPreviewData(prev => ({
            ...prev,
            [year]: val
        }));
    };

    // Calculate dynamic summary stats
    const yearsFound = previewData ? Object.keys(previewData).sort() : [];
    const minYear = yearsFound.length > 0 ? yearsFound[0] : "-";
    const maxYear = yearsFound.length > 0 ? yearsFound[yearsFound.length - 1] : "-";

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${previewData ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'}`}>
                            {previewData ? <CheckIcon size={24} strokeWidth={3} /> : <UploadIcon size={24} />}
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-800 leading-none">
                                {previewData ? "Verify & Edit" : "Import CPP Data"}
                            </h2>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">
                                {previewData ? "Review before importing" : "From Service Canada (MSCA)"}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                        {XIcon && <XIcon size={24} />}
                    </button>
                </div>

                {/* Content Area */}
                <div className="p-6 md:p-8 overflow-y-auto flex-1">
                    
                    {!previewData ? (
                        /* STEP 1: INPUT STATE */
                        <>
                            <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100 mb-6">
                                <h3 className="text-indigo-900 font-bold text-sm mb-3 uppercase tracking-wide flex items-center gap-2">
                                    <span className="bg-indigo-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">!</span> 
                                    How to Copy Correctly
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-indigo-800">
                                    <div className="bg-white p-3 rounded-xl border border-indigo-100 shadow-sm">
                                        <span className="block text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Step 1</span>
                                        <strong>Log in</strong> to MSCA and view "CPP Contributions."
                                    </div>
                                    <div className="bg-white p-3 rounded-xl border border-indigo-100 shadow-sm relative overflow-hidden">
                                        <span className="block text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Step 2 (Crucial)</span>
                                        <div className="flex items-center gap-2 font-black text-slate-800">
                                            <span className="border border-slate-300 rounded px-1.5 bg-slate-50">CTRL</span> + <span className="border border-slate-300 rounded px-1.5 bg-slate-50">A</span>
                                        </div>
                                        <p className="text-xs mt-1 leading-tight">Select the <strong>entire page</strong>.</p>
                                    </div>
                                    <div className="bg-white p-3 rounded-xl border border-indigo-100 shadow-sm">
                                        <span className="block text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Step 3</span>
                                        <strong>Paste</strong> everything below.
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-700 ml-1">Paste Data Here:</label>
                                <textarea 
                                    value={importText} 
                                    onChange={(e) => setImportText(e.target.value)} 
                                    className="w-full h-48 p-4 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-mono focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none shadow-inner"
                                    placeholder="Paste the entire text content of the page here..."
                                />
                                {localError && (
                                    <div className="flex items-center gap-3 text-rose-600 bg-rose-50 p-4 rounded-xl border border-rose-100 animate-slide-in">
                                        {InfoIcon && <InfoIcon size={20} className="shrink-0" />}
                                        <div className="text-sm font-bold">{localError}</div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        /* STEP 2: EDIT PREVIEW STATE */
                        <div className="animate-fade-in space-y-6">
                            {/* Summary Stats */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Records</div>
                                    <div className="text-2xl font-black text-slate-800">{yearsFound.length}</div>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Start</div>
                                    <div className="text-2xl font-black text-slate-800">{minYear}</div>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">End</div>
                                    <div className="text-2xl font-black text-slate-800">{maxYear}</div>
                                </div>
                            </div>

                            {/* Editable List */}
                            <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[300px]">
                                <div className="p-3 bg-slate-100 border-b border-slate-200 grid grid-cols-12 font-bold text-xs text-slate-500 uppercase tracking-wider items-center">
                                    <div className="col-span-3 pl-2">Year</div>
                                    <div className="col-span-7 pl-2">Earnings</div>
                                    <div className="col-span-2 text-center">Action</div>
                                </div>
                                <div className="overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-slate-200">
                                    {yearsFound.map(year => (
                                        <div key={year} className="grid grid-cols-12 py-1.5 px-2 border-b border-slate-100 last:border-0 text-sm hover:bg-white rounded-lg transition-colors items-center group">
                                            {/* Static Year */}
                                            <div className="col-span-3 font-bold text-slate-700 pl-2">{year}</div>
                                            
                                            {/* Editable Earnings Input */}
                                            <div className="col-span-7 relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-mono">$</span>
                                                <input 
                                                    type="number"
                                                    value={previewData[year]}
                                                    onChange={(e) => handleEditEarnings(year, e.target.value)}
                                                    className="w-full pl-6 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm"
                                                />
                                            </div>

                                            {/* Delete Button (Using XIcon which is SAFE) */}
                                            <div className="col-span-2 flex justify-center">
                                                <button 
                                                    onClick={() => handleDeleteRow(year)}
                                                    className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                                    title="Remove Row"
                                                >
                                                    <XIcon size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <p className="text-center text-xs text-slate-400 italic">
                                Tip: You can modify values here before importing.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                    <button onClick={onClose} className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-colors">
                        Cancel
                    </button>
                    
                    {!previewData ? (
                        <button 
                            onClick={handleAnalyze} 
                            disabled={!importText.trim()}
                            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                        >
                            {FileTextIcon && <FileTextIcon size={18} />} Analyze Text
                        </button>
                    ) : (
                        <>
                            <button 
                                onClick={handleReset} 
                                className="px-5 py-2.5 text-indigo-600 font-bold hover:bg-indigo-50 border border-transparent hover:border-indigo-100 rounded-xl transition-colors flex items-center gap-2"
                            >
                                {RotateCcwIcon && <RotateCcwIcon size={18} />} Back
                            </button>
                            <button 
                                onClick={handleConfirm} 
                                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center gap-2 animate-pulse-soft"
                            >
                                {CheckIcon && <CheckIcon size={18} />} Confirm Import
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}