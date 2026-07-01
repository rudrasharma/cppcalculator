import React, { useState, useMemo } from 'react';
import { calculateSmithManoeuvre } from '../utils/smithEngine';
import { SmithInputs } from './SmithInputs';
import { SmithMetrics } from './SmithMetrics';
import { SmithCharts } from './SmithCharts';
import { SmithAuditTable } from './SmithAuditTable';
import { SmithNarrative } from './SmithNarrative';
import { ScaleIcon, RotateCcwIcon, AICommandBar, StrategyCard, AICopilot, Accordion, ExternalLinkIcon, DollarSignIcon } from '../../../components/shared';
import { useFinancialMemory } from '../../../hooks/useFinancialMemory';

const SMITH_SUGGESTIONS = [
    { label: 'Basic Strategy', value: 'I have a $400k mortgage at 4% and a $600k home. My tax rate is 35%.' },
    { label: 'Initial Lump Sum', value: 'Buying for $750k with 20% down. What if I invest an extra $50k from HELOC today?' },
    { label: 'Accelerator', value: 'I want to re-invest my tax refunds into my mortgage to pay it off faster.' }
];

export default function SmithCalculator({ isVisible = true }) {
    const { memory, updateMemory } = useFinancialMemory();
    // 1. Initial State
    const [hVal, setHValueState] = useState(() => memory.homeValue || 600000);
    const [mBal, setMBalanceState] = useState(() => memory.mortgageBalance || 400000);
    const [mRate, setMRate] = useState(0.045);
    const [hRate, setHRate] = useState(0.055);
    const [tRate, setTRate] = useState(0.35);
    
    const [gRate, setGRate] = useState(0.05);
    const [dYield, setDYield] = useState(0.02);
    const [dTax, setDTax] = useState(0.15);
    const [dAlloc, setDAlloc] = useState('portfolio');
    const [aYears, setAYears] = useState(25);
    const [lumpSum, setLumpSum] = useState(0);
    const [tolerance, setTolerance] = useState(1.0);
    const [tAlloc, setTAlloc] = useState('portfolio');
    const [capInt, setCapInt] = useState(true);

    const [aiInsight, setAiInsight] = useState('');
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Sync wrappers
    const setHValue = (val) => { setHValueState(val); updateMemory({ homeValue: val }); };
    const setMBalance = (val) => { setMBalanceState(val); updateMemory({ mortgageBalance: val }); };

    // Sync state with memory after initial hydration or external updates
    React.useEffect(() => {
        if (memory.homeValue !== undefined && memory.homeValue !== null) setHValueState(prev => prev !== memory.homeValue ? memory.homeValue : prev);
        if (memory.mortgageBalance !== undefined && memory.mortgageBalance !== null) setMBalanceState(prev => prev !== memory.mortgageBalance ? memory.mortgageBalance : prev);
    }, [memory]);

    // 2. Computed Input Object
    const inputsForEngine = useMemo(() => ({
        homeValue: hVal,
        mortgageBalance: mBal,
        mortgageRate: mRate,
        helocRate: hRate,
        marginalTaxRate: tRate,
        capitalGainsRate: gRate,
        dividendYield: dYield,
        dividendTaxRate: dTax,
        dividendAllocation: dAlloc,
        amortizationYears: aYears,
        initialHelocLumpSum: lumpSum,
        readvanceTolerance: tolerance,
        taxRefundAllocation: tAlloc,
        capitalizeInterest: capInt
    }), [hVal, mBal, mRate, hRate, tRate, gRate, dYield, dTax, dAlloc, aYears, lumpSum, tolerance, tAlloc, capInt]);

    const data = useMemo(() => calculateSmithManoeuvre(inputsForEngine), [inputsForEngine]);
    const finalData = data[data.length - 1];
    const totalAdvantage = finalData.smithNetWorth - finalData.standardNetWorth;
    const annualData = useMemo(() => data.filter(r => r.month % 12 === 0), [data]);

    const currencyFormatter = useMemo(() => new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD',
        maximumFractionDigits: 0
    }), []);

    const handleExportCSV = () => {
        const headers = ["Year", "Standard Mortgage", "Smith HELOC", "Annual Refund", "Smith Net Worth", "Standard Net Worth", "Net Advantage"];
        const rows = annualData.map(r => [
            r.month / 12,
            r.standardMortgageBalance,
            r.smithHelocBalance,
            r.annualTaxRefund,
            r.smithNetWorth,
            r.standardNetWorth,
            r.smithNetWorth - r.standardNetWorth
        ]);
        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `smith_manoeuvre_projection.csv`;
        link.click();
    };

    if (!isVisible) return null;

    const handleAIUpdate = (args) => {
        if (args.homeValue !== undefined) setHValue(args.homeValue);
        if (args.mortgageBalance !== undefined) setMBalance(args.mortgageBalance);
        if (args.mortgageRate !== undefined) setMRate(args.mortgageRate);
        if (args.helocRate !== undefined) setHRate(args.helocRate);
        if (args.marginalTaxRate !== undefined) setTRate(args.marginalTaxRate);
        if (args.capitalGainsRate !== undefined) setGRate(args.capitalGainsRate);
        if (args.dividendYield !== undefined) setDYield(args.dividendYield);
        if (args.dividendTaxRate !== undefined) setDTax(args.dividendTaxRate);
        if (args.amortizationYears !== undefined) setAYears(args.amortizationYears);
        if (args.initialHelocLumpSum !== undefined) setLumpSum(args.initialHelocLumpSum);
        if (args.readvanceTolerance !== undefined) setTolerance(args.readvanceTolerance);
        if (args.capitalizeInterest !== undefined) setCapInt(args.capitalizeInterest);
        if (args.taxRefundAllocation) setTAlloc(args.taxRefundAllocation);
        if (args.dividendAllocation) setDAlloc(args.dividendAllocation);
        if (args.strategy_insight) setAiInsight(args.strategy_insight);
    };

    // Calculate OSFI Limit
    const MAX_TOTAL_LTV = 0.80;
    const MAX_HELOC_LTV = 0.65;
    const initialTotalRoom = (hVal * MAX_TOTAL_LTV) - mBal;
    const initialHelocRoom = (hVal * MAX_HELOC_LTV);
    const absoluteMaxLumpSum = Math.max(0, Math.min(initialTotalRoom, initialHelocRoom));
    const isOverLimit = lumpSum > absoluteMaxLumpSum;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 pb-32 md:pb-8 animate-fade-in relative flex flex-col min-h-0">
            {/* AI HERO SECTION (Hidden for Copilot)
            <AICommandBar 
                endpoint="/api/ai/smith"
                suggestions={SMITH_SUGGESTIONS}
                onUpdate={handleAIUpdate}
                context={inputsForEngine}
            />
            <StrategyCard insight={aiInsight} />
            */}

            {/* AI Copilot Persistent Sidebar/Bottom-sheet */}
            <AICopilot 
                onUpdate={handleAIUpdate}
                context={{ calculatorId: 'smith', ...inputsForEngine }}
                globalMemory={memory}
            />

            <div className="w-full">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-indigo-600 p-3 rounded-2xl shadow-xl shadow-indigo-200">
                            <ScaleIcon size={32} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">Smith Manoeuvre</h1>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Debt Conversion Strategy</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => window.location.search = ''}
                        className="bg-white border border-slate-200 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 group shadow-sm"
                    >
                        <RotateCcwIcon size={16} className="group-hover:-rotate-180 transition-transform duration-500" />
                        Reset
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-4 space-y-6">
                        <SmithInputs 
                            homeValue={hVal} setHomeValue={setHValue}
                            mortgageBalance={mBal} setMortgageBalance={setMBalance}
                            mortgageRate={mRate} setMortgageRate={setMRate}
                            helocRate={hRate} setHelocRate={setHRate}
                            marginalTaxRate={tRate} setMarginalTaxRate={setTRate}
                            capitalGainsRate={gRate} setCapitalGainsRate={setGRate}
                            dividendYield={dYield} setDividendYield={setDYield}
                            dividendTaxRate={dTax} setDividendTaxRate={setDTax}
                            amortizationYears={aYears} setAmortizationYears={setAYears}
                            initialLumpSum={lumpSum} setInitialLumpSum={setLumpSum}
                            readvanceTolerance={tolerance} setReadvanceTolerance={setTolerance}
                            capitalizeInterest={capInt} setCapitalizeInterest={setCapInt}
                            taxRefundAllocation={tAlloc} setTaxRefundAllocation={setTAlloc}
                            dividendAllocation={dAlloc} setDividendAllocation={setDAlloc}
                            showAdvanced={showAdvanced} setShowAdvanced={setShowAdvanced}
                            isOverLimit={isOverLimit}
                            absoluteMaxLumpSum={absoluteMaxLumpSum}
                            currency={currencyFormatter}
                        />
                    </div>
                    <div className="lg:col-span-8 space-y-8">
                        <SmithMetrics lastResult={finalData} totalAdvantage={totalAdvantage} currency={currencyFormatter} />
                        <SmithNarrative results={data} totalAdvantage={totalAdvantage} currency={currencyFormatter} amortizationYears={aYears} />
                        <SmithCharts results={data} amortizationYears={aYears} currency={currencyFormatter} />
                        <SmithAuditTable annualData={annualData} currency={currencyFormatter} handleExportCSV={handleExportCSV} />

                        {/* Official CRA Resources */}
                        <div className="pt-4">
                            <Accordion title="Official CRA Resources" icon={ExternalLinkIcon}>
                                <div className="flex flex-col gap-4">
                                    <a href="https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/line-22100-carrying-charges-interest-expenses.html" target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-indigo-50 rounded-2xl group transition-all hover:bg-indigo-100">
                                        <div className="flex items-center gap-3"><DollarSignIcon className="text-indigo-600" /> <span className="font-bold text-indigo-900 text-sm">CRA: Deducting Interest Expenses</span></div>
                                        <ExternalLinkIcon size={16} className="text-indigo-400 group-hover:translate-x-1 transition-transform" />
                                    </a>
                                    <a href="https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/personal-income/line-12700-capital-gains/you-calculate-your-capital-gain-loss.html" target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl group transition-all hover:bg-emerald-100">
                                        <div className="flex items-center gap-3"><DollarSignIcon className="text-emerald-600" /> <span className="font-bold text-emerald-900 text-sm">CRA: Calculating Capital Gains</span></div>
                                        <ExternalLinkIcon size={16} className="text-emerald-400 group-hover:translate-x-1 transition-transform" />
                                    </a>
                                </div>
                            </Accordion>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
