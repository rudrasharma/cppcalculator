# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: calculators.spec.js >> pSEO Route Integrity >> should load dynamic child benefit scenario
- Location: tests/e2e/calculators.spec.js:27:5

# Error details

```
Error: expect: Property 'first' not found.
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
      - main [ref=e17]:
        - generic [ref=e18]:
          - navigation "Breadcrumb" [ref=e19]:
            - list [ref=e20]:
              - listitem [ref=e21]:
                - link "Home" [ref=e22] [cursor=pointer]:
                  - /url: /
                  - img [ref=e23]
              - listitem [ref=e26]:
                - img [ref=e27]
                - link "Child Benefit" [ref=e29] [cursor=pointer]:
                  - /url: /child-benefit-calculator
              - listitem [ref=e30]:
                - img [ref=e31]
                - link "Ontario" [ref=e33] [cursor=pointer]:
                  - /url: /calculator/child-benefit/browse
              - listitem [ref=e34]:
                - img [ref=e35]
                - generic [ref=e37]: Couple (2 Children) ($60,000)
          - generic [ref=e38]:
            - heading "Ontario Child Benefit Estimator [2026]" [level=1] [ref=e39]
            - paragraph [ref=e40]:
              - text: Reviewing benefits for a
              - strong [ref=e41]: Couple (2 Children)
              - text: with a net income of
              - strong [ref=e42]: $60,000
              - text: .
          - generic [ref=e44]:
            - paragraph [ref=e45]: Estimated Monthly Support
            - generic [ref=e46]: $1,383 /mo
            - paragraph [ref=e47]: ~$16,600 per year (Tax-Free)
          - main [ref=e51]:
            - generic [ref=e52]:
              - generic [ref=e54]:
                - button "1. Household Inputs" [ref=e55] [cursor=pointer]
                - button "2. View Entitlement" [ref=e56] [cursor=pointer]
              - generic [ref=e58]:
                - generic [ref=e59]:
                  - generic [ref=e60]:
                    - generic [ref=e61]:
                      - img [ref=e62]
                      - text: Household Profile
                    - generic [ref=e64]:
                      - generic [ref=e65]:
                        - generic [ref=e66]: Province
                        - combobox "Province" [ref=e67] [cursor=pointer]:
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
                      - generic [ref=e68]:
                        - generic [ref=e69]: Marital Status
                        - combobox "Marital Status" [ref=e70] [cursor=pointer]:
                          - option "Married / Common-Law" [selected]
                          - option "Single Parent"
                      - generic [ref=e71]:
                        - generic [ref=e72]: Net Household Income
                        - generic [ref=e73]:
                          - generic: $
                          - textbox "Net Household Income" [ref=e74]: "60000"
                      - generic [ref=e75]:
                        - generic [ref=e76] [cursor=pointer]:
                          - checkbox "Shared Custody? 40-60% split" [ref=e78]
                          - generic [ref=e79]:
                            - generic [ref=e80]: Shared Custody?
                            - generic [ref=e81]: 40-60% split
                        - generic [ref=e82] [cursor=pointer]:
                          - checkbox "Rural Area? +20% Carbon Rebate" [ref=e84]
                          - generic [ref=e85]:
                            - generic [ref=e86]: Rural Area?
                            - generic [ref=e87]: +20% Carbon Rebate
                  - generic [ref=e88]:
                    - generic [ref=e89]:
                      - generic [ref=e90]:
                        - img [ref=e91]
                        - text: Children
                      - button "+ Add Child" [ref=e96] [cursor=pointer]
                    - generic [ref=e97]:
                      - generic [ref=e98]:
                        - generic [ref=e99]: "1"
                        - generic [ref=e100]:
                          - generic [ref=e102]: Max Rate
                          - generic [ref=e103]:
                            - generic [ref=e104]:
                              - generic [ref=e106]: Child Age
                              - generic [ref=e107]: "1"
                            - slider "Child Age" [ref=e108] [cursor=pointer]: "1"
                        - generic [ref=e109]:
                          - generic [ref=e110] [cursor=pointer]:
                            - checkbox "Disability (DTC) Required T2201 Requires an approved Form T2201 (Disability Tax Credit Certificate) on file with the CRA. This adds up to $3,411 per year per child." [ref=e111]
                            - generic [ref=e112]:
                              - generic [ref=e113]: Disability (DTC)
                              - generic [ref=e114]:
                                - text: Required T2201
                                - generic [ref=e115]:
                                  - button [ref=e116]:
                                    - img [ref=e117]
                                  - generic: Requires an approved Form T2201 (Disability Tax Credit Certificate) on file with the CRA. This adds up to $3,411 per year per child.
                          - button [ref=e121] [cursor=pointer]:
                            - img [ref=e122]
                      - generic [ref=e125]:
                        - generic [ref=e126]: "2"
                        - generic [ref=e127]:
                          - generic [ref=e129]: Max Rate
                          - generic [ref=e130]:
                            - generic [ref=e131]:
                              - generic [ref=e133]: Child Age
                              - generic [ref=e134]: "3"
                            - slider "Child Age" [ref=e135] [cursor=pointer]: "3"
                        - generic [ref=e136]:
                          - generic [ref=e137] [cursor=pointer]:
                            - checkbox "Disability (DTC) Required T2201 Requires an approved Form T2201 (Disability Tax Credit Certificate) on file with the CRA. This adds up to $3,411 per year per child." [ref=e138]
                            - generic [ref=e139]:
                              - generic [ref=e140]: Disability (DTC)
                              - generic [ref=e141]:
                                - text: Required T2201
                                - generic [ref=e142]:
                                  - button [ref=e143]:
                                    - img [ref=e144]
                                  - generic: Requires an approved Form T2201 (Disability Tax Credit Certificate) on file with the CRA. This adds up to $3,411 per year per child.
                          - button [ref=e148] [cursor=pointer]:
                            - img [ref=e149]
                - generic [ref=e152]:
                  - generic [ref=e153]:
                    - generic [ref=e154]: Estimated Annual Benefit
                    - generic [ref=e155]: $16,600 / yr
                  - generic [ref=e156]:
                    - button "Share" [ref=e157] [cursor=pointer]:
                      - img [ref=e158]
                      - text: Share
                    - button "View Full Breakdown" [ref=e161] [cursor=pointer]:
                      - text: View Full Breakdown
                      - img [ref=e162]
          - generic [ref=e164]:
            - heading "Your Result Explained" [level=2] [ref=e165]
            - paragraph [ref=e166]:
              - text: At an income of
              - strong [ref=e167]: $60,000
              - text: ", your family falls into the eligible range for federal benefits. Based on a household income of $60,000, a Couple (2 Children) in Ontario qualifies for approximately $16,600 per year in government support. This , plus includes the quarterly GST/HST credit and the Canada Carbon Rebate and the Ontario Child & Trillium."
            - heading "Benefit Breakdown" [level=3] [ref=e168]
            - list [ref=e169]:
              - listitem [ref=e170]:
                - strong [ref=e171]: "Canada Child Benefit (CCB):"
                - text: $13,613 / year
              - listitem [ref=e172]:
                - strong [ref=e173]: "Ontario Child & Trillium:"
                - text: $1,423 / year
              - listitem [ref=e174]:
                - strong [ref=e175]: "Tax Credits (GST + Carbon):"
                - text: $1,565 / year
          - generic [ref=e176]:
            - heading "Compare Nearby Income Levels" [level=3] [ref=e177]
            - generic [ref=e178]:
              - link "← View $55,000" [ref=e179] [cursor=pointer]:
                - /url: /calculator/child-benefit/ontario/married-2-children/55000
              - link "View $65,000 →" [ref=e180] [cursor=pointer]:
                - /url: /calculator/child-benefit/ontario/married-2-children/65000
    - contentinfo [ref=e181]:
      - generic [ref=e182]:
        - navigation "Footer navigation" [ref=e183]:
          - link "About Us" [ref=e184] [cursor=pointer]:
            - /url: /about
          - generic [ref=e185]: •
          - link "Guides & Blog" [ref=e186] [cursor=pointer]:
            - /url: /blog
            - img [ref=e188]
            - text: Guides & Blog
          - generic [ref=e191]: •
          - button "Copy page URL to clipboard" [ref=e192] [cursor=pointer]:
            - text: Share Link
            - img [ref=e193]
          - generic [ref=e196]: •
          - button "Contact" [ref=e198] [cursor=pointer]
        - paragraph [ref=e200]:
          - strong [ref=e201]: "Disclaimer:"
          - text: This tool provides estimates for informational purposes only and does not constitute financial, legal, or tax advice. While we strive for accuracy using official formulas, your actual government benefits (CPP, OAS, CCB) may vary based on official assessments. Please consult a professional financial planner or Service Canada for your specific situation.
        - generic [ref=e202]:
          - paragraph [ref=e203]: © 2026 LoonieFi. All rights reserved.
          - paragraph [ref=e204]: Made with ♥ in Waterloo, ON (v1.2)
  - generic [ref=e207]:
    - button "Menu" [ref=e208]:
      - img [ref=e210]
      - generic: Menu
    - button "Inspect" [ref=e214]:
      - img [ref=e216]
      - generic: Inspect
    - button "Audit" [ref=e218]:
      - generic [ref=e219]:
        - img [ref=e220]
        - img [ref=e223]
      - generic: Audit
    - button "Settings" [ref=e226]:
      - img [ref=e228]
      - generic: Settings
  - button "Open AI Copilot" [ref=e232] [cursor=pointer]:
    - img [ref=e233]
    - generic [ref=e235]: Ask AI
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
  20 |       const main = page.locator('main').first();
  21 |       await expect(main).toBeVisible();
  22 |     });
  23 |   }
  24 | });
  25 | 
  26 | test.describe('pSEO Route Integrity', () => {
  27 |     test('should load dynamic child benefit scenario', async ({ page }) => {
  28 |         await page.goto('/calculator/child-benefit/ontario/married-2-children/60000');
  29 |         // Use a more specific locator to avoid strict mode violations
  30 |         await expect(page.getByRole('heading', { name: /Ontario/i })).toBeVisible();
> 31 |         await expect(page.getByText('$60,000')).first().toBeVisible();
     |                                                ^ Error: expect: Property 'first' not found.
  32 |         // Check for "spiderweb" links we fixed earlier
  33 |         const nearbyLinks = page.locator('a:has-text("View")');
  34 |         await expect(nearbyLinks.first()).toBeVisible();
  35 |     });
  36 | });
  37 | 
```