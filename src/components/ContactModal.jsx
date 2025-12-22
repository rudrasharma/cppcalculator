import React, { useState } from 'react';
import { createPortal } from 'react-dom';

export default function ContactModal({ onClose }) {
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    // REPLACE THIS WITH YOUR WEB3FORMS ACCESS KEY
    const ACCESS_KEY = "e1d06bbe-b28f-4ee5-a96e-7e785fa7b628"; 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    access_key: ACCESS_KEY,
                    ...formData,
                    from_name: "LoonieFi Contact Form", // Optional: Customizes the sender name in your inbox
                    subject: `New Message from ${formData.name}`, // Optional: Custom subject
                }),
            });

            const result = await response.json();

            if (result.success) {
                setStatus('success');
                setFormData({ name: '', email: '', message: '' });
                // Optional: Close modal after 2 seconds
                // setTimeout(onClose, 2000); 
            } else {
                setStatus('error');
            }
        } catch (err) {
            setStatus('error');
        }
    };

    if (typeof document === 'undefined') return null;

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            {/* BACKDROP */}
            <div 
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            />

            {/* MODAL CONTENT */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-up">
                
                {/* Header */}
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-black text-slate-800 text-lg">Contact Support</h3>
                    <button 
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                <div className="p-6">
                    {status === 'success' ? (
                        <div className="text-center py-8 animate-fade-in">
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 mb-2">Message Sent!</h4>
                            <p className="text-slate-500 mb-6">Thanks for reaching out. We'll get back to you shortly.</p>
                            <button onClick={onClose} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all">
                                Close
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Hidden Honeypot for Spam */}
                            <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Your Name</label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none font-medium transition-all"
                                    placeholder="Jane Doe"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
                                <input 
                                    type="email" 
                                    required
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none font-medium transition-all"
                                    placeholder="jane@example.com"
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Message</label>
                                <textarea 
                                    required
                                    rows="4"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none font-medium transition-all resize-none"
                                    placeholder="How can we help?"
                                    value={formData.message}
                                    onChange={e => setFormData({...formData, message: e.target.value})}
                                />
                            </div>

                            {status === 'error' && (
                                <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 text-sm rounded-lg font-medium">
                                    Something went wrong. Please try again later.
                                </div>
                            )}

                            <button 
                                type="submit" 
                                disabled={status === 'submitting'}
                                className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-lg shadow-indigo-200"
                            >
                                {status === 'submitting' ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Sending...
                                    </>
                                ) : (
                                    'Send Message'
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}