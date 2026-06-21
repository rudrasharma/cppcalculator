import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRetirementMath } from '../hooks/useRetirementMath';
import { useUrlTab } from '../../../hooks/useUrlTab';
import { applyAverageSalary, calculateDisplayValues, calculateComparisonMessage } from '../utils/retirementHelpers';
import { loadStateFromUrl, syncStateToUrl } from '../utils/urlSync';
import { AboutModal, ImportModal } from './Modals';
import InputTab from './InputTab';
import ResultsTab from './ResultsTab';
import { AICommandBar, StrategyCard, AICopilot } from '../../../components/shared';
import { useFinancialMemory } from '../../../hooks/useFinancialMemory';

const RETIREMENT_SUGGESTIONS = [
    { label: 'Stop Working at 55', value: 'I turn 40 this year and make $100k. What if I stop working at age 55?' },
    { label: 'Gap Years', value: 'I make $80k but I didn’t work at all from ages 20 to 25.' },
    { label: 'Defer OAS/CPP', value: 'I make $75k. How much more do I get if I retire at 70 instead of 65?' }
];

export default function Calculator({ 
    isVisible = true, initialRetirementAge = 65, initialYearsInCanada = 40, initialIncome = '', initialMaritalStatus = false, initialSpouseIncome = '', initialChildCount = 0, initialDob = '1985-01-01'
}) {
    const { memory, updateMemory } = useFinancialMemory();
    
    // --- CORE STATE ---
    const [children, setChildren] = useState([]);
    const [dob, setDob] = useState(() => memory.dob || initialDob);
    const [retirementAge, setRetirementAge] = useState(initialRetirementAge);
    const [yearsInCanada, setYearsInCanada] = useState(() => memory.yearsInCanada || initialYearsInCanada);
    const [earnings, setEarnings] = useState({});
    const [activeTab, setActiveTab] = useUrlTab('input', 'step');
    const [mounted, setMounted] = useState(false); 
    
    // --- INPUT STATE ---
    const [avgSalaryInput, setAvgSalaryInput] = useState(() => memory.grossIncome ? String(memory.grossIncome) : initialIncome ? String(initialIncome) : '');
    const [otherIncome, setOtherIncome] = useState(''); 
    const [livedInCanadaAllLife, setLivedInCanadaAllLife] = useState(initialYearsInCanada >= 40); 
    const [isMarried, setIsMarried] = useState(() => memory.maritalStatus === 'MARRIED' || initialMaritalStatus);
    const [showChildren, setShowChildren] = useState(false);
    const [showGrid, setShowGrid] = useState(false);
    const [showNet, setShowNet] = useState(false);
    const [aiInsight, setAiInsight] = useState('');
    const [spouseDob, setSpouseDob] = useState('1985-01-01');
    const [spouseIncome, setSpouseIncome] = useState(initialSpouseIncome ? String(initialSpouseIncome) : '');
    const [forceAllowance, setForceAllowance] = useState(false);

    // UI State
    const [showAbout, setShowAbout] = useState(false);
    const [showImport, setShowImport] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [comparisonSnapshot, setComparisonSnapshot] = useState(null);

    const birthYear = parseInt(dob.split('-')[0]);
    const results = useRetirementMath({ earnings, dob, retirementAge, yearsInCanada, otherIncome, isMarried, spouseDob, spouseIncome, forceAllowance, children });
    const displayValues = useMemo(() => calculateDisplayValues(results, false, showNet, retirementAge, birthYear, 0.15), [results, showNet, retirementAge, birthYear]);

    useEffect(() => { setMounted(true); }, []);

    // --- EXPLICIT SETTERS ---
    const updateProvince = (val) => { updateMemory({ province: val }); };
    const updateDOB = (val) => { setDob(val); updateMemory({ dob: val }); };
    const updateIncome = (val) => { 
        setAvgSalaryInput(val); 
        updateMemory({ grossIncome: parseFloat(val) || 0 }); 
        if (val && results.years?.length > 0) {
            setEarnings(applyAverageSalary(earnings, val, results.years, birthYear));
        }
    };
    const updateMarital = (val) => { setIsMarried(val); updateMemory({ maritalStatus: val ? 'MARRIED' : 'SINGLE' }); };

    // Hydration Effect
    useEffect(() => {
        if (initialIncome && Object.keys(earnings).length === 0 && results.years.length > 0) {
            const hIncome = memory.grossIncome ? String(memory.grossIncome) : String(initialIncome);
            setEarnings(applyAverageSalary({}, hIncome, results.years, birthYear));
        }
    }, [results.years.length]);

    const handleAIUpdate = useCallback((updates) => {
        if (updates.retirementAge) setRetirementAge(Number(updates.retirementAge));
        if (updates.dob) updateDOB(updates.dob);
        if (typeof updates.isMarried !== 'undefined') updateMarital(updates.isMarried);
        if (updates.avgSalaryInput !== undefined) updateIncome(String(updates.avgSalaryInput));
        if (updates.earningsUpdate) { setEarnings(prev => ({ ...prev, ...updates.earningsUpdate })); setShowGrid(true); }
        if (updates.strategy_insight) setAiInsight(updates.strategy_insight);
    }, [updateMemory, earnings, results.years, birthYear]);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 flex flex-col min-h-0" style={{ paddingBottom: activeTab === 'input' ? '100px' : '60px' }}> 
            <main className="max-w-5xl mx-auto p-4 md:p-8 w-full mt-6">
                {/* AI HERO SECTION (Hidden for Copilot)
                <AICommandBar endpoint="/api/ai/retirement" suggestions={RETIREMENT_SUGGESTIONS} onUpdate={handleAIUpdate} context={{ dob, retirementAge, isMarried, yearsInCanada }} globalMemory={memory} />
                <StrategyCard insight={aiInsight} />
                */}

                {/* AI Copilot Persistent Sidebar/Bottom-sheet */}
                <AICopilot 
                    onUpdate={handleAIUpdate}
                    context={{ calculatorId: 'retirement', dob, retirementAge, yearsInCanada, isMarried, avgSalaryInput, spouseIncome, childCount: children.length }}
                    globalMemory={memory}
                />
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mb-12">
                    <div className="p-2 bg-slate-50 border-b border-slate-200">
                        <div className="flex bg-slate-200/50 p-1 rounded-xl">
                            <button onClick={() => setActiveTab('input')} className={`flex-1 py-2.5 text-sm font-bold text-center rounded-lg transition-all ${activeTab === 'input' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>1. Profile & History</button>
                            <button onClick={() => setActiveTab('results')} className={`flex-1 py-2.5 text-sm font-bold text-center rounded-lg transition-all ${activeTab === 'results' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>2. View Estimate</button>
                        </div>
                    </div>
                    <div className="p-6 md:p-8">
                        {activeTab === 'input' && (
                            <InputTab 
                                dob={dob} setDob={updateDOB} retirementAge={retirementAge} setRetirementAge={setRetirementAge}
                                isMarried={isMarried} setIsMarried={updateMarital} spouseDob={spouseDob} setSpouseDob={setSpouseDob}
                                spouseIncome={spouseIncome} setSpouseIncome={setSpouseIncome} showChildren={showChildren} setShowChildren={setShowChildren}
                                children={children} setChildren={setChildren} livedInCanadaAllLife={livedInCanadaAllLife} setLivedInCanadaAllLife={setLivedInCanadaAllLife}
                                yearsInCanada={yearsInCanada} setYearsInCanada={setYearsInCanada} otherIncome={otherIncome} setOtherIncome={setOtherIncome}
                                earnings={earnings} setEarnings={setEarnings} avgSalaryInput={avgSalaryInput} setAvgSalaryInput={updateIncome}
                                results={results} birthYear={birthYear} displayTotal={displayValues.displayTotal} copyLink={() => {}} copySuccess={copySuccess}
                                setActiveTab={setActiveTab} isVisible={isVisible} mounted={mounted}
                                hasEarnings={Object.keys(earnings).length > 0} showGrid={showGrid} setShowGrid={setShowGrid}
                                applyAverageSalary={() => setEarnings(applyAverageSalary(earnings, avgSalaryInput, results.years, birthYear))}
                                setShowImport={setShowImport}
                            />
                        )}
                        {activeTab === 'results' && (
                            <ResultsTab 
                                results={results} hasEarnings={Object.keys(earnings).length > 0} setActiveTab={setActiveTab} birthYear={birthYear}
                                copyLink={() => {}} copySuccess={copySuccess} displayTotal={displayValues.displayTotal} displayCPP={displayValues.displayCPP}
                                displayOAS={displayValues.displayOAS} displayGIS={displayValues.displayGIS} cppPerc={displayValues.cppPerc}
                                oasPerc={displayValues.oasPerc} gisPerc={displayValues.gisPerc} retirementAge={retirementAge} setRetirementAge={setRetirementAge}
                                comparisonSnapshot={comparisonSnapshot} saveComparison={() => {}} clearComparison={() => {}} comparisonData={{}}
                                inflationFactor={1} taxFactor={1} chartSelection={null} setChartSelection={() => {}}
                                lineVisibility={{Early:true, Standard:true, Deferred:true, Selected:true}} setLineVisibility={() => {}}
                            />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
