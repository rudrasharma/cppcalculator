import React, { useState, useMemo } from 'react';
import { calculateSmithManoeuvre } from '../utils/smithEngine';
import AICopilot from '../../../components/AICopilot';

// Sub-components
import { SmithMetrics } from './SmithMetrics';
import { SmithCharts } from './SmithCharts';
import { SmithAuditTable } from './SmithAuditTable';
import { SmithInputs } from './SmithInputs';
import { SmithNarrative } from './SmithNarrative';

export default function SmithCalculator() {
    // UI State
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Initial State
    const [homeValue, setHomeValue] = useState(750000);
    const [mortgageBalance, setMortgageBalance] = useState(500000);
    const [mortgageRate, setMortgageRate] = useState(0.045);
    const [helocRate, setHelocRate] = useState(0.065);
    const [marginalTaxRate, setMarginalTaxRate] = useState(0.43);
    
    // New Return States
    const [capitalGainsRate, setCapitalGainsRate] = useState(0.05);
    const [dividendYield, setDividendYield] = useState(0.02);
    const [dividendTaxRate, setDividendTaxRate] = useState(0.15);
    const [dividendAllocation, setDividendAllocation] = useState('portfolio');
    
    // Previous Inputs
    const [amortizationYears, setAmortizationYears] = useState(25);
    const [initialLumpSum, setInitialLumpSum] = useState(0);
    const [readvanceTolerance, setReadvanceTolerance] = useState(1.0);
    const [taxRefundAllocation, setTaxRefundAllocation] = useState('portfolio');
    const [capitalizeInterest, setCapitalizeInterest] = useState(true);

    const currency = new Intl.NumberFormat('en-CA', { 
        style: 'currency', 
        currency: 'CAD', 
        maximumFractionDigits: 0 
    });

    // CRITICAL: wrap execution in useMemo
    const results = useMemo(() => {
        return calculateSmithManoeuvre({
            homeValue,
            mortgageBalance,
            mortgageRate,
            helocRate,
            marginalTaxRate,
            capitalGainsRate,
            dividendYield,
            dividendTaxRate,
            dividendAllocation,
            amortizationYears,
            initialHelocLumpSum: initialLumpSum,
            readvanceTolerance,
            taxRefundAllocation,
            capitalizeInterest
        });
    }, [
        homeValue, mortgageBalance, mortgageRate, helocRate, marginalTaxRate, 
        capitalGainsRate, dividendYield, dividendTaxRate, dividendAllocation,
        amortizationYears, initialLumpSum, readvanceTolerance, taxRefundAllocation,
        capitalizeInterest
    ]);

    const lastResult = results[results.length - 1];
    const totalAdvantage = lastResult.smithNetWorth - lastResult.standardNetWorth;

    // Build annualData for table
    const annualData = useMemo(() => {
        return results.filter(r => r.month % 12 === 0 || r.month === results.length - 1);
    }, [results]);

    // OSFI Limit Logic for UI Feedback
    const maxByTotalLTV = Math.max(0, (homeValue * 0.8) - mortgageBalance);
    const maxByHelocLTV = (homeValue * 0.65);
    const absoluteMaxLumpSum = Math.floor(Math.min(maxByTotalLTV, maxByHelocLTV));
    const isOverLimit = initialLumpSum > absoluteMaxLumpSum;

    const handleAIUpdate = (args) => {
        if (args.homeValue !== undefined) setHomeValue(args.homeValue);
        if (args.mortgageBalance !== undefined) setMortgageBalance(args.mortgageBalance);
        if (args.mortgageRate !== undefined) setMortgageRate(args.mortgageRate);
        if (args.helocRate !== undefined) setHelocRate(args.helocRate);
        if (args.marginalTaxRate !== undefined) setMarginalTaxRate(args.marginalTaxRate);
        if (args.amortizationYears !== undefined) setAmortizationYears(args.amortizationYears);
        if (args.dividendAllocation !== undefined) setDividendAllocation(args.dividendAllocation);
        if (args.taxRefundAllocation !== undefined) setTaxRefundAllocation(args.taxRefundAllocation);
    };

    const handleExportCSV = () => {
        const headers = "Year,Mortgage Balance,HELOC Balance,Investment Portfolio,Out-of-Pocket Interest,Net Annual Dividends,Pocketed Cash,Standard Net Worth,Smith Net Worth,Net Benefit";
        const rows = annualData.map(row => {
            const netBenefit = row.smithNetWorth - row.standardNetWorth;
            return [
                row.month / 12,
                row.standardMortgageBalance,
                row.smithHelocBalance,
                row.smithInvestmentBalance,
                row.yearlyOutOfPocketInterest || 0,
                row.yearlyNetDividends || 0,
                row.cumulativePocketedCash || 0,
                row.standardNetWorth,
                row.smithNetWorth,
                netBenefit
            ].join(",");
        });
        
        const csvContent = [headers, ...rows].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "smith-manoeuvre-projection.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-fade-in">
            <AICopilot 
                mode="smith"
                context={{ homeValue, mortgageBalance, mortgageRate, helocRate, marginalTaxRate, amortizationYears }}
                onUpdateCalculator={handleAIUpdate}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <SmithInputs 
                    homeValue={homeValue} setHomeValue={setHomeValue}
                    mortgageBalance={mortgageBalance} setMortgageBalance={setMortgageBalance}
                    mortgageRate={mortgageRate} setMortgageRate={setMortgageRate}
                    helocRate={helocRate} setHelocRate={setHelocRate}
                    marginalTaxRate={marginalTaxRate} setMarginalTaxRate={setMarginalTaxRate}
                    capitalGainsRate={capitalGainsRate} setCapitalGainsRate={setCapitalGainsRate}
                    dividendYield={dividendYield} setDividendYield={setDividendYield}
                    showAdvanced={showAdvanced} setShowAdvanced={setShowAdvanced}
                    initialLumpSum={initialLumpSum} setInitialLumpSum={setInitialLumpSum}
                    isOverLimit={isOverLimit} absoluteMaxLumpSum={absoluteMaxLumpSum}
                    amortizationYears={amortizationYears} setAmortizationYears={setAmortizationYears}
                    readvanceTolerance={readvanceTolerance} setReadvanceTolerance={setReadvanceTolerance}
                    dividendTaxRate={dividendTaxRate} setDividendTaxRate={setDividendTaxRate}
                    capitalizeInterest={capitalizeInterest} setCapitalizeInterest={setCapitalizeInterest}
                    taxRefundAllocation={taxRefundAllocation} setTaxRefundAllocation={setTaxRefundAllocation}
                    dividendAllocation={dividendAllocation} setDividendAllocation={setDividendAllocation}
                    currency={currency}
                />

                <div className="lg:col-span-2 space-y-8">
                    <SmithNarrative 
                        results={results}
                        totalAdvantage={totalAdvantage}
                        currency={currency}
                        amortizationYears={amortizationYears}
                    />

                    <SmithMetrics 
                        lastResult={lastResult} 
                        totalAdvantage={totalAdvantage} 
                        currency={currency} 
                    />

                    <SmithCharts 
                        results={results} 
                        amortizationYears={amortizationYears} 
                        currency={currency} 
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-sm">
                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 text-center md:text-left">Strategy Liquidity</h4>
                            <p className="text-3xl font-black text-slate-900 tracking-tighter text-center md:text-left">
                                {currency.format(lastResult.cumulativePocketedCash)}
                            </p>
                            <p className="text-xs font-bold text-slate-500 mt-2 text-center md:text-left italic">Total cash flow extracted from dividends</p>
                        </div>
                        <div className="bg-indigo-600 p-8 rounded-3xl text-white shadow-xl shadow-indigo-100">
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Total Net Worth Advantage</p>
                            <h4 className="text-4xl font-black tracking-tighter">{currency.format(totalAdvantage)}</h4>
                            <p className="text-xs font-bold mt-4 opacity-90 leading-relaxed italic">
                                Projected wealth increase over standard home ownership.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <SmithAuditTable 
                annualData={annualData} 
                currency={currency} 
                handleExportCSV={handleExportCSV} 
            />

            {/* Sticky Mobile Summary */}
            <div className="lg:hidden fixed bottom-6 left-4 right-4 z-40">
                <div className="bg-slate-900/90 backdrop-blur-md text-white p-4 rounded-3xl shadow-2xl border border-slate-700/50 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Extra Wealth</p>
                        <p className="text-xl font-black text-emerald-400 leading-none">{currency.format(totalAdvantage)}</p>
                    </div>
                    <div className="h-8 w-px bg-slate-700"></div>
                    <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Portfolio</p>
                        <p className="text-xl font-black text-white leading-none">{currency.format(lastResult.smithInvestmentBalance)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
