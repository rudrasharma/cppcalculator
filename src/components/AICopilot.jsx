import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';

// --- INLINE ICONS (No external dependencies) ---
const SparklesIcon = ({ size = 20, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L12 3Z"/></svg>
);
const SendIcon = ({ size = 18, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
);
const XIcon = ({ size = 18, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

export default function AICopilot({ context, onUpdateCalculator, mode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]); // Start empty to allow dynamic greeting
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false); // Prevents SSR errors
    const messagesEndRef = useRef(null);

    // --- 1. MOUNT CHECK (Required for Portals) ---
    useEffect(() => {
        setMounted(true);
    }, []);

    // --- DYNAMIC GREETING ---
    useEffect(() => {
        // Only set greeting if messages are empty (first load)
        if (messages.length === 0) {
            let greeting = "Hi! I can help you estimate your EI benefits.";
            
            // Determine active page from prop OR context
            const activePage = mode || context?.page;

            if (activePage === 'household') {
                greeting = "Hi! I can help estimate your GST and CCB. Try 'I have 3 kids' or 'Estimate my payments'.";
            } else if (activePage === 'parental-leave') {
                greeting = "Hi! I can help with Maternity & Parental Leave. Try 'I make $75k in Ontario' or 'Switch to Extended'.";
            } else if (activePage === 'cpp') {
                greeting = "Hi! I can help with CPP/OAS. Try 'I am 50 years old and i want to retire at 65'.";
            } else if (activePage === 'mortgage') { // ADD THIS
                greeting = "Hi! I can help you decide if you should break your mortgage. Try 'I owe $450k at 5.5%'";
            }
            
            setMessages([{ role: 'assistant', content: greeting }]);
        }
    }, [context?.page, mode]); 

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen, scrollToBottom]);

    // --- HELPER TO EXECUTE TOOLS ---
    const handleToolExecution = useCallback((name, argsString) => {
        try {
            // Robust parsing in case AI adds markdown
            const cleanJson = argsString.replace(/```json/g, '').replace(/```/g, '').trim();
            const args = JSON.parse(cleanJson);
            
            onUpdateCalculator(args);
            
            setMessages(prev => [...prev, { 
                role: 'system', 
                content: `✅ Updated settings.` 
            }]);
            return true;
        } catch (e) {
            console.error("Tool execution failed:", e);
            return false;
        }
    }, [onUpdateCalculator]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!input.trim()) return;
    
        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);
    
        try {
          // Pass 'mode' into the context so the API knows which system prompt to load
          const apiContext = { ...context, page: mode || context?.page };

          // CRITICAL FIX: Filter out local 'system' UI messages (like "✅ Updated settings")
          // sending them back to the API confuses the LLM.
          const apiMessages = messages.filter(m => m.role !== 'system');

          const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: [...apiMessages, userMsg], context: apiContext })
          });
    
          const data = await res.json();
    
          if (data.error) throw new Error(data.error);
    
          const choice = data.choices?.[0];
          const message = choice?.message;
    
          if (!message) throw new Error("Empty response from AI provider");

          let toolWasExecuted = false;

          // 1. Handle Tool Calls (The AI wants to update the UI)
          if (message.tool_calls && message.tool_calls.length > 0) {
            const toolCall = message.tool_calls[0];
            
            // Allow tool names for all calculators
            if ([
                'update_parental_calculator', 
                'update_household_calculator',
                'update_retirement_calculator' 
            ].includes(toolCall.function.name)) {
                toolWasExecuted = handleToolExecution(toolCall.function.name, toolCall.function.arguments);
            }
          } 
          // 2. Fallback: Check for "Hallucinated" JSON in content (Fix for raw JSON output)
          // Sometimes models output raw JSON text instead of using the tool
          else if (message.content && (message.content.trim().startsWith('{') || message.content.includes('"action":'))) {
             try {
                // Try to extract JSON object from text
                const jsonMatch = message.content.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const jsonArgs = jsonMatch[0];
                    // Heuristic: If it looks like calculator data, treat it as an update
                    if (jsonArgs.includes('income') || jsonArgs.includes('retirementAge') || jsonArgs.includes('dob')) {
                        toolWasExecuted = handleToolExecution('fallback_update', jsonArgs);
                        // Mask the raw JSON from the user view
                        message.content = "I've processed those details for you.";
                    }
                }
             } catch (err) {
                 console.warn("Failed to parse fallback JSON", err);
             }
          }
          
          // 3. Handle Normal Text (The AI just talked back)
          // This now runs even if a tool was called, supporting dual responses
          if (message.content) {
            setMessages(prev => [...prev, { role: 'assistant', content: message.content }]);
          }
    
        } catch (err) {
          console.error("AICopilot Error:", err);
          setMessages(prev => [...prev, { role: 'assistant', content: `Sorry, I had trouble connecting. (${err.message || 'Unknown Error'})` }]);
        } finally {
          setIsLoading(false);
        }
    }, [input, messages, context, handleToolExecution, mode]);

// --- MOBILE RESPONSIVE LAYOUT CLASSES ---
    // Mobile: bottom-28 (Lifts it ABOVE the results footer)
    // Desktop: bottom-8 (Keeps it in the corner)
    const containerClasses = useMemo(() => 
        "fixed z-[10000] flex flex-col items-end gap-4 transition-all duration-300 bottom-28 right-4 md:bottom-8 md:right-8",
        []
    );

    const windowClasses = useMemo(() => 
        "bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col transition-all origin-bottom-right w-[calc(100vw-2rem)] md:w-96 h-[500px] max-h-[60vh] md:max-h-[500px]",
        []
    );

    // If not mounted (server-side), render nothing to avoid hydration mismatch
    if (!mounted) return null;

    // --- RENDER VIA PORTAL ---
    // This pushes the chat window to the document body, ensuring it sits on top of everything
    // regardless of parent overflow:hidden or z-index stacking contexts.
    return createPortal(
        <div className={containerClasses}>
            
            {/* CHAT WINDOW */}
            {isOpen && (
                <div className={`${windowClasses} animate-fade-in-up`}>
                    {/* Header */}
                    <div className="bg-indigo-600 p-4 text-white flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-2">
                            <SparklesIcon size={18} />
                            <span className="font-bold">LoonieFi Copilot</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                            <XIcon size={18} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                        {messages.map((m, i) => {
                            const getMessageClasses = (role) => {
                                if (role === 'user') {
                                    return 'bg-indigo-600 text-white rounded-tr-none';
                                }
                                if (role === 'system') {
                                    return 'bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs italic';
                                }
                                return 'bg-white text-slate-700 border border-slate-200 shadow-sm rounded-tl-none';
                            };
                            
                            return (
                                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : (m.role === 'system' ? 'justify-center' : 'justify-start')}`}>
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${getMessageClasses(m.role)}`}>
                                        {m.content}
                                    </div>
                                </div>
                            );
                        })}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-100 flex gap-2 shrink-0">
                        <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type here..."
                            className="flex-1 bg-slate-100 border-0 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                        <button 
                            type="submit" 
                            disabled={isLoading || !input.trim()}
                            className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <SendIcon size={18} />
                        </button>
                    </form>
                </div>
            )}

            {/* TOGGLE BUTTON */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`${isOpen ? 'bg-slate-700 rotate-90 scale-90' : 'bg-indigo-600 hover:scale-105'} text-white p-4 rounded-full shadow-xl hover:bg-indigo-700 transition-all duration-300 flex items-center gap-2 font-bold`}
            >
                {isOpen ? <XIcon size={24} /> : <SparklesIcon size={24} />}
                {!isOpen && <span className="hidden md:inline">Ask AI</span>}
            </button>
        </div>,
        document.body // Renders directly into the body tag
    );
}