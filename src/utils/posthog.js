import posthog from 'posthog-js';

const POSTHOG_KEY = import.meta.env.PUBLIC_POSTHOG_KEY;

if (typeof window !== 'undefined' && POSTHOG_KEY) {
  posthog.init(POSTHOG_KEY, {
    api_host: '/ingest',
    autocapture: true,
    capture_pageview: false, // Handle manually to support Astro View Transitions
  });

  let initialLoadFired = false;

  // Track page views on Astro View Transitions
  document.addEventListener('astro:page-load', () => {
    posthog.capture('$pageview');
    initialLoadFired = true;
  });

  // If astro:page-load already fired before this script was evaluated (due to React lazy hydration),
  // capture the initial pageview now.
  setTimeout(() => {
    if (!initialLoadFired) {
      posthog.capture('$pageview');
    }
  }, 100);
}

export default posthog;
