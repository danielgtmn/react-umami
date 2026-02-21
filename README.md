# React Umami Analytics

A lightweight React component for [Umami Analytics](https://umami.is) — the privacy-focused, open-source alternative to Google Analytics.

Zero runtime dependencies. Full TypeScript support. Works with React 18.2+ and 19.

## Installation

```bash
pnpm add @danielgtmn/umami-react
```

## Quick Start

```tsx
import UmamiAnalytics from '@danielgtmn/umami-react';

function App() {
  return (
    <>
      <UmamiAnalytics
        url="https://analytics.example.com"
        websiteId="your-website-id"
      />
      {/* Your app content */}
    </>
  );
}
```

The component renders nothing — it only injects the Umami tracking script.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `url` | `string` | `UMAMI_URL` env var | Your Umami instance URL |
| `websiteId` | `string` | `UMAMI_ID` env var | Your website tracking ID |
| `debug` | `boolean` | `false` | Log debug info to console |
| `lazyLoad` | `boolean` | `false` | Load script on first user interaction |
| `onlyInProduction` | `boolean` | `true` | Skip loading in development |
| `domains` | `string[]` | — | Restrict tracking to specific domains |
| `scriptAttributes` | `Record<string, string>` | — | Additional `<script>` attributes |

All props can also be set via environment variables:

```env
UMAMI_URL=https://analytics.example.com
UMAMI_ID=your-website-id
UMAMI_DEBUG=false
UMAMI_LAZY_LOAD=true
```

## Event Tracking

Use the `useUmami` hook for custom events, pageviews, and user identification:

```tsx
import { useUmami } from '@danielgtmn/umami-react';

function MyComponent() {
  const { track, trackPageview, identify } = useUmami();

  return (
    <button onClick={() => track('signup', { plan: 'pro' })}>
      Sign up
    </button>
  );
}
```

### Hook API

```tsx
const {
  track,                 // track(eventName, eventData?)
  trackPageview,         // trackPageview(pageviewData?)
  trackPageviewWithUTM,  // trackPageviewWithUTM(utmParams, additionalData?)
  trackPageviewAsync,    // trackPageviewAsync(utmId, fetcherFn, additionalData?)
  identify,              // identify(userId) or identify(sessionData)
} = useUmami();
```

### Pageview with UTM Parameters

```tsx
const { trackPageviewWithUTM } = useUmami();

trackPageviewWithUTM({
  utm_source: 'newsletter',
  utm_medium: 'email',
  utm_campaign: 'spring-sale',
});
```

### Async UTM Fetching

Fetch UTM parameters from your backend before tracking:

```tsx
import { useUmami, UTMFetcher } from '@danielgtmn/umami-react';

const fetchUTM: UTMFetcher = async (utmId) => {
  const res = await fetch(`/api/utm/${utmId}`);
  return res.json();
};

// Fetches UTM data, then tracks the pageview
// Falls back to basic pageview if the fetch fails
await trackPageviewAsync('campaign-123', fetchUTM);
```

### User Identification

```tsx
const { identify } = useUmami();

// With a string ID
identify('user-123');

// With session data
identify({ userId: 'user-123', plan: 'pro' });

// Both
identify('user-123', { plan: 'pro' });
```

### Disabling Auto-Tracking

To manually control pageview tracking, disable Umami's auto-tracking:

```tsx
<UmamiAnalytics
  url="https://analytics.example.com"
  websiteId="your-website-id"
  scriptAttributes={{ 'data-auto-track': 'false' }}
/>
```

## Framework Examples

### Next.js (App Router)

```tsx
// app/layout.tsx
import UmamiAnalytics from '@danielgtmn/umami-react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <UmamiAnalytics
          url="https://analytics.example.com"
          websiteId="your-website-id"
        />
        {children}
      </body>
    </html>
  );
}
```

### Vite

```tsx
// src/App.tsx
import UmamiAnalytics from '@danielgtmn/umami-react';

function App() {
  return (
    <>
      <UmamiAnalytics
        url="https://analytics.example.com"
        websiteId="your-website-id"
      />
      {/* Your app */}
    </>
  );
}
```

## TypeScript

All types are exported:

```tsx
import type {
  UmamiAnalyticsProps,
  UmamiConfig,
  PageviewData,
  UTMFetcher,
} from '@danielgtmn/umami-react';
```

## Development

```bash
pnpm install          # Install dependencies
pnpm dev              # Watch mode
pnpm build            # Production build
pnpm test             # Run tests
pnpm test:coverage    # Tests with coverage
pnpm lint             # Lint
pnpm type-check       # Type check
pnpm size             # Check bundle size
```

Commits follow [Conventional Commits](https://conventionalcommits.org/). Git hooks (Husky) run type-check, lint, and tests before each commit.

## Contributing

1. Fork the repo
2. Create your branch (`git checkout -b feat/my-feature`)
3. Make sure all checks pass (`pnpm test:run && pnpm lint && pnpm type-check`)
4. Commit using conventional commit format
5. Open a Pull Request

## License

[MIT](LICENSE)
