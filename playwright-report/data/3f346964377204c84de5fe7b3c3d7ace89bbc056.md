# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: calculators.spec.js >> Calculator Smoke Tests >> should load Mortgage calculator
- Location: tests/e2e/calculators.spec.js:15:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('main')
Expected: visible
Error: strict mode violation: locator('main') resolved to 2 elements:
    1) <main class="flex-grow flex flex-col">…</main> aka getByRole('main').filter({ hasText: 'Mortgage Calculator Canadian' })
    2) <main class="flex-grow flex flex-col justify-center w-full animate-fade-in">…</main> aka getByRole('main').filter({ hasText: 'Mortgage Calculator Canadian' }).getByRole('main')

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
          - tab "Mortgage" [selected] [ref=e12] [cursor=pointer]
          - tab "Smith Calc" [ref=e13] [cursor=pointer]
          - tab "Mat. Leave" [ref=e14] [cursor=pointer]
          - tab "Family Cash" [ref=e15] [cursor=pointer]
    - main [ref=e16]:
      - generic [ref=e18]:
        - generic [ref=e19]:
          - heading "Mortgage Calculator" [level=1] [ref=e20]
          - paragraph [ref=e21]: Canadian specific compounding and accelerated paydown options
        - generic [ref=e24]: Semi-Annual Compounding (Fixed Rate)
      - main [ref=e25]:
        - generic [ref=e27]:
          - generic [ref=e28]:
            - generic [ref=e29]:
              - img [ref=e31]
              - generic [ref=e33]:
                - heading "Canadian Mortgage Paydown" [level=1] [ref=e34]
                - paragraph [ref=e35]: Accelerate Your Financial Freedom
            - button "Reset Calculator" [ref=e37] [cursor=pointer]:
              - img [ref=e38]
              - text: Reset Calculator
          - generic [ref=e41]:
            - generic [ref=e42]:
              - generic [ref=e43]:
                - generic [ref=e44]:
                  - button "New Purchase" [ref=e45] [cursor=pointer]:
                    - img [ref=e46]
                    - text: New Purchase
                  - button "Renewal / Refi" [ref=e48] [cursor=pointer]:
                    - img [ref=e49]
                    - text: Renewal / Refi
                - generic [ref=e53]:
                  - generic [ref=e54]:
                    - generic [ref=e55]:
                      - generic [ref=e56]: Province
                      - combobox [ref=e58] [cursor=pointer]:
                        - option "Ontario" [selected]
                        - option "British Columbia"
                        - option "Quebec"
                        - option "Alberta"
                        - option "Manitoba"
                        - option "Saskatchewan"
                        - option "Nova Scotia"
                        - option "New Brunswick"
                        - option "Prince Edward Island"
                        - option "Newfoundland and Labrador"
                    - generic [ref=e59]:
                      - generic [ref=e60] [cursor=pointer]:
                        - checkbox "Inside Toronto" [ref=e62]
                        - generic [ref=e64]: Inside Toronto
                      - generic [ref=e65] [cursor=pointer]:
                        - checkbox "First-Time Buyer" [ref=e67]
                        - generic [ref=e69]: First-Time Buyer
                  - generic [ref=e70]:
                    - generic [ref=e71]: Asking Price
                    - generic [ref=e72]: Property Purchase Price
                    - generic [ref=e73]:
                      - generic: $
                      - textbox "Asking Price" [ref=e74]: "500000"
                  - generic [ref=e75]:
                    - generic [ref=e76]:
                      - generic [ref=e77]: Down Payment
                      - generic [ref=e78]:
                        - button "$ CAD" [ref=e79] [cursor=pointer]
                        - button "% Percent" [ref=e80] [cursor=pointer]
                    - generic [ref=e81]:
                      - generic: $
                      - textbox [ref=e82]: "100000"
                    - paragraph [ref=e84]: 20.0%
                  - generic [ref=e85]:
                    - generic [ref=e86]:
                      - generic [ref=e87]: Start Date
                      - textbox [ref=e88]: 2026-05-02
                    - generic [ref=e89]:
                      - generic [ref=e90]:
                        - generic [ref=e91]: Interest Rate
                        - generic [ref=e92] [cursor=pointer]:
                          - checkbox "Stress Test" [ref=e94]
                          - generic [ref=e96]: Stress Test
                      - generic [ref=e97]:
                        - textbox [ref=e98]: "5"
                        - generic [ref=e99]: "%"
                  - generic [ref=e100]:
                    - generic [ref=e101]:
                      - generic [ref=e102]: Amortization
                      - combobox [ref=e104] [cursor=pointer]:
                        - option "5 Years"
                        - option "10 Years"
                        - option "15 Years"
                        - option "20 Years"
                        - option "25 Years" [selected]
                        - option "30 Years"
                    - generic [ref=e105]:
                      - generic [ref=e106]: Mortgage Term
                      - combobox [ref=e108] [cursor=pointer]:
                        - option "1 Year"
                        - option "2 Years"
                        - option "3 Years"
                        - option "4 Years"
                        - option "5 Years" [selected]
                        - option "7 Years"
                        - option "10 Years"
                  - generic [ref=e109]:
                    - generic [ref=e110]:
                      - generic [ref=e111]: Payment Frequency
                      - combobox [ref=e113] [cursor=pointer]:
                        - option "Monthly" [selected]
                        - option "Semi-Monthly"
                        - option "Bi-Weekly"
                        - option "Accelerated Bi-Weekly"
                        - option "Weekly"
                        - option "Accelerated Weekly"
                    - generic [ref=e114]:
                      - generic [ref=e115]: Compounding
                      - combobox [ref=e117] [cursor=pointer]:
                        - option "Semi-Annual (Fixed Rate)" [selected]
                        - option "Monthly (Variable Rate)"
                  - generic [ref=e118]:
                    - generic [ref=e119]: Custom Payment
                    - generic [ref=e120]:
                      - generic: $
                      - textbox "Optional" [ref=e121]
                - group [ref=e123]:
                  - generic "Property Details (PITH)" [ref=e124] [cursor=pointer]:
                    - generic [ref=e125]:
                      - img [ref=e127]
                      - heading "Property Details (PITH)" [level=3] [ref=e130]
                    - img [ref=e132]
                - group [ref=e135]:
                  - generic "Prepayment Options" [ref=e136] [cursor=pointer]:
                    - generic [ref=e137]:
                      - img [ref=e139]
                      - heading "Prepayment Options" [level=3] [ref=e142]
                    - img [ref=e144]
              - generic [ref=e146]:
                - img [ref=e148]
                - paragraph [ref=e150]:
                  - text: Use this tool to calculate your mortgage payments and see how prepayments can save you thousands in interest.
                  - strong [ref=e151]: "Canadian specific:"
                  - text: Fixed rates compound semi-annually.
            - generic [ref=e153]:
              - generic [ref=e155]:
                - paragraph [ref=e156]: Regular Payment (monthly)
                - generic [ref=e159]: $2,326.42
                - generic [ref=e160]:
                  - generic [ref=e161]:
                    - generic [ref=e162]: Total Loan
                    - generic [ref=e163]: $400,000
                  - generic [ref=e164]:
                    - generic [ref=e165]: End of Term (5yr)
                    - generic [ref=e166]: $354,030
                  - generic [ref=e167]:
                    - generic [ref=e168]: Total Interest
                    - generic [ref=e169]: $297,926
                  - generic [ref=e170]:
                    - generic [ref=e171]: Payoff Time
                    - generic [ref=e172]: 25yr 0mo
              - generic [ref=e173]:
                - generic [ref=e174]:
                  - img [ref=e176]
                  - generic [ref=e179]: Prepayments
                  - generic [ref=e180]: Add a lump sum or monthly increase to see your savings.
                - generic [ref=e182]:
                  - generic [ref=e183]:
                    - generic [ref=e184]:
                      - img [ref=e185]
                      - generic [ref=e187]: Est. Cash to Close
                    - generic [ref=e188]: $108,325
                  - generic [ref=e189]:
                    - generic [ref=e190]:
                      - generic [ref=e191]: Down Payment
                      - generic [ref=e192]: $100,000
                    - generic [ref=e193]:
                      - generic [ref=e194]: Land Transfer Tax
                      - generic [ref=e195]: $6,475
                    - generic [ref=e196]:
                      - generic [ref=e197]: Legal & Title (Est.)
                      - generic [ref=e198]: $1,500
                    - generic [ref=e199]:
                      - generic [ref=e200]: Appraisal (Est.)
                      - generic [ref=e201]: $350
              - generic [ref=e202]:
                - generic [ref=e203]:
                  - generic [ref=e204]:
                    - heading "Balance Over Time" [level=3] [ref=e205]
                    - generic [ref=e207]: Remaining Balance
                  - application [ref=e212]:
                    - generic [ref=e223]:
                      - generic [ref=e224]:
                        - generic [ref=e226]: "1"
                        - generic [ref=e228]: "3"
                        - generic [ref=e230]: "5"
                        - generic [ref=e232]: "7"
                        - generic [ref=e234]: "9"
                        - generic [ref=e236]: "11"
                        - generic [ref=e238]: "13"
                        - generic [ref=e240]: "15"
                        - generic [ref=e242]: "17"
                        - generic [ref=e244]: "19"
                        - generic [ref=e246]: "21"
                        - generic [ref=e248]: "23"
                        - generic [ref=e250]: "25"
                      - generic [ref=e251]:
                        - generic [ref=e253]: $0
                        - generic [ref=e255]: $100k
                        - generic [ref=e257]: $200k
                        - generic [ref=e259]: $300k
                        - generic [ref=e261]: $400k
                - generic [ref=e262]:
                  - generic [ref=e263]:
                    - heading "Yearly Composition" [level=3] [ref=e264]
                    - generic [ref=e265]:
                      - generic [ref=e266]: Interest
                      - generic [ref=e268]: Principal
                  - application [ref=e273]:
                    - generic [ref=e336]:
                      - generic [ref=e337]:
                        - generic [ref=e339]: "1"
                        - generic [ref=e341]: "3"
                        - generic [ref=e343]: "5"
                        - generic [ref=e345]: "7"
                        - generic [ref=e347]: "9"
                        - generic [ref=e349]: "11"
                        - generic [ref=e351]: "13"
                        - generic [ref=e353]: "15"
                        - generic [ref=e355]: "17"
                        - generic [ref=e357]: "19"
                        - generic [ref=e359]: "21"
                        - generic [ref=e361]: "23"
                        - generic [ref=e363]: "25"
                      - generic [ref=e364]:
                        - generic [ref=e366]: $0
                        - generic [ref=e368]: $7k
                        - generic [ref=e370]: $14k
                        - generic [ref=e372]: $21k
                        - generic [ref=e374]: $28k
              - generic [ref=e375]:
                - generic [ref=e376]:
                  - heading "Complete Schedule" [level=3] [ref=e377]
                  - button "Export CSV" [ref=e378] [cursor=pointer]:
                    - img [ref=e379]
                    - text: Export CSV
                - table [ref=e383]:
                  - rowgroup [ref=e384]:
                    - row "Year Interest Principal Balance" [ref=e385]:
                      - columnheader "Year" [ref=e386]
                      - columnheader "Interest" [ref=e387]
                      - columnheader "Principal" [ref=e388]
                      - columnheader "Balance" [ref=e389]
                  - rowgroup [ref=e390]:
                    - row "1 $19,608 $8,309 $391,691" [ref=e391]:
                      - cell "1" [ref=e392]
                      - cell "$19,608" [ref=e393]
                      - cell "$8,309" [ref=e394]
                      - cell "$391,691" [ref=e395]
                    - row "2 $19,187 $8,730 $382,961" [ref=e396]:
                      - cell "2" [ref=e397]
                      - cell "$19,187" [ref=e398]
                      - cell "$8,730" [ref=e399]
                      - cell "$382,961" [ref=e400]
                    - row "3 $18,745 $9,172 $373,790" [ref=e401]:
                      - cell "3" [ref=e402]
                      - cell "$18,745" [ref=e403]
                      - cell "$9,172" [ref=e404]
                      - cell "$373,790" [ref=e405]
                    - row "4 $18,281 $9,636 $364,154" [ref=e406]:
                      - cell "4" [ref=e407]
                      - cell "$18,281" [ref=e408]
                      - cell "$9,636" [ref=e409]
                      - cell "$364,154" [ref=e410]
                    - row "5 $17,793 $10,124 $354,030" [ref=e411]:
                      - cell "5" [ref=e412]
                      - cell "$17,793" [ref=e413]
                      - cell "$10,124" [ref=e414]
                      - cell "$354,030" [ref=e415]
                    - row "6 $17,281 $10,636 $343,394" [ref=e416]:
                      - cell "6" [ref=e417]
                      - cell "$17,281" [ref=e418]
                      - cell "$10,636" [ref=e419]
                      - cell "$343,394" [ref=e420]
                    - row "7 $16,742 $11,175 $332,219" [ref=e421]:
                      - cell "7" [ref=e422]
                      - cell "$16,742" [ref=e423]
                      - cell "$11,175" [ref=e424]
                      - cell "$332,219" [ref=e425]
                    - row "8 $16,177 $11,740 $320,479" [ref=e426]:
                      - cell "8" [ref=e427]
                      - cell "$16,177" [ref=e428]
                      - cell "$11,740" [ref=e429]
                      - cell "$320,479" [ref=e430]
                    - row "9 $15,582 $12,335 $308,144" [ref=e431]:
                      - cell "9" [ref=e432]
                      - cell "$15,582" [ref=e433]
                      - cell "$12,335" [ref=e434]
                      - cell "$308,144" [ref=e435]
                    - row "10 $14,958 $12,959 $295,185" [ref=e436]:
                      - cell "10" [ref=e437]
                      - cell "$14,958" [ref=e438]
                      - cell "$12,959" [ref=e439]
                      - cell "$295,185" [ref=e440]
                    - row "11 $14,302 $13,615 $281,569" [ref=e441]:
                      - cell "11" [ref=e442]
                      - cell "$14,302" [ref=e443]
                      - cell "$13,615" [ref=e444]
                      - cell "$281,569" [ref=e445]
                    - row "12 $13,612 $14,305 $267,265" [ref=e446]:
                      - cell "12" [ref=e447]
                      - cell "$13,612" [ref=e448]
                      - cell "$14,305" [ref=e449]
                      - cell "$267,265" [ref=e450]
                    - row "13 $12,888 $15,029 $252,236" [ref=e451]:
                      - cell "13" [ref=e452]
                      - cell "$12,888" [ref=e453]
                      - cell "$15,029" [ref=e454]
                      - cell "$252,236" [ref=e455]
                    - row "14 $12,127 $15,790 $236,446" [ref=e456]:
                      - cell "14" [ref=e457]
                      - cell "$12,127" [ref=e458]
                      - cell "$15,790" [ref=e459]
                      - cell "$236,446" [ref=e460]
                    - row "15 $11,328 $16,589 $219,857" [ref=e461]:
                      - cell "15" [ref=e462]
                      - cell "$11,328" [ref=e463]
                      - cell "$16,589" [ref=e464]
                      - cell "$219,857" [ref=e465]
                    - row "16 $10,488 $17,429 $202,429" [ref=e466]:
                      - cell "16" [ref=e467]
                      - cell "$10,488" [ref=e468]
                      - cell "$17,429" [ref=e469]
                      - cell "$202,429" [ref=e470]
                    - row "17 $9,606 $18,311 $184,118" [ref=e471]:
                      - cell "17" [ref=e472]
                      - cell "$9,606" [ref=e473]
                      - cell "$18,311" [ref=e474]
                      - cell "$184,118" [ref=e475]
                    - row "18 $8,679 $19,238 $164,880" [ref=e476]:
                      - cell "18" [ref=e477]
                      - cell "$8,679" [ref=e478]
                      - cell "$19,238" [ref=e479]
                      - cell "$164,880" [ref=e480]
                    - row "19 $7,705 $20,212 $144,668" [ref=e481]:
                      - cell "19" [ref=e482]
                      - cell "$7,705" [ref=e483]
                      - cell "$20,212" [ref=e484]
                      - cell "$144,668" [ref=e485]
                    - row "20 $6,682 $21,235 $123,432" [ref=e486]:
                      - cell "20" [ref=e487]
                      - cell "$6,682" [ref=e488]
                      - cell "$21,235" [ref=e489]
                      - cell "$123,432" [ref=e490]
                    - row "21 $5,607 $22,310 $101,122" [ref=e491]:
                      - cell "21" [ref=e492]
                      - cell "$5,607" [ref=e493]
                      - cell "$22,310" [ref=e494]
                      - cell "$101,122" [ref=e495]
                    - row "22 $4,477 $23,440 $77,682" [ref=e496]:
                      - cell "22" [ref=e497]
                      - cell "$4,477" [ref=e498]
                      - cell "$23,440" [ref=e499]
                      - cell "$77,682" [ref=e500]
                    - row "23 $3,291 $24,626 $53,056" [ref=e501]:
                      - cell "23" [ref=e502]
                      - cell "$3,291" [ref=e503]
                      - cell "$24,626" [ref=e504]
                      - cell "$53,056" [ref=e505]
                    - row "24 $2,044 $25,873 $27,183" [ref=e506]:
                      - cell "24" [ref=e507]
                      - cell "$2,044" [ref=e508]
                      - cell "$25,873" [ref=e509]
                      - cell "$27,183" [ref=e510]
                    - row "25 $734 $27,183 $0" [ref=e511]:
                      - cell "25" [ref=e512]
                      - cell "$734" [ref=e513]
                      - cell "$27,183" [ref=e514]
                      - cell "$0" [ref=e515]
              - generic [ref=e516]:
                - img [ref=e517]
                - paragraph [ref=e519]: "Disclaimer: This calculator is for informational purposes only. Actual mortgage rates, taxes, and fees may vary based on lender, credit score, and location. Land Transfer Tax estimates are based on current provincial and municipal rates but do not account for all possible exemptions or regional variations. Always consult with a mortgage professional or financial advisor before making real estate decisions."
      - generic [ref=e520]:
        - heading "Canadian Mortgage Rules" [level=2] [ref=e521]
        - paragraph [ref=e522]:
          - text: In Canada, mortgage interest compounding rules differ between fixed and variable rates.
          - strong [ref=e523]: Fixed-rate mortgages
          - text: are legally required to be compounded semi-annually (twice per year), while
          - strong [ref=e524]: variable-rate mortgages
          - text: are typically compounded monthly. This calculator handles these differences automatically.
        - heading "Accelerated Payments" [level=3] [ref=e525]
        - paragraph [ref=e526]: Choosing "Accelerated Bi-Weekly" or "Accelerated Weekly" payments is one of the easiest ways to pay off your mortgage faster. The "Accelerated" version takes your standard monthly payment and divides it by 2 or 4, respectively. Because there are 26 bi-weekly or 52 weekly periods in a year, you effectively make one extra full monthly payment every year toward your principal.
        - heading "Prepayment Privileges" [level=3] [ref=e527]
        - paragraph [ref=e528]: Most Canadian mortgage contracts include "prepayment privileges" that allow you to pay a certain percentage (often 15% or 20%) of the original principal or current balance each year without penalty. Even small monthly increases or annual lump sums can drastically reduce the total interest you pay over the life of the loan.
        - generic [ref=e529]:
          - generic [ref=e530]:
            - heading "Mortgage Resources" [level=3] [ref=e531]
            - list [ref=e532]:
              - listitem [ref=e533]:
                - link "How to Shave 5+ Years Off Your Mortgage" [ref=e534] [cursor=pointer]:
                  - /url: /blog/mortgage-prepayment-guide
                  - text: How to Shave 5+ Years Off Your Mortgage
              - listitem [ref=e536]:
                - link "Understanding PITH & Carrying Costs" [ref=e537] [cursor=pointer]:
                  - /url: /blog/understanding-mortgage-carrying-costs
                  - text: Understanding PITH & Carrying Costs
          - generic [ref=e539]:
            - generic [ref=e540]:
              - heading "Regional Scenarios" [level=3] [ref=e541]
              - paragraph [ref=e542]: Browse localized mortgage calculations for Toronto, Vancouver, Calgary, and more.
            - link "Browse All Scenarios" [ref=e543] [cursor=pointer]:
              - /url: /calculator/mortgage/browse
    - contentinfo [ref=e544]:
      - generic [ref=e545]:
        - navigation "Footer navigation" [ref=e546]:
          - link "About Us" [ref=e547] [cursor=pointer]:
            - /url: /about
          - generic [ref=e548]: •
          - link "Guides & Blog" [ref=e549] [cursor=pointer]:
            - /url: /blog
            - img [ref=e551]
            - text: Guides & Blog
          - generic [ref=e554]: •
          - button "Copy page URL to clipboard" [ref=e555] [cursor=pointer]:
            - text: Share Link
            - img [ref=e556]
          - generic [ref=e559]: •
          - button "Contact" [ref=e561] [cursor=pointer]
        - paragraph [ref=e563]:
          - strong [ref=e564]: "Disclaimer:"
          - text: This tool provides estimates for informational purposes only and does not constitute financial, legal, or tax advice. While we strive for accuracy using official formulas, your actual government benefits (CPP, OAS, CCB) may vary based on official assessments. Please consult a professional financial planner or Service Canada for your specific situation.
        - generic [ref=e565]:
          - paragraph [ref=e566]: © 2026 LoonieFi. All rights reserved.
          - paragraph [ref=e567]: Made with ♥ in Waterloo, ON (v1.2)
  - generic [ref=e570]:
    - button "Menu" [ref=e571]:
      - img [ref=e573]
      - generic: Menu
    - button "Inspect" [ref=e577]:
      - img [ref=e579]
      - generic: Inspect
    - button "Audit" [ref=e581]:
      - generic [ref=e582]:
        - img [ref=e583]
        - img [ref=e586]
      - generic: Audit
    - button "Settings" [ref=e589]:
      - img [ref=e591]
      - generic: Settings
  - generic [ref=e594]: $7k
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