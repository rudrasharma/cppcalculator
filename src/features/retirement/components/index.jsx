import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRetirementMath } from '../hooks/useRetirementMath';
import { useUrlTab } from '../../../hooks/useUrlTab';
import { applyAverageSalary, calculateDisplayValues, calculateComparisonMessage } from '../utils/retirementHelpers';
import { loadStateFromUrl, syncStateToUrl } from '../utils/urlSync';
import { AboutModal, ImportModal } from './Modals';
import InputTab from './InputTab';
import ResultsTab from './ResultsTab';

export default function Calculator({ 
    isVisible = true,
    initialRetirementAge = 65,
    initialYearsInCanada = 40,
    initialIncome = '',
    initialMaritalStatus = false,
    initialSpouseIncome = '',
    initialChildCount = 0,
    initialDob = '1985-01-01'
}) {
    
    // --- CORE STATE ---
    const [children, setChildren] = useState(() => {
        if (initialChildCount > 0) {
            return Array.from({ length: initialChildCount }).map((_, i) => ({
                id: Date.now() + i,
                birthDate: '1990-01-01', 
                disability: false
            }));
        }
        return [];
    });

    const [dob, setDob] = useState(initialDob);
    const [retirementAge, setRetirementAge] = useState(initialRetirementAge);
    const [yearsInCanada, setYearsInCanada] = useState(initialYearsInCanada);
    const [earnings, setEarnings] = useState({});
    const [activeTab, setActiveTab] = useUrlTab('input', 'step');
    const [mounted, setMounted] = useState(false); 
    
    // --- INPUT STATE ---
    const [avgSalaryInput, setAvgSalaryInput] = useState(initialIncome ? initialIncome.toString() : '');
    const [otherIncome, setOtherIncome] = useState(''); 
    const [livedInCanadaAllLife, setLivedInCanadaAllLife] = useState(initialYearsInCanada >= 40); 
    const [isMarried, setIsMarried] = useState(initialMaritalStatus);
    const [showChildren, setShowChildren] = useState(initialChildCount > 0);
    const [showGrid, setShowGrid] = useState(false);
    const [showNet, setShowNet] = useState(false);
    const TAX_RATE = 0.15; 

    const [spouseDob, setSpouseDob] = useState('1985-01-01');
    const [spouseIncome, setSpouseIncome] = useState(initialSpouseIncome ? initialSpouseIncome.toString() : '');
    const [forceAllowance, setForceAllowance] = useState(false);

    // --- UI STATE ---
    const [showAbout, setShowAbout] = useState(false);
    const [useFutureDollars, setUseFutureDollars] = useState(false);
    const [showImport, setShowImport] = useState(false);
    const [importText, setImportText] = useState("");
    const [importError, setImportError] = useState("");
    const [chartSelection, setChartSelection] = useState(null);
    const [lineVisibility, setLineVisibility] = useState({
        Early: true, Standard: true, Deferred: true, Selected: true
    });
    const [copySuccess, setCopySuccess] = useState(false);
    const [comparisonSnapshot, setComparisonSnapshot] = useState(null);

    const birthYear = parseInt(dob.split('-')[0]);

    // --- CALCULATION HOOK ---
    const rawResults = useRetirementMath({
        earnings, dob, retirementAge, yearsInCanada, otherIncome,
        isMarried, spouseDob, spouseIncome, forceAllowance, children
    });

    const results = {
        grandTotal: 0,
        years: [],
        cpp: { base: 0, enhanced: 0, total: 0 },
        oas: { gross: 0, clawback: 0, total: 0 },
        gis: { total: 0, note: '' },
        breakevenData: [],
        crossovers: {},
        ...rawResults 
    };

    // --- DISPLAY CALCULATIONS ---
    const displayValues = useMemo(() => 
        calculateDisplayValues(results, useFutureDollars, showNet, retirementAge, birthYear, TAX_RATE),
        [results, useFutureDollars, showNet, retirementAge, birthYear]
    );

    // --- COMPARISON LOGIC ---
    const comparisonData = useMemo(() => 
        calculateComparisonMessage(
            comparisonSnapshot, 
            retirementAge, 
            results.breakevenData, 
            comparisonSnapshot?.breakevenData || []
        ),
        [comparisonSnapshot, retirementAge, results.breakevenData]
    );

    // --- EFFECTS ---
    useEffect(() => { setMounted(true); }, []);
    
    useEffect(() => { 
        if (livedInCanadaAllLife && yearsInCanada !== 40) setYearsInCanada(40); 
    }, [livedInCanadaAllLife]);
    
    useEffect(() => { 
        if (!showChildren && children.length > 0) setChildren([]); 
    }, [showChildren]);

    useEffect(() => {
        if (initialIncome && Object.keys(earnings).length === 0 && results.years.length > 0) {
            const newEarnings = applyAverageSalary(earnings, avgSalaryInput, results.years, birthYear);
            setEarnings(newEarnings);
        }
    }, [initialIncome, results.years.length, avgSalaryInput, birthYear]);

    // --- URL SYNC ---
    useEffect(() => {
        const urlState = loadStateFromUrl({
            dob: initialDob,
            retirementAge: initialRetirementAge,
            yearsInCanada: initialYearsInCanada,
            avgSalaryInput: initialIncome ? initialIncome.toString() : '',
            otherIncome: '',
            isMarried: initialMaritalStatus,
            spouseDob: '1985-01-01',
            spouseIncome: initialSpouseIncome ? initialSpouseIncome.toString() : '',
            forceAllowance: false,
            earnings: {},
            livedInCanadaAllLife: initialYearsInCanada >= 40
        });
        
        setDob(urlState.dob);
        setRetirementAge(urlState.retirementAge);
        setYearsInCanada(urlState.yearsInCanada);
        setLivedInCanadaAllLife(urlState.livedInCanadaAllLife);
        setAvgSalaryInput(urlState.avgSalaryInput);
        setOtherIncome(urlState.otherIncome);
        setIsMarried(urlState.isMarried);
        setSpouseDob(urlState.spouseDob);
        setSpouseIncome(urlState.spouseIncome);
        setForceAllowance(urlState.forceAllowance);
        setEarnings(urlState.earnings);
    }, []);

    useEffect(() => {
        syncStateToUrl({
            dob, retirementAge, yearsInCanada, avgSalaryInput, otherIncome,
            isMarried, spouseDob, spouseIncome, forceAllowance, earnings
        }, birthYear);
    }, [dob, retirementAge, yearsInCanada, avgSalaryInput, otherIncome, isMarried, spouseDob, spouseIncome, forceAllowance, earnings, birthYear]);

    // --- HANDLERS ---
    const copyLink = useCallback(() => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        });
    }, []);

    const handleImport = (importedData) => {
        if (importedData) {
            setEarnings(prev => ({ ...prev, ...importedData })); 
            setShowImport(false); 
            setImportText(""); 
        }
    };
    
    const handleApplyAverageSalary = useCallback(() => {
        const newEarnings = applyAverageSalary(earnings, avgSalaryInput, results.years, birthYear);
        setEarnings(newEarnings);
    }, [earnings, avgSalaryInput, results.years, birthYear]);

    const saveComparison = () => {
        setComparisonSnapshot({
            age: retirementAge,
            monthly: results.grandTotal,
            breakevenData: results.breakevenData 
        });
    };
    
    const clearComparison = () => setComparisonSnapshot(null);

    const hasEarnings = Object.keys(earnings).length > 0;

    return (
        <div 
            className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700"
            style={{ paddingBottom: activeTab === 'input' ? '100px' : '60px' }}
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

            <main className="max-w-5xl mx-auto p-4 md:p-8 w-full">
                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden mb-12">
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
                                applyAverageSalary={handleApplyAverageSalary}
                                setShowImport={setShowImport}
                                hasEarnings={hasEarnings}
                                showGrid={showGrid} setShowGrid={setShowGrid}
                                results={results} birthYear={birthYear}
                                displayTotal={displayValues.displayTotal}
                                copyLink={copyLink}
                                copySuccess={copySuccess}
                                setActiveTab={setActiveTab}
                                isVisible={isVisible}
                                mounted={mounted}
                            />
                        )}

                        {activeTab === 'results' && (
                            <ResultsTab 
                                results={results} hasEarnings={hasEarnings} setActiveTab={setActiveTab} birthYear={birthYear}
                                copyLink={copyLink} copySuccess={copySuccess}
                                displayTotal={displayValues.displayTotal} displayCPP={displayValues.displayCPP} displayOAS={displayValues.displayOAS} displayGIS={displayValues.displayGIS}
                                cppPerc={displayValues.cppPerc} oasPerc={displayValues.oasPerc} gisPerc={displayValues.gisPerc}
                                retirementAge={retirementAge} setRetirementAge={setRetirementAge}
                                comparisonSnapshot={comparisonSnapshot} saveComparison={saveComparison} clearComparison={clearComparison} comparisonData={comparisonData}
                                inflationFactor={displayValues.inflationFactor} taxFactor={displayValues.taxFactor}
                                chartSelection={chartSelection} setChartSelection={setChartSelection}
                                lineVisibility={lineVisibility} setLineVisibility={setLineVisibility}
                            />
                        )}
                    </div>
                </div>
                <div style={{ height: '140px' }}></div> 
            </main>
        </div>
    );
}
