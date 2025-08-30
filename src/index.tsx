import * as React from 'react';
import { useEffect, useRef, useCallback, useMemo } from 'react';

export interface UmamiAnalyticsProps {
  /**
   * The URL of your Umami instance
   */
  url?: string;

  /**
   * Your website tracking ID
   */
  websiteId?: string;

  /**
   * Enable debug logging
   * @default false
   */
  debug?: boolean;

  /**
   * Enable lazy loading of analytics script
   * @default false
   */
  lazyLoad?: boolean;

  /**
   * Only load analytics in production
   * @default true
   */
  onlyInProduction?: boolean;

  /**
   * Custom domains for the analytics script
   */
  domains?: string[];

  /**
   * Additional script attributes
   */
  scriptAttributes?: Record<string, string>;
}

export interface UmamiConfig {
  url: string;
  websiteId: string;
  debug: boolean;
  lazyLoad: boolean;
  onlyInProduction: boolean;
  domains?: string[];
  scriptAttributes?: Record<string, string>;
}

const getEnvVar = (key: string, defaultValue: string = ''): string => {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || defaultValue;
  }
  return defaultValue;
};

const createUmamiConfig = (props: UmamiAnalyticsProps): UmamiConfig => {
  const envUrl = getEnvVar('UMAMI_URL');
  const envId = getEnvVar('UMAMI_ID');
  const envDebug = getEnvVar('UMAMI_DEBUG', 'false');
  const envLazyLoad = getEnvVar('UMAMI_LAZY_LOAD', 'false');

  return {
    url: props.url || envUrl,
    websiteId: props.websiteId || envId,
    debug: props.debug ?? envDebug === 'true',
    lazyLoad: props.lazyLoad ?? envLazyLoad === 'true',
    onlyInProduction: props.onlyInProduction ?? true,
    domains: props.domains,
    scriptAttributes: props.scriptAttributes,
  };
};

const UmamiAnalytics: React.FC<UmamiAnalyticsProps> = React.memo(props => {
  const isLoadedRef = useRef(false);
  const config = useMemo(() => createUmamiConfig(props), [props]);

  const debugLog = useCallback((message: string, ...args: any[]) => {
    if (config.debug) {
      console.log(`[Umami Analytics] ${message}`, ...args);
    }
  }, [config.debug]);

  const debugWarn = useCallback((message: string, ...args: any[]) => {
    if (config.debug) {
      console.warn(`[Umami Analytics] ${message}`, ...args);
    }
  }, [config.debug]);

  const debugError = useCallback((message: string, ...args: any[]) => {
    if (config.debug) {
      console.error(`[Umami Analytics] ${message}`, ...args);
    }
  }, [config.debug]);

  const validateConfig = useCallback((): boolean => {
    if (!config.url) {
      debugError('UMAMI_URL is not set');
      return false;
    }
    if (!config.websiteId) {
      debugError('UMAMI_ID is not set');
      return false;
    }
    return true;
  }, [config.url, config.websiteId, debugError]);

  const loadScript = useCallback(() => {
    if (isLoadedRef.current) {
      debugLog('Script already loaded, skipping');
      return;
    }

    if (!validateConfig()) {
      debugError('Invalid configuration, skipping script load');
      return;
    }

    const script = document.createElement('script');
    script.src = `${config.url}/script.js`;
    script.defer = true;
    script.setAttribute('data-website-id', config.websiteId);

    // Add custom domains if provided
    if (config.domains && config.domains.length > 0) {
      script.setAttribute('data-domains', config.domains.join(','));
    }

    // Add custom attributes if provided
    if (config.scriptAttributes) {
      Object.entries(config.scriptAttributes).forEach(([key, value]) => {
        script.setAttribute(key, value);
      });
    }

    document.head.appendChild(script);
    isLoadedRef.current = true;
    debugLog('Analytics script loaded successfully');
  }, [config.url, config.websiteId, config.domains, config.scriptAttributes, debugLog, debugError, validateConfig]);

  const setupLazyLoading = useCallback(() => {
    const handleInteraction = () => {
      loadScript();
      document.removeEventListener('mousemove', handleInteraction);
      document.removeEventListener('scroll', handleInteraction);
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };

    document.addEventListener('mousemove', handleInteraction, { once: true });
    document.addEventListener('scroll', handleInteraction, { once: true });
    document.addEventListener('click', handleInteraction, { once: true });
    document.addEventListener('keydown', handleInteraction, { once: true });

    debugLog('Lazy loading setup completed');

    return () => {
      document.removeEventListener('mousemove', handleInteraction);
      document.removeEventListener('scroll', handleInteraction);
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, [loadScript, debugLog]);

  useEffect(() => {
    if (config.debug) {
      debugWarn('Debug mode is enabled');
      debugLog('Configuration:', {
        url: config.url,
        websiteId: config.websiteId,
        lazyLoad: config.lazyLoad,
        onlyInProduction: config.onlyInProduction,
      });
    }

    // Check if we should load in current environment
    const isDevelopment = process.env.NODE_ENV === 'development';
    if (config.onlyInProduction && isDevelopment) {
      debugLog('Skipping analytics in development mode');
      return;
    }

    if (!validateConfig()) {
      debugWarn('Invalid configuration, component will not load analytics');
      return;
    }

    if (config.lazyLoad) {
      debugLog('Setting up lazy loading');
      return setupLazyLoading();
    } else {
      debugLog('Loading analytics script immediately');
      loadScript();
    }
  }, [config]);

  return null;
});

// Hook for programmatic event tracking
export const useUmami = () => {
  const track = useCallback((eventName: string, eventData?: Record<string, any>) => {
    if (typeof window !== 'undefined' && (window as any).umami) {
      (window as any).umami.track(eventName, eventData);
    }
  }, []);

  return useMemo(() => ({ track }), [track]);
};

export default UmamiAnalytics;
