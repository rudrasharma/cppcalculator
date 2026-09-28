import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async ({ request }, next) => {
  const url = new URL(request.url);
  
  // Intercept requests to /ingest/:path*
  if (url.pathname.startsWith('/ingest/')) {
    const posthogPath = url.pathname.replace(/^\/ingest/, '');
    const posthogUrl = new URL(posthogPath + url.search, 'https://us.i.posthog.com');
    
    // Proxy the request
    try {
      const newRequest = new Request(posthogUrl.toString(), request);
      newRequest.headers.set('X-Forwarded-For', request.headers.get('CF-Connecting-IP') || '');
      
      const response = await fetch(newRequest);
      
      return response;
    } catch (error) {
      console.error('PostHog proxy error:', error);
      return new Response('PostHog proxy error', { status: 502 });
    }
  }
  
  return next();
});
