/**
 * Test utilities for React Testing Library
 * Reusable helpers for common test scenarios
 */

import { render } from '@testing-library/react';
import React from 'react';

/**
 * Custom render function that includes providers
 * Use this instead of the default render from @testing-library/react
 */
export function renderWithProviders(ui, { ...renderOptions } = {}) {
  function Wrapper({ children }) {
    return <>{children}</>;
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

/**
 * Wait for async operations to complete
 */
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));

/**
 * Mock window.location
 */
export const mockWindowLocation = (url) => {
  delete window.location;
  window.location = new URL(url);
};

/**
 * Restore window.location
 */
export const restoreWindowLocation = () => {
  window.location = location;
};

// Re-export everything from React Testing Library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

