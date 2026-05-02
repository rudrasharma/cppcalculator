import { test, expect } from '@playwright/test';

const calculators = [
  { name: 'CPP & OAS', path: '/cpp-oas-calculator' },
  { name: 'Child Benefit', path: '/child-benefit-calculator' },
  { name: 'Mortgage', path: '/mortgage-calculator' },
  { name: 'Parental Leave', path: '/parental-leave-calculator' },
  { name: 'RESP', path: '/resp-calculator' },
  { name: 'CAGR', path: '/cagr-calculator' },
  { name: 'Smith Manoeuvre', path: '/smith-manoeuvre' },
];

test.describe('Calculator Smoke Tests', () => {
  for (const calc of calculators) {
    test(`should load ${calc.name} calculator`, async ({ page }) => {
      await page.goto(calc.path);
      // Check for a common element or the title
      await expect(page).toHaveTitle(/LoonieFi/);
      // Verify main content area exists
      const main = page.locator('main').first();
      await expect(main).toBeVisible();
    });
  }
});

test.describe('pSEO Route Integrity', () => {
    test('should load dynamic child benefit scenario', async ({ page }) => {
        await page.goto('/calculator/child-benefit/ontario/married-2-children/60000');
        // Use a more specific locator to avoid strict mode violations
        await expect(page.getByRole('heading', { name: /Ontario/i })).toBeVisible();
        await expect(page.getByText('$60,000')).first().toBeVisible();
        // Check for "spiderweb" links we fixed earlier
        const nearbyLinks = page.locator('a:has-text("View")');
        await expect(nearbyLinks.first()).toBeVisible();
    });
});
