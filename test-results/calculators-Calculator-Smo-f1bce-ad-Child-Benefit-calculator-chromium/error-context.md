# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: calculators.spec.js >> Calculator Smoke Tests >> should load Child Benefit calculator
- Location: tests/e2e/calculators.spec.js:15:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('main')
Expected: visible
Error: strict mode violation: locator('main') resolved to 3 elements:
    1) <main class="flex-grow flex flex-col">…</main> aka getByRole('main').filter({ hasText: 'Household Benefits Estimator' })
    2) <main class="flex-grow flex flex-col justify-center w-full animate-fade-in">…</main> aka getByRole('main').nth(1)
    3) <main class="max-w-5xl mx-auto p-4 md:p-8 w-full mt-6">…</main> aka getByRole('main').nth(2)

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
          - tab "CPP & OAS" [ref=e10] [cursor=pointer]
          - tab "RESP" [ref=e11] [cursor=pointer]
          - tab "Mortgage" [ref=e12] [cursor=pointer]
          - tab "Smith Calc" [ref=e13] [cursor=pointer]
          - tab "Mat. Leave" [ref=e14] [cursor=pointer]
          - tab "Family Cash" [selected] [ref=e15] [cursor=pointer]
    - main [ref=e16]:
      - generic [ref=e18]:
        - generic [ref=e19]:
          - heading "Household Benefits Estimator [2026]" [level=1] [ref=e20]
          - paragraph [ref=e21]: CCB, Trillium, Carbon Rebate & GST Credits
        - generic [ref=e24]: "Data: CRA Indexed Rates (July 2026)"
      - main [ref=e25]:
        - main [ref=e28]:
          - generic [ref=e29]:
            - generic [ref=e31]:
              - button "1. Household Inputs" [ref=e32] [cursor=pointer]
              - button "2. View Entitlement" [ref=e33] [cursor=pointer]
            - generic [ref=e35]:
              - generic [ref=e36]:
                - generic [ref=e37]:
                  - generic [ref=e38]:
                    - img [ref=e39]
                    - text: Household Profile
                  - generic [ref=e41]:
                    - generic [ref=e42]:
                      - generic [ref=e43]: Province
                      - combobox "Province" [ref=e44] [cursor=pointer]:
                        - option "Ontario (ON)" [selected]
                        - option "Alberta (AB)"
                        - option "British Columbia (BC)"
                        - option "Quebec (QC)"
                        - option "Saskatchewan (SK)"
                        - option "Manitoba (MB)"
                        - option "Nova Scotia (NS)"
                        - option "New Brunswick (NB)"
                        - option "Newfoundland (NL)"
                        - option "Prince Edward Island (PE)"
                        - option "Other Provinces"
                    - generic [ref=e45]:
                      - generic [ref=e46]: Marital Status
                      - combobox "Marital Status" [ref=e47] [cursor=pointer]:
                        - option "Married / Common-Law" [selected]
                        - option "Single Parent"
                    - generic [ref=e48]:
                      - generic [ref=e49]: Net Household Income
                      - generic [ref=e50]:
                        - generic: $
                        - textbox "Net Household Income" [ref=e51]: "65000"
                    - generic [ref=e52]:
                      - generic [ref=e53] [cursor=pointer]:
                        - checkbox "Shared Custody? 40-60% split" [ref=e55]
                        - generic [ref=e56]:
                          - generic [ref=e57]: Shared Custody?
                          - generic [ref=e58]: 40-60% split
                      - generic [ref=e59] [cursor=pointer]:
                        - checkbox "Rural Area? +20% Carbon Rebate" [ref=e61]
                        - generic [ref=e62]:
                          - generic [ref=e63]: Rural Area?
                          - generic [ref=e64]: +20% Carbon Rebate
                - generic [ref=e65]:
                  - generic [ref=e66]:
                    - generic [ref=e67]:
                      - img [ref=e68]
                      - text: Children
                    - button "+ Add Child" [ref=e73] [cursor=pointer]
                  - generic [ref=e74]:
                    - generic [ref=e75]:
                      - generic [ref=e76]: "1"
                      - generic [ref=e77]:
                        - generic [ref=e79]: Max Rate
                        - generic [ref=e80]:
                          - generic [ref=e81]:
                            - generic [ref=e83]: Child Age
                            - generic [ref=e84]: "1"
                          - slider "Child Age" [ref=e85] [cursor=pointer]: "1"
                      - generic [ref=e86]:
                        - generic [ref=e87] [cursor=pointer]:
                          - checkbox "Disability (DTC) Required T2201 Requires an approved Form T2201 (Disability Tax Credit Certificate) on file with the CRA. This adds up to $3,411 per year per child." [ref=e88]
                          - generic [ref=e89]:
                            - generic [ref=e90]: Disability (DTC)
                            - generic [ref=e91]:
                              - text: Required T2201
                              - generic [ref=e92]:
                                - button [ref=e93]:
                                  - img [ref=e94]
                                - generic: Requires an approved Form T2201 (Disability Tax Credit Certificate) on file with the CRA. This adds up to $3,411 per year per child.
                        - button [ref=e98] [cursor=pointer]:
                          - img [ref=e99]
                    - generic [ref=e102]:
                      - generic [ref=e103]: "2"
                      - generic [ref=e104]:
                        - generic [ref=e106]: Max Rate
                        - generic [ref=e107]:
                          - generic [ref=e108]:
                            - generic [ref=e110]: Child Age
                            - generic [ref=e111]: "3"
                          - slider "Child Age" [ref=e112] [cursor=pointer]: "3"
                      - generic [ref=e113]:
                        - generic [ref=e114] [cursor=pointer]:
                          - checkbox "Disability (DTC) Required T2201 Requires an approved Form T2201 (Disability Tax Credit Certificate) on file with the CRA. This adds up to $3,411 per year per child." [ref=e115]
                          - generic [ref=e116]:
                            - generic [ref=e117]: Disability (DTC)
                            - generic [ref=e118]:
                              - text: Required T2201
                              - generic [ref=e119]:
                                - button [ref=e120]:
                                  - img [ref=e121]
                                - generic: Requires an approved Form T2201 (Disability Tax Credit Certificate) on file with the CRA. This adds up to $3,411 per year per child.
                        - button [ref=e125] [cursor=pointer]:
                          - img [ref=e126]
              - generic [ref=e129]:
                - generic [ref=e130]:
                  - generic [ref=e131]: Estimated Annual Benefit
                  - generic [ref=e132]: $15,075 / yr
                - generic [ref=e133]:
                  - button "Share" [ref=e134] [cursor=pointer]:
                    - img [ref=e135]
                    - text: Share
                  - button "View Full Breakdown" [ref=e138] [cursor=pointer]:
                    - text: View Full Breakdown
                    - img [ref=e139]
      - generic [ref=e142]:
        - paragraph [ref=e143]: Looking for specific family examples?
        - link "Browse child benefit examples by province and family size" [ref=e144] [cursor=pointer]:
          - /url: /calculator/child-benefit/browse
          - text: Browse Benefits by Province & Family Size
          - img [ref=e145]
      - generic [ref=e147]:
        - heading "When do CCB payments change?" [level=2] [ref=e148]
        - paragraph [ref=e149]:
          - text: The Canada Child Benefit (CCB) is recalculated every July based on your "Adjusted Family Net Income" (AFNI) from the previous year's tax return. For example, payments starting in
          - strong [ref=e150]: July 2026
          - text: are based on your
          - strong [ref=e151]: 2025 Tax Return
          - text: .
        - paragraph [ref=e152]: This calculator uses the latest indexation rates (announced late 2025) to forecast exactly how much your family will receive in the upcoming benefit year.
    - contentinfo [ref=e153]:
      - generic [ref=e154]:
        - navigation "Footer navigation" [ref=e155]:
          - link "About Us" [ref=e156] [cursor=pointer]:
            - /url: /about
          - generic [ref=e157]: •
          - link "Guides & Blog" [ref=e158] [cursor=pointer]:
            - /url: /blog
            - img [ref=e160]
            - text: Guides & Blog
          - generic [ref=e163]: •
          - button "Copy page URL to clipboard" [ref=e164] [cursor=pointer]:
            - text: Share Link
            - img [ref=e165]
          - generic [ref=e168]: •
          - button "Contact" [ref=e170] [cursor=pointer]
        - paragraph [ref=e172]:
          - strong [ref=e173]: "Disclaimer:"
          - text: This tool provides estimates for informational purposes only and does not constitute financial, legal, or tax advice. While we strive for accuracy using official formulas, your actual government benefits (CPP, OAS, CCB) may vary based on official assessments. Please consult a professional financial planner or Service Canada for your specific situation.
        - generic [ref=e174]:
          - paragraph [ref=e175]: © 2026 LoonieFi. All rights reserved.
          - paragraph [ref=e176]: Made with ♥ in Waterloo, ON (v1.2)
  - generic [ref=e179]:
    - button "Menu" [ref=e180]:
      - img [ref=e182]
      - generic: Menu
    - button "Inspect" [ref=e186]:
      - img [ref=e188]
      - generic: Inspect
    - button "Audit" [ref=e190]:
      - generic [ref=e191]:
        - img [ref=e192]
        - img [ref=e195]
      - generic: Audit
    - button "Settings" [ref=e198]:
      - img [ref=e200]
      - generic: Settings
  - button "Open AI Copilot" [ref=e204] [cursor=pointer]:
    - img [ref=e205]
    - generic [ref=e207]: Ask AI
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