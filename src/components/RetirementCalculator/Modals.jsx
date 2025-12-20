import React from 'react';
import { 
    XIcon, CalculatorIcon, CheckCircleIcon, UploadIcon, CheckIcon 
} from './Icons'; // Adjust path

export const AboutModal = ({ onClose }) => (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
        <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl relative border border-slate-100" onClick={e => e.stopPropagation()}>
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"><XIcon size={24} /></button>
            <div className="flex items-center gap-4 mb-6">
                <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
                    <CalculatorIcon size={28} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">About LoonieSense</h2>
                    <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Privacy-First Pension Forecasting</p>
                </div>
            </div>
            <div className="space-y-4 text-slate-600 leading-relaxed">
                <p><strong>Born in Canada, Built for Privacy.</strong></p>
                <p>This tool was designed to help Canadians navigate the complex math behind the Canada Pension Plan (CPP) and Old Age Security (OAS).</p>
                <p>It handles the new <strong>Enhanced CPP (Tier 2)</strong> rules introduced in 2024/2025, which can significantly change your future benefits if you are currently working.</p>
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-emerald-800 text-sm flex gap-3">
                    <CheckCircleIcon className="text-emerald-500 shrink-0" size={20} />
                    <div><strong>Privacy First:</strong> No data is sent to servers. Your earnings history and dates of birth never leave your computer. Everything runs locally in your browser.</div>
                </div>
            </div>
            <button onClick={onClose} className="mt-8 w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-slate-900/20">Close</button>
        </div>
    </div>
);

export const ImportModal = ({ onClose, importText, setImportText, importError, onImport }) => (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
        <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl relative border border-slate-100" onClick={e => e.stopPropagation()}>
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"><XIcon size={24} /></button>
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><UploadIcon className="text-indigo-600"/> Import from Service Canada</h2>
            <div className="space-y-4">
                <div className="text-sm text-slate-600 space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed">
                    <p><strong>How to get your data:</strong></p>
                    <ol className="list-decimal pl-5 space-y-2">
                        <li>Log in to <a href="https://www.canada.ca/en/employment-social-development/services/my-account.html" target="_blank" className="text-indigo-600 font-bold hover:underline">My Service Canada Account</a>.</li>
                        <li>Navigate to <strong>CPP</strong> {'>'} <strong>Contributions</strong>.</li>
                        <li>Select the entire table of years and amounts (it's okay to include headers).</li>
                        <li>Copy (Ctrl+C) and paste it into the box below.</li>
                    </ol>
                </div>
                <textarea 
                    value={importText} 
                    onChange={(e) => setImportText(e.target.value)} 
                    placeholder="Paste here (e.g. 2018  $55,900 ...)" 
                    className="w-full h-44 p-4 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-xs transition-all shadow-inner resize-none" 
                />
                {importError && <div className="text-rose-600 text-sm font-bold flex items-center gap-2 animate-fade-in bg-rose-50 p-2 rounded-lg border border-rose-100"><XIcon size={16}/> {importError}</div>}
                <div className="flex justify-end gap-3 pt-2">
                    <button onClick={onClose} className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-100 rounded-lg transition">Cancel</button>
                    <button onClick={onImport} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-lg shadow-indigo-200 flex items-center gap-2"><CheckIcon size={18}/> Parse & Import</button>
                </div>
            </div>
        </div>
    </div>
);