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
- 🌐 Custom domain support
- ⚙️ Configurable script attributes

## Installation

Install using pnpm:

```bash
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

# Format code
pnpm format

# Type check
pnpm type-check

# Build for production
pnpm build
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](https://choosealicense.com/licenses/mit/)