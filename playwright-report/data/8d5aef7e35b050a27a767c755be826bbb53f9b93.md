# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: calculators.spec.js >> Calculator Smoke Tests >> should load Smith Manoeuvre calculator
- Location: tests/e2e/calculators.spec.js:15:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('main')
Expected: visible
Error: strict mode violation: locator('main') resolved to 2 elements:
    1) <main class="flex-grow flex flex-col">…</main> aka getByRole('main').first()
    2) <main class="py-12 bg-slate-50 min-h-screen">…</main> aka getByRole('main').nth(1)

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
          - tab "Smith Calc" [selected] [ref=e13] [cursor=pointer]
          - tab "Mat. Leave" [ref=e14] [cursor=pointer]
          - tab "Family Cash" [ref=e15] [cursor=pointer]
    - main [ref=e16]:
      - main [ref=e17]:
        - generic [ref=e18]:
          - heading "Smith Manoeuvre Estimator" [level=1] [ref=e19]
          - paragraph [ref=e20]: Convert your non-deductible mortgage interest into a tax-deductible investment loan. Accelerate your wealth building using the standard Canadian re-advanceable mortgage strategy.
        - generic [ref=e22]:
          - generic [ref=e23]:
            - heading "Smith Manoeuvre Optimizer" [level=1] [ref=e24]
            - paragraph [ref=e25]: In Canada, mortgage interest isn't tax-deductible. The Smith Manoeuvre solves this by gradually converting your standard mortgage into a tax-deductible investment loan, generating annual tax refunds and accelerating your wealth.
          - generic [ref=e26]:
            - generic [ref=e28]:
              - heading "The Essentials" [level=3] [ref=e29]
              - generic [ref=e30]:
                - generic [ref=e31]: Home Value
                - generic [ref=e32]:
                  - generic: $
                  - textbox "Home Value" [ref=e33]: "750000"
              - generic [ref=e34]:
                - generic [ref=e35]: Mortgage Balance
                - generic [ref=e36]:
                  - generic: $
                  - textbox "Mortgage Balance" [ref=e37]: "500000"
              - generic [ref=e38]:
                - generic [ref=e39]: Mortgage Rate (4.50%)
                - slider [ref=e40] [cursor=pointer]: "0.045"
              - generic [ref=e41]:
                - generic [ref=e42]:
                  - text: Marginal Tax Rate (43%)
                  - generic [ref=e44]: i
                - slider [ref=e45] [cursor=pointer]: "0.43"
              - generic [ref=e46]:
                - generic [ref=e47]: Capital Gains Rate (5.0%)
                - slider [ref=e48] [cursor=pointer]: "0.05"
              - generic [ref=e49]:
                - generic [ref=e50]: Dividend Yield (2.0%)
                - slider [ref=e51] [cursor=pointer]: "0.02"
              - button "⚙️ Advanced Settings ▼" [ref=e53] [cursor=pointer]:
                - generic [ref=e54]: ⚙️ Advanced Settings
                - generic [ref=e55]: ▼
            - generic [ref=e56]:
              - generic [ref=e57]:
                - generic [ref=e58]:
                  - paragraph [ref=e59]: Total Net Worth
                  - paragraph [ref=e60]: $1,180,132
                - generic [ref=e61]:
                  - paragraph [ref=e62]: Extra Wealth Created
                  - paragraph [ref=e63]: +$430,132
                - generic [ref=e64]:
                  - paragraph [ref=e65]: Portfolio Built
                  - paragraph [ref=e66]: $1,507,092
                - generic [ref=e67]:
                  - paragraph [ref=e68]: Total Out-of-Pocket Cost
                  - paragraph [ref=e69]: $0
              - generic [ref=e70]:
                - generic [ref=e71]:
                  - heading "Net Worth Projection" [level=2] [ref=e72]
                  - paragraph [ref=e73]: 25 Year Strategy Lifecycle
                - generic [ref=e76]:
                  - list [ref=e78]:
                    - listitem [ref=e79]:
                      - img "Smith Net Worth legend icon" [ref=e80]
                      - text: Smith Net Worth
                    - listitem [ref=e82]:
                      - img "Standard Net Worth legend icon" [ref=e83]
                      - text: Standard Net Worth
                  - application [ref=e85]:
                    - generic [ref=e106]:
                      - generic [ref=e107]:
                        - generic [ref=e109]: Yr 1
                        - generic [ref=e111]: Yr 3
                        - generic [ref=e113]: Yr 5
                        - generic [ref=e115]: Yr 7
                        - generic [ref=e117]: Yr 9
                        - generic [ref=e119]: Yr 11
                        - generic [ref=e121]: Yr 13
                        - generic [ref=e123]: Yr 15
                        - generic [ref=e125]: Yr 17
                        - generic [ref=e127]: Yr 19
                        - generic [ref=e129]: Yr 21
                        - generic [ref=e131]: Yr 23
                        - generic [ref=e133]: Yr 25
                      - generic [ref=e134]:
                        - generic [ref=e136]: $0.0M
                        - generic [ref=e138]: $0.3M
                        - generic [ref=e140]: $0.6M
                        - generic [ref=e142]: $0.9M
                        - generic [ref=e144]: $1.2M
              - generic [ref=e145]:
                - generic [ref=e146]:
                  - heading "Strategy Liquidity" [level=4] [ref=e147]
                  - paragraph [ref=e148]: $0
                  - paragraph [ref=e149]: Total cash flow extracted from dividends
                - generic [ref=e150]:
                  - paragraph [ref=e151]: Total Net Worth Advantage
                  - heading "$430,132" [level=4] [ref=e152]
                  - paragraph [ref=e153]: Projected wealth increase over standard home ownership.
          - generic [ref=e154]:
            - generic [ref=e156]:
              - generic [ref=e157]:
                - heading "Year-by-Year Financial Audit" [level=3] [ref=e158]
                - paragraph [ref=e159]: Detailed breakdown of debt conversion and growth
              - button "⬇️ Export Timeline (CSV)" [ref=e160] [cursor=pointer]
            - table [ref=e161]:
              - rowgroup [ref=e162]:
                - row "Year Mortgage Balance HELOC Balance Out-of-Pocket Interest Annual Tax Refund Annual Dividends Standard Net Worth Smith Net Worth Net Benefit" [ref=e163]:
                  - columnheader "Year" [ref=e164]
                  - columnheader "Mortgage Balance" [ref=e165]
                  - columnheader "HELOC Balance" [ref=e166]
                  - columnheader "Out-of-Pocket Interest" [ref=e167]
                  - columnheader "Annual Tax Refund" [ref=e168]
                  - columnheader "Annual Dividends" [ref=e169]
                  - columnheader "Standard Net Worth" [ref=e170]
                  - columnheader "Smith Net Worth" [ref=e171]
                  - columnheader "Net Benefit" [ref=e172]
              - rowgroup [ref=e173]:
                - row "1 $488,858 $11,478 $0 $144 $88 $261,142 $261,297 +$155" [ref=e174]:
                  - cell "1" [ref=e175]
                  - cell "$488,858" [ref=e176]
                  - cell "$11,478" [ref=e177]
                  - cell "$0" [ref=e178]
                  - cell "$144" [ref=e179]
                  - cell "$88" [ref=e180]
                  - cell "$261,142" [ref=e181]
                  - cell "$261,297" [ref=e182]
                  - cell "+$155" [ref=e183]
                - row "2 $477,208 $24,246 $0 $481 $297 $272,792 $273,475 +$684" [ref=e184]:
                  - cell "2" [ref=e185]
                  - cell "$477,208" [ref=e186]
                  - cell "$24,246" [ref=e187]
                  - cell "$0" [ref=e188]
                  - cell "$481" [ref=e189]
                  - cell "$297" [ref=e190]
                  - cell "$272,792" [ref=e191]
                  - cell "$273,475" [ref=e192]
                  - cell "+$684" [ref=e193]
                - row "3 $465,029 $38,416 $0 $856 $535 $284,971 $286,623 +$1,652" [ref=e194]:
                  - cell "3" [ref=e195]
                  - cell "$465,029" [ref=e196]
                  - cell "$38,416" [ref=e197]
                  - cell "$0" [ref=e198]
                  - cell "$856" [ref=e199]
                  - cell "$535" [ref=e200]
                  - cell "$284,971" [ref=e201]
                  - cell "$286,623" [ref=e202]
                  - cell "+$1,652" [ref=e203]
                - row "4 $452,295 $54,106 $0 $1,271 $806 $297,705 $300,839 +$3,134" [ref=e204]:
                  - cell "4" [ref=e205]
                  - cell "$452,295" [ref=e206]
                  - cell "$54,106" [ref=e207]
                  - cell "$0" [ref=e208]
                  - cell "$1,271" [ref=e209]
                  - cell "$806" [ref=e210]
                  - cell "$297,705" [ref=e211]
                  - cell "$300,839" [ref=e212]
                  - cell "+$3,134" [ref=e213]
                - row "5 $438,982 $71,443 $0 $1,730 $1,113 $311,018 $316,232 +$5,213" [ref=e214]:
                  - cell "5" [ref=e215]
                  - cell "$438,982" [ref=e216]
                  - cell "$71,443" [ref=e217]
                  - cell "$0" [ref=e218]
                  - cell "$1,730" [ref=e219]
                  - cell "$1,113" [ref=e220]
                  - cell "$311,018" [ref=e221]
                  - cell "$316,232" [ref=e222]
                  - cell "+$5,213" [ref=e223]
                - row "6 $425,063 $90,565 $0 $2,238 $1,460 $324,937 $332,919 +$7,982" [ref=e224]:
                  - cell "6" [ref=e225]
                  - cell "$425,063" [ref=e226]
                  - cell "$90,565" [ref=e227]
                  - cell "$0" [ref=e228]
                  - cell "$2,238" [ref=e229]
                  - cell "$1,460" [ref=e230]
                  - cell "$324,937" [ref=e231]
                  - cell "$332,919" [ref=e232]
                  - cell "+$7,982" [ref=e233]
                - row "7 $410,510 $111,621 $0 $2,796 $1,850 $339,490 $351,034 +$11,544" [ref=e234]:
                  - cell "7" [ref=e235]
                  - cell "$410,510" [ref=e236]
                  - cell "$111,621" [ref=e237]
                  - cell "$0" [ref=e238]
                  - cell "$2,796" [ref=e239]
                  - cell "$1,850" [ref=e240]
                  - cell "$339,490" [ref=e241]
                  - cell "$351,034" [ref=e242]
                  - cell "+$11,544" [ref=e243]
                - row "8 $395,296 $134,769 $0 $3,411 $2,289 $354,704 $370,719 +$16,015" [ref=e244]:
                  - cell "8" [ref=e245]
                  - cell "$395,296" [ref=e246]
                  - cell "$134,769" [ref=e247]
                  - cell "$0" [ref=e248]
                  - cell "$3,411" [ref=e249]
                  - cell "$2,289" [ref=e250]
                  - cell "$354,704" [ref=e251]
                  - cell "$370,719" [ref=e252]
                  - cell "+$16,015" [ref=e253]
                - row "9 $379,389 $160,180 $0 $4,087 $2,780 $370,611 $392,132 +$21,521" [ref=e254]:
                  - cell "9" [ref=e255]
                  - cell "$379,389" [ref=e256]
                  - cell "$160,180" [ref=e257]
                  - cell "$0" [ref=e258]
                  - cell "$4,087" [ref=e259]
                  - cell "$2,780" [ref=e260]
                  - cell "$370,611" [ref=e261]
                  - cell "$392,132" [ref=e262]
                  - cell "+$21,521" [ref=e263]
                - row "10 $362,758 $188,039 $0 $4,828 $3,330 $387,242 $415,448 +$28,206" [ref=e264]:
                  - cell "10" [ref=e265]
                  - cell "$362,758" [ref=e266]
                  - cell "$188,039" [ref=e267]
                  - cell "$0" [ref=e268]
                  - cell "$4,828" [ref=e269]
                  - cell "$3,330" [ref=e270]
                  - cell "$387,242" [ref=e271]
                  - cell "$415,448" [ref=e272]
                  - cell "+$28,206" [ref=e273]
                - row "11 $345,370 $218,544 $0 $5,640 $3,945 $404,630 $440,858 +$36,228" [ref=e274]:
                  - cell "11" [ref=e275]
                  - cell "$345,370" [ref=e276]
                  - cell "$218,544" [ref=e277]
                  - cell "$0" [ref=e278]
                  - cell "$5,640" [ref=e279]
                  - cell "$3,945" [ref=e280]
                  - cell "$404,630" [ref=e281]
                  - cell "$440,858" [ref=e282]
                  - cell "+$36,228" [ref=e283]
                - row "12 $327,191 $251,906 $0 $6,529 $4,629 $422,809 $468,570 +$45,762" [ref=e284]:
                  - cell "12" [ref=e285]
                  - cell "$327,191" [ref=e286]
                  - cell "$251,906" [ref=e287]
                  - cell "$0" [ref=e288]
                  - cell "$6,529" [ref=e289]
                  - cell "$4,629" [ref=e290]
                  - cell "$422,809" [ref=e291]
                  - cell "$468,570" [ref=e292]
                  - cell "+$45,762" [ref=e293]
                - row "13 $308,185 $288,354 $0 $7,500 $5,391 $441,815 $498,815 +$57,000" [ref=e294]:
                  - cell "13" [ref=e295]
                  - cell "$308,185" [ref=e296]
                  - cell "$288,354" [ref=e297]
                  - cell "$0" [ref=e298]
                  - cell "$7,500" [ref=e299]
                  - cell "$5,391" [ref=e300]
                  - cell "$441,815" [ref=e301]
                  - cell "$498,815" [ref=e302]
                  - cell "+$57,000" [ref=e303]
                - row "14 $288,314 $328,135 $0 $8,561 $6,237 $461,686 $531,843 +$70,157" [ref=e304]:
                  - cell "14" [ref=e305]
                  - cell "$288,314" [ref=e306]
                  - cell "$328,135" [ref=e307]
                  - cell "$0" [ref=e308]
                  - cell "$8,561" [ref=e309]
                  - cell "$6,237" [ref=e310]
                  - cell "$461,686" [ref=e311]
                  - cell "$531,843" [ref=e312]
                  - cell "+$70,157" [ref=e313]
                - row "15 $267,539 $371,511 $0 $9,718 $7,176 $482,461 $567,932 +$85,471" [ref=e314]:
                  - cell "15" [ref=e315]
                  - cell "$267,539" [ref=e316]
                  - cell "$371,511" [ref=e317]
                  - cell "$0" [ref=e318]
                  - cell "$9,718" [ref=e319]
                  - cell "$7,176" [ref=e320]
                  - cell "$482,461" [ref=e321]
                  - cell "$567,932" [ref=e322]
                  - cell "+$85,471" [ref=e323]
                - row "16 $245,818 $418,766 $0 $10,980 $8,217 $504,182 $607,383 +$103,201" [ref=e324]:
                  - cell "16" [ref=e325]
                  - cell "$245,818" [ref=e326]
                  - cell "$418,766" [ref=e327]
                  - cell "$0" [ref=e328]
                  - cell "$10,980" [ref=e329]
                  - cell "$8,217" [ref=e330]
                  - cell "$504,182" [ref=e331]
                  - cell "$607,383" [ref=e332]
                  - cell "+$103,201" [ref=e333]
                - row "17 $223,109 $470,205 $0 $12,353 $9,369 $526,891 $650,528 +$123,637" [ref=e334]:
                  - cell "17" [ref=e335]
                  - cell "$223,109" [ref=e336]
                  - cell "$470,205" [ref=e337]
                  - cell "$0" [ref=e338]
                  - cell "$12,353" [ref=e339]
                  - cell "$9,369" [ref=e340]
                  - cell "$526,891" [ref=e341]
                  - cell "$650,528" [ref=e342]
                  - cell "+$123,637" [ref=e343]
                - row "18 $199,366 $526,152 $0 $13,848 $10,643 $550,634 $697,728 +$147,094" [ref=e344]:
                  - cell "18" [ref=e345]
                  - cell "$199,366" [ref=e346]
                  - cell "$526,152" [ref=e347]
                  - cell "$0" [ref=e348]
                  - cell "$13,848" [ref=e349]
                  - cell "$10,643" [ref=e350]
                  - cell "$550,634" [ref=e351]
                  - cell "$697,728" [ref=e352]
                  - cell "+$147,094" [ref=e353]
                - row "19 $174,543 $586,959 $0 $15,473 $12,049 $575,457 $749,381 +$173,924" [ref=e354]:
                  - cell "19" [ref=e355]
                  - cell "$174,543" [ref=e356]
                  - cell "$586,959" [ref=e357]
                  - cell "$0" [ref=e358]
                  - cell "$15,473" [ref=e359]
                  - cell "$12,049" [ref=e360]
                  - cell "$575,457" [ref=e361]
                  - cell "$749,381" [ref=e362]
                  - cell "+$173,924" [ref=e363]
                - row "20 $148,591 $653,003 $0 $17,239 $13,601 $601,409 $805,919 +$204,510" [ref=e364]:
                  - cell "20" [ref=e365]
                  - cell "$148,591" [ref=e366]
                  - cell "$653,003" [ref=e367]
                  - cell "$0" [ref=e368]
                  - cell "$17,239" [ref=e369]
                  - cell "$13,601" [ref=e370]
                  - cell "$601,409" [ref=e371]
                  - cell "$805,919" [ref=e372]
                  - cell "+$204,510" [ref=e373]
                - row "21 $121,457 $724,686 $0 $19,156 $15,311 $628,543 $867,818 +$239,275" [ref=e374]:
                  - cell "21" [ref=e375]
                  - cell "$121,457" [ref=e376]
                  - cell "$724,686" [ref=e377]
                  - cell "$0" [ref=e378]
                  - cell "$19,156" [ref=e379]
                  - cell "$15,311" [ref=e380]
                  - cell "$628,543" [ref=e381]
                  - cell "$867,818" [ref=e382]
                  - cell "+$239,275" [ref=e383]
                - row "22 $93,088 $802,441 $0 $21,236 $17,195 $656,912 $935,596 +$278,685" [ref=e384]:
                  - cell "22" [ref=e385]
                  - cell "$93,088" [ref=e386]
                  - cell "$802,441" [ref=e387]
                  - cell "$0" [ref=e388]
                  - cell "$21,236" [ref=e389]
                  - cell "$17,195" [ref=e390]
                  - cell "$656,912" [ref=e391]
                  - cell "$935,596" [ref=e392]
                  - cell "+$278,685" [ref=e393]
                - row "23 $63,429 $886,734 $0 $23,492 $19,268 $686,571 $1,009,819 +$323,248" [ref=e394]:
                  - cell "23" [ref=e395]
                  - cell "$63,429" [ref=e396]
                  - cell "$886,734" [ref=e397]
                  - cell "$0" [ref=e398]
                  - cell "$23,492" [ref=e399]
                  - cell "$19,268" [ref=e400]
                  - cell "$686,571" [ref=e401]
                  - cell "$1,009,819" [ref=e402]
                  - cell "+$323,248" [ref=e403]
                - row "24 $32,420 $978,062 $0 $25,937 $21,548 $717,580 $1,091,106 +$373,526" [ref=e404]:
                  - cell "24" [ref=e405]
                  - cell "$32,420" [ref=e406]
                  - cell "$978,062" [ref=e407]
                  - cell "$0" [ref=e408]
                  - cell "$25,937" [ref=e409]
                  - cell "$21,548" [ref=e410]
                  - cell "$717,580" [ref=e411]
                  - cell "$1,091,106" [ref=e412]
                  - cell "+$373,526" [ref=e413]
                - row "25 $0 $1,076,960 $0 $28,586 $24,052 $750,000 $1,180,132 +$430,132" [ref=e414]:
                  - cell "25" [ref=e415]
                  - cell "$0" [ref=e416]
                  - cell "$1,076,960" [ref=e417]
                  - cell "$0" [ref=e418]
                  - cell "$28,586" [ref=e419]
                  - cell "$24,052" [ref=e420]
                  - cell "$750,000" [ref=e421]
                  - cell "$1,180,132" [ref=e422]
                  - cell "+$430,132" [ref=e423]
        - generic [ref=e424]:
          - heading "How the Smith Manoeuvre Works" [level=2] [ref=e425]
          - generic [ref=e426]:
            - generic [ref=e427]:
              - 'heading "Step 1: Re-advancing" [level=3] [ref=e428]'
              - paragraph [ref=e429]: As you make your regular mortgage payment, the principal portion is "re-advanced" into a Home Equity Line of Credit (HELOC).
            - generic [ref=e430]:
              - 'heading "Step 2: Investing" [level=3] [ref=e431]'
              - paragraph [ref=e432]: The money from the HELOC is invested in income-producing assets (like stocks or ETFs), making the interest on that loan tax-deductible.
            - generic [ref=e433]:
              - 'heading "Step 3: Tax Refunds" [level=3] [ref=e434]'
              - paragraph [ref=e435]: The tax deductions generate annual refunds, which you can use to pay down your mortgage even faster, accelerating the cycle.
            - generic [ref=e436]:
              - 'heading "Step 4: Debt Conversion" [level=3] [ref=e437]'
              - paragraph [ref=e438]: Eventually, your entire non-deductible mortgage is converted into a fully deductible investment loan, improving your net worth.
    - contentinfo [ref=e439]:
      - generic [ref=e440]:
        - navigation "Footer navigation" [ref=e441]:
          - link "About Us" [ref=e442] [cursor=pointer]:
            - /url: /about
          - generic [ref=e443]: •
          - link "Guides & Blog" [ref=e444] [cursor=pointer]:
            - /url: /blog
            - img [ref=e446]
            - text: Guides & Blog
          - generic [ref=e449]: •
          - button "Copy page URL to clipboard" [ref=e450] [cursor=pointer]:
            - text: Share Link
            - img [ref=e451]
          - generic [ref=e454]: •
          - button "Contact" [ref=e456] [cursor=pointer]
        - paragraph [ref=e458]:
          - strong [ref=e459]: "Disclaimer:"
          - text: This tool provides estimates for informational purposes only and does not constitute financial, legal, or tax advice. While we strive for accuracy using official formulas, your actual government benefits (CPP, OAS, CCB) may vary based on official assessments. Please consult a professional financial planner or Service Canada for your specific situation.
        - generic [ref=e460]:
          - paragraph [ref=e461]: © 2026 LoonieFi. All rights reserved.
          - paragraph [ref=e462]: Made with ♥ in Waterloo, ON (v1.2)
  - generic [ref=e465]:
    - button "Menu" [ref=e466]:
      - img [ref=e468]
      - generic: Menu
    - button "Inspect" [ref=e472]:
      - img [ref=e474]
      - generic: Inspect
    - button "Audit" [ref=e476]:
      - generic [ref=e477]:
        - img [ref=e478]
        - img [ref=e481]
      - generic: Audit
    - button "Settings" [ref=e484]:
      - img [ref=e486]
      - generic: Settings
  - generic [ref=e489]: $0.0M
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