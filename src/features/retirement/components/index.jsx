import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRetirementMath } from '../hooks/useRetirementMath';
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
    { label: 'Defer CPP', value: 'I make $75k. How much more do I get if I retire at 70 instead of 65?' }
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
    const [mounted, setMounted] = useState(false); 
    
    // --- INPUT STATE ---
    const [avgSalaryInput, setAvgSalaryInput] = useState(() => memory.grossIncome ? String(memory.grossIncome) : initialIncome ? String(initialIncome) : '');
    const [otherIncome, setOtherIncome] = useState(''); 
    const [livedInCanadaAllLife, setLivedInCanadaAllLife] = useState(initialYearsInCanada >= 40); 
    const [showChildren, setShowChildren] = useState(false);
    const [showGrid, setShowGrid] = useState(false);
    const [showNet, setShowNet] = useState(false);
    const [aiInsight, setAiInsight] = useState('');
    const [spouseIncome, setSpouseIncome] = useState(initialSpouseIncome ? String(initialSpouseIncome) : '');
    const [forceAllowance, setForceAllowance] = useState(false);

    // UI State
    const [showAbout, setShowAbout] = useState(false);
    const [showImport, setShowImport] = useState(false);
    const [importText, setImportText] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);
    const [comparisonSnapshot, setComparisonSnapshot] = useState(null);

    const birthYear = parseInt(dob.split('-')[0]);
    const results = useRetirementMath({ earnings, dob, retirementAge, children });
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
        if (typeof updates.dob !== 'undefined') updateDOB(updates.dob);
        if (updates.avgSalaryInput !== undefined) updateIncome(String(updates.avgSalaryInput));
        if (updates.earningsUpdate) { setEarnings(prev => ({ ...prev, ...updates.earningsUpdate })); setShowGrid(true); }
        if (updates.strategy_insight) setAiInsight(updates.strategy_insight);
    }, [updateMemory, earnings, results.years, birthYear]);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 flex flex-col min-h-0" style={{ paddingBottom: '60px' }}> 
            <main className="max-w-5xl mx-auto p-4 md:p-8 w-full mt-6">
                {/* AI HERO SECTION (Hidden for Copilot)
                <AICommandBar endpoint="/api/ai/retirement" suggestions={RETIREMENT_SUGGESTIONS} onUpdate={handleAIUpdate} context={{ dob, retirementAge, yearsInCanada }} globalMemory={memory} />
                <StrategyCard insight={aiInsight} />
                */}

                {/* AI Copilot Persistent Sidebar/Bottom-sheet */}
                <AICopilot 
                    onUpdate={handleAIUpdate}
                    context={{ calculatorId: 'retirement', dob, retirementAge, yearsInCanada, avgSalaryInput, childCount: children.length }}
                    globalMemory={memory}
                />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Inputs */}
                    <div className="lg:col-span-5 space-y-6">
                        <InputTab 
                            dob={dob} setDob={updateDOB} retirementAge={retirementAge} setRetirementAge={setRetirementAge}
                            showChildren={showChildren} setShowChildren={setShowChildren}
                            children={children} setChildren={setChildren}
                            earnings={earnings} setEarnings={setEarnings} avgSalaryInput={avgSalaryInput} setAvgSalaryInput={updateIncome}
                            results={results} birthYear={birthYear} displayTotal={displayValues.displayTotal} copyLink={() => {}} copySuccess={copySuccess}
                            isVisible={isVisible} mounted={mounted}
                            hasEarnings={Object.keys(earnings).length > 0} showGrid={showGrid} setShowGrid={setShowGrid}
                            applyAverageSalary={() => setEarnings(applyAverageSalary({}, avgSalaryInput, results.years, birthYear))}
                            setShowImport={setShowImport}
                        />

                        {showImport && (
                            <ImportModal 
                                onClose={() => setShowImport(false)} 
                                importText={importText} 
                                setImportText={setImportText} 
                                onImport={(data) => {
                                    setEarnings(data);
                                    setShowImport(false);
                                    setImportText('');
                                }} 
                            />
                        )}
                    </div>

                    {/* Right Column: Visualization & Metrics */}
                    <div className="lg:col-span-7 space-y-6">
                        <ResultsTab 
                            results={results} hasEarnings={Object.keys(earnings).length > 0} birthYear={birthYear}
                            copyLink={() => {}} copySuccess={copySuccess} displayTotal={displayValues.displayTotal} displayCPP={displayValues.displayCPP}
                            cppPerc={displayValues.cppPerc}
                            retirementAge={retirementAge} setRetirementAge={setRetirementAge}
                            comparisonSnapshot={comparisonSnapshot} saveComparison={() => {}} clearComparison={() => {}} comparisonData={{}}
                            inflationFactor={1} taxFactor={1} chartSelection={null} setChartSelection={() => {}}
                            lineVisibility={{Early:true, Standard:true, Deferred:true, Selected:true}} setLineVisibility={() => {}}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
