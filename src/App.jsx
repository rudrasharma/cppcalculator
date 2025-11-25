import React, { useState, useEffect, useMemo } from 'react';
import { Calculator, Calendar, DollarSign, TrendingUp, Info, RotateCcw, CheckCircle } from 'lucide-react';

// --- CONSTANTS & DATA ---

// Approximate YMPE history. In a real production app, fetch this or keep it updated.
// 2025 projected ~71,300. 2024=68500.
const YMPE_DATA = {
  2030: 80600, 2029: 78700, 2028: 76800, 2027: 74900, 2026: 73100, // Projections
  2025: 71300, 2024: 68500, 2023: 66600, 2022: 64900, 2021: 61600, 2020: 58700,
  2019: 57400, 2018: 55900, 2017: 55300, 2016: 54900, 2015: 53600, 2014: 52500,
  2013: 51100, 2012: 50100, 2011: 48300, 2010: 47200, 2009: 46300, 2008: 44900,
  2007: 43700, 2006: 42100, 2005: 41100, 2004: 40500, 2003: 39900, 2002: 39100,
  2001: 38300, 2000: 37600, 1999: 37400, 1998: 36900, 1997: 35800, 1996: 35400,
  1995: 34900, 1994: 34400, 1993: 33400, 1992: 32200, 1991: 30500, 1990: 28900,
  1989: 27700, 1988: 26500, 1987: 25900, 1986: 25800, 1985: 23400, 1984: 20800,
  1983: 18500, 1982: 16500, 1981: 14700, 1980: 13100, 1979: 11700, 1978: 10400,
  1977: 9300,  1976: 8300,  1975: 7400,  1974: 6600,  1973: 5600,  1972: 5500,
  1971: 5400,  1970: 5300,  1969: 5200,  1968: 5100,  1967: 5000,  1966: 5000
};

// YAMPE (Year's Additional Maximum Pensionable Earnings) - Introduced 2024
// 2024: ~73,200. 2025: ~81,200 (approx +14% of YMPE).
const getYAMPE = (year) => {
  if (year < 2024) return 0;
  if (year === 2024) return 73200;
  if (year === 2025) return 81200; 
  // Future projection: approx 1.14 * YMPE
  const ympe = YMPE_DATA[year] || (71300 * Math.pow(1.025, year - 2025));
  return Math.round(ympe * 1.14);
};

const CURRENT_YEAR = new Date().getFullYear();
const MAX_BASE_CPP_2025 = 1364.60; 

// Helper to get YMPE safely
const getYMPE = (year) => {
  if (YMPE_DATA[year]) return YMPE_DATA[year];
  // Simple projection for future if not in table
  if (year > 2025) {
    return Math.round(71300 * Math.pow(1.025, year - 2025)); // 2.5% inflation
  }
  return 5000; // Fallback for very old
};

const App = () => {
  // --- STATE ---
  const [dob, setDob] = useState('1985-01-01');
  const [retirementAge, setRetirementAge] = useState(65);
  const [earnings, setEarnings] = useState({}); // { year: amount }
  const [useMaxForFuture, setUseMaxForFuture] = useState(true);
  
  // Tabs: 'input' or 'results'
  const [activeTab, setActiveTab] = useState('input');

  // --- DERIVED CALCULATIONS ---
  
  const birthYear = parseInt(dob.split('-')[0]);
  const startYear = birthYear + 18;
  const endYear = birthYear + retirementAge; // The year they turn retirementAge
  
  // Generate the list of relevant years
  const years = useMemo(() => {
    const list = [];
    for (let y = startYear; y < endYear; y++) {
      list.push(y);
    }
    return list;
  }, [startYear, endYear]);

  // Handle Input Changes
  const handleEarningChange = (year, value) => {
    setEarnings(prev => ({ ...prev, [year]: value }));
  };

  const toggleMax = (year, isMax) => {
    if (isMax) {
      setEarnings(prev => ({ ...prev, [year]: 'MAX' }));
    } else {
      const newEarnings = { ...prev };
      delete newEarnings[year];
      setEarnings(newEarnings);
    }
  };

  const fillRemaining = (type) => {
    const newEarnings = { ...earnings };
    years.forEach(y => {
      if (y >= CURRENT_YEAR) {
        if (type === 'max') newEarnings[y] = 'MAX';
        if (type === 'clear') delete newEarnings[y];
      }
    });
    setEarnings(newEarnings);
  };
  
  const fillPast = (type) => {
    const newEarnings = { ...earnings };
    years.forEach(y => {
      if (y < CURRENT_YEAR) {
        if (type === 'max') newEarnings[y] = 'MAX';
      }
    });
    setEarnings(newEarnings);
  };

  // --- CORE LOGIC ---

  const calculateCPP = () => {
    // 1. BASE CPP CALCULATION
    // Formula: Average Monthly Pensionable Earnings (AMPE) * 25%
    // Steps: 
    // - Index past earnings to current YMPE values
    // - Drop 17% lowest months (General Dropout)
    // - Calculate average
    
    // We use the last 5 years average YMPE for the "MPE" variable in strict calc, 
    // but for estimation "Today's Dollars" using Current YMPE is the standard clean approach.
    const currentYMPE = getYMPE(CURRENT_YEAR); // 2025 reference
    
    let totalAdjustedEarnings = 0;
    let contributoryMonths = 0;
    
    // Map years to data objects
    const yearData = years.map(year => {
      const ympe = getYMPE(year);
      const yampe = getYAMPE(year);
      let rawIncome = earnings[year];
      
      if (rawIncome === 'MAX') rawIncome = ympe + (yampe > 0 ? (yampe - ympe) : 0); // Assume max covers Tier 2 if applicable
      if (!rawIncome) rawIncome = 0;
      rawIncome = parseFloat(rawIncome);

      // Cap at YMPE for Base calculation
      const baseIncome = Math.min(rawIncome, ympe);
      
      // Calculate Ratio (how much of the max did they earn that year?)
      const ratio = baseIncome / ympe;
      
      // Adjusted Earnings (in today's dollars) = Ratio * Current YMPE
      const adjustedEarnings = ratio * currentYMPE;

      // Enhanced Data
      const isEnhancedYear = year >= 2019;
      // Tier 1: Income up to YMPE
      const tier1Income = baseIncome; 
      // Tier 2: Income between YMPE and YAMPE (Starts 2024)
      const tier2Income = Math.max(0, Math.min(rawIncome, yampe) - ympe);

      return {
        year,
        ratio,
        adjustedEarnings,
        isEnhancedYear,
        tier1Income,
        tier2Income,
        ympe,
        yampe
      };
    });

    // --- BASE DROPOUT LOGIC ---
    // Sort by ratio (lowest first) to drop
    const sortedByRatio = [...yearData].sort((a, b) => a.ratio - b.ratio);
    const totalMonths = years.length * 12;
    const monthsToDrop = Math.floor(totalMonths * 0.17);
    const yearsToDrop = monthsToDrop / 12; // Approx for array slicing
    
    // Mark lowest years as dropped
    // Note: This is a simplified dropout (entire years instead of months) for the UI tool
    const numYearsToDrop = Math.floor(yearsToDrop);
    const retainedYears = sortedByRatio.slice(numYearsToDrop);
    
    const avgRatio = retainedYears.reduce((sum, y) => sum + y.ratio, 0) / retainedYears.length;
    
    // Base Monthly Benefit (Pre-adjustment)
    // Max Benefit * Average Ratio
    const baseBenefit = MAX_BASE_CPP_2025 * avgRatio;

    // --- ENHANCED CPP LOGIC ---
    // Enhancement is additive and doesn't use the dropout provision.
    // It works like a "Points" system.
    // Tier 1 Target: 8.33% replacement (33.33% - 25%) of YMPE
    // Tier 2 Target: 33.33% replacement of (YAMPE - YMPE)
    // Accrual Rate: Roughly 1/40th of the target per year contributed
    
    let enhancedTier1Total = 0;
    let enhancedTier2Total = 0;

    yearData.forEach(d => {
      if (d.isEnhancedYear) {
        // TIER 1
        // Value: (Income / YMPE) * (8.33% / 40) * Current YMPE
        // We use Current YMPE to output in "Today's Dollars"
        const t1Credit = (d.tier1Income / d.ympe) * (0.0833 / 40) * currentYMPE;
        enhancedTier1Total += t1Credit;

        // TIER 2 (2024+)
        if (d.year >= 2024) {
          const spread = d.yampe - d.ympe;
          if (spread > 0) {
             // Value: (Tier2Income / Spread) * (33.33% / 40) * Current_Spread_Value
             // We estimate current spread value as ~14% of Current YMPE for consistency
             const currentSpread = currentYMPE * 0.14; 
             const t2Credit = (d.tier2Income / spread) * (0.3333 / 40) * currentSpread;
             enhancedTier2Total += t2Credit;
          }
        }
      }
    });

    const enhancedBenefit = (enhancedTier1Total / 12) + (enhancedTier2Total / 12);

    // --- DEFERRAL / EARLY ADJUSTMENT ---
    // < 65: -0.6% per month
    // > 65: +0.7% per month
    const monthsDiff = (retirementAge - 65) * 12;
    let adjustmentFactor = 1;
    let adjustmentPercent = 0;

    if (monthsDiff < 0) {
      // Early
      adjustmentPercent = monthsDiff * 0.6; // e.g., -36%
    } else if (monthsDiff > 0) {
      // Late (Max 70)
      const cappedMonths = Math.min(monthsDiff, 60); // Cap at 70 (5 years)
      adjustmentPercent = cappedMonths * 0.7; // e.g., +42%
    }
    
    adjustmentFactor = 1 + (adjustmentPercent / 100);

    return {
      base: baseBenefit,
      enhanced: enhancedBenefit,
      total: (baseBenefit + enhancedBenefit) * adjustmentFactor,
      adjustmentPercent,
      adjustmentFactor
    };
  };

  const results = calculateCPP();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-blue-700 text-white p-4 shadow-lg sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator size={24} />
            <h1 className="text-xl font-bold">CPP Estimator (Enhanced)</h1>
          </div>
          <div className="text-sm opacity-90 hidden sm:block">
            Estimated in 2025 Dollars
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-6">
        
        {/* Top Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Date of Birth</label>
            <input 
              type="date" 
              value={dob} 
              onChange={(e) => setDob(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Retirement Age: <span className="text-blue-600 font-bold text-lg">{retirementAge}</span>
            </label>
            <input 
              type="range" 
              min="60" 
              max="70" 
              step="1"
              value={retirementAge} 
              onChange={(e) => setRetirementAge(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>60 (Early)</span>
              <span>65 (Standard)</span>
              <span>70 (Deferred)</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button 
            onClick={() => setActiveTab('input')}
            className={`pb-2 px-1 font-medium transition-colors ${activeTab === 'input' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Contribution History
          </button>
          <button 
            onClick={() => setActiveTab('results')}
            className={`pb-2 px-1 font-medium transition-colors ${activeTab === 'results' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Estimate Results
          </button>
        </div>

        {/* --- INPUT TAB --- */}
        {activeTab === 'input' && (
          <div className="animate-fade-in">
             <div className="flex flex-wrap gap-2 mb-4">
                <button onClick={() => fillPast('max')} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full border border-gray-300 transition">
                  Set Past to MAX
                </button>
                <button onClick={() => fillRemaining('max')} className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1 rounded-full border border-blue-200 transition">
                  Set Future to MAX
                </button>
                <button onClick={() => setEarnings({})} className="text-xs bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1 rounded-full border border-red-200 transition ml-auto flex items-center gap-1">
                  <RotateCcw size={12} /> Reset
                </button>
             </div>

             <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="grid grid-cols-12 bg-gray-50 p-3 text-xs font-bold text-gray-500 uppercase tracking-wider border-b">
                  <div className="col-span-2">Year</div>
                  <div className="col-span-2">Age</div>
                  <div className="col-span-3 text-right pr-4">YMPE</div>
                  <div className="col-span-5">Earnings</div>
                </div>
                <div className="max-h-[500px] overflow-y-auto">
                  {years.map(year => {
                    const isFuture = year > CURRENT_YEAR;
                    const ympe = getYMPE(year);
                    const isMax = earnings[year] === 'MAX';
                    const val = earnings[year] === 'MAX' ? ympe : (earnings[year] || '');

                    return (
                      <div key={year} className={`grid grid-cols-12 p-3 border-b last:border-0 items-center hover:bg-gray-50 transition ${isFuture ? 'bg-blue-50/30' : ''}`}>
                        <div className="col-span-2 text-sm font-medium text-gray-700">{year}</div>
                        <div className="col-span-2 text-sm text-gray-500">{year - birthYear}</div>
                        <div className="col-span-3 text-right pr-4 text-sm text-gray-400 font-mono">${ympe.toLocaleString()}</div>
                        <div className="col-span-5 flex items-center gap-2">
                          <div className="relative flex-1">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                            <input 
                              type="number" 
                              disabled={isMax}
                              value={isMax ? ympe : val}
                              onChange={(e) => handleEarningChange(year, e.target.value)}
                              className={`w-full pl-5 pr-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-blue-500 outline-none ${isMax ? 'bg-gray-100 text-gray-400' : 'bg-white'}`}
                              placeholder="0"
                            />
                          </div>
                          <button 
                            onClick={() => toggleMax(year, !isMax)}
                            className={`px-2 py-1 text-xs font-bold rounded border transition-colors ${isMax ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-400 border-gray-200'}`}
                          >
                            MAX
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
             </div>
          </div>
        )}

        {/* --- RESULTS TAB --- */}
        {activeTab === 'results' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Main Result Card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <DollarSign size={150} />
              </div>
              
              <div className="relative z-10">
                <h2 className="text-blue-100 text-sm font-semibold uppercase tracking-widest mb-1">Estimated Monthly Payout</h2>
                <div className="flex items-baseline gap-2">
                   <span className="text-5xl font-bold">${results.total.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                   <span className="text-blue-200">/ mo</span>
                </div>
                <div className="mt-4 flex gap-2 items-center text-sm bg-white/10 w-fit px-3 py-1 rounded-full">
                  <Calendar size={14} />
                  <span>Starts at age {retirementAge}</span>
                </div>
              </div>
            </div>

            {/* Breakdown Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {/* Base Breakdown */}
               <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center gap-2 mb-4 text-gray-700">
                    <TrendingUp size={20} className="text-blue-600"/>
                    <h3 className="font-bold">Base CPP</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                       <span className="text-gray-500">Base Entitlement</span>
                       <span className="font-medium">${results.base.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 italic">
                       <span>Target Replacement</span>
                       <span>25%</span>
                    </div>
                    <div className="h-px bg-gray-100 my-2"></div>
                    <p className="text-xs text-gray-400">
                      Calculated using your best earnings years (17% dropout applied).
                    </p>
                  </div>
               </div>

               {/* Enhanced Breakdown */}
               <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center gap-2 mb-4 text-gray-700">
                    <CheckCircle size={20} className="text-green-600"/>
                    <h3 className="font-bold">Enhanced CPP</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                       <span className="text-gray-500">Enhancement Top-up</span>
                       <span className="font-medium text-green-600">+${results.enhanced.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 italic">
                       <span>Tier 1 (Since 2019)</span>
                       <span>Included</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 italic">
                       <span>Tier 2 (Since 2024)</span>
                       <span>Included</span>
                    </div>
                    <div className="h-px bg-gray-100 my-2"></div>
                    <p className="text-xs text-gray-400">
                      Based on accumulated contributions since 2019.
                    </p>
                  </div>
               </div>
            </div>

            {/* Deferral Logic Card */}
            <div className="bg-amber-50 border border-amber-100 p-5 rounded-xl flex gap-4">
              <Info className="text-amber-500 shrink-0 mt-1" size={24} />
              <div>
                <h4 className="font-bold text-amber-800 mb-1">Age Adjustment Factor: {results.adjustmentPercent > 0 ? '+' : ''}{results.adjustmentPercent.toFixed(1)}%</h4>
                <p className="text-sm text-amber-700 leading-relaxed">
                  {retirementAge < 65 && "You are taking CPP early. Your benefit is reduced by 0.6% for every month before age 65."}
                  {retirementAge === 65 && "You are taking CPP at the standard age of 65."}
                  {retirementAge > 65 && "You are deferring CPP. Your benefit increases by 0.7% for every month after age 65 (up to age 70)."}
                </p>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default App;