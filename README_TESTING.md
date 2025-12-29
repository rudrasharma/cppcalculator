# Testing Guide

This project uses [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/react) for testing.

## Setup

1. Install dependencies:
```bash
npm install --legacy-peer-deps
```

**Note:** We use `--legacy-peer-deps` because `@testing-library/react` v15 lists React 18 as a peer dependency, but it works fine with React 19. The `.npmrc` file should handle this automatically, but if you encounter dependency conflicts, use the flag explicitly.

2. Run tests:
```bash
npm test
```

3. Run tests in watch mode:
```bash
npm run test:watch
```

4. Generate coverage report:
```bash
npm run test:coverage
```

## Test Structure

Tests are located alongside the code they test:
- Component tests: `src/components/**/__tests__/*.test.jsx`
- Utility tests: `src/**/utils/__tests__/*.test.js`
- Hook tests: `src/hooks/__tests__/*.test.js`

## Writing Tests

### Component Tests

```jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles clicks', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    await user.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Utility Function Tests

```javascript
import { calculateAll } from '../benefitEngine';

describe('benefitEngine', () => {
  it('calculates benefits correctly', () => {
    const result = calculateAll(50000, [{ age: 5 }], false, 'ON', 'MARRIED', false);
    expect(result.total).toBeGreaterThan(0);
  });
});
```

## Best Practices

1. **Test behavior, not implementation**: Focus on what the component does, not how it does it.

2. **Use semantic queries**: Prefer `getByRole`, `getByLabelText` over `getByTestId`.

3. **Test user interactions**: Use `@testing-library/user-event` for realistic interactions.

4. **Keep tests simple**: Each test should verify one thing.

5. **Use descriptive test names**: Test names should clearly describe what is being tested.

6. **Mock external dependencies**: Mock API calls, timers, and browser APIs.

## Coverage Goals

- **Current Target**: 60% coverage
- **Long-term Goal**: 80% coverage

Focus coverage on:
- ✅ Utility functions (engines)
- ✅ Shared components
- ✅ Custom hooks
- ⚠️ Feature components (moderate coverage)
- ❌ Astro pages (excluded)

## Running Tests in CI

```bash
npm run test:ci
```

This command runs tests with:
- CI-friendly output
- Coverage reporting
- Limited workers for CI environments

## Debugging Tests

1. Use `screen.debug()` to see the rendered output:
```jsx
render(<MyComponent />);
screen.debug(); // Prints the DOM
```

2. Use `--verbose` flag for detailed output:
```bash
npm test -- --verbose
```

3. Use `--no-coverage` for faster runs during development:
```bash
npm test -- --no-coverage
```

## Common Issues

### "Cannot find module" errors
- Ensure all dependencies are installed
- Check that file paths are correct
- Verify module name mappings in `jest.config.mjs`

### "window is not defined" errors
- Ensure `testEnvironment: 'jsdom'` in jest.config.mjs
- Check that mocks are set up in `jest.setup.js`

### Async test failures
- Use `waitFor` for async operations
- Use `findBy*` queries for elements that appear asynchronously
- Ensure proper cleanup with `afterEach` or `cleanup`

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

