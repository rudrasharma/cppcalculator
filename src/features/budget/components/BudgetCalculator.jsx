import React, { useState, useRef, useEffect } from 'react';
import RedactionCanvas from './RedactionCanvas';
import BudgetDashboard from './BudgetDashboard';
import { ShieldCheckIcon, AlertTriangleIcon } from '../../../components/shared/Icons';

export default function BudgetCalculator() {
    const [appState, setAppState] = useState('UPLOAD'); // UPLOAD, REDACT, ANALYZING, DASHBOARD
    const [rawImages, setRawImages] = useState([]);
    const [budgetData, setBudgetData] = useState(null);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState(0);
    const [progressMessage, setProgressMessage] = useState("Initializing AI Engine...");

    const fileInputRef = useRef(null);
    const canvasRefs = useRef([]);

    // Listen for paste events anywhere in the window
    useEffect(() => {
        if (appState !== 'UPLOAD' && appState !== 'REDACT') return;

        const handlePaste = (e) => {
            const items = e.clipboardData?.items;
            if (!items) return;

            const imageFiles = [];
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.startsWith('image/')) {
                    imageFiles.push(items[i].getAsFile());
                }
            }

            if (imageFiles.length > 0) {
                processFiles(imageFiles);
            }
        };

        window.addEventListener('paste', handlePaste);
        return () => window.removeEventListener('paste', handlePaste);
    }, [appState]);

    // Progress bar simulation
    useEffect(() => {
        if (appState !== 'ANALYZING') {
            setProgress(0);
            setProgressMessage("Initializing AI Engine...");
            return;
        }

        const messages = [
            "Scanning images for text...",
            "Extracting merchant names...",
            "Standardizing transactions...",
            "Categorizing expenses...",
            "Generating financial insights...",
            "Finalizing report..."
        ];

        let currentMsg = 0;
        let currentProg = 0;

        const interval = setInterval(() => {
            currentProg += Math.random() * 5 + 2;
            if (currentProg > 95) currentProg = 95; // stall at 95% until done
            setProgress(currentProg);

            if (currentProg > (currentMsg + 1) * 15 && currentMsg < messages.length - 1) {
                currentMsg++;
                setProgressMessage(messages[currentMsg]);
            }
        }, 800);

        return () => clearInterval(interval);
    }, [appState]);

    const processFiles = (files) => {
        const promises = files.map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.readAsDataURL(file);
            });
        });

        Promise.all(promises).then(base64Images => {
            setRawImages(prev => [...prev, ...base64Images]);
            setAppState('REDACT');
            setError(null);
        });
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
        if (files.length === 0) {
            setError("Please upload image files (PNG, JPEG).");
            return;
        }
        processFiles(files);
    };

    const handleLoadSample = () => {
        setAppState('ANALYZING');
        setTimeout(() => {
            setBudgetData({
                transactions: [
                    { date: "2023-10-01", cleanName: "FreshCo Supermarket", amount: 145.20, category: "Food & Groceries" },
                    { date: "2023-10-02", cleanName: "Starbucks", amount: 6.50, category: "Dining Out" },
                    { date: "2023-10-03", cleanName: "Property Tax", amount: 350.00, category: "Housing" },
                    { date: "2023-10-04", cleanName: "Enbridge Gas", amount: 85.00, category: "Utilities" },
                    { date: "2023-10-05", cleanName: "Netflix", amount: 15.99, category: "Recreational" },
                    { date: "2023-10-06", cleanName: "Uber", amount: 24.50, category: "Transportation" },
                    { date: "2023-10-10", cleanName: "Costco Wholesale", amount: 312.45, category: "Food & Groceries" }
                ],
                insights: [
                    "You spend a significant portion on Food & Groceries. Buying in bulk at Costco is great, but watch out for impulse buys!",
                    "Your Dining Out expenses are low, which is excellent for saving money.",
                    "Consider setting up a dedicated sinking fund for your Property Taxes to smooth out your monthly cash flow."
                ],
                totals: {
                    income: 0,
                    expenses: 939.64
                }
            });
            setAppState('DASHBOARD');
        }, 1500);
    };

    const handleAnalyze = async () => {
        // Collect base64 strings from all canvas refs
        const redactedImages = canvasRefs.current
            .map(ref => ref?.getBase64())
            .filter(Boolean);

        if (redactedImages.length === 0) {
            setError("No valid images to analyze.");
            return;
        }

        setAppState('ANALYZING');
        setError(null);

        try {
            const res = await fetch('/api/ai/budget-analyzer/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ images: redactedImages })
            });

            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.error || "Failed to analyze image");
            }

            setBudgetData(data);
            setAppState('DASHBOARD');
        } catch (err) {
            console.error(err);
            setError(err.message || "An error occurred during analysis.");
            setAppState('REDACT'); 
        }
    };

    const resetApp = () => {
        setAppState('UPLOAD');
        setRawImages([]);
        setBudgetData(null);
        setError(null);
        canvasRefs.current = [];
    };

    return (
        <div className="max-w-6xl mx-auto w-full">
            {error && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-start gap-3 text-rose-800 animate-fade-in">
                    <div className="mt-0.5"><AlertTriangleIcon className="w-5 h-5 text-rose-500" /></div>
                    <div>
                        <h4 className="font-bold">Error</h4>
                        <p className="text-sm">{error}</p>
                    </div>
                </div>
            )}

            {appState === 'UPLOAD' && (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start animate-fade-in">
                    
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50 pointer-events-none"></div>
                            
                            <h2 className="text-2xl font-black text-slate-900 mb-2">Upload Bank Statement</h2>
                            <p className="text-slate-500 mb-8 max-w-md">Just take a screenshot of the transactions list from your bank or credit card statement and paste it here. <strong>You do NOT need to include any personal identifying information (PII)</strong> like your name, account number, or balance! We'll use AI to categorize your spending and find optimizations.</p>

                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="border-3 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50 hover:bg-indigo-50/50 rounded-2xl p-12 text-center cursor-pointer transition-colors group"
                            >
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform text-indigo-500">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-slate-700 mb-1">Click to upload or press Ctrl+V to paste</h3>
                                <p className="text-sm text-slate-400">PNG, JPG up to 10MB. Multiple files allowed.</p>
                                <input 
                                    type="file" 
                                    accept="image/png, image/jpeg" 
                                    multiple
                                    className="hidden" 
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                />
                            </div>

                            <div className="mt-6 flex items-center justify-center gap-4">
                                <div className="h-px bg-slate-200 flex-1"></div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">OR</span>
                                <div className="h-px bg-slate-200 flex-1"></div>
                            </div>

                            <div className="mt-6 text-center">
                                <button onClick={handleLoadSample} className="text-sm font-bold text-indigo-600 hover:text-indigo-700 hover:underline">
                                    Try it with a sample statement
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white border border-slate-200 rounded-3xl p-8 text-slate-600 shadow-sm relative overflow-hidden">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                                    <ShieldCheckIcon className="w-5 h-5" />
                                </div>
                                <h3 className="font-black text-lg text-slate-900">100% Private & Secure</h3>
                            </div>
                            <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                We take your privacy seriously. Your data is processed securely and is <strong className="text-slate-800">never stored in any database.</strong>
                            </p>
                            
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-sm text-slate-600">
                                    <svg className="w-5 h-5 text-indigo-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    <span><strong className="text-slate-800">Local Censor Tool:</strong> You will have the opportunity to blur out account numbers and names before analysis.</span>
                                </li>
                                <li className="flex gap-3 text-sm text-slate-600">
                                    <svg className="w-5 h-5 text-indigo-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    <span><strong className="text-slate-800">Zero Storage Guarantee:</strong> Your statement is analyzed in memory and immediately discarded.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {appState === 'REDACT' && (
                <div className="flex flex-col animate-fade-in w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 sticky top-4 z-20 bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-slate-200 shadow-sm">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900">Censor Private Info</h2>
                            <p className="text-slate-500 text-sm">Click and drag to draw black boxes over anything private. Press Ctrl+V to paste more images.</p>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                            <button 
                                onClick={resetApp}
                                className="px-5 py-2.5 rounded-full text-slate-600 font-bold bg-slate-100 hover:bg-slate-200 transition-colors flex-1 md:flex-none text-center"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleAnalyze}
                                className="px-6 py-2.5 rounded-full text-white font-bold bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition-colors flex-1 md:flex-none text-center"
                            >
                                Analyze {rawImages.length} Image{rawImages.length > 1 ? 's' : ''}
                            </button>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        {rawImages.map((img, i) => (
                            <RedactionCanvas 
                                key={i}
                                index={i}
                                imageUrl={img} 
                                ref={el => canvasRefs.current[i] = el}
                            />
                        ))}
                    </div>
                </div>
            )}

            {appState === 'ANALYZING' && (
                <div className="flex flex-col items-center justify-center py-32 animate-fade-in w-full max-w-xl mx-auto">
                    <div className="w-full mb-8">
                        <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                            <span>{progressMessage}</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden shadow-inner border border-slate-200">
                            <div 
                                className="bg-gradient-to-r from-indigo-500 to-violet-600 h-full rounded-full transition-all duration-500 ease-out relative"
                                style={{ width: `${progress}%` }}
                            >
                                <div className="absolute inset-0 bg-white/20 w-full h-full" style={{ backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem' }}></div>
                            </div>
                        </div>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Analyzing your spending...</h2>
                    <p className="text-slate-500 text-center">Our AI is reading your transactions across {rawImages.length} image{rawImages.length > 1 ? 's' : ''}, standardizing merchant names, and finding optimization opportunities.</p>
                </div>
            )}

            {appState === 'DASHBOARD' && budgetData && (
                <BudgetDashboard 
                    data={budgetData} 
                    onReset={resetApp} 
                />
            )}
        </div>
    );
}
