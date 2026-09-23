import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://looniefi.ca',
  trailingSlash: 'always',
  // Markdown configuration (no math plugins needed)
  markdown: {
    remarkPlugins: [],
    rehypePlugins: [],
  },

  integrations: [
    react(),
    tailwind(),
    // MDX configuration (no math plugins needed)
    mdx({
      remarkPlugins: [],
      rehypePlugins: [],
    }),
    sitemap({
      filter: (page) => {
        // Exclude redirect routes, embed widgets, and 404
        if (
          page === 'https://looniefi.ca/calculator/' ||
          page === 'https://looniefi.ca/blog/grocery-inflation/' ||
          page.includes('/calculator/grocery-inflation/') ||
          page.includes('/embed/') ||
          page.includes('/404')
        ) {
          return false;
        }
        // Exclude programmatic child scenarios that canonicalize to root calculators
        // Keep browse hubs (/calculator/*/browse/) and budget tool (/calculator/budget/)
        if (page.includes('/calculator/')) {
          if (page.includes('/browse/') || page === 'https://looniefi.ca/calculator/budget/') {
            return true;
          }
          return false;
        }
        return true;
      },
    }),
  ],

  output: 'server',
  adapter: cloudflare(),

  redirects: {
    '/grocery-inflation-calculator': {
      status: 301,
      destination: '/'
    },
    '/calculator/mortgage/ontario-mortgage-calculator': {
      status: 301,
      destination: '/calculator/mortgage/ontario/500000/'
    },
    '/calculator/mortgage/alberta-mortgage-calculator': {
      status: 301,
      destination: '/calculator/mortgage/alberta/500000/'
    },
    '/calculator/mortgage/bc-mortgage-calculator': {
      status: 301,
      destination: '/calculator/mortgage/bc/500000/'
    }
  },
  
  vite: {
    server: {
      proxy: {
        '/ingest': {
          target: 'https://us.i.posthog.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/ingest/, ''),
        },
      },
    },
  },
});
