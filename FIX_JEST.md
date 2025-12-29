# Fix Jest Installation

The `@jest/test-sequencer` module is missing. This is a known issue with some Jest installations.

## Quick Fix

Run this command to install the missing dependency:

```bash
npm install --save-dev @jest/test-sequencer@^29.7.0 --legacy-peer-deps
```

Then run tests:

```bash
npm test
```

## Alternative: Reinstall All Jest Packages

If the above doesn't work, try reinstalling all Jest-related packages:

```bash
npm uninstall jest jest-environment-jsdom babel-jest @jest/test-sequencer
npm install --save-dev jest@^29.7.0 jest-environment-jsdom@^29.7.0 babel-jest@^29.7.0 @jest/test-sequencer@^29.7.0 --legacy-peer-deps
```

## What Happened

Jest 29 should include `@jest/test-sequencer` as a dependency, but sometimes npm doesn't install all peer dependencies correctly, especially with `--legacy-peer-deps`. Adding it explicitly resolves the issue.

