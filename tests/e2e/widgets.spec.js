import { test, expect } from '@playwright/test';

test.describe('B2B Embeddable Widgets', () => {

  test('Widget landing page loads and configurator works', async ({ page }) => {
    // 1. Visit the widgets landing page
    await page.goto('/widgets/');
    
    // 2. Verify SEO H1 is present
    await expect(page.locator('h1').first()).toContainText('Beautiful Calculator');

    // 3. Verify the Configurator sidebar is loaded
    await expect(page.getByTestId('widget-btn-mortgage')).toBeVisible();
    await expect(page.getByTestId('widget-btn-tax')).toBeVisible();

    // 4. Verify the preview iframe is loaded with the default widget
    const iframe = page.locator('iframe[title="Canadian Mortgage Calculator Preview"]');
    await expect(iframe).toBeVisible();

    // Wait for Astro React component to hydrate
    await page.waitForTimeout(1000);
    
    // 5. Switch to Income Tax widget
    await page.getByTestId('widget-btn-tax').click();

    // 6. Verify the embed code block updates (this proves state changed)
    const embedCode = page.locator('pre').first();
    await expect(embedCode).toContainText('/embed/tax');


  });

  test('Embed routes load naked calculators without navigation', async ({ page }) => {
    // 1. Visit the raw embed route
    await page.goto('/embed/mortgage/');
    
    // 2. Verify the mortgage calculator is visible
    await expect(page.locator('text=Asking Price')).toBeVisible();

    // 3. Verify the main site navigation and footer are NOT visible
    // We can check that the "LoonieFi" main logo is not there, or that the header tag is missing
    const navLinks = page.locator('nav');
    await expect(navLinks).toHaveCount(0); // Should be completely stripped out in EmbedLayout

    // 4. Verify the watermark is present
    await expect(page.locator('text=Powered by LoonieFi')).toBeVisible();
  });

});
