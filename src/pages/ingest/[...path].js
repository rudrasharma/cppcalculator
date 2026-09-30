export const prerender = false;

export async function ALL({ request, params, url }) {
  const posthogPath = url.pathname.replace(/^\/ingest/, '');
  const posthogUrl = new URL(posthogPath + url.search, 'https://us.i.posthog.com');

  try {
    const newRequest = new Request(posthogUrl.toString(), {
      method: request.method,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
      duplex: request.method !== 'GET' && request.method !== 'HEAD' ? 'half' : undefined
    });
    
    const safeHeaders = ['user-agent', 'content-type', 'content-length', 'accept', 'accept-language', 'referer'];
    for (const header of safeHeaders) {
      if (request.headers.has(header)) {
        newRequest.headers.set(header, request.headers.get(header));
      }
    }
    newRequest.headers.set('X-Forwarded-For', request.headers.get('CF-Connecting-IP') || '');
    
    const response = await fetch(newRequest);
    return response;
  } catch (error) {
    console.error('PostHog proxy error:', error);
    return new Response('PostHog proxy error', { status: 502 });
  }
}
