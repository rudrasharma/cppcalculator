# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: calculators.spec.js >> Calculator Smoke Tests >> should load CPP & OAS calculator
- Location: tests/e2e/calculators.spec.js:15:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('main')
Expected: visible
Error: strict mode violation: locator('main') resolved to 3 elements:
    1) <main class="flex-grow flex flex-col">…</main> aka getByRole('main').first()
    2) <main>…</main> aka getByRole('main').nth(1)
    3) <main class="max-w-5xl mx-auto p-4 md:p-8 w-full">…</main> aka locator('section').filter({ hasText: 'CPP & OAS Estimator [2026]' }).getByRole('main')

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('main')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - navigation "Main navigation" [ref=e4]:
      - generic [ref=e5]:
        - link "LoonieFi homepage" [ref=e6] [cursor=pointer]:
          - /url: /
          - img "LoonieFi Logo" [ref=e7]
          - generic [ref=e8]: LoonieFi
        - tablist "Calculator navigation" [ref=e9]:
          - tab "CPP & OAS" [selected] [ref=e10] [cursor=pointer]
          - tab "RESP" [ref=e11] [cursor=pointer]
          - tab "Mortgage" [ref=e12] [cursor=pointer]
          - tab "Smith Calc" [ref=e13] [cursor=pointer]
          - tab "Mat. Leave" [ref=e14] [cursor=pointer]
          - tab "Family Cash" [ref=e15] [cursor=pointer]
    - main [ref=e16]:
      - main [ref=e17]:
        - generic [ref=e18]:
          - generic [ref=e19]:
            - heading "CPP & OAS Estimator [2026]" [level=1] [ref=e20]
            - paragraph [ref=e21]: Accurate estimates for your government pension benefits, including the new enhanced CPP and GIS top-ups.
          - main [ref=e24]:
            - generic [ref=e25]:
              - generic [ref=e27]:
                - button "1. Earnings & Inputs" [ref=e28] [cursor=pointer]
                - button "2. View Estimate" [ref=e29] [cursor=pointer]
              - generic [ref=e31]:
                - generic [ref=e32]:
                  - generic [ref=e33]:
                    - generic [ref=e34]:
                      - img [ref=e35]
                      - heading "Profile & Family" [level=3] [ref=e40]
                    - generic [ref=e41]:
                      - generic [ref=e42]:
                        - generic [ref=e43]: Date of Birth
                        - textbox [ref=e44]: 1985-01-01
                      - generic [ref=e45]:
                        - generic [ref=e46]:
                          - generic [ref=e47]:
                            - generic [ref=e48]: Target Retirement Age
                            - generic [ref=e49]: The age you plan to start collecting CPP and OAS. Start as early as 60 or as late as 70.
                          - generic [ref=e50]: "65"
                        - slider "Target Retirement Age" [ref=e51] [cursor=pointer]: "65"
                      - generic [ref=e52]:
                        - generic [ref=e53]: Early (60)
                        - generic [ref=e54]: Standard (65)
                        - generic [ref=e55]: Deferred (70)
                    - generic [ref=e56]:
                      - generic [ref=e57] [cursor=pointer]:
                        - checkbox "I have a Spouse / Partner Helps estimate household GIS supplement eligibility." [ref=e58]
                        - generic [ref=e59]:
                          - generic [ref=e60]: I have a Spouse / Partner
                          - text: Helps estimate household GIS supplement eligibility.
                      - generic [ref=e61] [cursor=pointer]:
                        - checkbox "Raised Children (Child-Rearing Provision) Drops low-income years while kids were under 7." [ref=e62]
                        - generic [ref=e63]:
                          - generic [ref=e64]: Raised Children (Child-Rearing Provision)
                          - text: Drops low-income years while kids were under 7.
                  - generic [ref=e65]:
                    - generic [ref=e66]:
                      - img [ref=e67]
                      - heading "Financial & Residency" [level=3] [ref=e69]
                    - generic [ref=e70]:
                      - generic [ref=e72] [cursor=pointer]:
                        - generic [ref=e73]: Canadian Resident Entire Adult Life?
                        - text: Age 18 to present / 65.
                      - generic [ref=e76]:
                        - generic [ref=e77]: Personal Retirement Income (Taxable)
                        - generic [ref=e78]: Estimate your annual taxable income in retirement (excluding OAS/GIS). Includes workplace pensions, RRSP/RRIF withdrawals, and interest. Used for the OAS Recovery Tax calculation.
                        - generic [ref=e79]:
                          - generic: $
                          - textbox "Personal Retirement Income (Taxable)" [ref=e80]
                      - paragraph [ref=e81]: Do not include TFSA withdrawals.
                - generic [ref=e84]:
                  - generic [ref=e85]:
                    - img [ref=e86]
                    - heading "Earnings History" [level=3] [ref=e89]
                  - generic [ref=e90]:
                    - generic [ref=e91] [cursor=pointer]:
                      - img [ref=e93]
                      - heading "Quick Estimate" [level=4] [ref=e98]
                      - paragraph [ref=e99]: Just enter your current salary. We'll automatically project it backward and forward for a fast calculation.
                    - generic [ref=e100] [cursor=pointer]:
                      - img [ref=e102]
                      - heading "Official Data Import" [level=4] [ref=e105]
                      - paragraph [ref=e106]: Paste your Service Canada data for the most accurate results possible, accounting for gap years and tiered contributions.
                  - generic [ref=e107]:
                    - generic [ref=e109]:
                      - generic [ref=e111]:
                        - generic [ref=e112]: Generate Forecast from Salary
                        - generic [ref=e113]:
                          - generic: $
                          - textbox "Generate Forecast from Salary" [ref=e114]
                      - button "Generate All" [ref=e115] [cursor=pointer]:
                        - img [ref=e116]
                        - text: Generate All
                    - generic [ref=e122]:
                      - button "Import" [ref=e123] [cursor=pointer]:
                        - img [ref=e124]
                        - text: Import
                      - button "Clear all earnings" [ref=e127] [cursor=pointer]:
                        - img [ref=e128]
                - generic [ref=e131]:
                  - generic [ref=e132]:
                    - generic [ref=e133]: Forecast @ Age 65
                    - generic [ref=e134]: $1,872 / mo
                  - generic [ref=e135]:
                    - button "Share" [ref=e136] [cursor=pointer]:
                      - img [ref=e137]
                      - text: Share
                    - button "Analyze Forecast" [ref=e140] [cursor=pointer]:
                      - text: Analyze Forecast
                      - img [ref=e141]
          - region "Popular Retirement Scenarios" [ref=e144]:
            - heading "Popular Retirement Scenarios" [level=2] [ref=e145]
            - list [ref=e146]:
              - listitem [ref=e147]:
                - link "View Retiring Early at Age 60 scenario" [ref=e148] [cursor=pointer]:
                  - /url: /calculator/cpp-oas/taking-cpp-early-at-60
                  - generic [ref=e149]:
                    - generic [ref=e150]: Early
                    - img [ref=e151]
                  - heading "Retiring Early at Age 60" [level=3] [ref=e153]
                  - paragraph [ref=e154]: See the impact of the 36% permanent penalty on your monthly payments.
              - listitem [ref=e155]:
                - link "View Retiring at Age 62 scenario" [ref=e156] [cursor=pointer]:
                  - /url: /calculator/cpp-oas/taking-cpp-at-62
                  - generic [ref=e157]:
                    - generic [ref=e158]: Early
                    - img [ref=e159]
                  - heading "Retiring at Age 62" [level=3] [ref=e161]
                  - paragraph [ref=e162]: A common compromise age. Calculate your specific penalty (21.6% reduction).
              - listitem [ref=e163]:
                - link "View Standard Retirement (Age 65) scenario" [ref=e164] [cursor=pointer]:
                  - /url: /calculator/cpp-oas/standard-retirement-age-65
                  - generic [ref=e165]:
                    - generic [ref=e166]: Standard
                    - img [ref=e167]
                  - heading "Standard Retirement (Age 65)" [level=3] [ref=e169]
                  - paragraph [ref=e170]: The benchmark calculation. 100% of your entitled CPP and OAS with no adjustments.
              - listitem [ref=e171]:
                - link "View Deferring to Age 68 scenario" [ref=e172] [cursor=pointer]:
                  - /url: /calculator/cpp-oas/deferring-cpp-to-68
                  - generic [ref=e173]:
                    - generic [ref=e174]: Deferred
                    - img [ref=e175]
                  - heading "Deferring to Age 68" [level=3] [ref=e177]
                  - paragraph [ref=e178]: Boost your pension by 25.2% (CPP) and 21.6% (OAS) by waiting three extra years.
              - listitem [ref=e179]:
                - link "View Max Deferral (Age 70) scenario" [ref=e180] [cursor=pointer]:
                  - /url: /calculator/cpp-oas/maximum-deferral-age-70
                  - generic [ref=e181]:
                    - generic [ref=e182]: Deferred
                    - img [ref=e183]
                  - heading "Max Deferral (Age 70)" [level=3] [ref=e185]
                  - paragraph [ref=e186]: The 'patience payoff'. See the maximum possible monthly boost (42% CPP, 36% OAS).
              - listitem [ref=e187]:
                - link "View Maximum CPP Contributor scenario" [ref=e188] [cursor=pointer]:
                  - /url: /calculator/cpp-oas/maximum-cpp-amount-2026
                  - generic [ref=e189]:
                    - generic [ref=e190]: Standard
                    - img [ref=e191]
                  - heading "Maximum CPP Contributor" [level=3] [ref=e193]
                  - paragraph [ref=e194]: Estimate for high-income earners who consistently hit the Yearly Maximum Pensionable Earnings.
            - link "Browse all CPP and OAS retirement scenarios" [ref=e196] [cursor=pointer]:
              - /url: /calculator/cpp-oas/browse
              - text: View All Scenarios
              - img [ref=e197]
    - contentinfo [ref=e199]:
      - generic [ref=e200]:
        - navigation "Footer navigation" [ref=e201]:
          - link "About Us" [ref=e202] [cursor=pointer]:
            - /url: /about
          - generic [ref=e203]: •
          - link "Guides & Blog" [ref=e204] [cursor=pointer]:
            - /url: /blog
            - img [ref=e206]
            - text: Guides & Blog
          - generic [ref=e209]: •
          - button "Copy page URL to clipboard" [ref=e210] [cursor=pointer]:
            - text: Share Link
            - img [ref=e211]
          - generic [ref=e214]: •
          - button "Contact" [ref=e216] [cursor=pointer]
        - paragraph [ref=e218]:
          - strong [ref=e219]: "Disclaimer:"
          - text: This tool provides estimates for informational purposes only and does not constitute financial, legal, or tax advice. While we strive for accuracy using official formulas, your actual government benefits (CPP, OAS, CCB) may vary based on official assessments. Please consult a professional financial planner or Service Canada for your specific situation.
        - generic [ref=e220]:
          - paragraph [ref=e221]: © 2026 LoonieFi. All rights reserved.
          - paragraph [ref=e222]: Made with ♥ in Waterloo, ON (v1.2)
  - generic [ref=e225]:
    - button "Menu" [ref=e226]:
      - img [ref=e228]
      - generic: Menu
    - button "Inspect" [ref=e232]:
      - img [ref=e234]
      - generic: Inspect
    - button "Audit" [ref=e236]:
      - generic [ref=e237]:
        - img [ref=e238]
        - img [ref=e241]
      - generic: Audit
    - button "Settings" [ref=e244]:
      - img [ref=e246]
      - generic: Settings
  - button "Open AI Copilot" [ref=e250] [cursor=pointer]:
    - img [ref=e251]
    - generic [ref=e253]: Ask AI
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const calculators = [
  4  |   { name: 'CPP & OAS', path: '/cpp-oas-calculator' },
  5  |   { name: 'Child Benefit', path: '/child-benefit-calculator' },
  6  |   { name: 'Mortgage', path: '/mortgage-calculator' },
  7  |   { name: 'Parental Leave', path: '/parental-leave-calculator' },
  8  |   { name: 'RESP', path: '/resp-calculator' },
  9  |   { name: 'CAGR', path: '/cagr-calculator' },
  10 |   { name: 'Smith Manoeuvre', path: '/smith-manoeuvre' },
  11 | ];
  12 | 
  13 | test.describe('Calculator Smoke Tests', () => {
  14 |   for (const calc of calculators) {
  15 |     test(`should load ${calc.name} calculator`, async ({ page }) => {
  16 |       await page.goto(calc.path);
  17 |       // Check for a common element or the title
  18 |       await expect(page).toHaveTitle(/LoonieFi/);
  19 |       // Verify main content area exists
  20 |       const main = page.locator('main');
> 21 |       await expect(main).toBeVisible();
     |                          ^ Error: expect(locator).toBeVisible() failed
  22 |     });
  23 |   }
  24 | });
  25 | 
  26 | test.describe('pSEO Route Integrity', () => {
  27 |     test('should load dynamic child benefit scenario', async ({ page }) => {
  28 |         await page.goto('/calculator/child-benefit/ontario/married-2-children/60000');
  29 |         await expect(page.getByText('Ontario')).toBeVisible();
  30 |         await expect(page.getByText('$60,000')).toBeVisible();
  31 |         // Check for "spiderweb" links we fixed earlier
  32 |         const nearbyLinks = page.locator('a:has-text("View")');
  33 |         await expect(nearbyLinks.first()).toBeVisible();
  34 |     });
  35 | });
  36 | 
```