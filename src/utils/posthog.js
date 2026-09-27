import posthog from 'posthog-js';

const POSTHOG_KEY = import.meta.env.PUBLIC_POSTHOG_KEY;

if (typeof window !== 'undefined' && POSTHOG_KEY) {
  posthog.init(POSTHOG_KEY, {
    api_host: '/ingest',
    autocapture: true,
    capture_pageview: false,
  });

  // Track page views on Astro View Transitions
  document.addEventListener('astro:page-load', () => {
    posthog.capture('$pageview');
  });
}

export default posthog;
