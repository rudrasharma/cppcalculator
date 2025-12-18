// src/components/Calculator.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip as RechartsTooltip, 
    Legend, 
    ResponsiveContainer, 
    ReferenceLine 
} from 'recharts';

// ==========================================
//              ICONS
// ==========================================
const IconBase = ({ size = 20, className = "", children }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        {children}
    </svg>
);

const CalculatorIcon = (props) => (
    <IconBase {...props}>
        <rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/>
    </IconBase>
);
const TrendingUpIcon = (props) => (
    <IconBase {...props}>
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
    </IconBase>
);
const CheckCircleIcon = (props) => (
    <IconBase {...props}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/>
    </IconBase>
);
const RotateCcwIcon = (props) => (
    <IconBase {...props}>
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
    </IconBase>
);
const InfoIcon = (props) => (
    <IconBase {...props}>
        <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
    </IconBase>
);
const HomeIcon = (props) => (
    <IconBase {...props}>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </IconBase>
);
const DollarSignIcon = (props) => (
    <IconBase {...props}>
        <line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </IconBase>
);
const BookOpenIcon = (props) => (
    <IconBase {...props}>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </IconBase>
);
const HelpCircleIcon = (props) => (
    <IconBase {...props}>
        <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </IconBase>
);
const MailIcon = (props) => (
    <IconBase {...props}>
        <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </IconBase>
);
const ArrowRightIcon = (props) => (
    <IconBase {...props}>
        <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </IconBase>
);
const ExternalLinkIcon = (props) => (
    <IconBase {...props}>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
    </IconBase>
);
const XIcon = (props) => (
    <IconBase {...props}>
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </IconBase>
);
const UserGroupIcon = (props) => (
    <IconBase {...props}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </IconBase>
);
const ChevronDownIcon = (props) => (
    <IconBase {...props}>
        <polyline points="6 9 12 15 18 9"/>
    </IconBase>
);
const LightbulbIcon = (props) => (
    <IconBase {...props}>
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2 1.5-3.5 0-2.2-1.8-4-4-4a4 4 0 0 0-4 4c0 1.5.5 2.5 1.5 3.5.8.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>
    </IconBase>
);
const HeartHandshakeIcon = (props) => (
    <IconBase {...props}>
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
    </IconBase>
);
const WandIcon = (props) => (
    <IconBase {...props}>
        <path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8 19 13"/><path d="M15 9h0"/><path d="M17.8 6.2 19 5"/><path d="m3 21 9-9"/><path d="M12.2 6.2 11 5"/>
    </IconBase>
);
const BarChartIcon = (props) => (
    <IconBase {...props}>
        <line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/>
    </IconBase>
);
const MousePointerIcon = (props) => (
    <IconBase {...props}>
        <path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="m13 13 6 6"/>
    </IconBase>
);
const LinkIcon = (props) => (
    <IconBase {...props}>
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </IconBase>
);
const CheckIcon = (props) => (
    <IconBase {...props}>
        <polyline points="20 6 9 17 4 12"/>
    </IconBase>
);
const FileTextIcon = (props) => (
    <IconBase {...props}>
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>
    </IconBase>
);
const UploadIcon = (props) => (
    <IconBase {...props}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
    </IconBase>
);
const FilterIcon = (props) => (
    <IconBase {...props}>
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </IconBase>
);
const TrendingDownIcon = (props) => (
    <IconBase {...props}>
        <polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/>
    </IconBase>
);

// ==========================================
//              CONSTANTS
// ==========================================

const YMPE_DATA = {
    2030:80600, 2029:78700, 2028:76800, 2027:74900, 2026:73100,
    2025:71300, 2024:68500, 2023:66600, 2022:64900, 2021:61600,
    2020:58700, 2019:57400, 2018:55900, 2017:55300, 2016:54900,
    2015:53600, 2014:52500, 2013:51100, 2012:50100, 2011:48300,
    2010:47200, 2009:46300, 2008:44900, 2007:43700, 2006:42100,
    2005:41100, 2004:40500, 2003:39900, 2002:39100, 2001:38300
};
const CURRENT_YEAR = new Date().getFullYear();
const MAX_BASE_CPP_2025 = 1364.60;
const MAX_OAS_2025 = 727.67;
const OAS_CLAWBACK_THRESHOLD_2025 = 93454;
const GIS_PARAMS = {
    SINGLE: { max: 1086.88, limit: 22056, rate: 0.50 },
    MARRIED_SPOUSE_OAS: { max: 665.41, limit: 29136, rate: 0.25 },
    MARRIED_SPOUSE_NO_OAS: { max: 1086.88, limit: 52848, rate: 0.25 },
    MARRIED_SPOUSE_ALLOWANCE: { max: 665.41, limit: 40800, rate: 0.25 }
};

const getYAMPE = (year) => {
    if (year < 2024) return 0;
    if (year === 2024) return 73200;
    if (year === 2025) return 81200;
    const ympe = YMPE_DATA[year] || (71300 * Math.pow(1.025, year - 2025));
    return Math.round(ympe * 1.14);
};
const getYMPE = (year) => {
    if (YMPE_DATA[year]) return YMPE_DATA[year];
    if (year > 2025) return Math.round(71300 * Math.pow(1.025, year - 2025));
    if (year < 2011) return Math.round(48300 * Math.pow(0.975, 2011 - year));
    return 5000;
};

// ==========================================
//          COMPRESSION HELPERS
// ==========================================

const compressEarnings = (earningsObj, birthYear) => {
    const years = Object.keys(earningsObj).map(Number).sort((a,b) => a-b);
    if (years.length === 0) return '';

    const startAge18 = birthYear + 18;
    const firstDataYear = years[0];
    
    // Offset from age 18.
    const offset = Math.max(0, firstDataYear - startAge18);
    const header = offset.toString(36); 

    const lastYear = years[years.length - 1];
    let stream = "";
    
    for (let y = firstDataYear; y <= lastYear; y++) {
        let val = earningsObj[y] || 0;
        if (val > 129500) val = 129500;
        
        let compressed = Math.floor(val / 100).toString(36);
        if (compressed.length < 2) compressed = '0' + compressed; // Pad to 2 chars
        stream += compressed;
    }
    return header + stream; 
};

const decompressEarnings = (str, birthYear) => {
    if (!str || str.length < 3) return {};
    
    const startAge18 = birthYear + 18;
    const offsetChar = str.charAt(0);
    const offset = parseInt(offsetChar, 36);
    
    const startYear = startAge18 + offset;
    const dataString = str.slice(1);
    const result = {};
    
    for (let i = 0; i < dataString.length; i += 2) {
        const chunk = dataString.substr(i, 2);
        const val = parseInt(chunk, 36);
        if (val > 0) {
            result[startYear + (i / 2)] = val * 100;
        }
    }
    return result;
};

// ==========================================
//             UI COMPONENTS
// ==========================================

const Tooltip = ({ text }) => (
    <div className="group relative inline-flex items-center ml-1">
        <button type="button" className="text-slate-400 hover:text-indigo-600 transition-colors cursor-help">
            <HelpCircleIcon size={16} />
        </button>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 text-slate-50 text-xs rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 text-center leading-relaxed">
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
        </div>
    </div>
);

const Accordion = ({ title, icon: Icon, children, defaultOpen = false }) => {
    return (
        <details className="group bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-4 transition-all duration-300 hover:shadow-md" open={defaultOpen}>
            <summary className="flex items-center justify-between p-4 cursor-pointer bg-white hover:bg-slate-50 transition select-none">
                <div className="flex items-center gap-4">
                    <div className="text-indigo-600 bg-indigo-50 p-2.5 rounded-lg"><Icon size={20} /></div>
                    <h3 className="font-bold text-slate-800">{title}</h3>
                </div>
                <div className="text-slate-400 transition-transform duration-300 group-open:rotate-180"><ChevronDownIcon size={20} /></div>
            </summary>
            <div className="p-6 pt-2 border-t border-slate-100 text-sm text-slate-600 leading-relaxed animate-fade-in">{children}</div>
        </details>
    );
};

// ==========================================
//          MAIN APPLICATION
// ==========================================

export default function Calculator() {
    // --- STATE MANAGEMENT ---
    const [dob, setDob] = useState('1985-01-01');
    const [retirementAge, setRetirementAge] = useState(65);
    const [yearsInCanada, setYearsInCanada] = useState(40);
    const [earnings, setEarnings] = useState({});
    const [activeTab, setActiveTab] = useState('input');
    const [avgSalaryInput, setAvgSalaryInput] = useState('');
    const [otherIncome, setOtherIncome] = useState('');
    const [showAbout, setShowAbout] = useState(false);
    
    // --- UX STATES ---
    const [compactGrid, setCompactGrid] = useState(false);
    const [useFutureDollars, setUseFutureDollars] = useState(false); // Inflation toggle
    
    // --- IMPORT MODAL STATE ---
    const [showImport, setShowImport] = useState(false);
    const [importText, setImportText] = useState("");
    const [importError, setImportError] = useState("");

    // --- INTERACTIVE CHART STATE ---
    const [chartSelection, setChartSelection] = useState(null);
    const [lineVisibility, setLineVisibility] = useState({
        Early: true,
        Standard: true,
        Deferred: true,
        Selected: true
    });
    
    // --- MARITAL STATUS STATES ---
    const [isMarried, setIsMarried] = useState(false);
    const [spouseDob, setSpouseDob] = useState('1985-01-01');
    const [spouseIncome, setSpouseIncome] = useState('');
    const [forceAllowance, setForceAllowance] = useState(false);

    // --- SHARE LINK STATE ---
    const [copySuccess, setCopySuccess] = useState(false);

    const birthYear = parseInt(dob.split('-')[0]);

    // --- LOAD FROM URL ON MOUNT ---
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.toString()) {
            // Short codes: d=dob, r=retAge, y=yic, s=sal, o=other, m=married, sd=spouseDob, si=spouseInc, fa=forceAllow, e=earnings
            if (params.get('d')) setDob(params.get('d').replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));
            if (params.get('r')) setRetirementAge(parseInt(params.get('r')));
            if (params.get('y')) setYearsInCanada(parseInt(params.get('y')));
            
            // Base36 Decoding for Numbers
            if (params.get('s')) setAvgSalaryInput(parseInt(params.get('s'), 36).toString());
            if (params.get('o')) setOtherIncome(parseInt(params.get('o'), 36).toString());
            
            if (params.get('m') === '1') setIsMarried(true);
            if (params.get('sd')) setSpouseDob(params.get('sd').replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));
            if (params.get('si')) setSpouseIncome(parseInt(params.get('si'), 36).toString());
            if (params.get('fa') === '1') setForceAllowance(true);

            // Earnings Decompression
            const earningsStr = params.get('e');
            const dobParam = params.get('d');
            if (earningsStr && dobParam) {
                const bYear = parseInt(dobParam.substring(0, 4));
                setEarnings(decompressEarnings(earningsStr, bYear));
            }
        }
    }, []);

    // --- PARSE MSCA DATA ---
    const handleImport = () => {
        setImportError("");
        if (!importText.trim()) return;

        try {
            // 1. Sanitize: Fix fused text (e.g., "4072.002006" -> "4072.00 2006") and "2024$3000" -> "2024 3000"
            let cleanText = importText
                .replace(/[$,]/g, '') // Remove currency chars
                .replace(/(\d)(19\d{2}|20\d{2})/g, '$1 $2'); // Add space between any digit and a Year

            const newEarnings = { ...earnings };
            let count = 0;

            // 2. Tokenize into rows starting with a Year
            const rows = cleanText.split(/(?=\b(?:19|20)\d{2}\b)/);

            rows.forEach(row => {
                const lowerRow = row.toLowerCase();
                if (
                    lowerRow.includes("date modified") ||
                    lowerRow.includes("contribution rate") ||
                    lowerRow.includes("calculated") ||
                    lowerRow.includes("maximum") ||
                    lowerRow.includes("updated")
                ) return;

                const yearMatch = row.match(/\b(19|20)\d{2}\b/);
                if (!yearMatch) return;

                const year = parseInt(yearMatch[0]);
                
                const nums = row.match(/(\d+(\.\d+)?)/g);
                
                if (nums) {
                    const candidates = nums
                        .map(Number)
                        .filter(n => n !== year && n < 200000); // Filter out year & unrealistic numbers
                    
                    if (candidates.length > 0) {
                        let val = Math.max(...candidates);
                        
                        // Special "M" (Max) marker handling
                        if (row.toUpperCase().includes('M')) {
                             const ympe = getYMPE(year);
                             const yampe = getYAMPE(year);
                             const limit = year >= 2024 ? yampe : ympe;
                             if (val < 1000 || val > (limit * 0.9)) {
                                 val = limit;
                             }
                        }

                        if (val > 0) {
                            newEarnings[year] = Math.round(val);
                            count++;
                        }
                    }
                }
            });

            if (count > 0) {
                setEarnings(newEarnings);
                setShowImport(false);
                setImportText("");
            } else {
                setImportError("No valid earnings data found. Please copy the table rows.");
            }
        } catch (e) {
            setImportError("Parser error. Please enter manually.");
        }
    };

    // --- SHARE FUNCTION ---
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
        if (compressedEarn) {
            params.set('e', compressedEarn);
        }

        const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
        
        navigator.clipboard.writeText(url).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        });
    };

    const startYear = birthYear + 18;
    const endYear = birthYear + retirementAge;
    const years = useMemo(() => {
        const list = [];
        for (let y = startYear; y < endYear; y++) list.push(y);
        return list;
    }, [startYear, endYear]);

    const handleEarningChange = (year, value) => setEarnings(prev => ({ ...prev, [year]: value }));
    const toggleMax = (year, isMax) => {
        const newEarnings = { ...earnings };
        if (isMax) delete newEarnings[year];
        else {
            const ympe = getYMPE(year);
            const yampe = getYAMPE(year);
            newEarnings[year] = yampe > 0 ? yampe : ympe;
        }
        setEarnings(newEarnings);
    };
    
    // --- UPDATED AVERAGE SALARY LOGIC (NON-DESTRUCTIVE) ---
    const applyAverageSalary = () => {
        if (!avgSalaryInput || avgSalaryInput <= 0) return;
        const currentYMPE = getYMPE(CURRENT_YEAR);
        const ratio = parseFloat(avgSalaryInput) / currentYMPE;
        
        setEarnings(prev => {
            const newEarnings = { ...prev };
            years.forEach(y => {
                // Only overwrite if the year is in the future OR the year has no data yet
                if (y >= CURRENT_YEAR || newEarnings[y] === undefined) {
                    const yYMPE = getYMPE(y);
                    newEarnings[y] = Math.round(yYMPE * ratio);
                }
            });
            return newEarnings;
        });
    };

    const handleLegendClick = (e) => {
        const { dataKey } = e;
        setLineVisibility(prev => ({ ...prev, [dataKey]: !prev[dataKey] }));
    };

    // --- MEMOIZED CALCULATION LOGIC ---
    const results = useMemo(() => {
        // --- 1. CPP CALCULATION ---
        const currentYMPE = getYMPE(CURRENT_YEAR);
        const yearData = years.map(year => {
            const ympe = getYMPE(year);
            const yampe = getYAMPE(year);
            let rawIncome = parseFloat(earnings[year] || 0);
            const baseIncome = Math.min(rawIncome, ympe);
            const ratio = baseIncome / ympe;
            const adjustedEarnings = ratio * currentYMPE;
            const isEnhancedYear = year >= 2019;
            const tier1Income = baseIncome;
            const tier2Income = Math.max(0, Math.min(rawIncome, yampe) - ympe);
            return { year, ratio, adjustedEarnings, isEnhancedYear, tier1Income, tier2Income, ympe, yampe };
        });

        const sortedByRatio = [...yearData].sort((a, b) => a.ratio - b.ratio);
        const totalMonths = years.length * 12;
        const monthsToDrop = Math.floor(totalMonths * 0.17);
        const retainedYears = sortedByRatio.slice(Math.floor(monthsToDrop / 12));
        const avgRatio = retainedYears.length > 0 ? retainedYears.reduce((sum, y) => sum + y.ratio, 0) / retainedYears.length : 0;
        const baseBenefit = MAX_BASE_CPP_2025 * avgRatio;

        let enhancedTier1Total = 0, enhancedTier2Total = 0;
        yearData.forEach(d => {
            if (d.isEnhancedYear) {
                const t1Credit = (d.tier1Income / d.ympe) * (0.0833 / 40) * currentYMPE;
                enhancedTier1Total += t1Credit;
                if (d.year >= 2024) {
                    const spread = d.yampe - d.ympe;
                    if (spread > 0) {
                        const currentSpread = currentYMPE * 0.14;
                        enhancedTier2Total += (d.tier2Income / spread) * (0.3333 / 40) * currentSpread;
                    }
                }
            }
        });

        const enhancedBenefit = (enhancedTier1Total / 12) + (enhancedTier2Total / 12);
        
        // Base benefit (at 65)
        const baseCppAt65 = baseBenefit + enhancedBenefit;
        
        // Adjustment for Current Selection
        const monthsDiff = (retirementAge - 65) * 12;
        let cppAdjustmentPercent = 0;
        if (monthsDiff < 0) cppAdjustmentPercent = monthsDiff * 0.6;
        else if (monthsDiff > 0) cppAdjustmentPercent = Math.min(monthsDiff, 60) * 0.7;
        const finalCPP = baseCppAt65 * (1 + (cppAdjustmentPercent / 100));

        // 2. OAS
        const validYears = Math.min(Math.max(0, yearsInCanada), 40);
        let baseOASAt65 = MAX_OAS_2025 * (validYears / 40);
        
        let oasGross = 0;
        if (retirementAge >= 65) {
            const oasMonthsDeferred = Math.min((retirementAge - 65) * 12, 60);
            oasGross = baseOASAt65 * (1 + (oasMonthsDeferred * 0.6 / 100));
        }
        
        // --- BREAKEVEN DATA ---
        const breakevenData = [];
        let cum60 = 0, cum65 = 0, cum70 = 0, cumSelected = 0;

        const cpp60 = baseCppAt65 * 0.64; 
        const cpp65 = baseCppAt65;
        const cpp70 = baseCppAt65 * 1.42; 
        
        const oasStandard = baseOASAt65;
        const oas70 = baseOASAt65 * 1.36;

        const userIsDistinct = retirementAge !== 60 && retirementAge !== 65 && retirementAge !== 70;
        let cppSelected = 0;
        let oasSelected = baseOASAt65; 
        
        if (userIsDistinct) {
            const userMonthsDiff = (retirementAge - 65) * 12;
            let userCppAdj = 0;
            if (userMonthsDiff < 0) userCppAdj = userMonthsDiff * 0.006;
            else userCppAdj = Math.min(userMonthsDiff, 60) * 0.007;
            cppSelected = baseCppAt65 * (1 + userCppAdj);

            if (retirementAge > 65) {
                const oasDelayMonths = Math.min((retirementAge - 65) * 12, 60);
                oasSelected = baseOASAt65 * (1 + (oasDelayMonths * 0.006));
            }
        }

        let crossover65 = null;
        let crossover70 = null;

        for (let age = 60; age <= 95; age++) {
            let annual60 = 0;
            if (age >= 60) annual60 += cpp60 * 12;
            if (age >= 65) annual60 += oasStandard * 12;
            cum60 += annual60;

            let annual65 = 0;
            if (age >= 65) annual65 += (cpp65 * 12) + (oasStandard * 12);
            cum65 += annual65;

            let annual70 = 0;
            if (age >= 70) annual70 += (cpp70 * 12) + (oas70 * 12);
            cum70 += annual70;

            let annualSelected = 0;
            if (userIsDistinct) {
                if (age >= retirementAge) annualSelected += cppSelected * 12;
                const oasStart = Math.max(65, retirementAge);
                if (age >= oasStart) annualSelected += oasSelected * 12;
                cumSelected += annualSelected;
            }

            if (!crossover65 && cum65 > cum60 && age > 65) crossover65 = age;
            if (!crossover70 && cum70 > cum65 && age > 70) crossover70 = age;

            const dataPoint = {
                age,
                Early: Math.round(cum60),
                Standard: Math.round(cum65),
                Deferred: Math.round(cum70)
            };
            if (userIsDistinct) {
                dataPoint.Selected = Math.round(cumSelected);
            }
            breakevenData.push(dataPoint);
        }

        // 3. CLAWBACK & GIS
        const annualCPP = finalCPP * 12;
        const annualOAS = oasGross * 12;
        const annualOther = parseFloat(otherIncome) || 0;
        
        let oasClawbackMonthly = 0;
        const totalNetWorldIncome = annualOther + annualCPP + annualOAS;
        
        if (retirementAge >= 65) {
            if (totalNetWorldIncome > OAS_CLAWBACK_THRESHOLD_2025) {
                oasClawbackMonthly = ((totalNetWorldIncome - OAS_CLAWBACK_THRESHOLD_2025) * 0.15) / 12;
            }
        }
        const finalOAS = Math.max(0, oasGross - oasClawbackMonthly);

        // --- SMART GIS CALCULATION ---
        let gisAmount = 0;
        let gisNote = "";
        
        if (retirementAge >= 65) {
            let params = GIS_PARAMS.SINGLE;
            let combinedIncome = annualCPP + annualOther; 
            
            if (isMarried) {
                const spouseAnnual = parseFloat(spouseIncome) || 0;
                combinedIncome += spouseAnnual;
                
                const retireYear = birthYear + retirementAge;
                const spBirthYear = parseInt(spouseDob.split('-')[0]);
                const spouseAgeAtRetirement = retireYear - spBirthYear;

                if (spouseAgeAtRetirement >= 65) {
                    params = GIS_PARAMS.MARRIED_SPOUSE_OAS;
                    gisNote = `Combined income used (Spouse age ${spouseAgeAtRetirement}: receives OAS)`;
                } else if (spouseAgeAtRetirement >= 60 && spouseAgeAtRetirement < 65) {
                    if (forceAllowance) {
                        params = GIS_PARAMS.MARRIED_SPOUSE_ALLOWANCE;
                        gisNote = `Combined income used (Spouse age ${spouseAgeAtRetirement}: receives Allowance)`;
                    } else {
                        params = GIS_PARAMS.MARRIED_SPOUSE_NO_OAS;
                        gisNote = `Combined income used (Spouse age ${spouseAgeAtRetirement}: No OAS)`;
                    }
                } else {
                    params = GIS_PARAMS.MARRIED_SPOUSE_NO_OAS;
                    gisNote = `Combined income used (Spouse age ${spouseAgeAtRetirement}: Under 60)`;
                }
            }

            const annualClawback = Math.max(0, combinedIncome) * params.rate;
            gisAmount = Math.max(0, params.max - (annualClawback / 12));

        } else {
            gisNote = "GIS starts at age 65";
        }

        // --- 4. ZERO REASON LOGIC ---
        let cppZeroReason = null;
        if (finalCPP === 0) {
             if (retirementAge < 60) cppZeroReason = "Min age 60";
             else cppZeroReason = "No eligible earnings";
        }

        let oasZeroReason = null;
        if (finalOAS === 0) {
            if (retirementAge < 65) oasZeroReason = "Min age 65";
            else if (yearsInCanada < 10) oasZeroReason = "Min 10 years residency"; 
            else if (oasClawbackMonthly >= oasGross) oasZeroReason = "Clawed back by income";
        }

        let gisZeroReason = null;
        if (gisAmount === 0) {
            if (retirementAge < 65) gisZeroReason = "Min age 65";
            else gisZeroReason = "Income exceeds threshold";
        }

        const generateInsights = () => {
            const insights = [];
            if (retirementAge < 65) {
                insights.push({
                    type: 'opportunity',
                    text: `Retiring at ${retirementAge} reduces your CPP by ${Math.abs(cppAdjustmentPercent).toFixed(1)}%.`
                });
            } else if (retirementAge > 65) {
                insights.push({
                    type: 'success',
                    text: `By delaying to ${retirementAge}, you boosted CPP by ${cppAdjustmentPercent.toFixed(1)}% and OAS by ${(Math.min((retirementAge - 65) * 12, 60) * 0.6).toFixed(1)}%.`
                });
            }
            if (gisAmount > 0) {
                 insights.push({
                    type: 'success',
                    text: `Low Income Support: You qualify for an estimated $${gisAmount.toFixed(0)}/mo in GIS.`
                });
            }
            if (oasClawbackMonthly > 0) {
                insights.push({
                    type: 'danger',
                    text: `OAS Recovery Tax triggered. You are losing $${oasClawbackMonthly.toFixed(0)}/mo of OAS.`
                });
            }
            return insights;
        };

        return {
            cpp: { base: baseBenefit || 0, enhanced: enhancedBenefit || 0, total: finalCPP || 0, adjustmentPercent: cppAdjustmentPercent, zeroReason: cppZeroReason },
            oas: { amount: finalOAS, gross: oasGross, clawback: oasClawbackMonthly, yearsUsed: validYears, note: retirementAge < 65 ? "Starts at 65" : "", zeroReason: oasZeroReason },
            gis: { amount: gisAmount, note: gisNote, zeroReason: gisZeroReason },
            grandTotal: (finalCPP || 0) + finalOAS + gisAmount,
            insights: generateInsights(),
            breakevenData,
            crossovers: { age65: crossover65, age70: crossover70 },
            userIsDistinct,
            selectedAge: retirementAge,
            spouseAgeAtRetirement: isMarried ? (birthYear + retirementAge - parseInt(spouseDob.split('-')[0])) : null
        };
    }, [earnings, retirementAge, yearsInCanada, spouseIncome, spouseDob, isMarried, forceAllowance, otherIncome, dob]);

    // --- INFLATION ADJUSTMENT LOGIC ---
    const inflationFactor = useFutureDollars ? Math.pow(1.025, retirementAge - (CURRENT_YEAR - birthYear)) : 1;
    const displayTotal = results.grandTotal * inflationFactor;
    const displayCPP = results.cpp.total * inflationFactor;
    const displayOAS = results.oas.amount * inflationFactor;
    const displayGIS = results.gis.amount * inflationFactor;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700 pb-16">
            
            {/* ABOUT MODAL */}
            {showAbout && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowAbout(false)}>
                    <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl relative border border-slate-100" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setShowAbout(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"><XIcon size={24} /></button>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600"><UserGroupIcon size={28} /></div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">About CPP Forecast</h2>
                                <p className="text-sm text-slate-500">Transparent Financial Planning</p>
                            </div>
                        </div>
                        <div className="space-y-4 text-slate-600 leading-relaxed">
                            <p><strong>Born in Canada, Built for Privacy.</strong></p>
                            <p>Existing government calculators can be cumbersome. This tool handles the new <strong>Enhanced CPP (Tier 2)</strong> rules introduced in 2024/2025 with an easy-to-use interface.</p>
                            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-emerald-800 text-sm flex gap-3">
                                <span>🔒</span>
                                <div><strong>Privacy First:</strong> This entire calculator runs in your browser. No data is sent to our servers. Your financial information stays on your device.</div>
                            </div>
                            <p className="text-xs text-slate-400 mt-4 text-center">Built by Canadian financial enthusiasts in Ontario.</p>
                        </div>
                        <button onClick={() => setShowAbout(false)} className="mt-8 w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-slate-900/20">Close</button>
                    </div>
                </div>
            )}

            {/* IMPORT MODAL */}
            {showImport && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowImport(false)}>
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl relative border border-slate-100" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setShowImport(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"><XIcon size={24} /></button>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600"><UploadIcon size={24} /></div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Import from Service Canada</h2>
                                <p className="text-sm text-slate-500">Paste your "Statement of Contributions" data below.</p>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="text-sm text-slate-600 space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <p><strong>How to get your data:</strong></p>
                                <ol className="list-decimal pl-5 space-y-1">
                                    <li>Log in to <a href="https://www.canada.ca/en/employment-social-development/services/my-account.html" target="_blank" className="text-indigo-600 hover:underline">My Service Canada Account</a>.</li>
                                    <li>Go to <strong>CPP</strong> {'>'} <strong>Contributions</strong>.</li>
                                    <li>Select the entire table of years and amounts (Ctrl+A or drag to select).</li>
                                    <li>Copy (Ctrl+C) and paste it into the box below.</li>
                                </ol>
                            </div>
                            
                            <textarea 
                                value={importText}
                                onChange={(e) => setImportText(e.target.value)}
                                placeholder="Paste here (e.g. 2018  $55,900 ...)"
                                className="w-full h-40 p-4 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-xs transition-shadow shadow-sm resize-none"
                            />
                            
                            {importError && <div className="text-rose-600 text-sm font-bold flex items-center gap-2 animate-fade-in"><XIcon size={16}/> {importError}</div>}
                            
                            <div className="flex justify-end gap-3 pt-2">
                                <button onClick={() => setShowImport(false)} className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-100 rounded-lg transition">Cancel</button>
                                <button onClick={handleImport} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition shadow-lg shadow-indigo-200">Parse & Import</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* HEADER */}
            <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-6 py-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 text-white p-2 rounded-lg shadow-lg shadow-indigo-500/30">
                            <CalculatorIcon size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900">CPP & OAS Estimator</h1>
                            <div className="text-xs font-medium text-slate-500 tracking-wide uppercase">2025 Ruleset</div>
                        </div>
                    </div>
                    <div className="flex gap-4 items-center">
                        <button 
                            onClick={copyLink} 
                            className="text-sm font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-all flex items-center gap-2 border border-transparent hover:border-indigo-100"
                        >
                            {copySuccess ? <CheckIcon size={16} /> : <LinkIcon size={16} />}
                            {copySuccess ? "Copied!" : "Copy Link"}
                        </button>
                        <button onClick={() => setShowAbout(true)} className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors hidden sm:block">About</button>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="max-w-5xl mx-auto p-4 md:p-8 w-full">

                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden mb-12">
                    
                    {/* TABS HEADER */}
                    <div className="p-2 bg-slate-50 border-b border-slate-200">
                        <div className="flex bg-slate-200/50 p-1 rounded-xl">
                            <button onClick={() => setActiveTab('input')} className={`flex-1 py-2.5 text-sm font-bold text-center rounded-lg transition-all duration-200 ${activeTab === 'input' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
                                1. Earnings & Inputs
                            </button>
                            <button onClick={() => setActiveTab('results')} className={`flex-1 py-2.5 text-sm font-bold text-center rounded-lg transition-all duration-200 ${activeTab === 'results' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
                                2. View Estimate
                            </button>
                        </div>
                    </div>

                    <div className="p-6 md:p-8">
                        {activeTab === 'input' && (
                            <div className="animate-fade-in space-y-8">
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                                    {/* COLUMN 1: PERSONAL */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-2 text-indigo-600 mb-2">
                                            <UserGroupIcon size={20} />
                                            <h3 className="text-xs font-bold uppercase tracking-wider">Personal Profile</h3>
                                        </div>
                                        
                                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-5">
                                            <div>
                                                <label className="flex items-center text-sm font-bold text-slate-700 mb-2">
                                                    Date of Birth
                                                    <Tooltip text="Used to calculate your age for dropout years and start dates." />
                                                </label>
                                                <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm" />
                                            </div>

                                            {/* SIMPLIFIED MARITAL STATUS */}
                                            <div>
                                                <label className="flex items-center text-sm font-bold text-slate-700 mb-2">
                                                    Marital Status
                                                    <Tooltip text="Combined income affects GIS eligibility." />
                                                </label>
                                                <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                                                    <button onClick={() => setIsMarried(false)} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isMarried ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
                                                        Single
                                                    </button>
                                                    <button onClick={() => setIsMarried(true)} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isMarried ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
                                                        Married / Partnered
                                                    </button>
                                                </div>
                                            </div>

                                            {isMarried && (
                                                <div className="animate-fade-in space-y-4 pl-4 border-l-2 border-indigo-200">
                                                    <div>
                                                        <label className="flex items-center text-sm font-bold text-indigo-900 mb-2">
                                                            Spouse Date of Birth
                                                            <Tooltip text="We automatically calculate if your spouse qualifies for OAS or Allowance based on their age when YOU retire." />
                                                        </label>
                                                        <input type="date" value={spouseDob} onChange={(e) => setSpouseDob(e.target.value)} className="w-full p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                                                    </div>

                                                    <div>
                                                        <label className="flex items-center text-sm font-bold text-indigo-900 mb-2">
                                                            Spouse Annual Income
                                                            <Tooltip text="Total taxable income (CPP, Pension, Investments). Exclude OAS." />
                                                        </label>
                                                        <div className="relative">
                                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                                                            <input type="number" value={spouseIncome} onChange={(e) => setSpouseIncome(e.target.value)} className="w-full pl-7 p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="0" />
                                                        </div>
                                                    </div>
                                                    
                                                    {(() => {
                                                        const spouseAge = birthYear + retirementAge - parseInt(spouseDob.split('-')[0]);
                                                        if (spouseAge >= 60 && spouseAge < 65) {
                                                            return (
                                                                <label className="flex items-start gap-3 p-3 bg-indigo-100/50 rounded-xl cursor-pointer hover:bg-indigo-100 transition">
                                                                    <input type="checkbox" checked={forceAllowance} onChange={(e) => setForceAllowance(e.target.checked)} className="mt-1 w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
                                                                    <div className="text-xs text-indigo-900">
                                                                        <strong>Apply for Allowance Benefit?</strong><br/>
                                                                        Your spouse will be {spouseAge} when you retire. Check this if you expect to qualify for the low-income Allowance.
                                                                    </div>
                                                                </label>
                                                            );
                                                        }
                                                        return null;
                                                    })()}
                                                </div>
                                            )}

                                            <div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <label className="flex items-center text-sm font-bold text-slate-700">
                                                        Retirement Age
                                                        <Tooltip text="65 is standard. 60 is min (-36%). 70 is max (+42%)." />
                                                    </label>
                                                    <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-md">{retirementAge}</span>
                                                </div>
                                                <input type="range" min="60" max="70" step="1" value={retirementAge} onChange={(e) => setRetirementAge(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                                                <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium"><span>60</span><span>65</span><span>70</span></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* COLUMN 2: FINANCIAL */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-2 text-emerald-600 mb-2">
                                            <DollarSignIcon size={20} />
                                            <h3 className="text-xs font-bold uppercase tracking-wider">Financial Profile</h3>
                                        </div>

                                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-5">
                                            <div>
                                                <label className="flex items-center text-sm font-bold text-slate-700 mb-2">
                                                    Years in Canada (18-65)
                                                    <Tooltip text="40 years required for full OAS." />
                                                </label>
                                                <input type="number" min="0" max="47" value={yearsInCanada} onChange={(e) => setYearsInCanada(parseInt(e.target.value) || 0)} className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm" />
                                            </div>

                                            <div>
                                                <label className="flex items-center text-sm font-bold text-slate-700 mb-2">
                                                    Other Retirement Income
                                                    <Tooltip text="Pension, RRSP, etc. Triggers OAS Clawback." />
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                                                    <input type="number" placeholder="0" value={otherIncome} onChange={(e) => setOtherIncome(e.target.value)} className="w-full pl-7 p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm" />
                                                </div>
                                                <p className="text-xs text-slate-400 mt-2 ml-1">Required for accurate GIS/Clawback results.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 my-8"></div>

                                {/* EARNINGS GRID */}
                                <div>
                                    <div className="flex flex-col gap-6 mb-6">
                                        <div className="flex items-center gap-2 text-slate-700">
                                            <TrendingUpIcon size={20} />
                                            <h3 className="text-sm font-bold uppercase tracking-wider">Earnings History</h3>
                                        </div>

                                        {/* NEW QUICK ACTIONS TOOLBAR */}
                                        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-wrap gap-4 items-end">
                                            
                                            {/* SALARY ESTIMATOR */}
                                            <div className="flex-1 min-w-[240px]">
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                                                    Quick Fill: Estimate from Salary
                                                    <Tooltip text="Only fills future or empty years. Does not overwrite imported data." />
                                                </label>
                                                <div className="flex gap-2">
                                                    <div className="relative w-full">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                                                        <input type="number" placeholder="65000" value={avgSalaryInput} onChange={(e) => setAvgSalaryInput(e.target.value)} className="w-full pl-7 p-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                                                    </div>
                                                    <button onClick={applyAverageSalary} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-1 transition-all shadow-sm whitespace-nowrap">
                                                        <WandIcon size={16} /> Fill Future
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="w-px bg-slate-200 self-stretch mx-2 hidden md:block"></div>

                                            {/* IMPORT BUTTON */}
                                            <div className="flex-1 min-w-[180px]">
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                                                    Bulk Import
                                                </label>
                                                <button 
                                                    onClick={() => setShowImport(true)} 
                                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
                                                >
                                                    <FileTextIcon size={16} /> Import from MSCA
                                                </button>
                                            </div>

                                            <button onClick={() => setEarnings({})} className="text-xs font-bold text-rose-500 hover:bg-rose-50 hover:text-rose-700 px-4 py-2.5 rounded-lg border border-transparent hover:border-rose-200 transition flex items-center gap-1 self-end ml-auto">
                                                <RotateCcwIcon size={14} /> Reset
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                                        <div className="flex items-center justify-between bg-slate-50/80 backdrop-blur p-3 border-b border-slate-200">
                                            <div className="grid grid-cols-12 w-full text-xs font-bold text-slate-500 uppercase tracking-wider">
                                                <div className="col-span-2">Year</div><div className="col-span-2">Age</div><div className="col-span-3 text-right pr-6">YMPE</div><div className="col-span-5">Earnings</div>
                                            </div>
                                            <button 
                                                onClick={() => setCompactGrid(!compactGrid)} 
                                                className={`ml-2 p-1.5 rounded hover:bg-slate-200 transition ${compactGrid ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'}`}
                                                title={compactGrid ? "Show all years" : "Hide empty past years"}
                                            >
                                                <FilterIcon size={16} />
                                            </button>
                                        </div>
                                        
                                        <div className="max-h-[350px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                                        {years
                                            .filter(year => {
                                                if (!compactGrid) return true;
                                                // Always show future years (>= current) and years with data
                                                return year >= CURRENT_YEAR || (earnings[year] && earnings[year] > 0);
                                            })
                                            .map(year => {
                                            const isFuture = year > CURRENT_YEAR;
                                            const ympe = getYMPE(year);
                                            const yampe = getYAMPE(year);
                                            const maxVal = yampe > 0 ? yampe : ympe;
                                            const val = earnings[year] || '';
                                            const isMax = val >= maxVal && val !== '';
                                            return (
                                            <div key={year} className={`grid grid-cols-12 p-2 border-b border-slate-50 last:border-0 items-center hover:bg-slate-50 transition group ${isFuture ? 'bg-indigo-50/20' : ''}`}>
                                                <div className="col-span-2 text-sm font-semibold text-slate-700">{year}</div>
                                                <div className="col-span-2 text-sm text-slate-400 group-hover:text-slate-600">{year - birthYear}</div>
                                                <div className="col-span-3 text-right pr-6 text-sm text-slate-400 font-mono">${ympe.toLocaleString()}</div>
                                                <div className="col-span-5 flex items-center gap-2">
                                                    <div className="relative flex-1">
                                                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                                                        <input type="number" value={val} onChange={(e) => handleEarningChange(year, e.target.value)} className={`w-full pl-6 pr-2 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${isMax ? 'text-emerald-600 font-bold border-emerald-200 bg-emerald-50/30' : 'border-slate-200'}`} placeholder="0" />
                                                    </div>
                                                    <button onClick={() => toggleMax(year, isMax)} className={`px-2 py-1 text-[10px] font-bold rounded-md border transition-all uppercase tracking-wide ${isMax ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'}`}>Max</button>
                                                </div>
                                            </div>
                                            );
                                        })}
                                        {compactGrid && (
                                            <div className="p-2 text-center text-xs text-slate-400 italic">
                                                Hidden {years.length - years.filter(y => y >= CURRENT_YEAR || (earnings[y] && earnings[y] > 0)).length} empty past years.
                                            </div>
                                        )}
                                        </div>
                                    </div>
                                    
                                    <div className="mt-8 flex justify-center pb-4">
                                        <button onClick={() => setActiveTab('results')} className="bg-slate-900 hover:bg-slate-800 text-white text-lg font-bold py-4 px-10 rounded-2xl shadow-xl shadow-slate-900/20 transform transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-3">
                                            Calculate Estimate <ArrowRightIcon size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'results' && (
                            <div className="space-y-8 animate-fade-in">
                                
                                {/* HERO CARD */}
                                <div className="bg-slate-900 rounded-2xl shadow-2xl p-8 text-white relative overflow-hidden isolate">
                                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                                    
                                    <div className="relative z-10 text-center md:text-left md:flex justify-between items-center">
                                        <div>
                                            <h2 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Estimated Monthly Income</h2>
                                            <div className="flex items-baseline justify-center md:justify-start gap-1">
                                                <span className="text-5xl md:text-6xl font-bold tracking-tight">${displayTotal.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                                <span className="text-slate-400 text-lg">/ mo</span>
                                            </div>
                                            
                                            <div className="flex items-center gap-2 mt-4 justify-center md:justify-start">
                                                <div className="flex items-center bg-white/10 rounded-full p-1 pl-3 pr-1">
                                                    <span className="text-xs text-slate-300 mr-2">
                                                        {useFutureDollars ? `In Future Dollars (Age ${retirementAge})` : "In Today's Dollars (2025)"}
                                                    </span>
                                                    <button 
                                                        onClick={() => setUseFutureDollars(!useFutureDollars)}
                                                        className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${useFutureDollars ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                                                    >
                                                        {useFutureDollars ? 'Switch to Today\'s $' : 'Switch to Future $'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-8 md:mt-0 flex gap-3 flex-wrap justify-center">
                                            <div className="bg-white/10 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/10">
                                                <div className="text-slate-400 text-xs uppercase font-bold">CPP</div>
                                                <div className="text-xl font-bold">${displayCPP.toLocaleString(undefined, {minimumFractionDigits:0, maximumFractionDigits:0})}</div>
                                            </div>
                                            <div className="bg-white/10 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/10">
                                                <div className="text-slate-400 text-xs uppercase font-bold">OAS</div>
                                                <div className="text-xl font-bold">${displayOAS.toLocaleString(undefined, {minimumFractionDigits:0, maximumFractionDigits:0})}</div>
                                            </div>
                                            {displayGIS > 0 && 
                                                <div className="bg-emerald-500/20 backdrop-blur-sm px-5 py-3 rounded-xl border border-emerald-500/30 text-emerald-100">
                                                    <div className="text-emerald-300 text-xs uppercase font-bold">GIS</div>
                                                    <div className="text-xl font-bold">${displayGIS.toLocaleString(undefined, {minimumFractionDigits:0, maximumFractionDigits:0})}</div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>

                                {/* BREAKEVEN CHART */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><BarChartIcon size={20}/></div>
                                            <div>
                                                <h3 className="font-bold text-slate-800">Breakeven Analysis</h3>
                                                {results.crossovers.age70 && (
                                                    <p className="text-sm text-slate-600 mt-1">
                                                        Deferring to age 70 pays off if you live past <span className="font-bold text-indigo-700">{results.crossovers.age70}</span>.
                                                    </p>
                                                )}
                                                {!results.crossovers.age70 && results.crossovers.age65 && (
                                                    <p className="text-sm text-slate-600 mt-1">
                                                        Waiting until 65 pays off if you live past <span className="font-bold text-indigo-700">{results.crossovers.age65}</span>.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="h-[300px] w-full cursor-pointer relative group">
                                        {/* CLICK INSTRUCTION OVERLAY (Fades out on hover) */}
                                        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="bg-slate-900/10 p-4 rounded-full"><MousePointerIcon size={32} className="text-slate-400"/></div>
                                        </div>

                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart 
                                                data={results.breakevenData} 
                                                margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                                                onClick={(e) => { if(e && e.activeLabel) setChartSelection(e.activeLabel) }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                                <XAxis dataKey="age" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                                                <YAxis 
                                                    stroke="#94a3b8" 
                                                    fontSize={11} 
                                                    tickLine={false} 
                                                    axisLine={false}
                                                    tickFormatter={(value) => `$${value/1000}k`} 
                                                />
                                                <RechartsTooltip 
                                                    cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }}
                                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#f8fafc', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                                    itemStyle={{ color: '#f8fafc', fontSize: '12px', padding: '2px 0' }}
                                                    formatter={(value, name) => [`$${value.toLocaleString()}`, name]}
                                                    labelFormatter={(label) => <span className="font-bold text-slate-300 mb-2 block border-b border-slate-700 pb-1">At Age {label}</span>}
                                                />
                                                <Legend 
                                                    wrapperStyle={{ paddingTop: '15px', fontSize: '12px', cursor: 'pointer' }} 
                                                    iconType="circle" 
                                                    onClick={handleLegendClick}
                                                />
                                                
                                                <Line 
                                                    type="monotone" 
                                                    dataKey="Early" 
                                                    name="Start at 60" 
                                                    stroke="#10b981" 
                                                    strokeWidth={2} 
                                                    dot={false} 
                                                    activeDot={{ r: 6 }} 
                                                    hide={!lineVisibility.Early}
                                                />
                                                <Line 
                                                    type="monotone" 
                                                    dataKey="Standard" 
                                                    name="Start at 65" 
                                                    stroke="#3b82f6" 
                                                    strokeWidth={2} 
                                                    dot={false} 
                                                    activeDot={{ r: 6 }} 
                                                    hide={!lineVisibility.Standard} 
                                                />
                                                <Line 
                                                    type="monotone" 
                                                    dataKey="Deferred" 
                                                    name="Start at 70" 
                                                    stroke="#f59e0b" 
                                                    strokeWidth={2} 
                                                    dot={false} 
                                                    activeDot={{ r: 6 }} 
                                                    hide={!lineVisibility.Deferred}
                                                />
                                                
                                                {results.userIsDistinct && (
                                                    <Line 
                                                        type="monotone" 
                                                        dataKey="Selected" 
                                                        name={`Start at ${results.selectedAge} (Selected)`} 
                                                        stroke="#8b5cf6" 
                                                        strokeWidth={3} 
                                                        strokeDasharray="5 5" 
                                                        dot={false} 
                                                        activeDot={{ r: 8 }} 
                                                        hide={!lineVisibility.Selected}
                                                    />
                                                )}

                                                {results.crossovers.age65 && lineVisibility.Early && lineVisibility.Standard && <ReferenceLine x={results.crossovers.age65} stroke="#3b82f6" strokeDasharray="3 3" label={{ position: 'top', value: '65 beats 60', fill: '#3b82f6', fontSize: 10, fontWeight: 'bold' }} />}
                                                {results.crossovers.age70 && lineVisibility.Standard && lineVisibility.Deferred && <ReferenceLine x={results.crossovers.age70} stroke="#f59e0b" strokeDasharray="3 3" label={{ position: 'top', value: '70 beats 65', fill: '#f59e0b', fontSize: 10, fontWeight: 'bold' }} />}
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* CLICK DETAIL PANEL - Conditioned on Visibility */}
                                    {chartSelection && (
                                        <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-4 animate-fade-in">
                                            <div className="flex justify-between items-center mb-3">
                                                <h4 className="font-bold text-slate-800 flex items-center gap-2"><MousePointerIcon size={16} className="text-indigo-500"/> Deep Dive: Age {chartSelection}</h4>
                                                <button onClick={() => setChartSelection(null)} className="text-xs text-slate-400 hover:text-slate-600">Close</button>
                                            </div>
                                            <div className={`grid gap-2 text-center ${results.userIsDistinct ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-3'}`}>
                                                {results.breakevenData.filter(d => d.age === chartSelection).map(d => (
                                                    <React.Fragment key={d.age}>
                                                        {lineVisibility.Early && (
                                                            <div className="bg-emerald-50 border border-emerald-100 p-2 rounded-lg">
                                                                <div className="text-[10px] text-emerald-600 font-bold uppercase">Start 60</div>
                                                                <div className="font-bold text-emerald-800">${d.Early.toLocaleString()}</div>
                                                            </div>
                                                        )}
                                                        {lineVisibility.Standard && (
                                                            <div className="bg-blue-50 border border-blue-100 p-2 rounded-lg">
                                                                <div className="text-[10px] text-blue-600 font-bold uppercase">Start 65</div>
                                                                <div className="font-bold text-blue-800">${d.Standard.toLocaleString()}</div>
                                                            </div>
                                                        )}
                                                        {lineVisibility.Deferred && (
                                                            <div className="bg-amber-50 border border-amber-100 p-2 rounded-lg">
                                                                <div className="text-[10px] text-amber-600 font-bold uppercase">Start 70</div>
                                                                <div className="font-bold text-amber-800">${d.Deferred.toLocaleString()}</div>
                                                            </div>
                                                        )}
                                                        {results.userIsDistinct && lineVisibility.Selected && (
                                                            <div className="bg-violet-50 border border-violet-100 p-2 rounded-lg">
                                                                <div className="text-[10px] text-violet-600 font-bold uppercase">Start {results.selectedAge}</div>
                                                                <div className="font-bold text-violet-800">${d.Selected.toLocaleString()}</div>
                                                            </div>
                                                        )}
                                                    </React.Fragment>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* INSIGHTS */}
                                {results.insights.length > 0 && (
                                    <div className="grid gap-3">
                                        {results.insights.map((insight, idx) => (
                                            <div key={idx} className={`text-sm p-4 rounded-xl border flex items-start gap-3 shadow-sm ${
                                                insight.type === 'danger' ? 'bg-rose-50 border-rose-100 text-rose-800' :
                                                insight.type === 'warning' ? 'bg-amber-50 border-amber-100 text-amber-800' :
                                                insight.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' :
                                                'bg-indigo-50 border-indigo-100 text-indigo-700'
                                            }`}>
                                                <div className="mt-0.5 shrink-0">
                                                    {insight.type === 'danger' ? <XIcon size={16}/> : 
                                                     insight.type === 'warning' ? <InfoIcon size={16}/> : 
                                                     insight.type === 'success' ? <CheckCircleIcon size={16}/> : <LightbulbIcon size={16}/>}
                                                </div>
                                                <span className="font-medium">{insight.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* DETAIL CARDS */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* CPP CARD */}
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
                                        <div className="flex items-center gap-3 mb-4 text-slate-700">
                                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><TrendingUpIcon size={20}/></div>
                                            <h3 className="font-bold">CPP Details</h3>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500">Base</span>
                                                <span className="font-mono font-medium">${(results.cpp.base * inflationFactor).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500">Enhanced</span>
                                                <span className="font-mono font-medium text-emerald-600">+${(results.cpp.enhanced * inflationFactor).toFixed(2)}</span>
                                            </div>
                                            <div className="pt-3 border-t border-slate-100 flex justify-between text-sm font-bold">
                                                <span className="text-slate-800">Total CPP</span>
                                                <span>${displayCPP.toFixed(2)}</span>
                                            </div>
                                            {results.cpp.zeroReason && (
                                                <div className="text-xs text-center bg-amber-50 text-amber-700 p-2 rounded border border-amber-100 font-semibold mt-2">
                                                    {results.cpp.zeroReason}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* OAS CARD */}
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
                                        <div className="flex items-center gap-3 mb-4 text-slate-700">
                                            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><HomeIcon size={20}/></div>
                                            <h3 className="font-bold">OAS Details</h3>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500">Gross Amount</span>
                                                <span className="font-mono font-medium">${(results.oas.gross * inflationFactor).toFixed(2)}</span>
                                            </div>
                                            {results.oas.clawback > 0 && (
                                                <div className="flex justify-between text-sm text-rose-600 bg-rose-50 px-2 py-1 rounded">
                                                    <span>Recovery Tax</span>
                                                    <span className="font-mono">-${(results.oas.clawback * inflationFactor).toFixed(2)}</span>
                                                </div>
                                            )}
                                            <div className="pt-3 border-t border-slate-100 flex justify-between text-sm font-bold">
                                                <span className="text-slate-800">Net OAS</span>
                                                <span>${displayOAS.toFixed(2)}</span>
                                            </div>
                                            {results.oas.zeroReason && (
                                                <div className="text-xs text-center bg-amber-50 text-amber-700 p-2 rounded border border-amber-100 font-semibold mt-2">
                                                    {results.oas.zeroReason}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* GIS CARD */}
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                                        <div className="flex items-center gap-3 mb-4 text-slate-700">
                                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><HeartHandshakeIcon size={20}/></div>
                                            <h3 className="font-bold">GIS Details</h3>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500">Supplement</span>
                                                <span className="font-mono font-medium text-emerald-600">${displayGIS.toFixed(2)}</span>
                                            </div>
                                            {results.gis.note && (<div className="text-xs text-slate-400 mt-2 bg-slate-50 p-2 rounded">{results.gis.note}</div>)}
                                            <div className="pt-3 border-t border-slate-100 flex justify-between text-sm font-bold">
                                                <span className="text-slate-800">Total GIS</span>
                                                <span>${displayGIS.toFixed(2)}</span>
                                            </div>
                                            {results.gis.zeroReason && (
                                                <div className="text-xs text-center bg-amber-50 text-amber-700 p-2 rounded border border-amber-100 font-semibold mt-2">
                                                    {results.gis.zeroReason}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex justify-center pt-8">
                                    <button onClick={() => setActiveTab('input')} className="text-slate-500 hover:text-indigo-600 text-sm font-semibold flex items-center gap-2 transition-colors">
                                        <RotateCcwIcon size={16} /> Edit Inputs
                                    </button>
                                </div>

                            </div>
                        )}
                    </div>
                </div>

                {/* INFO SECTION */}
                <div className="max-w-3xl mx-auto space-y-4">
                    <Accordion title="Guide to 2025 CPP & OAS Changes" icon={BookOpenIcon}>
                        <p className="mb-4">In 2025, the Canada Pension Plan (CPP) completes a major transition into 'Phase 2' of the enhancement strategy. The most visible change is the <strong>Second Earnings Ceiling (YAMPE)</strong>. For decades, there was only one limit (YMPE). Now, there are two.</p>
                        <p className="mb-4">If you earn up to <strong>$71,300</strong> (the 2025 YMPE), you contribute at the base rate. However, if you earn <em>between</em> $71,300 and approximately <strong>$81,200</strong> (the YAMPE), you make additional <strong>Tier 2 contributions</strong>.</p>
                        <p>Simultaneously, Old Age Security (OAS) thresholds have indexed to inflation. The recovery tax (clawback) threshold is projected to rise to approximately <strong>$93,454</strong>.</p>
                    </Accordion>

                    <Accordion title="How Calculations Are Done" icon={CalculatorIcon}>
                         <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-bold text-slate-800 mb-2">1. Contribution Period</h4>
                                <p className="mb-2">Your contributory period starts at age 18. The <strong>General Drop-out Provision</strong> automatically removes the lowest 17% of your earning months.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 mb-2">2. Enhanced CPP</h4>
                                <p className="mb-2">Calculates Phase 1 (25% to 33.33% replacement rate) and Phase 2 (New YAMPE ceiling) separately and adds them to your base.</p>
                            </div>
                        </div>
                    </Accordion>
                    
                    <Accordion title="Understanding GIS" icon={HeartHandshakeIcon}>
                        <p className="mb-4">GIS is a monthly non-taxable benefit to OAS recipients with low income.</p>
                        <ul className="list-disc pl-5 space-y-2 mb-4">
                            <li>You must be receiving OAS to get GIS (Age 65+).</li>
                            <li>For single individuals, GIS is reduced by <strong>50 cents</strong> for every dollar of income you earn (excluding OAS).</li>
                            <li>For married couples, income is combined.</li>
                        </ul>
                   </Accordion>

                    <Accordion title="Government Sources" icon={ExternalLinkIcon}>
                        <ul className="text-sm space-y-2 text-indigo-600 pl-4 font-medium">
                            <li><a href="https://www.canada.ca/en/services/benefits/publicpensions/cpp/payment-amounts.html" target="_blank" className="hover:underline flex items-center gap-1">CPP Payment Amounts <ExternalLinkIcon size={12} /></a></li>
                            <li><a href="https://www.canada.ca/en/services/benefits/publicpensions/old-age-security/payments.html" target="_blank" className="hover:underline flex items-center gap-1">OAS Payments & Thresholds <ExternalLinkIcon size={12} /></a></li>
                            <li><a href="https://www.canada.ca/en/employment-social-development/services/my-account.html" target="_blank" className="hover:underline flex items-center gap-1">My Service Canada Account (MSCA) <ExternalLinkIcon size={12} /></a></li> 
                        </ul>
                    </Accordion>
                </div>

            </main>

            <footer className="text-center text-slate-400 text-sm py-8 mt-8 border-t border-slate-200">
                <div className="flex justify-center gap-6 mb-4 font-medium">
                    <a href="/blog" className="hover:text-indigo-600 transition">Guides</a>
                    <span>•</span>
                    <button onClick={() => setShowAbout(true)} className="hover:text-indigo-600 transition">About</button>
                    <span>•</span>
                    <a href="mailto:support@cppforecast.ca" className="hover:text-indigo-600 transition">Contact</a>
                </div>
                <p>Not financial advice. For estimation purposes only.</p>
            </footer>
        </div>
    );
};