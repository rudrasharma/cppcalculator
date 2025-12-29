import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { SparklesIcon, SendIcon, XIcon } from './shared';

export default function AICopilot({ context, onUpdateCalculator }) {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hi! I can help you estimate your EI benefits. Try saying: 'I make $75k in Ontario' or 'Switch to Extended plan'." }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen, scrollToBottom]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!input.trim()) return;
    
        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);
    
        try {
          const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: [...messages, userMsg], context })
          });
    
          const data = await res.json();
    
          if (data.error) throw new Error(data.error);
    
          // --- PARSE STANDARD OPENAI RESPONSE ---
          const choice = data.choices?.[0];
          const message = choice?.message;
    
          if (!message) throw new Error("Empty response from AI provider");
    
          // 1. Handle Tool Calls (The AI wants to update the UI)
          if (message.tool_calls && message.tool_calls.length > 0) {
            const toolCall = message.tool_calls[0];
            
            if (toolCall.function.name === 'update_parental_calculator') {
              // Robust JSON parsing for arguments
              let args = {};
              try {
                 args = JSON.parse(toolCall.function.arguments);
              } catch (e) {
                 console.error("Failed to parse tool arguments:", toolCall.function.arguments);
              }
    
              onUpdateCalculator(args);
              
              setMessages(prev => [...prev, { 
                role: 'system', 
                content: `✅ Updated: ${Object.entries(args).map(([k,v]) => `${k}: ${v}`).join(', ')}` 
              }]);
            }
          } 
          
          // 2. Handle Normal Text (The AI just talked back)
          if (message.content) {
            setMessages(prev => [...prev, { role: 'assistant', content: message.content }]);
          }
    
        } catch (err) {
          console.error(err);
          setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${err.message}` }]);
        } finally {
          setIsLoading(false);
        }
    }, [input, messages, context, onUpdateCalculator]);

    // --- MOBILE RESPONSIVE LAYOUT CLASSES ---
    // Mobile: bottom-28 (clears footer), right-4, w-[90vw]
    // Desktop: bottom-6 (standard), right-6, w-96
    const containerClasses = useMemo(() => 
        "fixed z-[10000] flex flex-col items-end gap-4 transition-all duration-300 bottom-28 right-4 md:bottom-6 md:right-6",
        []
    );
    const windowClasses = useMemo(() => 
        "bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col transition-all origin-bottom-right w-[calc(100vw-2rem)] md:w-96 h-[500px] max-h-[60vh] md:max-h-[500px]",
        []
    );

    return (
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
                                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
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
                            placeholder="Ask about your leave..."
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
        </div>
    );
}