# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: calculators.spec.js >> Calculator Smoke Tests >> should load CAGR calculator
- Location: tests/e2e/calculators.spec.js:15:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('main')
Expected: visible
Error: strict mode violation: locator('main') resolved to 2 elements:
    1) <main class="flex-grow flex flex-col">…</main> aka getByRole('main').filter({ hasText: 'CAGR Calculator Measure the' })
    2) <main class="flex-grow flex flex-col justify-center w-full animate-fade-in">…</main> aka getByRole('main').filter({ hasText: 'CAGR Calculator Measure the' }).getByRole('main')

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
          - tab "Family Cash" [ref=e15] [cursor=pointer]
    - main [ref=e16]:
      - generic [ref=e18]:
        - generic [ref=e19]:
          - heading "CAGR Calculator" [level=1] [ref=e20]
          - paragraph [ref=e21]: Measure the consistent growth rate of your investments
        - generic [ref=e24]: Standard Financial Formula
      - main [ref=e25]:
        - generic [ref=e27]:
          - generic [ref=e28]:
            - button "Find Growth Rate What return do I need?" [ref=e29] [cursor=pointer]:
              - img [ref=e30]
              - generic [ref=e33]: Find Growth Rate
              - generic [ref=e34]: What return do I need?
            - button "Find Future Value How much will I have?" [ref=e35] [cursor=pointer]:
              - img [ref=e36]
              - generic [ref=e38]: Find Future Value
              - generic [ref=e39]: How much will I have?
            - button "Find Initial Deposit How much to invest?" [ref=e40] [cursor=pointer]:
              - img [ref=e41]
              - generic [ref=e45]: Find Initial Deposit
              - generic [ref=e46]: How much to invest?
            - button "Find Time Horizon How long will it take?" [ref=e47] [cursor=pointer]:
              - img [ref=e48]
              - generic [ref=e50]: Find Time Horizon
              - generic [ref=e51]: How long will it take?
          - generic [ref=e52]:
            - generic [ref=e53]:
              - generic [ref=e54]:
                - generic [ref=e55]:
                  - generic [ref=e56]:
                    - generic [ref=e57]: Initial Investment
                    - generic [ref=e58]: Starting amount
                    - generic [ref=e59]:
                      - generic: $
                      - textbox "Initial Investment" [ref=e60]: "10000"
                  - generic [ref=e63] [cursor=pointer]:
                    - generic [ref=e66]: Add Contributions
                    - checkbox "Add Contributions" [ref=e67]
                  - generic [ref=e68]:
                    - generic [ref=e69]: Annual Return (%)
                    - generic [ref=e70]:
                      - spinbutton "Annual Return (%)" [ref=e71]: "7"
                      - generic [ref=e72]: "%"
                  - generic [ref=e73]:
                    - generic [ref=e74]: Time Period
                    - generic [ref=e75]:
                      - spinbutton "Time Period" [ref=e76]: "10"
                      - generic [ref=e77]: Years
                - generic [ref=e80] [cursor=pointer]:
                  - generic [ref=e83]: Adjust for Inflation
                  - checkbox "Adjust for Inflation" [ref=e84]
              - generic [ref=e85]:
                - img [ref=e87]
                - paragraph [ref=e89]: Projects your final wealth after a set period. Use this to see the magic of compound interest over time.
            - generic [ref=e90]:
              - generic [ref=e92]:
                - paragraph [ref=e93]: Projected Value
                - generic [ref=e96]: $20,096.61
              - generic [ref=e97]:
                - generic [ref=e98]:
                  - heading "Growth Over Time" [level=3] [ref=e99]
                  - generic [ref=e100]:
                    - generic [ref=e101]: Total Value
                    - generic [ref=e103]: Principal
                - application [ref=e108]:
                  - generic [ref=e124]:
                    - generic [ref=e125]:
                      - generic [ref=e127]: "0"
                      - generic [ref=e129]: "1"
                      - generic [ref=e131]: "2"
                      - generic [ref=e133]: "3"
                      - generic [ref=e135]: "4"
                      - generic [ref=e137]: "5"
                      - generic [ref=e139]: "6"
                      - generic [ref=e141]: "7"
                      - generic [ref=e143]: "8"
                      - generic [ref=e145]: "9"
                      - generic [ref=e147]: "10"
                    - generic [ref=e148]:
                      - generic [ref=e150]: $0
                      - generic [ref=e152]: $6k
                      - generic [ref=e154]: $11k
                      - generic [ref=e156]: $17k
                      - generic [ref=e158]: $22k
              - button "Reset Inputs" [ref=e160] [cursor=pointer]:
                - img [ref=e161]
                - text: Reset Inputs
      - generic [ref=e164]:
        - heading "What is CAGR?" [level=2] [ref=e165]
        - paragraph [ref=e166]:
          - text: The
          - strong [ref=e167]: Compound Annual Growth Rate (CAGR)
          - text: is one of the most accurate ways to calculate and determine returns for anything that can rise or fall in value over time.
        - paragraph [ref=e168]: Unlike a simple average return, CAGR smoothes out the volatility of investment returns. It represents the rate at which an investment would have grown if it had grown the same rate every single year and the profits were reinvested at the end of each year.
    - contentinfo [ref=e169]:
      - generic [ref=e170]:
        - navigation "Footer navigation" [ref=e171]:
          - link "About Us" [ref=e172] [cursor=pointer]:
            - /url: /about
          - generic [ref=e173]: •
          - link "Guides & Blog" [ref=e174] [cursor=pointer]:
            - /url: /blog
            - img [ref=e176]
            - text: Guides & Blog
          - generic [ref=e179]: •
          - button "Copy page URL to clipboard" [ref=e180] [cursor=pointer]:
            - text: Share Link
            - img [ref=e181]
          - generic [ref=e184]: •
          - button "Contact" [ref=e186] [cursor=pointer]
        - paragraph [ref=e188]:
          - strong [ref=e189]: "Disclaimer:"
          - text: This tool provides estimates for informational purposes only and does not constitute financial, legal, or tax advice. While we strive for accuracy using official formulas, your actual government benefits (CPP, OAS, CCB) may vary based on official assessments. Please consult a professional financial planner or Service Canada for your specific situation.
        - generic [ref=e190]:
          - paragraph [ref=e191]: © 2026 LoonieFi. All rights reserved.
          - paragraph [ref=e192]: Made with ♥ in Waterloo, ON (v1.2)
  - generic [ref=e195]:
    - button "Menu" [ref=e196]:
      - img [ref=e198]
      - generic: Menu
    - button "Inspect" [ref=e202]:
      - img [ref=e204]
      - generic: Inspect
    - button "Audit" [ref=e206]:
      - generic [ref=e207]:
        - img [ref=e208]
        - img [ref=e211]
      - generic: Audit
    - button "Settings" [ref=e214]:
      - img [ref=e216]
      - generic: Settings
  - generic [ref=e219]: $0
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