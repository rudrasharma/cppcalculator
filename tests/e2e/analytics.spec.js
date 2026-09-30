import { test, expect } from '@playwright/test';

test.describe('Analytics Integration', () => {
    test('PostHog correctly configures direct API hosts instead of local proxy', async ({ page }) => {
        let directHostHit = false;
        let proxyHit = false;

        page.on('request', request => {
            const url = request.url();
            // Posthog direct URLs (either the API or the assets endpoint)
            if (url.includes('us.i.posthog.com') || url.includes('us-assets.i.posthog.com')) {
                directHostHit = true;
            }
            // The old broken proxy URL
            if (url.includes('/ingest')) {
                proxyHit = true;
            }
        });

        // Load the page
        await page.goto('/');

        // Wait a moment for scripts to initialize
        await page.waitForTimeout(2000);

        // Assertions
        expect(proxyHit).toBe(false);
        expect(directHostHit).toBe(true);
    });
});
