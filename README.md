# React Umami Analytics

A lightweight, privacy-focused React component for integrating Umami Analytics into your website. Umami is an open-source, privacy-friendly alternative to Google Analytics that helps you understand your website's traffic without compromising user privacy.

## Features

- 🚀 Easy integration with props or environment variables
- 🔒 Privacy-focused analytics
- ⚡ Lazy loading support
- 🐛 Debug mode for development
- 📦 Zero runtime dependencies
- 🔍 Full TypeScript support
- 🎯 Custom event tracking hook
- 📊 Manual pageview tracking with UTM support
- 🔄 Async UTM parameter fetching
- 🌐 Custom domain support
- ⚙️ Configurable script attributes
- ⚛️ **React 18 & 19 Support** - Compatible with both React 18.2+ and React 19

## Requirements

- **React**: 18.2+ or 19.0+
- **Node.js**: 16.0+

## Installation

The package is available on both NPM and GitHub Packages:

### From NPM (recommended)
```bash
pnpm add @danielgtmn/umami-react
```

### From GitHub Packages
```bash
# First, configure npm to use GitHub Packages for @danielgtmn scope
echo "@danielgtmn:registry=https://npm.pkg.github.com" >> .npmrc

# Then install
pnpm add @danielgtmn/umami-react
```

## Quick Start

### Basic Usage

```tsx
import UmamiAnalytics from '@danielgtmn/umami-react';

function App() {
  return (
    <div>
      <UmamiAnalytics
        url="https://analytics.example.com"
        websiteId="your-website-id"
      />
      {/* Your app content */}
    </div>
  );
}
```

### With Environment Variables

Create a `.env` file:

```env
UMAMI_URL=https://analytics.example.com
UMAMI_ID=your-website-id
UMAMI_DEBUG=false
UMAMI_LAZY_LOAD=true
```

Then use the component:

```tsx
import UmamiAnalytics from '@danielgtmn/umami-react';

function App() {
  return (
    <div>
      <UmamiAnalytics />
      {/* Your app content */}
    </div>
  );
}
```

## Configuration

### Props

| Prop | Type | Description | Default |
|------|------|-------------|---------|
| `url` | `string` | Your Umami instance URL | `UMAMI_URL` env var |
| `websiteId` | `string` | Your website tracking ID | `UMAMI_ID` env var |
| `debug` | `boolean` | Enable debug logging | `false` |
| `lazyLoad` | `boolean` | Enable lazy loading | `false` |
| `onlyInProduction` | `boolean` | Only load in production | `true` |
| `domains` | `string[]` | Custom domains for tracking | `undefined` |
| `scriptAttributes` | `Record<string, string>` | Additional script attributes | `undefined` |

### Environment Variables

| Variable | Type | Description | Default |
|----------|------|-------------|---------|
| `UMAMI_URL` | `string` | Your Umami instance URL | `""` |
| `UMAMI_ID` | `string` | Your website tracking ID | `""` |
| `UMAMI_DEBUG` | `string` | Enable debug logging | `"false"` |
| `UMAMI_LAZY_LOAD` | `string` | Enable lazy loading | `"false"` |

## Advanced Usage

### Lazy Loading

Enable lazy loading to improve initial page load performance:

```tsx
<UmamiAnalytics
  url="https://analytics.example.com"
  websiteId="your-website-id"
  lazyLoad={true}
/>
```

### Debug Mode

Enable debug mode for development:

```tsx
<UmamiAnalytics
  url="https://analytics.example.com"
  websiteId="your-website-id"
  debug={true}
/>
```

### Custom Domains

Track only specific domains:

```tsx
<UmamiAnalytics
  url="https://analytics.example.com"
  websiteId="your-website-id"
  domains={['example.com', 'app.example.com']}
/>
```

### Custom Script Attributes

Add custom attributes to the script tag:

```tsx
<UmamiAnalytics
  url="https://analytics.example.com"
  websiteId="your-website-id"
  scriptAttributes={{
    'data-cache': 'true',
    'data-host-url': 'https://custom-host.com'
  }}
/>
```

## Event Tracking

Use the `useUmami` hook for custom event tracking:

```tsx
import { useUmami } from '@danielgtmn/umami-react';

function MyComponent() {
  const { track } = useUmami();

  const handleClick = () => {
    track('button-click', { button: 'header-cta' });
  };

  return (
    <button onClick={handleClick}>
      Click me!
    </button>
  );
}
```

## Manual Pageview Tracking

The `useUmami` hook provides comprehensive pageview tracking capabilities, perfect for scenarios where you need to disable auto-tracking and manually control pageview events with custom UTM parameters.

> **Note**: This library correctly integrates with Umami's official tracking API. Pageviews are tracked using Umami's standard `umami.track()` method without custom event names.

### Basic Pageview Tracking

```tsx
import { useUmami } from '@danielgtmn/umami-react';

function MyComponent() {
  const { trackPageview } = useUmami();

  const handlePageview = () => {
    trackPageview({
      url: '/custom-page',
      title: 'Custom Page Title',
      referrer: document.referrer,
    });
  };

  return (
    <button onClick={handlePageview}>
      Track Pageview
    </button>
  );
}
```

### Pageview Tracking with UTM Parameters

```tsx
import { useUmami } from '@danielgtmn/umami-react';

function MyComponent() {
  const { trackPageviewWithUTM } = useUmami();

  const handleUTMPageview = () => {
    trackPageviewWithUTM({
      utm_source: 'newsletter',
      utm_medium: 'email',
      utm_campaign: 'spring-sale',
      utm_term: 'discount',
      utm_content: 'header-link',
    });
  };

  return (
    <button onClick={handleUTMPageview}>
      Track UTM Pageview
    </button>
  );
}
```

### Async UTM Parameter Fetching

For scenarios where you need to fetch UTM parameters from your backend using a unique ID:

```tsx
import { useUmami, UTMFetcher } from '@danielgtmn/umami-react';

function MyComponent() {
  const { trackPageviewAsync } = useUmami();

  // Define your UTM fetcher function
  const fetchUTMData: UTMFetcher = async (utmId: string) => {
    const response = await fetch(`/api/utm/${utmId}`);
    const data = await response.json();
    
    return {
      utm_source: data.source,
      utm_medium: data.medium,
      utm_campaign: data.campaign,
      utm_term: data.term,
      utm_content: data.content,
    };
  };

  const handleAsyncPageview = async () => {
    // This will fetch UTM data from your backend and track the pageview
    await trackPageviewAsync('unique-utm-id-123', fetchUTMData, {
      // Optional additional data
      custom_property: 'custom_value',
    });
  };

  return (
    <button onClick={handleAsyncPageview}>
      Track Async UTM Pageview
    </button>
  );
}
```

### Complete useUmami Hook API

The `useUmami` hook provides the following methods:

```tsx
const {
  track,                    // Original event tracking
  trackPageview,           // Manual pageview tracking
  trackPageviewWithUTM,    // Pageview with UTM parameters
  trackPageviewAsync       // Async UTM fetching + pageview
} = useUmami();
```

### TypeScript Support for Pageview Tracking

```tsx
import { PageviewData, UTMFetcher } from '@danielgtmn/umami-react';

// PageviewData interface
const pageviewData: PageviewData = {
  url: '/custom-page',
  title: 'Page Title',
  referrer: 'https://example.com',
  utm_source: 'google',
  utm_medium: 'cpc',
  utm_campaign: 'summer-sale',
  utm_term: 'shoes',
  utm_content: 'ad-1',
  utm_id: 'unique-id-123',
  // Any additional custom properties
  custom_field: 'custom_value',
};

// UTMFetcher function type
const myUTMFetcher: UTMFetcher = async (utmId: string) => {
  // Your implementation
  return {
    utm_source: 'backend-source',
    utm_medium: 'backend-medium',
    // ... other UTM parameters
  };
};
```

### Disabling Auto-Tracking

When using manual pageview tracking, you might want to disable Umami's automatic pageview tracking by adding the `data-auto-track="false"` attribute:

```tsx
<UmamiAnalytics
  url="https://analytics.example.com"
  websiteId="your-website-id"
  scriptAttributes={{
    'data-auto-track': 'false'
  }}
/>
```

### Error Handling

The async UTM fetching includes built-in error handling. If the UTM fetcher fails, it will:

1. Log an error to the console (in debug mode)
2. Fall back to basic pageview tracking with the provided `utm_id`
3. Include any additional data you provided

```tsx
// This will gracefully handle network errors
await trackPageviewAsync('utm-id', failingFetcher, {
  fallback_source: 'direct',
});
```

## TypeScript Support

The package includes full TypeScript support with exported interfaces:

```tsx
import UmamiAnalytics, { UmamiAnalyticsProps, UmamiConfig } from '@danielgtmn/umami-react';

const config: UmamiAnalyticsProps = {
  url: 'https://analytics.example.com',
  websiteId: 'your-website-id',
  debug: true,
  lazyLoad: true,
};

<UmamiAnalytics {...config} />
```

## Framework Integration

### Next.js

```tsx
// pages/_app.tsx or app/layout.tsx
import UmamiAnalytics from '@danielgtmn/umami-react';

export default function App({ Component, pageProps }) {
  return (
    <>
      <UmamiAnalytics
        url="https://analytics.example.com"
        websiteId="your-website-id"
      />
      <Component {...pageProps} />
    </>
  );
}
```

### Vite/Create React App

```tsx
// src/App.tsx
import UmamiAnalytics from '@danielgtmn/umami-react';

function App() {
  return (
    <div className="App">
      <UmamiAnalytics
        url="https://analytics.example.com"
        websiteId="your-website-id"
      />
      {/* Your app content */}
    </div>
  );
}
```

## Development

```bash
# Install dependencies
pnpm install

# Start development mode
pnpm dev

# Run linting
pnpm lint

# Auto-fix linting issues
pnpm lint:fix

# Format code
pnpm format

# Type check
pnpm type-check

# Run tests
pnpm test

# Run tests once
pnpm test:run

# Run tests with coverage
pnpm test:coverage

# Run tests in watch mode
pnpm test:watch

# Check bundle size
pnpm size

# Analyze bundle
pnpm analyze

# Build for production
pnpm build

# Clean build artifacts
pnpm clean
```

## Development Workflow

This project uses modern development tools to ensure code quality:

### Git Hooks (Husky)
Git hooks automatically run quality checks before commits:
- **Pre-commit**: TypeScript check, linting, and tests
- **Commit-msg**: Validates commit message format

### Commit Convention (Commitlint)
Commits follow [Conventional Commits](https://conventionalcommits.org/) format:

```bash
type(scope): description

# Examples:
feat: add new tracking feature
fix: resolve lazy loading bug
docs: update README
test: add component tests
```

**Allowed types**: `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`

## Testing

This project uses [Vitest](https://vitest.dev/) for testing with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).

```bash
# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run tests in watch mode
pnpm test:watch
```

## CI/CD

This project uses GitHub Actions for continuous integration and deployment:

- **CI Pipeline** (`.github/workflows/ci.yml`): Runs on every push/PR to main
  - Tests across multiple Node.js versions (18.x, 20.x, 22.x)
  - Linting and type checking
  - Bundle size monitoring
  - Test coverage reporting

- **Release Pipeline** (`.github/workflows/publish.yml`): Runs on releases
  - Runs full test suite before publishing
  - Publishes to NPM with public access

## Bundle Analysis

The project includes bundle size monitoring and analysis:

```bash
# Check current bundle sizes
pnpm size

# Analyze bundle composition
pnpm analyze
```

Bundle size limits:
- ESM: ≤ 3 KB (gzipped)
- CJS: ≤ 3.5 KB (gzipped)

## Contributing

Contributions are welcome! Please ensure:

1. **Follow commit conventions**: Use [Conventional Commits](https://conventionalcommits.org/) format
2. **Quality checks**: Git hooks automatically run:
   - TypeScript type checking
   - ESLint linting
   - Test execution
   - Commit message validation
3. **Manual verification**:
   - All tests pass: `pnpm test:run`
   - Code is linted: `pnpm lint`
   - Bundle size is within limits: `pnpm size`
   - TypeScript types are correct: `pnpm type-check`

### Development Setup

```bash
# Install dependencies
pnpm install

# Git hooks are automatically set up via prepare script
# If needed manually: pnpm prepare
```

Please feel free to submit a Pull Request!


## License

[MIT](https://choosealicense.com/licenses/mit/)