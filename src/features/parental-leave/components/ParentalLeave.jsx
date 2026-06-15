import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useUrlTab } from '../../../hooks/useUrlTab';
import { 
    calculateParentalLeave,
    getCurrentMaxInsurable,
    getIndividualMaxWeeks,
    getMaxWeeks,
    isBonusWeeksActive
} from '../utils/parentalLeaveEngine';
import ParentalLeaveForm from './ParentalLeaveForm';
import ParentalLeaveResults from './ParentalLeaveResults';
import { AICommandBar, StrategyCard } from '../../../components/shared';

const PARENTAL_SUGGESTIONS = [
    { label: 'Standard Leave', value: 'I make $75k in BC and want to take 12 months off' },
    { label: 'Split with Partner', value: 'My partner makes $60k and I make $80k, how do we split 18 months?' },
    { label: 'Quebec QPIP', value: 'How does parental leave work in Quebec if I make $90k?' }
];

// ==========================================
//              MAIN COMPONENT
// ==========================================
export default function ParentalLeave({ 
    isVisible = true, 
    initialProvince = 'ON', 
    initialSalary = 70000,
    initialPartner = true,
    initialPlan = 'STANDARD' 
}) {
    
    const getParam = (key) => {
        if (typeof window === 'undefined') return null;
        const params = new URLSearchParams(window.location.search);
        return params.get(key);
    };

    // --- LAZY STATE INITIALIZATION ---
    const [province, setProvince] = useState(() => getParam('prov') || initialProvince);
    const [salary, setSalary] = useState(() => {
        const val = getParam('sal');
        return val ? parseInt(val, 36) : initialSalary;
    });
    const [partnerSalary, setPartnerSalary] = useState(() => {
        const val = getParam('psal');
        return val ? parseInt(val, 36) : 60000;
    });
    const [hasPartner, setHasPartner] = useState(() => {
        const val = getParam('part');
        return val ? val === '1' : initialPartner;
    });
    const [planType, setPlanType] = useState(() => {
        const val = getParam('plan');
        if (val) return val === 'ext' ? 'EXTENDED' : 'STANDARD';
        return initialPlan;
    });
    const [p1Maternity, setP1Maternity] = useState(() => {
        const val = getParam('mat');
        return val ? val === '1' : true;
    });
    const [p1Weeks, setP1Weeks] = useState(() => {
        const val = getParam('p1w');
        if (val) return parseInt(val);
        return initialPlan === 'EXTENDED' ? 50 : 30;
    });
    const [p2Weeks, setP2Weeks] = useState(() => {
        const val = getParam('p2w');
        if (val) return parseInt(val);
        return 5;
    });

    const [aiInsight, setAiInsight] = useState('');
    const [activeTab, setActiveTab] = useUrlTab('input', 'step');
    const [copySuccess, setCopySuccess] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    // Helper: Get Current Max Insurable based on province
    const currentMaxInsurable = useMemo(() => 
        getCurrentMaxInsurable(province),
        [province]
    );

    // ==========================================
    //    SYNC TO URL (Live Update)
    // ==========================================
    useEffect(() => {
        if (!mounted) return;
        const params = new URLSearchParams(window.location.search);
        params.set('prov', province);
        if (salary > 0) params.set('sal', salary.toString(36)); else params.delete('sal');
        if (hasPartner) {
            params.set('part', '1');
            if (partnerSalary > 0) params.set('psal', partnerSalary.toString(36)); else params.delete('psal');
        } else {
            params.set('part', '0');
            params.delete('psal');
        }
        params.set('plan', planType === 'EXTENDED' ? 'ext' : 'std');
        params.set('mat', p1Maternity ? '1' : '0');
        params.set('p1w', p1Weeks);
        if (hasPartner) params.set('p2w', p2Weeks); else params.delete('p2w');
        params.set('view', 'parental');
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState(null, '', newUrl);
    }, [province, salary, partnerSalary, hasPartner, planType, p1Maternity, p1Weeks, p2Weeks, mounted]);

    // Reset/Adjust weeks when Plan Type or Partner status changes
    useEffect(() => {
        if (!mounted) return;
        const indMax = getIndividualMaxWeeks(province, planType);
        if (p1Weeks > indMax) setP1Weeks(indMax);
        if (p2Weeks > indMax) setP2Weeks(indMax);
        if (!hasPartner) setP2Weeks(0);
    }, [planType, hasPartner, province, mounted, p1Weeks, p2Weeks]);

    // --- SLIDER LOGIC ---
    const handleWeeksChange = useCallback((parent, val) => {
        const indMax = getIndividualMaxWeeks(province, planType);
        const maxWeeksTotal = getMaxWeeks(province, planType);
        const pool = hasPartner ? maxWeeksTotal : indMax;
        let newWeeks = parseInt(val, 10);
        if (newWeeks > indMax) newWeeks = indMax;
        if (parent === 1) {
            if (newWeeks + p2Weeks > pool) setP2Weeks(Math.max(0, pool - newWeeks));
            setP1Weeks(newWeeks);
        } else {
            if (newWeeks + p1Weeks > pool) setP1Weeks(Math.max(0, pool - newWeeks));
            setP2Weeks(newWeeks);
        }
    }, [planType, hasPartner, province, p1Weeks, p2Weeks]);

    // --- AI HANDLER ---
    const handleAIUpdate = (data) => {
        if (data.province) setProvince(data.province);
        if (data.salary !== undefined) setSalary(data.salary);
        if (data.partnerSalary !== undefined) {
            setPartnerSalary(data.partnerSalary);
            setHasPartner(true);
        }
        if (data.hasPartner !== undefined) setHasPartner(data.hasPartner);
        if (data.planType) setPlanType(data.planType);
        if (data.p1Maternity !== undefined) setP1Maternity(data.p1Maternity);
        if (data.p1Weeks !== undefined) setP1Weeks(data.p1Weeks);
        if (data.p2Weeks !== undefined) setP2Weeks(data.p2Weeks);
        if (data.strategy_insight) setAiInsight(data.strategy_insight);
    };

    const results = useMemo(() => {
        return calculateParentalLeave({
            province, salary, partnerSalary, hasPartner, planType, p1Weeks, p2Weeks, p1Maternity
        });
    }, [province, salary, partnerSalary, hasPartner, planType, p1Weeks, p2Weeks, p1Maternity]);

    const combinedWeeks = useMemo(() => p1Weeks + p2Weeks, [p1Weeks, p2Weeks]);
    const individualMax = useMemo(() => getIndividualMaxWeeks(province, planType), [province, planType]);
    const maxWeeks = useMemo(() => getMaxWeeks(province, planType), [province, planType]);
    const bonusWeeksActive = useMemo(() => isBonusWeeksActive(combinedWeeks, individualMax), [combinedWeeks, individualMax]);

    const copyLink = useCallback(() => {
        navigator.clipboard.writeText(window.location.href).then(() => { 
            setCopySuccess(true); 
            setTimeout(() => setCopySuccess(false), 2000); 
        });
    }, []);

    return (
        <div className="bg-slate-50 text-slate-900 font-sans selection:bg-rose-100" style={{ paddingBottom: activeTab === 'input' ? '100px' : '40px' }}>
            
            <main className="max-w-5xl mx-auto p-4 md:p-8 w-full mt-6 flex flex-col min-h-0">
                
                {/* AI HERO SECTION */}
                <AICommandBar 
                    endpoint="/api/ai/parental-leave"
                    suggestions={PARENTAL_SUGGESTIONS}
                    onUpdate={handleAIUpdate}
                    context={{ province, salary, partnerSalary, hasPartner, planType, p1Weeks, p2Weeks, p1Maternity }}
                />

                <StrategyCard insight={aiInsight} />

                <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden mb-12">
                    {/* TABS */}
                    <div className="p-2 bg-slate-50 border-b">
                        <div className="flex bg-slate-200/50 p-1 rounded-2xl">
                            <button onClick={() => setActiveTab('input')} className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'input' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>1. Configure</button>
                            <button onClick={() => setActiveTab('results')} className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'results' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>2. Your Results</button>
                        </div>
                    </div>

                    <div className="p-4 md:p-10">
                        {activeTab === 'input' && (
                            <ParentalLeaveForm
                                province={province}
                                setProvince={setProvince}
                                salary={salary}
                                setSalary={setSalary}
                                partnerSalary={partnerSalary}
                                setPartnerSalary={setPartnerSalary}
                                hasPartner={hasPartner}
                                setHasPartner={setHasPartner}
                                planType={planType}
                                setPlanType={setPlanType}
                                p1Maternity={p1Maternity}
                                setP1Maternity={setP1Maternity}
                                p1Weeks={p1Weeks}
                                p2Weeks={p2Weeks}
                                handleWeeksChange={handleWeeksChange}
                                currentMaxInsurable={currentMaxInsurable}
                                individualMax={individualMax}
                                maxWeeks={maxWeeks}
                                combinedWeeks={combinedWeeks}
                                bonusWeeksActive={bonusWeeksActive}
                                results={results}
                                copyLink={copyLink}
                                copySuccess={copySuccess}
                                setActiveTab={setActiveTab}
                                isVisible={isVisible}
                                mounted={mounted}
                            />
                        )}

                        {activeTab === 'results' && (
                            <ParentalLeaveResults
                                results={results}
                                hasPartner={hasPartner}
                                province={province}
                            />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
