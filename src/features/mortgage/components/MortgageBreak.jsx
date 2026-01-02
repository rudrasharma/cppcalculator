import React, { useState, useEffect } from 'react';
import MortgageForm from './MortgageForm';
import MortgageResults from './MortgageResults';
import AICopilot from '../../../components/AICopilot';
import { useLiveRates } from '../hooks/useLiveRates';

export default function MortgageBreak({ isVisible = true }) {
    const [balance, setBalance] = useState(450000);
    const [currentRate, setCurrentRate] = useState(5.29);
    
    // Default placeholder
    const [newRate, setNewRate] = useState(0); 
    const [monthsRemaining, setMonthsRemaining] = useState(36);
    
    const [lenderKey, setLenderKey] = useState('RBC');
    const [mortgageType, setMortgageType] = useState('FIXED');
    const [newMortgageType, setNewMortgageType] = useState('FIXED');

    // LIVE DATA HOOK
    const { rates, loading } = useLiveRates();

    // DERIVED STATE: Determine the "Target" live rate based on toggle
    const targetLiveRate = rates ? (newMortgageType === 'FIXED' ? rates.fixed5Year : rates.variable5Year) : null;

    // LOGIC: If the current box value matches the live rate, the badge is ON.
    // We use a small epsilon (0.001) to handle floating point math safety.
    const isLiveRate = targetLiveRate !== null && Math.abs(newRate - targetLiveRate) < 0.001;

    // Auto-fill when rates arrive (Only if currently 0)
    useEffect(() => {
        if (targetLiveRate && newRate === 0) {
            setNewRate(targetLiveRate);
        }
    }, [targetLiveRate, newRate]);

    // Handle manual typing
    const handleManualRateChange = (val) => {
        setNewRate(val);
    };
    
    if (!isVisible) return null;

    return (
        <div className="max-w-6xl mx-auto px-4 py-4 md:py-12 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                <MortgageForm 
                    balance={balance} setBalance={setBalance}
                    currentRate={currentRate} setCurrentRate={setCurrentRate}
                    newRate={newRate} setNewRate={handleManualRateChange} 
                    monthsRemaining={monthsRemaining} setMonthsRemaining={setMonthsRemaining}
                    lenderKey={lenderKey} setLenderKey={setLenderKey}
                    mortgageType={mortgageType} setMortgageType={setMortgageType}
                    newMortgageType={newMortgageType} setNewMortgageType={setNewMortgageType}
                    
                    // Pass the robust derived boolean
                    isLiveRate={isLiveRate}
                    isLoadingRates={loading}
                />
                <MortgageResults 
                    balance={balance}
                    currentRate={currentRate}
                    newRate={newRate}
                    monthsRemaining={monthsRemaining}
                    lenderKey={lenderKey}
                    mortgageType={mortgageType}
                    newMortgageType={newMortgageType}
                />
            </div>
            
            <AICopilot 
                mode="mortgage"
                context={{ balance, currentRate, newRate, monthsRemaining, lenderKey }}
                onUpdateCalculator={(data) => {
                    if (data.balance) setBalance(data.balance);
                    if (data.currentRate) setCurrentRate(data.currentRate);
                    if (data.newRate) setNewRate(data.newRate);
                    if (data.monthsRemaining) setMonthsRemaining(data.monthsRemaining);
                }}
            />
        </div>
    );
}