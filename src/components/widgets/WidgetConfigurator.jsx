import React, { useState } from 'react';

const WIDGETS = [
    { id: 'mortgage', name: 'Canadian Mortgage Calculator', path: '/embed/mortgage/' },
    { id: 'tax', name: 'Income Tax Calculator', path: '/embed/tax/' }
];

export default function WidgetConfigurator() {
    const [selectedWidget, setSelectedWidget] = useState(WIDGETS[0]);
    const [copied, setCopied] = useState(false);
    const [baseUrl, setBaseUrl] = useState('https://looniefi.com');

    // Use useEffect to get the window origin after hydration
    // This prevents React hydration mismatch errors between server and client
    React.useEffect(() => {
        setBaseUrl(window.location.origin);
    }, []);

    const iframeUrl = `${baseUrl}${selectedWidget.path}`;

    const embedCode = `<!-- LoonieFi Widget -->
<iframe 
    id="looniefi-widget-${selectedWidget.id}"
    src="${iframeUrl}" 
    style="width: 1px; min-width: 100%; border: none;"
    scrolling="no"
></iframe>
<script src="https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.3.9/iframeResizer.min.js"></script>
<script>iFrameResize({ log: false }, '#looniefi-widget-${selectedWidget.id}')</script>
<!-- End LoonieFi Widget -->`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(embedCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Configuration Sidebar */}
            <div className="lg:col-span-4 space-y-8">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                    <div>
                        <label className="text-xs font-black text-slate-700 block uppercase mb-3 tracking-widest">
                            Select Widget
                        </label>
                        <div className="space-y-2">
                            {WIDGETS.map((widget) => (
                                <button
                                    key={widget.id}
                                    data-testid={`widget-btn-${widget.id}`}
                                    onClick={() => setSelectedWidget(widget)}
                                    className={`w-full text-left px-4 py-3 rounded-2xl transition-all border-2 ${
                                        selectedWidget.id === widget.id
                                            ? 'bg-indigo-50 border-indigo-600 text-indigo-900 font-bold'
                                            : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-200'
                                    }`}
                                >
                                    {widget.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                        <label className="text-xs font-black text-slate-700 block uppercase mb-3 tracking-widest">
                            Embed Code
                        </label>
                        <p className="text-xs text-slate-500 mb-4">
                            Copy and paste this code into your website's HTML builder (WordPress, Webflow, Squarespace, etc). 
                            The widget will automatically resize to fit its contents.
                        </p>
                        <div className="relative group">
                            <pre className="bg-slate-900 text-slate-300 p-4 rounded-2xl text-[10px] overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
                                {embedCode}
                            </pre>
                            <button
                                onClick={handleCopy}
                                className="absolute top-2 right-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors backdrop-blur-sm"
                            >
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                    <h3 className="text-sm font-black text-indigo-900 uppercase tracking-widest mb-2">Free Forever</h3>
                    <p className="text-xs text-indigo-700 leading-relaxed">
                        These widgets are completely free to use. They include no tracking cookies and load instantly.
                        A small "Powered by LoonieFi" watermark supports our platform.
                    </p>
                </div>
            </div>

            {/* Live Preview Area */}
            <div className="lg:col-span-8">
                <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-200 h-full min-h-[600px] flex flex-col">
                    <div className="flex items-center justify-between mb-6 px-2">
                        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Live Preview</h2>
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                        </div>
                    </div>
                    
                    <div className="flex-grow bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 relative">
                        {/* We use standard iframe here for preview, without the script injected to avoid cross-origin dev issues */}
                        <iframe
                            key={selectedWidget.id}
                            src={selectedWidget.path}
                            className="w-full h-full border-none absolute inset-0"
                            title={`${selectedWidget.name} Preview`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
