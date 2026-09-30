import fs from 'fs';
import path from 'path';

describe('PostHog Configuration', () => {
    it('initializes with the correct direct API host to bypass Cloudflare issues', () => {
        // Read the posthog utility file directly to verify the hardcoded config
        // This acts as a safeguard against reverting to '/ingest' in the future
        const posthogPath = path.resolve(__dirname, '../posthog.js');
        const content = fs.readFileSync(posthogPath, 'utf8');

        expect(content).toContain("api_host: 'https://us.i.posthog.com'");
        expect(content).not.toContain("api_host: '/ingest'");
    });
});
