import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { calculateAll } from '../utils/benefitEngine';
import HouseholdForm from './HouseholdForm';
import BenefitResults from './BenefitResults';
import { AICommandBar, StrategyCard, AICopilot } from '../../../components/shared';
import { useFinancialMemory } from '../../../hooks/useFinancialMemory';

const CCB_SUGGESTIONS = [
    { label: 'Ontario Family', value: 'We make $85k combined in Ontario with a 2 and 4 year old' },
    { label: 'Single Parent', value: 'I am a single parent making $50k with one 3 year old child' },
    { label: 'Add Disability', value: 'What if our 5 year old has the disability tax credit?' }
];

export default function HouseholdBenefits({ 
    isVisible = true, 
    initialProvince = 'ON', 
    initialIncome = 65000,
    initialMaritalStatus = 'MARRIED', 
    initialChildCount = 2 
}) {
    const { memory, updateMemory } = useFinancialMemory();
    
    const getParam = (key) => {
        if (typeof window === 'undefined') return null;
        const params = new URLSearchParams(window.location.search);
        return params.get(key);
    };

    // --- LAZY STATE INITIALIZATION ---
    const [province, setProvince] = useState(() => getParam('p') || memory.province || initialProvince);
    const [grossAfni, setGrossAfni] = useState(() => {
        const urlI = getParam('i');
        if (urlI) return parseInt(urlI, 36);
        return memory.grossIncome || initialIncome;
    });
    const [maritalStatus, setMaritalStatus] = useState(() => getParam('ms') || memory.maritalStatus || initialMaritalStatus);
    const [children, setChildren] = useState(() => {
        const urlC = getParam('c');
        if (urlC) {
            try {
                return urlC.split('_').map((str, idx) => {
                    const [age, dis] = str.split('-');
                    return { id: Date.now() + idx, age: parseInt(age) || 0, disability: dis === '1' };
                });
            } catch(e) { return [{ id: 1, age: 3, disability: false }]; }
        }
        if (memory.children?.length > 0) {
            return memory.children.map((c, i) => ({ id: Date.now() + i, age: c.age, disability: c.disability || false }));
        }
        const kids = [];
        for(let i=0; i < initialChildCount; i++) {
            kids.push({ id: Date.now() + i, age: i * 2 + 1, disability: false });
        }
        return kids;
    });

    const [sharedCustody, setSharedCustody] = useState(() => getParam('sc') === '1');
    const [isRural, setIsRural] = useState(() => getParam('r') === '1');
    const [aiInsight, setAiInsight] = useState('');
    const [activeTab, setActiveTab] = useState('input');
    const [copySuccess, setCopySuccess] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    // --- EXPLICIT SETTERS ---
    const updateProvince = (val) => { setProvince(val); updateMemory({ province: val }); };
    const updateIncome = (val) => { setGrossAfni(val); updateMemory({ grossIncome: val }); };
    const updateMarital = (val) => { setMaritalStatus(val); updateMemory({ maritalStatus: val }); };
    const updateKids = (val) => { setChildren(val); updateMemory({ children: val.map(c => ({ age: c.age, disability: c.disability })) }); };

    // ==========================================
    //   SYNC TO URL (Live Update)
    // ==========================================
    useEffect(() => {
        if(!mounted) return;
        const params = new URLSearchParams(window.location.search);
        if (grossAfni > 0) params.set('i', grossAfni.toString(36)); else params.delete('i');
        params.set('p', province);
        params.set('ms', maritalStatus);
        params.set('sc', sharedCustody ? '1' : '0');
        params.set('r', isRural ? '1' : '0');
        if (children.length > 0) {
            const childStr = children.map(c => `${c.age}-${c.disability ? 1 : 0}`).join('_');
            params.set('c', childStr);
        } else { params.delete('c'); }
        params.set('view', 'ccb');
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState(null, '', newUrl);
    }, [grossAfni, province, maritalStatus, sharedCustody, isRural, children, mounted]);

    // Child Handlers
    const addChild = () => updateKids([...children, { id: Date.now(), age: 0, disability: false }]);
    const removeChild = (id) => updateKids(children.filter(c => c.id !== id));
    const updateChild = (id, field, value) => {
        const next = children.map(c => c.id === id ? { ...c, [field]: value } : c);
        updateKids(next);
    };

    const handleAIUpdate = (data) => {
        if (data.province) updateProvince(data.province);
        if (data.maritalStatus) updateMarital(data.maritalStatus);
        if (data.grossAfni !== undefined) updateIncome(data.grossAfni);
        if (data.sharedCustody !== undefined) setSharedCustody(data.sharedCustody);
        if (data.isRural !== undefined) setIsRural(data.isRural);
        
        if (data.children && Array.isArray(data.children)) {
            const newKids = data.children.map((k, i) => ({
                id: Date.now() + i, 
                age: k.age,
                disability: k.disability || false
            }));
            updateKids(newKids);
        }
        if (data.strategy_insight) setAiInsight(data.strategy_insight);
    };

    const results = useMemo(() => calculateAll(grossAfni || 0, children, sharedCustody, province, maritalStatus, isRural), [grossAfni, children, sharedCustody, province, maritalStatus, isRural]);

    // Graph Data
    const chartData = useMemo(() => {
        const data = [];
        for (let inc = 0; inc <= 180000; inc += 5000) {
            const res = calculateAll(inc, children, sharedCustody, province, maritalStatus, isRural);
            data.push({ income: inc, CCB: Math.round(res.federal), Provincial: Math.round(res.provincial), Credits: Math.round(res.gst + res.caip) });
        }
        return data;
    }, [children, sharedCustody, province, maritalStatus, isRural]);

    const paymentSchedule = useMemo(() => {
        const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"];
        return months.map(m => {
            const isQuarterly = ["Jul", "Oct", "Jan", "Apr"].includes(m);
            let base = (results.federal) / 12;
            if (province === 'ON') base += (results.provincial / 12);
            else if (province === 'AB' || province === 'QC') {
                const isAbQuarter = ["Aug", "Nov", "Feb", "May"].includes(m);
                base += isAbQuarter ? (results.provincial / 4) : 0; 
            } else base += (results.provincial / 12);
            const extra = isQuarterly ? (results.gst / 4) + (results.caip / 4) : 0;
            return { month: m, total: base + extra, isQuarterly: (isQuarterly || (["Aug", "Nov", "Feb", "May"].includes(m) && (province === 'AB' || province === 'QC'))) };
        });
    }, [results, province]);

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href).then(() => { 
            setCopySuccess(true); 
            setTimeout(() => setCopySuccess(false), 2000); 
        });
    };

    return (
        <div className="bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100" style={{ paddingBottom: activeTab === 'input' ? '100px' : '40px' }}>
            <main className="max-w-5xl mx-auto p-4 md:p-8 w-full mt-6 flex flex-col min-h-0">
                {/* AI HERO SECTION (Hidden for Copilot)
                <AICommandBar 
                    endpoint="/api/ai/ccb"
                    suggestions={CCB_SUGGESTIONS}
                    onUpdate={handleAIUpdate}
                    context={{ province, maritalStatus, income: grossAfni, children, sharedCustody, isRural }}
                    globalMemory={memory}
                />
                <StrategyCard insight={aiInsight} />
                */}

                {/* AI Copilot Persistent Sidebar/Bottom-sheet */}
                <AICopilot 
                    onUpdate={handleAIUpdate}
                    context={{ calculatorId: 'ccb', province, maritalStatus, grossAfni, children, sharedCustody, isRural }}
                    globalMemory={memory}
                />

                <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden mb-12">
                    <div className="p-2 bg-slate-50 border-b">
                        <div className="flex bg-slate-200/50 p-1 rounded-2xl">
                            <button onClick={() => setActiveTab('input')} className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'input' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>1. Household Inputs</button>
                            <button onClick={() => setActiveTab('results')} className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'results' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>2. View Entitlement</button>
                        </div>
                    </div>
                    <div className="p-4 md:p-10">
                        {activeTab === 'input' && (
                            <HouseholdForm
                                province={province}
                                setProvince={updateProvince}
                                maritalStatus={maritalStatus}
                                setMaritalStatus={updateMarital}
                                grossAfni={grossAfni}
                                setGrossAfni={updateIncome}
                                sharedCustody={sharedCustody}
                                setSharedCustody={setSharedCustody}
                                isRural={isRural}
                                setIsRural={setIsRural}
                                children={children}
                                addChild={addChild}
                                removeChild={removeChild}
                                updateChild={updateChild}
                                results={results}
                                copyLink={copyLink}
                                copySuccess={copySuccess}
                                setActiveTab={setActiveTab}
                                isVisible={activeTab === 'input'}
                                mounted={mounted}
                            />
                        )}
                        {activeTab === 'results' && (
                            <BenefitResults results={results} chartData={chartData} paymentSchedule={paymentSchedule} afni={grossAfni || 0} />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
