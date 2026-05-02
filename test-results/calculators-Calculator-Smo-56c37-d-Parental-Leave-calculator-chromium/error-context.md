# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: calculators.spec.js >> Calculator Smoke Tests >> should load Parental Leave calculator
- Location: tests/e2e/calculators.spec.js:15:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('main')
Expected: visible
Error: strict mode violation: locator('main') resolved to 3 elements:
    1) <main class="flex-grow flex flex-col">…</main> aka getByRole('main').filter({ hasText: 'Maternity & Parental Leave' })
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
          - tab "Mat. Leave" [selected] [ref=e14] [cursor=pointer]
          - tab "Family Cash" [ref=e15] [cursor=pointer]
    - main [ref=e16]:
      - generic [ref=e18]:
        - generic [ref=e19]:
          - heading "Maternity & Parental Leave Estimator [2026]" [level=1] [ref=e20]
          - paragraph [ref=e21]: Plan your EI payments and family budget
        - generic [ref=e24]: "Data: Service Canada EI Rates (2026)"
      - main [ref=e25]:
        - main [ref=e28]:
          - generic [ref=e29]:
            - generic [ref=e31]:
              - button "1. Configure" [ref=e32] [cursor=pointer]
              - button "2. Your Results" [ref=e33] [cursor=pointer]
            - generic [ref=e35]:
              - generic [ref=e36]:
                - generic [ref=e37]:
                  - generic [ref=e38]:
                    - generic [ref=e39]:
                      - img [ref=e40]
                      - text: Location & Plan
                    - generic [ref=e43]:
                      - generic [ref=e44]:
                        - generic [ref=e45]: Province
                        - combobox "Province" [ref=e46] [cursor=pointer]:
                          - option "Ontario (EI)" [selected]
                          - option "British Columbia (EI)"
                          - option "Alberta (EI)"
                          - option "Quebec (QPIP)"
                          - option "Nova Scotia (EI)"
                          - option "New Brunswick (EI)"
                          - option "Manitoba (EI)"
                          - option "Saskatchewan (EI)"
                          - option "PEI (EI)"
                          - option "Newfoundland (EI)"
                          - option "Territories / Other (EI)"
                      - generic [ref=e47]:
                        - generic [ref=e48]: Plan Type
                        - generic [ref=e49]:
                          - button "Standard 12 Months (55%)" [ref=e50] [cursor=pointer]:
                            - img [ref=e52]
                            - generic [ref=e55]: Standard
                            - generic [ref=e56]: 12 Months (55%)
                          - button "Extended 18 Months (33%)" [ref=e57] [cursor=pointer]:
                            - generic [ref=e58]: Extended
                            - generic [ref=e59]: 18 Months (33%)
                  - generic [ref=e60]:
                    - generic [ref=e61]:
                      - img [ref=e62]
                      - text: Annual Income
                    - generic [ref=e67]:
                      - generic [ref=e68]:
                        - button "Set Max ($68,900)" [ref=e70] [cursor=pointer]
                        - generic [ref=e71]:
                          - generic [ref=e72]: Parent 1 (Birth)
                          - generic [ref=e73]:
                            - generic: $
                            - textbox "Parent 1 (Birth)" [ref=e74]: "70000"
                      - generic [ref=e75]:
                        - generic [ref=e76] [cursor=pointer]:
                          - checkbox "Include Partner?" [checked] [ref=e78]
                          - generic [ref=e80]: Include Partner?
                        - generic [ref=e81]:
                          - button "Set Max ($68,900)" [ref=e83] [cursor=pointer]
                          - generic [ref=e84]:
                            - generic [ref=e85]: Parent 2 (Non-Birth)
                            - generic [ref=e86]:
                              - generic: $
                              - textbox "Parent 2 (Non-Birth)" [ref=e87]: "60000"
                - generic [ref=e88]:
                  - generic [ref=e89]:
                    - img [ref=e90]
                    - text: Strategy & Allocation
                  - generic [ref=e91]:
                    - generic [ref=e92]:
                      - generic [ref=e93]:
                        - generic [ref=e94]: Maternity Leave
                        - generic [ref=e95]: Exclusive to Parent 1
                      - generic [ref=e96]:
                        - generic [ref=e97]: 15 Wks
                        - button [ref=e98] [cursor=pointer]
                    - generic [ref=e100]:
                      - generic [ref=e102]:
                        - generic [ref=e103]: Shared Pool
                        - generic [ref=e104]: Standard Pool
                      - generic [ref=e109]:
                        - generic [ref=e111]:
                          - generic [ref=e112]:
                            - generic [ref=e113]:
                              - generic [ref=e114]: Parent 1 (Birth)
                              - generic [ref=e115]: Parental Weeks
                            - generic [ref=e116]: "30"
                          - slider "Parent 1 (Birth)" [ref=e117] [cursor=pointer]: "30"
                        - generic [ref=e119]:
                          - generic [ref=e120]:
                            - generic [ref=e121]:
                              - generic [ref=e122]: Parent 2 (Non-Birth)
                              - generic [ref=e123]: Parental Weeks
                            - generic [ref=e124]: "5"
                          - slider "Parent 2 (Non-Birth)" [ref=e125] [cursor=pointer]: "5"
                      - generic [ref=e126]:
                        - generic [ref=e127]: Total Shared Weeks
                        - generic [ref=e128]: 35 / 40
              - generic [ref=e129]:
                - generic [ref=e130]:
                  - generic [ref=e131]: Estimated Total Benefit
                  - generic [ref=e132]: $35,967 Total
                - generic [ref=e133]:
                  - button "Share" [ref=e134] [cursor=pointer]:
                    - img [ref=e135]
                    - text: Share
                  - button "View Your Plan" [ref=e138] [cursor=pointer]:
                    - text: View Your Plan
                    - img [ref=e139]
      - generic [ref=e142]:
        - paragraph [ref=e143]: Looking for specific examples?
        - link "Browse parental leave examples by province and salary" [ref=e144] [cursor=pointer]:
          - /url: /calculator/parental-leave/browse
          - text: Browse Benefits by Province & Salary
          - img [ref=e145]
      - generic [ref=e147]:
        - heading "Standard vs. Extended Parental Leave" [level=2] [ref=e148]
        - paragraph [ref=e149]:
          - text: In Canada (outside Quebec), you can choose between a
          - strong [ref=e150]: Standard
          - text: (12-month) plan at 55% income replacement or an
          - strong [ref=e151]: Extended
          - text: (18-month) plan at 33%.
        - paragraph [ref=e152]: This calculator helps you visualize the trade-off between monthly cash flow and time off, including the "use it or lose it" bonus weeks available when parents share leave.
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