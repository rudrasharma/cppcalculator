import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async ({ request }, next) => {
  const url = new URL(request.url);
  
  // Intercept requests to /ingest/:path*
  if (url.pathname.startsWith('/ingest/')) {
    const posthogPath = url.pathname.replace(/^\/ingest/, '');
    const posthogUrl = new URL(posthogPath + url.search, 'https://us.i.posthog.com');
    
    // Copy the original headers
    const headers = new Headers(request.headers);
    headers.set('Host', 'us.i.posthog.com');
    
    // Proxy the request
    try {
      const response = await fetch(posthogUrl.toString(), {
        method: request.method,
        headers: headers,
        body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
        duplex: 'half', // Needed for proxying bodies in some environments
      });
      
      return response;
    } catch (error) {
      console.error('PostHog proxy error:', error);
      return new Response('PostHog proxy error', { status: 502 });
    }
  }
  
  return next();
});
