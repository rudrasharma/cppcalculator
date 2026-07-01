import { test, expect } from '@playwright/test';

test.describe('Phase 2: Critical Path E2E Testing', () => {

    test('Tax Calculator User Journey', async ({ page }) => {
        await page.goto('/income-tax-calculator/');
        await page.waitForLoadState('networkidle');

        // Input Income
        await page.getByLabel('Gross Annual Income').fill('100000');
        
        // Select Ontario
        await page.getByLabel('Province of Residence').selectOption('ON');
        
        // The net pay should be updated. We just want to check if a valid number is displayed.
        await expect(page.locator('text=/\\$\\d+,\\d{3}/').first()).toBeVisible();
    });

    test('Retirement Planner User Journey', async ({ page }) => {
        await page.goto('/retirement-planner/');
        await page.waitForLoadState('networkidle');

        // Input Target Income
        const targetIncome = page.getByPlaceholder('e.g. 60000').first();
        await targetIncome.fill('75000');

        // Enable Spouse by clicking the label text
        const spouseLabel = page.locator('text=Include Spouse');
        await spouseLabel.click();

        // Switch to Spouse Tab
        const spouseTab = page.getByRole('button', { name: /Spouse/i });
        await spouseTab.click();

        // Check if Final Estate Value renders
        await expect(page.locator('text=/Final Estate Value/i').first()).toBeVisible();
        await expect(page.locator('text=/Retirement Status/i').first()).toBeVisible();
    });

    test('Mortgage Calculator User Journey', async ({ page }) => {
        await page.goto('/mortgage-calculator/');
        await page.waitForLoadState('networkidle');

        // Input Asking Price
        await page.getByLabel('Asking Price').fill('500000');
        
        // Select % Percent for Down Payment
        await page.getByRole('button', { name: '% Percent', exact: true }).click();
        
        // Down payment is the second text input
        const dpInput = page.locator('input[type="text"]').nth(1);
        await dpInput.fill('10');
        
        // CMHC warning is present as '*CMHC limits amortization...'
        await expect(page.getByText('*CMHC limits amortization')).toBeVisible();
        
        // Monthly Payment exists
        await expect(page.locator('text=/\\$\\d+,\\d{3}/').first()).toBeVisible();
    });

    test('Child Benefit (CCB) Journey', async ({ page }) => {
        await page.goto('/child-benefit-calculator/');
        await page.waitForLoadState('networkidle');
        
        // Set Income
        await page.getByLabel('Net Household Income').fill('60000');
        
        // Add Children 
        await page.getByRole('button', { name: '+ Add Child' }).click();
        await page.getByRole('button', { name: '+ Add Child' }).click();

        // Expect non-zero CCB
        await expect(page.locator('text=/\\$\\d+,\\d{3}/').first()).toBeVisible();
    });

    test('Parental Leave Journey', async ({ page }) => {
        await page.goto('/parental-leave-calculator/');
        await page.waitForLoadState('networkidle');

        // Income Parent 1 - Ensure we grab the textbox, not the range slider
        await page.getByRole('textbox', { name: 'Parent 1 (Birth)' }).fill('80000');
        
        // Add Partner by forcing a check on the visually hidden checkbox
        await page.getByLabel('Include Partner?').check({ force: true });
        
        // Income Parent 2
        await page.getByRole('textbox', { name: 'Parent 2 (Non-Birth)' }).fill('60000');
        
        // Totals
        await expect(page.locator('text=Maternity').first()).toBeVisible();
    });

    test('RESP Journey', async ({ page }) => {
        await page.goto('/resp-calculator/');
        await page.waitForLoadState('networkidle');

        // Annual Contribution
        await page.getByLabel('Total Amount').fill('2500');
        
        // CESG match shows up under "Total Grants"
        await expect(page.locator('text=Total Grants').first()).toBeVisible();
    });

    test('CAGR / Investment Journey', async ({ page }) => {
        await page.goto('/cagr-calculator/');
        await page.waitForLoadState('networkidle');

        await page.getByLabel('Initial Investment').fill('10000');
        
        await expect(page.locator('text=/\\$\\d+,\\d{3}/').first()).toBeVisible();
    });

    test('Smith Manoeuvre Journey', async ({ page }) => {
        await page.goto('/smith-manoeuvre/');
        await page.waitForLoadState('networkidle');

        // Wait for the tool to load using the Home Value label
        await expect(page.getByText('Home Value')).toBeVisible();
        await page.getByLabel('Home Value').fill('1000000');
        
        // Check for the Strategy Impact Summary heading instead of reinvestment text
        await expect(page.getByText('Strategy Impact Summary')).toBeVisible();
    });

    test('Cross-Calculator Memory Sync Journey', async ({ page }) => {
        // Go to Mortgage and set Home Price
        await page.goto('/mortgage-calculator/');
        await page.waitForLoadState('networkidle');

        await page.getByLabel('Asking Price').fill('999999');
        
        await page.waitForTimeout(500); 
        
        // Go to smith manoeuvre which uses homeValue synced from Mortgage
        await page.goto('/smith-manoeuvre/');
        await page.waitForLoadState('networkidle');

        // Verify it synced (homeValue)
        await expect(page.getByRole('textbox', { name: 'Home Value' })).toHaveValue('999,999');
    });
});

