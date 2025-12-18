---
title: "Skip the Manual Entry: How to Import Your Service Canada Data in Seconds"
pubDate: 2025-12-20
description: "Don't type out 40 years of earnings by hand. Our new import tool lets you copy-paste your entire Service Canada history—messy formatting included."
slug: "how-to-import-msca-data"
layout: ../../layouts/BlogPost.astro
---

The most accurate CPP estimate requires your **exact** earnings history. Service Canada keeps this record, known as your "Statement of Contributions."

However, manually typing 30 or 40 years of numbers into a calculator is tedious and prone to typos. A single extra zero can throw off your entire retirement forecast.

That is why we built the **Bulk Import** feature. It uses a "fuzzy" text parser that allows you to copy directly from the government website and paste it here, without needing to clean up the formatting first.

Here is how to do it.

## Step 1: Get Your Data

To get your official numbers, you need to log in to the government portal.

> **⚠️ Important Warning: Site Availability**
>
> The My Service Canada Account (MSCA) website is frequently unavailable due to maintenance or high traffic. We have found it is most reliable during **standard business hours (Monday to Friday, 9 AM – 5 PM EST)**. If you cannot log in, please try again during these times.

1.  Log in to your **[My Service Canada Account (MSCA)](https://www.canada.ca/en/employment-social-development/services/my-account.html)**.
2.  From the main dashboard, click on **Canada Pension Plan (CPP)**.
3.  Click on **Contributions**.
4.  You should see a table listing every year you have worked and the amount you contributed.

## Step 2: The "Lazy" Copy & Paste

This is the best part: **You do not need to be precise.**

Our importer is smart enough to ignore the "noise" on the page (like menu links, footers, and copyright dates). It scans specifically for years (e.g., "2018") associated with dollar amounts.

1.  **Select Everything:** On the contributions page, just press **Ctrl + A** (Command + A on Mac) to select the entire page text. Or, click and drag your mouse from the top of the table to the bottom.
2.  **Copy:** Press **Ctrl + C**.
3.  **Paste:** Open our calculator, click the green **Import from MSCA** button, and paste the text into the box.

Click **"Parse & Import"**, and watch your grid populate instantly.

## Step 3: Fill in the Blanks (The Hybrid Strategy)

Your Service Canada data only tells the story of your *past*. It ends in 2024 (or whichever year tax data was last filed). But you aren't retiring yesterday—you are retiring in the future.

To get a true estimate, you need to combine **actual past data** with **projected future data**.

1.  **Import First:** Follow the steps above to fill your history from age 18 to present.
2.  **Estimate Future:** In the "Quick Fill" toolbar above the grid, enter your current salary (e.g., \$85,000).
3.  **Click "Fill Future":** Click the purple wand icon.

The calculator will preserve your imported data exactly as is, but it will automatically fill every future year (from today until your retirement age) with your projected salary. This gives you the most precise "hybrid" forecast possible.

## A Note on Bugs (Beta Feature)

This parser is a new, experimental feature.

Service Canada occasionally updates their website layout, which can sometimes confuse our text reader. We have tested it against standard profiles, but edge cases exist.

**If the importer fails or gives you weird numbers:**
Please let us know! You can usually fix it manually by pasting *just* the table rows instead of the whole page, but we want to make the "lazy" method work for everyone. Reach out to us at support so we can tweak the algorithm.