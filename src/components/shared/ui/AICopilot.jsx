import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

// Inline Icons for independence & robustness
const SparklesIcon = ({ className, size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z" />
    <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5Z" />
    <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1Z" />
  </svg>
);

const SendIcon = ({ className, size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const XIcon = ({ className, size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const UserIcon = ({ className, size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const TrashIcon = ({ className, size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

// Simple, high-performance Markdown parser for chat bubbles
const parseMarkdown = (text) => {
  if (!text) return '';
  
  // Split into lines
  const lines = text.split('\n');
  let inList = false;
  const elements = [];
  
  lines.forEach((line, index) => {
    let trimmed = line.trim();
    
    // Unordered list item
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (!inList) {
        inList = true;
      }
      const content = trimmed.substring(2);
      elements.push(
        <li key={`li-${index}`} className="ml-4 list-disc mb-1.5 text-slate-700">
          {parseInlineFormatting(content)}
        </li>
      );
      return;
    }
    
    // Numbered list item
    const numMatch = trimmed.match(/^(\d+)\.\s(.*)/);
    if (numMatch) {
      if (!inList) {
        inList = true;
      }
      const content = numMatch[2];
      elements.push(
        <li key={`ol-${index}`} className="ml-4 list-decimal mb-1.5 text-slate-700">
          {parseInlineFormatting(content)}
        </li>
      );
      return;
    }
    
    // End list if we find a non-list item
    if (inList && trimmed !== '') {
      inList = false;
    }
    
    // Paragraph or Heading
    if (trimmed !== '') {
      if (trimmed.startsWith('### ')) {
        elements.push(<h4 key={`h4-${index}`} className="text-sm font-black text-slate-900 mt-3 mb-1.5">{parseInlineFormatting(trimmed.substring(4))}</h4>);
      } else if (trimmed.startsWith('## ')) {
        elements.push(<h3 key={`h3-${index}`} className="text-base font-black text-slate-900 mt-4 mb-2">{parseInlineFormatting(trimmed.substring(3))}</h3>);
      } else {
        elements.push(<p key={`p-${index}`} className="mb-2.5 text-slate-700 leading-relaxed">{parseInlineFormatting(trimmed)}</p>);
      }
    }
  });
  
  return <div className="space-y-1">{elements}</div>;
};

// Sub-helper for bold (**bold**) and inline code (`code`)
const parseInlineFormatting = (text) => {
  const parts = [];
  let remaining = text;
  
  while (remaining.length > 0) {
    const boldIndex = remaining.indexOf('**');
    const codeIndex = remaining.indexOf('`');
    
    // Find whichever markdown symbol comes first
    let index = -1;
    let symbol = '';
    
    if (boldIndex !== -1 && (codeIndex === -1 || boldIndex < codeIndex)) {
      index = boldIndex;
      symbol = '**';
    } else if (codeIndex !== -1) {
      index = codeIndex;
      symbol = '`';
    }
    
    if (index === -1) {
      parts.push(remaining);
      break;
    }
    
    if (index > 0) {
      parts.push(remaining.substring(0, index));
    }
    
    const closingIndex = remaining.indexOf(symbol, index + symbol.length);
    if (closingIndex === -1) {
      parts.push(remaining.substring(index));
      break;
    }
    
    const innerText = remaining.substring(index + symbol.length, closingIndex);
    if (symbol === '**') {
      parts.push(<strong key={remaining.length} className="font-bold text-slate-900">{innerText}</strong>);
    } else {
      parts.push(<code key={remaining.length} className="px-1.5 py-0.5 bg-slate-100 rounded text-rose-600 font-mono text-xs">{innerText}</code>);
    }
    
    remaining = remaining.substring(closingIndex + symbol.length);
  }
  
  return parts;
};

const CHAT_STORAGE_KEY = 'loonie_copilot_messages_v1';

const getWelcomeMessage = (calculatorId) => {
  const base = "Hi! I'm your LoonieFi Copilot. 🇨🇦\n\nI can help you model different scenarios and understand your numbers. ";
  
  switch (calculatorId) {
    case 'mortgage':
      return { role: 'assistant', content: base + "Ask me questions like:\n- *\"What if I put 20% down on a $800k home?\"*\n- *\"How much interest do I save by paying an extra $500/mo?\"*\n- *\"Compare a 3-year fixed to a 5-variable rate.\"*" };
    case 'tax':
      return { role: 'assistant', content: base + "Ask me questions like:\n- *\"I make $80,000 in Ontario\"*\n- *\"What if I contribute $6,000 to my RRSP?\"*\n- *\"Explain CPP and EI deductions\"*" };
    case 'ccb':
      return { role: 'assistant', content: base + "Ask me questions like:\n- *\"I have two kids aged 4 and 8 in BC\"*\n- *\"How does my income affect the CCB?\"*\n- *\"What if my salary increases to $120,000?\"*" };
    case 'parental':
      return { role: 'assistant', content: base + "Ask me questions like:\n- *\"Compare standard vs extended leave\"*\n- *\"I make $90k and want to take 12 months\"*\n- *\"What is the EI maximum for this year?\"*" };
    case 'resp':
      return { role: 'assistant', content: base + "Ask me questions like:\n- *\"How do I max out the CESG grant?\"*\n- *\"What if I contribute $200 a month?\"*\n- *\"Explain the Canada Learning Bond\"*" };
    case 'retirement':
      return { role: 'assistant', content: base + "Ask me questions like:\n- *\"When should I take CPP?\"*\n- *\"How much OAS will I get at 65?\"*\n- *\"What if I delay CPP to 70?\"*" };
    case 'smith':
      return { role: 'assistant', content: base + "Ask me questions like:\n- *\"What is the Smith Manoeuvre?\"*\n- *\"I have a $500k mortgage and $100k in equity\"*\n- *\"How much tax refund will I get?\"*" };
    case 'cagr':
      return { role: 'assistant', content: base + "Ask me questions like:\n- *\"If I invest $10k at 7% for 20 years?\"*\n- *\"What is my CAGR if my portfolio went from $50k to $80k in 3 years?\"*\n- *\"Calculate Rule of 72 for 8% return\"*" };
    default:
      return { role: 'assistant', content: base + "Ask me questions like:\n- *\"I make $80,000 in Ontario\"*\n- *\"What if I contribute $6,000 to my RRSP?\"*\n- *\"Explain CPP and EI deductions\"*" };
  }
};

export const AICopilot = ({ onUpdate, context, globalMemory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);

  const messageEndRef = useRef(null);
  const inputRef = useRef(null);

  const storageKey = context?.calculatorId 
    ? `${CHAT_STORAGE_KEY}_${context.calculatorId}` 
    : CHAT_STORAGE_KEY;

  const defaultWelcome = getWelcomeMessage(context?.calculatorId);

  // Initialize from LocalStorage
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setMessages(JSON.parse(stored));
      } else {
        setMessages([defaultWelcome]);
      }
    } catch (e) {
      setMessages([defaultWelcome]);
    }
  }, [storageKey, defaultWelcome.content]);

  // Sync animation and body scrolling
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
      // Auto focus input on desktop
      setTimeout(() => {
        if (window.innerWidth >= 768) {
          inputRef.current?.focus();
        }
      }, 300);
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300);
      document.body.style.overflow = 'unset';
      setIsExpanded(false);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Auto scroll messages
  useEffect(() => {
    if (isAnimating || isOpen) {
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAnimating, isOpen, isLoading]);

  const saveMessages = (newMsgs) => {
    setMessages(newMsgs);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newMsgs));
    } catch (e) {}
  };

  const handleClearChat = () => {
    if (confirm("Reset conversation history?")) {
      saveMessages([defaultWelcome]);
    }
  };

  const handleSubmit = async (e, customText = '') => {
    if (e) e.preventDefault();
    
    const messageText = customText.trim() || input.trim();
    if (!messageText || isLoading) return;

    const userMessage = { role: 'user', content: messageText };
    const updatedMessages = [...messages, userMessage];
    
    setInput('');
    saveMessages(updatedMessages);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          context,
          globalMemory
        })
      });

      if (!response.ok) {
        throw new Error("Unable to reach Copilot. Please try again.");
      }

      const data = await response.json();
      
      // Update calculator inputs reactively
      if (data.toolData) {
        onUpdate(data.toolData);
      }

      const assistantMessage = {
        role: 'assistant',
        content: data.text || "I've processed your update."
      };
      
      saveMessages([...updatedMessages, assistantMessage]);
    } catch (err) {
      console.error("Copilot Communication Error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Pre-configured quick action prompts
  const suggestions = [
    { label: "💰 Explain Marginal Rate", text: "Can you explain what my marginal tax rate means and how it affects my next dollar earned?" },
    { label: "🛡️ Max RRSP Contribution", text: "Calculate how much tax I will save if I make the maximum allowable RRSP contribution." },
    { label: "🍁 Compare other provinces", text: "How does my current take-home pay compare if I lived in Alberta or British Columbia instead?" }
  ];

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[9999] w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-indigo-500/20 group"
        aria-label="Open AI Copilot"
      >
        {/* Pulsing ring indicator */}
        <span className="absolute -inset-1 rounded-full bg-indigo-500/30 animate-ping opacity-75 pointer-events-none group-hover:animate-none"></span>
        <SparklesIcon className="w-6 h-6 md:w-7 md:h-7 animate-pulse" />
      </button>

      {/* Drawer Overlay */}
      {(isOpen || isAnimating) && (
        <div className="fixed inset-0 z-[10000] flex justify-end">
          {/* Backdrop */}
          <div 
            onClick={() => setIsOpen(false)}
            className={`absolute inset-0 bg-slate-900/5 backdrop-blur-[1.5px] transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          />

          {/* Sliding Sheet (Responsive) */}
          <div 
            className={`fixed z-[10002] bg-slate-50 flex flex-col border-slate-200 shadow-2xl transition-all duration-300 ease-out 
              /* Mobile Styles */
              bottom-0 inset-x-0 rounded-t-[2.5rem] border-t ${isExpanded ? 'h-[80vh]' : 'h-[42vh]'}
              /* Desktop Styles */
              md:top-0 md:bottom-0 md:right-0 md:left-auto md:h-full md:w-[420px] md:rounded-y-none md:rounded-l-[2.5rem] md:border-l md:border-t-0
              ${isOpen ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-y-0 md:translate-x-full'}`}
          >
            {/* Mobile Drag/Touch Handle - Tap to Toggle Height */}
            <div 
              onClick={() => setIsExpanded(prev => !prev)}
              className="shrink-0 md:hidden w-full flex flex-col items-center py-2.5 cursor-pointer hover:bg-slate-100/50 active:bg-slate-100 transition-colors rounded-t-[2.5rem]"
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mb-1" />
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none select-none">
                {isExpanded ? 'Tap to Minimize' : 'Tap to Expand'}
              </span>
            </div>

            {/* Header */}
            <div className="shrink-0 px-6 py-4 flex items-center justify-between border-b border-slate-200/60 bg-white md:rounded-tl-[2.5rem]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <SparklesIcon size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 tracking-tight leading-none mb-1">LoonieFi Copilot</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Assistant</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Mobile Collapse/Expand toggle button */}
                <button
                  type="button"
                  onClick={() => setIsExpanded(prev => !prev)}
                  className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-indigo-600 active:scale-95 border border-slate-100 transition-all"
                  title={isExpanded ? "Collapse panel" : "Expand panel"}
                >
                  {isExpanded ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline><line x1="14" y1="10" x2="21" y2="3"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
                  )}
                </button>
                <button
                  onClick={handleClearChat}
                  title="Clear chat history"
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-rose-500 active:scale-95 border border-slate-100 transition-all"
                >
                  <TrashIcon size={16} />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-95 transition-all border border-slate-200/50"
                  aria-label="Close copilot"
                >
                  <XIcon size={18} />
                </button>
              </div>
            </div>

            {/* Message Thread Area */}
            <div className="flex-grow overflow-y-auto overscroll-contain px-6 py-6 space-y-5 flex flex-col bg-slate-50">
              {messages.map((msg, index) => {
                const isUser = msg.role === 'user';
                return (
                  <div 
                    key={index}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                      {!isUser && <SparklesIcon size={10} className="text-indigo-500" />}
                      {isUser && <UserIcon size={10} />}
                      {isUser ? 'You' : 'Copilot'}
                    </div>
                    <div 
                      className={`px-4 py-3 rounded-2xl shadow-sm text-sm font-medium leading-relaxed max-w-[90%]
                        ${isUser 
                          ? 'bg-indigo-600 text-white rounded-tr-none' 
                          : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'}`}
                    >
                      {isUser ? msg.content : parseMarkdown(msg.content)}
                    </div>
                  </div>
                );
              })}

              {/* Loader */}
              {isLoading && (
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-1.5 mb-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                    <SparklesIcon size={10} className="text-indigo-500" />
                    Copilot
                  </div>
                  <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-none px-5 py-4 shadow-sm flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-semibold">
                  ⚠️ {error}
                </div>
              )}

              <div ref={messageEndRef} />
            </div>

            {/* Quick Action Suggestion Chips */}
            <div className="shrink-0 bg-white border-t border-slate-100 px-6 py-3 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
              {suggestions.map((sug, i) => (
                <button
                  key={i}
                  onClick={(e) => handleSubmit(e, sug.text)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-600 hover:text-indigo-600 hover:border-indigo-200 active:scale-95 transition-all shadow-sm shrink-0"
                >
                  {sug.label}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <div className="shrink-0 p-4 border-t border-slate-100 bg-white md:rounded-bl-[2.5rem]">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onFocus={() => {
                    if (window.innerWidth < 768) {
                      setIsExpanded(true);
                    }
                  }}
                  placeholder="Ask a question or describe a change..."
                  className="flex-grow bg-slate-50 border border-slate-200 focus:border-indigo-300 rounded-[1.5rem] px-4 py-3.5 text-slate-900 placeholder:text-slate-400 font-medium focus:ring-0 transition-all text-base"
                  disabled={isLoading}
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 text-white disabled:text-slate-300 rounded-[1.5rem] flex items-center justify-center shrink-0 active:scale-95 transition-all shadow-md cursor-pointer disabled:cursor-not-allowed"
                >
                  <SendIcon size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>,
    document.body
  );
};
