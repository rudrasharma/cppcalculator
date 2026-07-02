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
    sitemap(),
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
