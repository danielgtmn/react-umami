/// <reference types="vitest" />
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.umami
Object.defineProperty(window, 'umami', {
  writable: true,
  value: {
    track: vi.fn(),
  },
});

// Mock process.env
Object.defineProperty(process, 'env', {
  writable: true,
  value: {
    NODE_ENV: 'test',
    UMAMI_URL: '',
    UMAMI_ID: '',
    UMAMI_DEBUG: 'false',
    UMAMI_LAZY_LOAD: 'false',
  },
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

// Mock document methods
Object.defineProperty(document, 'head', {
  writable: true,
  value: document.head || document.createElement('head'),
});
