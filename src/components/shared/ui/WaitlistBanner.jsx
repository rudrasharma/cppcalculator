import React, { useState } from 'react';
import { usePostHog } from 'posthog-js/react';

export default function WaitlistBanner() {
  const posthog = usePostHog();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

    try {
      if (posthog) {
        posthog.capture('waitlist_joined', { email: email });
        // Optional: also identify them by email
        posthog.identify(email, { email: email });
      }
      
      // Artificial delay to show loading state (since posthog capture is instant)
      await new Promise(resolve => setTimeout(resolve, 800));

      setStatus('success');
      setEmail('');
    } catch (err) {
      console.error('Waitlist submission error:', err);
      setStatus('error');
    }
  };

  return (
    <div className="bg-indigo-600 text-white px-4 py-3 relative shadow-sm z-[110]">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm">
        
        {status === 'success' ? (
          <div className="flex items-center gap-2 font-medium">
            <svg className="w-5 h-5 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            Thanks for joining! We'll notify you when LoonieFi Plus is ready.
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 font-medium text-center sm:text-left">
              <span className="hidden sm:inline">🚀</span>
              <span>Want to save your data across devices? Join the LoonieFi Plus waitlist.</span>
            </div>

            <form onSubmit={handleSubmit} className="flex w-full sm:w-auto items-center gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-3 py-1.5 rounded-md text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 w-full sm:w-48 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'loading'}
                required
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="whitespace-nowrap bg-indigo-800 hover:bg-indigo-900 text-white px-4 py-1.5 rounded-md text-sm font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Joining...' : 'Join Waitlist'}
              </button>
            </form>
            
            {status === 'error' && (
              <span className="text-red-200 text-xs absolute bottom-1 sm:static">Something went wrong. Try again.</span>
            )}
          </>
        )}

        <button 
          onClick={() => setIsVisible(false)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-indigo-700 rounded-full transition-colors opacity-70 hover:opacity-100"
          aria-label="Dismiss"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
    </div>
  );
}
