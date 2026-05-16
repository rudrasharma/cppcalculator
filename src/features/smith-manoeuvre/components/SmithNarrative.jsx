import React, { useMemo } from 'react';

export const SmithNarrative = ({ results, totalAdvantage, currency, amortizationYears }) => {
    const narrative = useMemo(() => {
        // Find mortgage-free month for Smith
        const smithMortgageFreeMonth = results.find(r => r.smithMortgageBalance <= 0)?.month || (amortizationYears * 12);
        
        // Standard mortgage usually lasts full amortization unless we assume extra payments (not in current engine)
        const standardMortgageFreeMonth = amortizationYears * 12;
        
        const yearsSaved = (standardMortgageFreeMonth - smithMortgageFreeMonth) / 12;
        
        const lastResult = results[results.length - 1];
        const portfolioBuilt = lastResult.smithInvestmentBalance;
        
        // Calculate average annual tax refund
        const totalRefunds = results.reduce((acc, r) => acc + (r.annualTaxRefund || 0), 0);
        const avgAnnualRefund = totalRefunds / amortizationYears;

        return {
            yearsSaved: yearsSaved.toFixed(1),
            portfolioBuilt,
            avgAnnualRefund,
            totalAdvantage,
            isAccelerated: yearsSaved > 0
        };
    }, [results, totalAdvantage, amortizationYears]);

    return (
        <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-[2.5rem] border border-indigo-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor" className="text-indigo-600">
                    <path d="M12 2L1 12h3v9h6v-6h4v6h6v-9h3L12 2z"/>
                </svg>
            </div>
            
            <h3 className="text-xs font-black uppercase tracking-widest text-indigo-600 mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                Strategy Impact Summary
            </h3>
            
            <div className="relative z-10 space-y-4">
                <p className="text-xl md:text-2xl font-bold text-slate-800 leading-tight">
                    By following this strategy, you could be mortgage-free 
                    <span className="text-indigo-600 mx-1.5 underline decoration-indigo-200 decoration-4 underline-offset-4">
                        {narrative.yearsSaved} years sooner
                    </span> 
                    than a standard mortgage.
                </p>
                
                <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
                    You'll build a <span className="font-black text-slate-900">{currency.format(narrative.portfolioBuilt)}</span> investment portfolio 
                    while generating an average annual tax refund of <span className="font-black text-slate-900">{currency.format(narrative.avgAnnualRefund)}</span>.
                </p>

                <div className="pt-4 flex flex-wrap gap-4">
                    <div className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
                        🚀 Total Advantage: {currency.format(narrative.totalAdvantage)}
                    </div>
                    {narrative.isAccelerated && (
                        <div className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
                            ✨ Accelerated Paydown Active
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
