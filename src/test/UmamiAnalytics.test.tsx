import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import UmamiAnalytics, { useUmami } from '../index';

// Mock window.umami
const mockUmami = {
  track: vi.fn(),
};

Object.defineProperty(window, 'umami', {
  writable: true,
  value: mockUmami,
});

// Test component for useUmami hook
function TestComponent() {
  const { track } = useUmami();

  const handleClick = () => {
    track('test-event', { key: 'value' });
  };

  return (
    <div>
      <button onClick={handleClick}>Track Event</button>
    </div>
  );
}

describe('UmamiAnalytics', () => {
  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks();

    // Reset document head
    document.head.innerHTML = '';

    // Reset process.env
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
  });

  afterEach(() => {
    // Clean up
    vi.restoreAllMocks();
  });

  describe('Component Rendering', () => {
    it('renders without crashing', () => {
      render(<UmamiAnalytics url="https://test.com" websiteId="test-id" />);
      expect(document.head).toBeDefined();
    });

    it('renders nothing to DOM', () => {
      const { container } = render(<UmamiAnalytics url="https://test.com" websiteId="test-id" />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Script Loading', () => {
    it('loads script with correct attributes', async () => {
      render(<UmamiAnalytics url="https://test.com" websiteId="test-id" />);

      await waitFor(() => {
        const script = document.querySelector('script[src="https://test.com/script.js"]');
        expect(script).toBeInTheDocument();
        expect(script?.getAttribute('data-website-id')).toBe('test-id');
        expect(script?.getAttribute('defer')).toBe('');
      });
    });

    it('does not load script in development when onlyInProduction is true', () => {
      Object.defineProperty(process, 'env', {
        writable: true,
        value: { ...process.env, NODE_ENV: 'development' },
      });

      render(<UmamiAnalytics url="https://test.com" websiteId="test-id" />);

      const script = document.querySelector('script[src="https://test.com/script.js"]');
      expect(script).not.toBeInTheDocument();
    });

    it('loads script in development when onlyInProduction is false', async () => {
      Object.defineProperty(process, 'env', {
        writable: true,
        value: { ...process.env, NODE_ENV: 'development' },
      });

      render(<UmamiAnalytics url="https://test.com" websiteId="test-id" onlyInProduction={false} />);

      await waitFor(() => {
        const script = document.querySelector('script[src="https://test.com/script.js"]');
        expect(script).toBeInTheDocument();
      });
    });
  });

  describe('Environment Variables', () => {
    it('uses environment variables when props are not provided', async () => {
      Object.defineProperty(process, 'env', {
        writable: true,
        value: {
          ...process.env,
          UMAMI_URL: 'https://env-test.com',
          UMAMI_ID: 'env-test-id',
        },
      });

      render(<UmamiAnalytics />);

      await waitFor(() => {
        const script = document.querySelector('script[src="https://env-test.com/script.js"]');
        expect(script).toBeInTheDocument();
        expect(script?.getAttribute('data-website-id')).toBe('env-test-id');
      });
    });

    it('prioritizes props over environment variables', async () => {
      Object.defineProperty(process, 'env', {
        writable: true,
        value: {
          ...process.env,
          UMAMI_URL: 'https://env-test.com',
          UMAMI_ID: 'env-test-id',
        },
      });

      render(<UmamiAnalytics url="https://props-test.com" websiteId="props-test-id" />);

      await waitFor(() => {
        const script = document.querySelector('script[src="https://props-test.com/script.js"]');
        expect(script).toBeInTheDocument();
        expect(script?.getAttribute('data-website-id')).toBe('props-test-id');
      });
    });
  });

  describe('Custom Domains', () => {
    it('adds domains attribute when domains are provided', async () => {
      const domains = ['example.com', 'app.example.com'];

      render(
        <UmamiAnalytics
          url="https://test.com"
          websiteId="test-id"
          domains={domains}
        />
      );

      await waitFor(() => {
        const script = document.querySelector('script[src="https://test.com/script.js"]');
        expect(script?.getAttribute('data-domains')).toBe('example.com,app.example.com');
      });
    });
  });

  describe('Custom Script Attributes', () => {
    it('adds custom attributes to script', async () => {
      const scriptAttributes = {
        'data-cache': 'true',
        'data-custom': 'value',
      };

      render(
        <UmamiAnalytics
          url="https://test.com"
          websiteId="test-id"
          scriptAttributes={scriptAttributes}
        />
      );

      await waitFor(() => {
        const script = document.querySelector('script[src="https://test.com/script.js"]');
        expect(script?.getAttribute('data-cache')).toBe('true');
        expect(script?.getAttribute('data-custom')).toBe('value');
      });
    });
  });

  describe('Lazy Loading', () => {
    it('does not load script immediately when lazyLoad is true', () => {
      render(<UmamiAnalytics url="https://test.com" websiteId="test-id" lazyLoad={true} />);

      const script = document.querySelector('script[src="https://test.com/script.js"]');
      expect(script).not.toBeInTheDocument();
    });

    it('loads script on user interaction when lazyLoad is true', async () => {
      const user = userEvent.setup();

      render(<UmamiAnalytics url="https://test.com" websiteId="test-id" lazyLoad={true} />);

      // Trigger user interaction
      await user.click(document.body);

      await waitFor(() => {
        const script = document.querySelector('script[src="https://test.com/script.js"]');
        expect(script).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('does not load script when url is missing', () => {
      const originalWarn = console.warn;
      console.warn = vi.fn();

      render(<UmamiAnalytics websiteId="test-id" />);

      const script = document.querySelector('script');
      expect(script).toBeNull();

      console.warn = originalWarn;
    });

    it('does not load script when websiteId is missing', () => {
      const originalError = console.error;
      console.error = vi.fn();

      render(<UmamiAnalytics url="https://test.com" />);

      const script = document.querySelector('script');
      expect(script).toBeNull();

      console.error = originalError;
    });
  });

  describe('useUmami Hook', () => {
    it('provides track function', () => {
      render(<TestComponent />);

      const button = screen.getByRole('button', { name: /track event/i });
      expect(button).toBeInTheDocument();
    });

    it('calls window.umami.track when track is called', async () => {
      const user = userEvent.setup();

      render(<TestComponent />);

      const button = screen.getByRole('button', { name: /track event/i });
      await user.click(button);

      expect(mockUmami.track).toHaveBeenCalledWith('test-event', { key: 'value' });
    });

    it('handles missing window.umami gracefully', () => {
      // Remove umami from window
      Object.defineProperty(window, 'umami', {
        writable: true,
        value: undefined,
      });

      expect(() => {
        render(<TestComponent />);
      }).not.toThrow();
    });
  });
});
