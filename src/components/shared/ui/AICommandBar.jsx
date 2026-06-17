import React, { useState } from 'react';
import { SparklesIcon, SendIcon } from '../Icons';

export const AICommandBar = ({ 
    onUpdate, 
    context, 
    endpoint = '/api/ai/tax',
    globalMemory = {}, // New prop
    suggestions = [
        { label: 'Ontario Salary', value: 'I make $75,000 in Ontario' },
        { label: 'BC with RRSP', value: 'I make $100k in BC and contribute $10k to RRSP' },
        { label: 'Add Bonus', value: 'I just got a $5,000 bonus in Alberta' }
    ]
}) => {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message: input, 
                    context,
                    globalMemory // Send memory to AI
                })
            });
            
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'The AI is currently busy. Please try again in a moment.');
            }

            const data = await res.json();

            if (data.toolData) {
                // If the AI returned a tool call, we update state (including insight)
                onUpdate(data.toolData);
            } else if (data.text) {
                // If it was just a question, we only update the insight text
                onUpdate({ strategy_insight: data.text });
            }
            
            // Clear input on success
            setInput('');
        } catch (err) {
            console.error("AI Command Bar Error:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full mb-12">
            <form 
                onSubmit={handleSubmit}
                className="relative group"
            >
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${error ? 'from-rose-500 to-amber-500' : 'from-indigo-500 to-amber-500'} rounded-[2rem] blur opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                
                <div className={`relative flex items-center bg-white border-2 ${error ? 'border-rose-100 shadow-rose-200/30' : 'border-slate-100 shadow-slate-200/30'} rounded-[2rem] p-2 shadow-xl focus-within:border-indigo-200 focus-within:shadow-indigo-100/50 transition-all`}>
                    <div className={`pl-4 pr-2 ${error ? 'text-rose-500' : 'text-indigo-500'}`}>
                        <SparklesIcon size={24} className={isLoading ? 'animate-pulse' : ''} />
                    </div>
                    
                    <input 
                        type="text"
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            if (error) setError(null);
                        }}
                        placeholder={error ? "Error: " + error : "Describe your scenario (e.g., 'I make $85k in BC and put $5k in RRSP')"}
                        className={`flex-1 bg-transparent border-none focus:ring-0 ${error ? 'text-rose-600 placeholder:text-rose-400' : 'text-slate-900 placeholder:text-slate-400'} font-medium py-4 text-sm md:text-base`}
                        disabled={isLoading}
                    />

                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className={`${error ? 'bg-rose-600' : 'bg-slate-900'} text-white p-3 md:p-4 rounded-[1.5rem] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 group/btn`}
                    >
                        {isLoading ? (
                             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <span className="hidden md:inline text-[10px] font-black uppercase tracking-widest px-2">{error ? 'Retry' : 'Analyze'}</span>
                                <SendIcon size={18} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                            </>
                        )}
                    </button>
                </div>

                {error ? (
                    <div className="mt-4 px-6">
                         <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] animate-pulse">Service Unavailable: The AI is currently experiencing high demand. Please try again.</p>
                    </div>
                ) : (
                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 px-6">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-1">Suggestions:</span>
                        {suggestions.map((tip, i) => (
                            <button 
                                key={i}
                                type="button"
                                onClick={() => setInput(tip.value)}
                                className="text-[10px] font-bold text-slate-500 hover:text-indigo-600 transition-colors decoration-dotted underline underline-offset-4 decoration-slate-300"
                            >
                                {tip.label}
                            </button>
                        ))}
                    </div>
                )}
            </form>
        </div>
    );
};
