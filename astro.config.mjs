import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://looniefi.ca',
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
    '/calculator/grocery-inflation/[...slug]': {
      status: 301,
      destination: '/'
    },
    '/blog/grocery-inflation': {
      status: 301,
      destination: '/'
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
