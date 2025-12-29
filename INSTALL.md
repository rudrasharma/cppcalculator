# Installation Instructions

## Quick Start

```bash
npm install --legacy-peer-deps
```

## Why `--legacy-peer-deps`?

This project uses **React 19**, which is very new. Some testing libraries (like `@testing-library/react`) haven't updated their peer dependencies to officially support React 19 yet, even though they work fine with it.

The `--legacy-peer-deps` flag tells npm to use the older, more lenient dependency resolution algorithm that doesn't strictly enforce peer dependency versions.

## Alternative: Using .npmrc

We've included a `.npmrc` file that should automatically use legacy peer deps. However, if you still encounter issues, you can:

1. **Explicitly use the flag:**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Or verify .npmrc is being read:**
   ```bash
   npm config get legacy-peer-deps
   ```
   Should return `true`

## After Installation

Once installed, you can run:

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Troubleshooting

If you still have issues:

1. **Clear npm cache:**
   ```bash
   npm cache clean --force
   ```

2. **Delete node_modules and package-lock.json:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install --legacy-peer-deps
   ```

3. **Check Node version:**
   ```bash
   node --version
   ```
   We recommend Node 18+ or 20+

