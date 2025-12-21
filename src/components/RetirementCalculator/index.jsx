// src/components/RetirementCalculator/index.jsx
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CheckIcon, LinkIcon, ArrowRightIcon } from './Icons';
import { CURRENT_YEAR, getYMPE } from '../../utils/constants';
import { useRetirementMath } from '../../hooks/useRetirementMath';
import { compressEarnings, decompressEarnings } from '../../utils/compression';

import { AboutModal, ImportModal } from './Modals';
import InputTab from './InputTab';
import ResultsTab from './ResultsTab';

// ==========================================
//              MAIN COMPONENT
// ==========================================
export default function Calculator() {
    // --- 1. CORE STATE ---
    const [children, setChildren] = useState([]); 
    const [dob, setDob] = useState('1985-01-01');
    const [retirementAge, setRetirementAge] = useState(65);
    const [yearsInCanada, setYearsInCanada] = useState(40);
    const [earnings, setEarnings] = useState({});
    const [activeTab, setActiveTab] = useState('input');
    const [mounted, setMounted] = useState(false); 

    // --- 2. INPUT STATE & TOGGLES ---
    const [avgSalaryInput, setAvgSalaryInput] = useState('');
    const [otherIncome, setOtherIncome] = useState(''); 
    
    // UX Toggles
    const [livedInCanadaAllLife, setLivedInCanadaAllLife] = useState(true); 
    const [isMarried, setIsMarried] = useState(false);
    const [showChildren, setShowChildren] = useState(false);
    
    // Feature: Grid & Tax
    const [showGrid, setShowGrid] = useState(false);
    const [showNet, setShowNet] = useState(false);
    const TAX_RATE = 0.15; 

    // Spouse Data
    const [spouseDob, setSpouseDob] = useState('1985-01-01');
    const [spouseIncome, setSpouseIncome] = useState('');
    const [forceAllowance, setForceAllowance] = useState(false);

    // --- 3. UI STATE ---
    const [showAbout, setShowAbout] = useState(false);
    const [useFutureDollars, setUseFutureDollars] = useState(false);
    const [showImport, setShowImport] = useState(false);
    const [importText, setImportText] = useState("");
    const [importError, setImportError] = useState("");
    
    // --- 4. CHART & COMPARISON STATE ---
    const [chartSelection, setChartSelection] = useState(null);
    const [lineVisibility, setLineVisibility] = useState({
        Early: true, Standard: true, Deferred: true, Selected: true
    });
    const [copySuccess, setCopySuccess] = useState(false);
    const [comparisonSnapshot, setComparisonSnapshot] = useState(null);

    // --- 5. MOBILE UX STATE ---
    const [isInputFocused, setIsInputFocused] = useState(false);

    const birthYear = parseInt(dob.split('-')[0]);

    // --- 6. LOGIC HOOK ---
    // Ensure results has a default structure to prevent crashes
    const rawResults = useRetirementMath({
        earnings, dob, retirementAge, yearsInCanada, otherIncome,
        isMarried, spouseDob, spouseIncome, forceAllowance, children
    });

    // Safety: Ensure results object always has the expected keys
    const results = {
        grandTotal: 0,
        years: [],
        cpp: { base: 0, enhanced: 0, total: 0 },
        oas: { gross: 0, clawback: 0, total: 0 },
        gis: { total: 0, note: '' },
        breakevenData: [],
        crossovers: {},
        ...rawResults // Overwrite defaults with actual data if it exists
    };

    // --- 7. HANDLERS ---
    useEffect(() => { setMounted(true); }, []);
    useEffect(() => { if (livedInCanadaAllLife) setYearsInCanada(40); }, [livedInCanadaAllLife]);
    useEffect(() => { if (!showChildren) setChildren([]); }, [showChildren]);

    // Handle Mobile Keyboard Detection
    useEffect(() => {
        const handleFocus = (e) => {
            const tag = e.target.tagName;
            const type = e.target.type;
            if (tag === 'TEXTAREA' || (tag === 'INPUT' && !['checkbox', 'radio', 'range', 'submit', 'button', 'file', 'color'].includes(type))) {
                setIsInputFocused(true);
            }
        };

        const handleBlur = () => {
            setTimeout(() => {
                const active = document.activeElement;
                const tag = active?.tagName;
                const type = active?.type;
                if (!(tag === 'TEXTAREA' || (tag === 'INPUT' && !['checkbox', 'radio', 'range', 'submit', 'button', 'file', 'color'].includes(type)))) {
                    setIsInputFocused(false);
                }
            }, 100);
        };

        window.addEventListener('focus', handleFocus, true);
        window.addEventListener('blur', handleBlur, true);
        return () => {
            window.removeEventListener('focus', handleFocus, true);
            window.removeEventListener('blur', handleBlur, true);
        };
    }, []);

    // Load from URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.toString()) {
            if (params.get('d')) setDob(params.get('d').replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));
            if (params.get('r')) setRetirementAge(parseInt(params.get('r')));
            const yic = params.get('y');
            if (yic) {
                const yicVal = parseInt(yic);
                setYearsInCanada(yicVal);
                if (yicVal < 40) setLivedInCanadaAllLife(false);
            }
            if (params.get('s')) setAvgSalaryInput(parseInt(params.get('s'), 36).toString());
            if (params.get('o')) setOtherIncome(parseInt(params.get('o'), 36).toString());
            if (params.get('m') === '1') setIsMarried(true);
            if (params.get('sd')) setSpouseDob(params.get('sd').replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));
            if (params.get('si')) setSpouseIncome(parseInt(params.get('si'), 36).toString());
            if (params.get('fa') === '1') setForceAllowance(true);
            const earningsStr = params.get('e');
            const dobParam = params.get('d');
            if (earningsStr && dobParam) {
                const bYear = parseInt(dobParam.substring(0, 4));
                setEarnings(decompressEarnings(earningsStr, bYear));
            }
        }
    }, []);

    const copyLink = () => {
        const params = new URLSearchParams();
        params.set('d', dob.replace(/-/g,'')); 
        params.set('r', retirementAge);
        params.set('y', yearsInCanada);
        if (avgSalaryInput) params.set('s', parseInt(avgSalaryInput).toString(36));
        if (otherIncome) params.set('o', parseInt(otherIncome).toString(36));
        if (isMarried) {
            params.set('m', '1');
            params.set('sd', spouseDob.replace(/-/g,''));
            if (spouseIncome) params.set('si', parseInt(spouseIncome).toString(36));
            if (forceAllowance) params.set('fa', '1');
        }
        const compressedEarn = compressEarnings(earnings, birthYear);
        if (compressedEarn) params.set('e', compressedEarn);
        const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
        navigator.clipboard.writeText(url).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        });
    };

    const handleImport = (importedData) => {
        // The modal now does the work. We just receive the clean object!
        if (importedData) {
            setEarnings(prev => ({ ...prev, ...importedData })); 
            setShowImport(false); 
            setImportText(""); 
        }
    };
    
    const applyAverageSalary = () => {
        if (!avgSalaryInput || avgSalaryInput <= 0) return;
        
        const currentYMPE = getYMPE(CURRENT_YEAR);
        // Calculate the user's "Peak Earning Power" relative to the average Canadian
        const peakRatio = parseFloat(avgSalaryInput) / currentYMPE;

        setEarnings(prev => {
            const newEarnings = { ...prev };
            
            // Define a simple curve function
            const getAgeFactor = (age) => {
                if (age < 22) return 0.3;  // Part-time / Student
                if (age < 25) return 0.6;  // Entry Level
                if (age < 30) return 0.8;  // Junior/Mid
                if (age < 35) return 0.9;  // Senior
                return 1.0;                // Peak (35+)
            };

            results.years.forEach(year => {
                const age = year - birthYear;
                
                // Only overwrite if: 
                // 1. It's a future year (projection)
                // 2. OR it's a past year that the user hasn't manually entered yet
                const isFuture = year >= CURRENT_YEAR;
                const isEmpty = newEarnings[year] === undefined;

                if (isFuture || isEmpty) {
                    const yYMPE = getYMPE(year);
                    const ageFactor = isFuture ? 1.0 : getAgeFactor(age); // Assume peak for future, curve for past
                    
                    // The calculation: Year's Average Wage * Your Peak Ratio * Age Adjustment
                    newEarnings[year] = Math.round(yYMPE * peakRatio * ageFactor);
                }
            });
            return newEarnings;
        });
    };

    const saveComparison = () => {
        setComparisonSnapshot({
            age: retirementAge,
            monthly: results.grandTotal,
            breakevenData: results.breakevenData 
        });
    };
    
    const clearComparison = () => setComparisonSnapshot(null);

    let comparisonMsg = null;
    if (comparisonSnapshot && comparisonSnapshot.age !== retirementAge) {
        const currentData = results.breakevenData;
        const snapshotData = comparisonSnapshot.breakevenData;
        const isCurrentLater = retirementAge > comparisonSnapshot.age;
        const lateAge = isCurrentLater ? retirementAge : comparisonSnapshot.age;
        const earlyAge = isCurrentLater ? comparisonSnapshot.age : retirementAge;
        let foundCrossover = null;

        for (let i = 0; i < currentData.length; i++) {
            const age = currentData[i].age;
            if (age <= lateAge) continue; 
            const currentTotal = currentData[i].Selected;
            const snapshotTotal = snapshotData.find(d => d.age === age)?.Selected || 0;
            if (isCurrentLater) { if (currentTotal > snapshotTotal) { foundCrossover = age; break; } } 
            else { if (snapshotTotal > currentTotal) { foundCrossover = age; break; } }
        }

        if (foundCrossover) {
            comparisonMsg = <span className="text-slate-700"><strong>Age {lateAge}</strong> beats <strong>Age {earlyAge}</strong> if you live past <span className="text-lg font-bold text-indigo-700">{foundCrossover}</span>.</span>;
        } else {
            comparisonMsg = <span className="text-slate-400 italic"><strong>Age {lateAge}</strong> never catches up to <strong>Age {earlyAge}</strong> by age 95.</span>;
        }
    }

    const inflationFactor = useFutureDollars ? Math.pow(1.025, retirementAge - (CURRENT_YEAR - birthYear)) : 1;
    const taxFactor = showNet ? (1 - TAX_RATE) : 1; 
    
    // --- SAFE CALCULATIONS ---
    // We access results.cpp.total safely because we forced defaults in step 6
    const displayTotal = (results.grandTotal || 0) * inflationFactor * taxFactor;
    const displayCPP = (results.cpp.total || 0) * inflationFactor * taxFactor;
    const displayOAS = (results.oas.total || 0) * inflationFactor * taxFactor;
    const displayGIS = (results.gis.total || 0) * inflationFactor * taxFactor;

    const totalRaw = displayTotal || 1; 
    const cppPerc = (displayCPP / totalRaw) * 100;
    const oasPerc = (displayOAS / totalRaw) * 100;
    const gisPerc = (displayGIS / totalRaw) * 100;

    const hasEarnings = Object.keys(earnings).length > 0;

    return (
        <div 
            className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700"
            style={{ paddingBottom: activeTab === 'input' ? '200px' : '60px' }}
        > 
            {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
            
            {showImport && (
                <ImportModal 
                    onClose={() => setShowImport(false)}
                    importText={importText}
                    setImportText={setImportText}
                    importError={importError}
                    onImport={handleImport}
                />
            )}

            {/* MAIN CONTENT */}
            <main className="max-w-5xl mx-auto p-4 md:p-8 w-full">
                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden mb-12">
                    {/* TABS HEADER */}
                    <div className="p-2 bg-slate-50 border-b border-slate-200">
                        <div className="flex bg-slate-200/50 p-1 rounded-xl">
                            <button onClick={() => setActiveTab('input')} className={`flex-1 py-2.5 text-sm font-bold text-center rounded-lg transition-all duration-200 ${activeTab === 'input' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>1. Earnings & Inputs</button>
                            <button onClick={() => setActiveTab('results')} className={`flex-1 py-2.5 text-sm font-bold text-center rounded-lg transition-all duration-200 ${activeTab === 'results' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>2. View Estimate</button>
                        </div>
                    </div>

                    <div className="p-6 md:p-8">
                        {activeTab === 'input' && (
                            <InputTab 
                                dob={dob} setDob={setDob}
                                retirementAge={retirementAge} setRetirementAge={setRetirementAge}
                                isMarried={isMarried} setIsMarried={setIsMarried}
                                spouseDob={spouseDob} setSpouseDob={setSpouseDob}
                                spouseIncome={spouseIncome} setSpouseIncome={setSpouseIncome}
                                showChildren={showChildren} setShowChildren={setShowChildren}
                                children={children} setChildren={setChildren}
                                livedInCanadaAllLife={livedInCanadaAllLife} setLivedInCanadaAllLife={setLivedInCanadaAllLife}
                                yearsInCanada={yearsInCanada} setYearsInCanada={setYearsInCanada}
                                otherIncome={otherIncome} setOtherIncome={setOtherIncome}
                                earnings={earnings} setEarnings={setEarnings}
                                avgSalaryInput={avgSalaryInput} setAvgSalaryInput={setAvgSalaryInput}
                                applyAverageSalary={applyAverageSalary}
                                setShowImport={setShowImport}
                                hasEarnings={hasEarnings}
                                showGrid={showGrid} setShowGrid={setShowGrid}
                                results={results} birthYear={birthYear}
                            />
                        )}

                        {activeTab === 'results' && (
                            <ResultsTab 
                                results={results} hasEarnings={hasEarnings} setActiveTab={setActiveTab} birthYear={birthYear}
                                copyLink={copyLink} copySuccess={copySuccess}
                                displayTotal={displayTotal} displayCPP={displayCPP} displayOAS={displayOAS} displayGIS={displayGIS}
                                cppPerc={cppPerc} oasPerc={oasPerc} gisPerc={gisPerc}
                                retirementAge={retirementAge} setRetirementAge={setRetirementAge}
                                comparisonSnapshot={comparisonSnapshot} saveComparison={saveComparison} clearComparison={clearComparison} comparisonMsg={comparisonMsg}
                                inflationFactor={inflationFactor} taxFactor={taxFactor}
                                chartSelection={chartSelection} setChartSelection={setChartSelection}
                                lineVisibility={lineVisibility} setLineVisibility={setLineVisibility}
                            />
                        )}
                    </div>
                </div>
                <div style={{ height: '140px' }}></div> 
            </main>

            {/* FLOATING FOOTER */}
            {activeTab === 'input' && mounted && !isInputFocused && createPortal(
                <div 
                    className="fixed bottom-[64px] md:bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 p-3 shadow-[0_-15px_40px_-10px_rgba(0,0,0,0.15)] z-[9999] animate-slide-up"
                    // IMPORTANT: Removed 'bottom: 0' inline style here
                    style={{ width: '100%' }}
                >
                    <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
                        <div className="flex flex-col pl-2">
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-3xl font-black text-slate-900 leading-none tracking-tighter">
                                    ${displayTotal.toLocaleString('en-CA', { maximumFractionDigits: 0 })}
                                </span>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">/mo</span>
                            </div>
                            <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest leading-none mt-2 drop-shadow-sm">Forecast @ Age {retirementAge}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={copyLink}
                                className="p-4 rounded-2xl border-2 border-slate-100 text-slate-500 hover:bg-slate-50 active:bg-slate-200 transition-all flex items-center justify-center shadow-sm"
                            >
                                {copySuccess ? <CheckIcon size={22} className="text-emerald-500" /> : <LinkIcon size={22} />}
                            </button>
                            <button 
                                onClick={() => {
                                    setActiveTab('results');
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }} 
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center gap-3 active:scale-95"
                            >
                                <span className="text-[10px] uppercase tracking-[0.2em] font-black">Analyze</span>
                                <ArrowRightIcon size={20} />
                            </button>
                        </div>
                    </div>
                </div>,
                document.body 
            )}
        </div>
    );
}