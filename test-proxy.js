const url = new URL('https://looniefi.ca/ingest/static/array.js');
const posthogPath = url.pathname.replace(/^\/ingest/, '');
const posthogUrl = new URL(posthogPath + url.search, 'https://us.i.posthog.com');

const newRequest = new Request(posthogUrl.toString(), {
  method: 'GET'
});

fetch(newRequest).then(r => console.log(r.status, r.headers.get('content-type'))).catch(console.error);
