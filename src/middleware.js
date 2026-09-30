import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async ({ request }, next) => {
  const url = new URL(request.url);
  console.log('[MIDDLEWARE] Incoming request:', request.method, url.pathname);
  
  if (url.pathname.startsWith('/ingest/')) {
    let posthogPath = url.pathname.replace(/^\/ingest/, '');
    if (posthogPath.endsWith('/')) {
      posthogPath = posthogPath.slice(0, -1);
    }
    const posthogUrl = new URL(posthogPath + url.search, 'https://us.i.posthog.com');
    console.log('[MIDDLEWARE] PostHog URL:', posthogUrl.toString());
    
    // Copy headers but strip Host
    const headers = new Headers(request.headers);
    headers.delete('host');
    headers.set('X-Forwarded-For', request.headers.get('CF-Connecting-IP') || '');
    
    // Cloudflare Workers requires duplex: 'half' for streams, but only on POST/PUT
    const hasBody = request.method !== 'GET' && request.method !== 'HEAD';
    
    const proxyRequest = new Request(posthogUrl.toString(), {
      method: request.method,
      headers: headers,
      body: hasBody ? request.body : undefined,
      duplex: hasBody ? 'half' : undefined
    });
    
    try {
      const response = await fetch(proxyRequest);
      console.log('[MIDDLEWARE] PostHog returned:', response.status);
      
      // Return the response directly
      return response;
    } catch (error) {
      console.error('[MIDDLEWARE] PostHog proxy error:', error);
      return new Response('Proxy Error', { status: 502 });
    }
  }
  
  return next();
});
