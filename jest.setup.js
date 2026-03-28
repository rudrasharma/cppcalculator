// Jest setup file - runs before each test file
import '@testing-library/jest-dom';

// Mock window.matchMedia (used by some components)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver (used by some components)
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};

// Mock ResizeObserver (used by some components)
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock window.scrollTo
window.scrollTo = jest.fn();

// Mock Recharts
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div style={{ width: 800, height: 400 }}>{children}</div>,
  AreaChart: ({ children }) => <svg>{children}</svg>,
  Area: () => <rect />,
  XAxis: () => <g />,
  YAxis: () => <g />,
  CartesianGrid: () => <g />,
  Tooltip: () => <div />,
  Legend: () => <div />,
  ReferenceLine: () => <g />,
  LineChart: ({ children }) => <svg>{children}</svg>,
  Line: () => <path />,
  Label: () => <text />,
}));

// Suppress console errors in tests (optional - uncomment if needed)
// global.console = {
//   ...console,
//   error: jest.fn(),
//   warn: jest.fn(),
// };

