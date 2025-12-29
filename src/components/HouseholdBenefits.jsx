import React, { useState, useEffect, useMemo } from 'react';
import { calculateAll } from '../features/child-benefit/utils/benefitEngine';
import HouseholdForm from './HouseholdForm';
import BenefitResults from './BenefitResults';

// ==========================================
//              MAIN COMPONENT
// ==========================================
export default function HouseholdBenefits({ 
    isVisible = true, 
    initialProvince = 'ON', 
    initialIncome = 65000,
    initialMaritalStatus = 'MARRIED',
    initialChildCount = 2 
}) {
    
    const getParam = (key) => {
        if (typeof window === 'undefined') return null;
        const params = new URLSearchParams(window.location.search);
        return params.get(key);
    };

    // --- LAZY STATE INITIALIZATION ---
    // 1. Province
    const [province, setProvince] = useState(() => {
        return getParam('p') || initialProvince;
    });

    // 2. Income
    const [grossAfni, setGrossAfni] = useState(() => {
        const urlI = getParam('i');
        return urlI ? parseInt(urlI, 36) : initialIncome;
    });

    // 3. Marital Status
    const [maritalStatus, setMaritalStatus] = useState(() => {
        return getParam('ms') || initialMaritalStatus;
    });

    // 4. Children (Complex Logic)
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
        const kids = [];
        for(let i=0; i < initialChildCount; i++) {
            kids.push({ id: Date.now() + i, age: i * 2 + 1, disability: false });
        }
        return kids;
    });

    const [sharedCustody, setSharedCustody] = useState(() => getParam('sc') === '1');
    const [isRural, setIsRural] = useState(() => getParam('r') === '1');
    
    const [activeTab, setActiveTab] = useState('input');
    const [copySuccess, setCopySuccess] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    const afni = Math.max(0, grossAfni || 0);

    // ==========================================
    //   SYNC TO URL (Live Update)
    // ==========================================
    useEffect(() => {
        if(!mounted) return;

        const params = new URLSearchParams(window.location.search);

        if (grossAfni > 0) params.set('i', grossAfni.toString(36));
        else params.delete('i');

        params.set('p', province);
        params.set('ms', maritalStatus);
        params.set('sc', sharedCustody ? '1' : '0');
        params.set('r', isRural ? '1' : '0');

        if (children.length > 0) {
            const childStr = children.map(c => `${c.age}-${c.disability ? 1 : 0}`).join('_');
            params.set('c', childStr);
        } else {
            params.delete('c');
        }

        params.set('view', 'ccb');

        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState(null, '', newUrl);

    }, [grossAfni, province, maritalStatus, sharedCustody, isRural, children, mounted]);


    // Child Handlers
    const addChild = () => setChildren([...children, { id: Date.now(), age: 0, disability: false }]);
    const removeChild = (id) => setChildren(children.filter(c => c.id !== id));
    const updateChild = (id, field, value) => {
        setChildren(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    const results = useMemo(() => calculateAll(afni, children, sharedCustody, province, maritalStatus, isRural), [afni, children, sharedCustody, province, maritalStatus, isRural]);

    // Graph Data
    const chartData = useMemo(() => {
        const data = [];
        for (let inc = 0; inc <= 180000; inc += 5000) {
            const res = calculateAll(inc, children, sharedCustody, province, maritalStatus, isRural);
            data.push({ 
                income: inc, 
                CCB: Math.round(res.federal), 
                Provincial: Math.round(res.provincial), 
                Credits: Math.round(res.gst + res.caip) 
            });
        }
        return data;
    }, [children, sharedCustody, province, maritalStatus, isRural]);

    const paymentSchedule = useMemo(() => {
        const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"];
        return months.map(m => {
            const isQuarterly = ["Jul", "Oct", "Jan", "Apr"].includes(m);
            let base = (results.federal) / 12;
            
            if (province === 'ON') {
                base += (results.provincial / 12);
            } else if (province === 'AB' || province === 'QC') {
                const isAbQuarter = ["Aug", "Nov", "Feb", "May"].includes(m);
                if (province === 'QC') isAbQuarter ? base += (results.provincial / 4) : base += 0; 
                else isAbQuarter ? base += (results.provincial / 4) : base += 0; 
            } else {
                base += (results.provincial / 12); 
            }

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
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100" style={{ paddingBottom: activeTab === 'input' ? '100px' : '40px' }}>
            
            <main className="max-w-5xl mx-auto p-4 md:p-8 w-full mt-6">
                <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden mb-12">
                    {/* TABS */}
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
                                setProvince={setProvince}
                                maritalStatus={maritalStatus}
                                setMaritalStatus={setMaritalStatus}
                                grossAfni={grossAfni}
                                setGrossAfni={setGrossAfni}
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
                                isVisible={isVisible}
                                mounted={mounted}
                            />
                        )}

                        {activeTab === 'results' && (
                            <BenefitResults
                                results={results}
                                chartData={chartData}
                                paymentSchedule={paymentSchedule}
                                afni={afni}
                            />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}