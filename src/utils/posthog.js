import posthog from 'posthog-js';

const POSTHOG_KEY = import.meta.env.PUBLIC_POSTHOG_KEY;

if (typeof window !== 'undefined' && POSTHOG_KEY) {
  posthog.init(POSTHOG_KEY, {
    api_host: 'https://us.i.posthog.com',
    ui_host: 'https://us.posthog.com',
    autocapture: true,
    capture_pageview: false, // Handle manually to support Astro View Transitions
  });

  window.posthog = posthog;

  let lastTrackedUrl = null;
  const capturePageviewOnce = () => {
    const currentUrl = window.location.href;
    if (lastTrackedUrl === currentUrl) return;
    lastTrackedUrl = currentUrl;
    posthog.capture('$pageview');
  };

  // Track page views on Astro View Transitions navigation
  document.addEventListener('astro:page-load', capturePageviewOnce);

  // If astro:page-load has already fired before React hydration or DOM is already ready
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    capturePageviewOnce();
  } else {
    window.addEventListener('DOMContentLoaded', capturePageviewOnce, { once: true });
  }
}

export default posthog;
