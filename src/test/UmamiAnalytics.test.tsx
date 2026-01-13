import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import UmamiAnalytics, { useUmami, UTMFetcher } from '../index';

// Mock window.umami
const mockUmami = {
  track: vi.fn(),
  identify: vi.fn(),
};

// Simple assignment instead of defineProperty
(window as any).umami = mockUmami;

// Test component for useUmami hook
function TestComponent() {
  const { track } = useUmami();

  const handleClick = () => {
    track('test-event', { key: 'value' });
  };

  return (
    <div>
      <button type="button" onClick={handleClick}>Track Event</button>
    </div>
  );
}

// Test component for pageview tracking
function PageviewTestComponent() {
  const { trackPageview, trackPageviewAsync, trackPageviewWithUTM } = useUmami();

  const handlePageview = () => {
    trackPageview({ url: '/test-page', title: 'Test Page' });
  };

  const handlePageviewWithUTM = () => {
    trackPageviewWithUTM({
      utm_source: 'test-source',
      utm_medium: 'test-medium',
      utm_campaign: 'test-campaign',
    });
  };

  const handleAsyncPageview = async () => {
    const mockFetcher: UTMFetcher = async (_utmId: string) => {
      void _utmId; // Mark as used for test purposes
      return {
        utm_source: 'backend-source',
        utm_medium: 'backend-medium',
        utm_campaign: 'backend-campaign',
      };
    };

    await trackPageviewAsync('test-utm-id', mockFetcher);
  };

  return (
    <div>
      <button type="button" onClick={handlePageview}>Track Pageview</button>
      <button type="button" onClick={handlePageviewWithUTM}>Track Pageview with UTM</button>
      <button type="button" onClick={handleAsyncPageview}>Track Async Pageview</button>
    </div>
  );
}

// Test component for identify
function IdentifyTestComponent() {
  const { identify } = useUmami();

  const handleIdentify = () => {
    identify('user-123');
  };

  return (
    <button type="button" onClick={handleIdentify}>Identify User</button>
  );
}

describe('UmamiAnalytics', () => {
  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks();

    // Reset document head
    document.head.innerHTML = '';

    // Reset umami mock
    mockUmami.track.mockClear();
    mockUmami.identify.mockClear();
    (window as any).umami = mockUmami;

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

  describe('Pageview Tracking', () => {
    it('provides pageview tracking functions', () => {
      render(<PageviewTestComponent />);

      const pageviewButton = screen.getByRole('button', { name: /track pageview$/i });
      const utmButton = screen.getByRole('button', { name: /track pageview with utm/i });
      const asyncButton = screen.getByRole('button', { name: /track async pageview/i });

      expect(pageviewButton).toBeInTheDocument();
      expect(utmButton).toBeInTheDocument();
      expect(asyncButton).toBeInTheDocument();
    });

    it('calls window.umami.track with pageview data when trackPageview is called', async () => {
      const user = userEvent.setup();

      render(<PageviewTestComponent />);

      const button = screen.getByRole('button', { name: /track pageview$/i });
      await user.click(button);

      expect(mockUmami.track).toHaveBeenCalledWith({
        url: '/test-page',
        title: 'Test Page',
        referrer: '',
      });
    });

    it('calls window.umami.track with UTM parameters when trackPageviewWithUTM is called', async () => {
      const user = userEvent.setup();

      render(<PageviewTestComponent />);

      const button = screen.getByRole('button', { name: /track pageview with utm/i });
      await user.click(button);

      expect(mockUmami.track).toHaveBeenCalledWith(expect.objectContaining({
        utm_source: 'test-source',
        utm_medium: 'test-medium',
        utm_campaign: 'test-campaign',
      }));
    });

    it('handles async UTM fetching with trackPageviewAsync', async () => {
      const user = userEvent.setup();

      render(<PageviewTestComponent />);

      const button = screen.getByRole('button', { name: /track async pageview/i });
      await user.click(button);

      // Wait for async operation to complete
      await waitFor(() => {
        expect(mockUmami.track).toHaveBeenCalledWith(expect.objectContaining({
          utm_id: 'test-utm-id',
          utm_source: 'backend-source',
          utm_medium: 'backend-medium',
          utm_campaign: 'backend-campaign',
        }));
      });
    });

    it('handles UTM fetcher errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const FailingPageviewComponent = () => {
        const { trackPageviewAsync } = useUmami();

        const handleFailingAsync = async () => {
          const failingFetcher: UTMFetcher = async () => {
            throw new Error('Network error');
          };

          await trackPageviewAsync('test-utm-id', failingFetcher, { title: 'Fallback Page' });
        };

        return (
          // biome-ignore lint/a11y/useButtonType: test button
<button type="button" onClick={handleFailingAsync}>Track Failing Async</button>
        );
      };

      const user = userEvent.setup();
      render(<FailingPageviewComponent />);

      const button = screen.getByRole('button', { name: /track failing async/i });
      await user.click(button);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('[Umami Analytics] Error fetching UTM data:', expect.any(Error));
        expect(mockUmami.track).toHaveBeenCalledWith(expect.objectContaining({
          utm_id: 'test-utm-id',
          title: 'Fallback Page',
        }));
      });

      consoleSpy.mockRestore();
    });

    it('uses default values for url, title, and referrer when not provided', async () => {
      const SimplePageviewComponent = () => {
        const { trackPageview } = useUmami();

        const handleSimplePageview = () => {
          trackPageview();
        };

        return (
          <button type="button" onClick={handleSimplePageview}>Track Simple Pageview</button>
        );
      };

      const user = userEvent.setup();
      render(<SimplePageviewComponent />);

      const button = screen.getByRole('button', { name: /track simple pageview/i });
      await user.click(button);

      expect(mockUmami.track).toHaveBeenCalledWith();
    });

    it('handles missing window.umami gracefully for pageview tracking', () => {
      // Remove umami from window
      (window as any).umami = undefined;

      const SafePageviewComponent = () => {
        const { trackPageview } = useUmami();

        const handleSafePageview = () => {
          trackPageview({ url: '/safe-page' });
        };

        return (
          <button type="button" onClick={handleSafePageview}>Track Safe Pageview</button>
        );
      };

      expect(() => {
        render(<SafePageviewComponent />);
      }).not.toThrow();

      // Restore umami for other tests
      (window as any).umami = mockUmami;
    });
  });

  describe('Session Identification', () => {
    it('provides identify function', () => {
      render(<IdentifyTestComponent />);

      const button = screen.getByRole('button', { name: /identify user/i });
      expect(button).toBeInTheDocument();
    });

    it('calls window.umami.identify when identify is called', async () => {
      const user = userEvent.setup();

      render(<IdentifyTestComponent />);

      const button = screen.getByRole('button', { name: /identify user/i });
      await user.click(button);

      expect(mockUmami.identify).toHaveBeenCalledWith('user-123');
    });

    it('handles missing window.umami gracefully for identify', () => {
      // Remove umami from window
      (window as any).umami = undefined;

      const SafeIdentifyComponent = () => {
        const { identify } = useUmami();

        const handleSafeIdentify = () => {
          identify('user-456');
        };

        return (
          <button type="button" onClick={handleSafeIdentify}>Safe Identify</button>
        );
      };

      expect(() => {
        render(<SafeIdentifyComponent />);
      }).not.toThrow();

      // Restore umami for other tests
      (window as any).umami = mockUmami;
    });
  });
});
