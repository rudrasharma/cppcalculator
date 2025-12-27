---
title: "Feature Update: Why We Killed the 'Linear' Salary Projection"
prerender: true
pubDate: 2025-12-20
description: "We updated our 'Quick Estimate' logic from a simple linear projection to a realistic Lifecycle Earnings Curve. Here is why your estimate might have changed (and why it's better)."
slug: "salary-estimate-update"
layout: ../../layouts/BlogPost.astro
category: "cpp"
---

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Why did my estimated CPP amount go down?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We updated our calculator to use a 'Lifecycle Earnings Curve.' Instead of assuming you earned your current high salary since age 18 (which artificially inflates your pension), we now apply realistic age factors to estimate lower earnings during your early career years. This results in a more conservative but accurate estimate."
      }
    },
    {
      "@type": "Question",
      "name": "How does the 'Quick Estimate' feature calculate past earnings?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The tool takes your current salary ratio against the national average (YMPE) and adjusts it based on your age. For example, it assumes you earned ~30% of your peak potential at age 20 and 60% at age 25, rather than applying your age-40 salary to your entire history."
      }
    },
    {
      "@type": "Question",
      "name": "What is the problem with linear salary projections for CPP?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Linear projections suffer from 'recency bias,' assuming that if you are a high earner today, you were also a high earner at age 18. This hides your actual low-income years, preventing the CPP 'Dropout Provision' from working correctly and leading to an inflated final pension number."
      }
    },
    {
      "@type": "Question",
      "name": "Does the calculator account for my years as a student?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. The new Lifecycle Curve automatically assumes significantly lower earnings for ages 18-21 (Student/Part-time years). This helps the calculator correctly identify these years as candidates for the CPP general dropout, ensuring your final average is based on your best earning years."
      }
    }
  ]
}
</script>

If you’ve used the **"Quick Estimate"** button on our CPP Calculator recently, you might have noticed the math got a little smarter—and perhaps a little more conservative.

For a long time, our "Generate All" feature relied on a simple linear projection. It took your current salary, calculated your ratio against the average Canadian wage (YMPE), and assumed you had maintained that exact same status your entire life.

It was fast. It was clean. **It was also wrong.**

Here is why we changed our projection engine to use a **Lifecycle Earnings Curve**, and why it matters for your retirement planning.

---

## The "Time Machine" Fallacy

The old linear model suffered from a recency bias.

Let’s say you are 40 years old and earning **$120,000** today. That is roughly **1.8x** the maximum pensionable earnings (YMPE).

The old calculator would look at your history and assume that when you were 20 years old, you were *also* earning 1.8x the average wage. It assumed you were a "high earner" from day one.

But for 99% of us, that isn't true. At 20, you weren't a Senior Manager. You were likely a student, an intern, or working an entry-level job. You weren't maxing out your CPP contributions; you were barely making rent.

## Why This Broke the Math

CPP is calculated based on your "Best 40 Years." The system allows you to drop out your lowest-earning months (roughly 8 years' worth) from the calculation.

By artificially backfilling your history with high salaries:

1.  **We hid your "bad" years:** The calculator assumed your age-22 income was high enough to count toward your average.
2.  **We skewed the Dropout Provision:** If your projected "entry-level" years look just as good as your "peak" years, the calculator struggles to identify which years to drop, leading to an inflated final pension number.

---

## The Fix: The Lifecycle Curve

We have updated the projection logic to follow a standard **Career Earnings Curve**.

Now, when you enter your current salary and hit "Generate," the calculator applies an **Age Factor** to your past history:

* **Age 18-21:** Assumes **30%** of your peak earning power (Part-time/Student years).
* **Age 22-25:** Assumes **60%** (Entry-level years).
* **Age 25-30:** Assumes **80%** (Junior/Mid-level years).
* **Age 35+:** Assumes **100%** (Peak earning years).

## What This Means for You

If you re-run your numbers today, you might see your estimated CPP amount dip slightly compared to the old version. **Do not panic.**

This dip is a good thing. It means the calculator is no longer "hallucinating" that you were wealthy in university. It is giving you a number based on the reality that careers start slow and build momentum.

We believe a conservative, realistic estimate is worth far more than an optimistic, inflated one.

*The update is live now. Give the **Quick Estimate** wand a wave and see where you stand.*