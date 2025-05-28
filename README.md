# React Simple Umami Analytics Loader

A lightweight, privacy-focused React component for integrating Umami Analytics into your website. Umami is an open-source, privacy-friendly alternative to Google Analytics that helps you understand your website's traffic without compromising user privacy.

## Features

- 🚀 Easy one-line integration
- 🔒 Privacy-focused analytics
- ⚡ Lazy loading support
- 🐛 Debug mode for development
- 📦 Zero dependencies
- 🔍 TypeScript support

## Installation

Install using pnpm:

```bash
pnpm add @danielgtmn/umami-react
```

## Quick Start

Add the UmamiAnalytics component to your main layout file:

```jsx
import { UmamiAnalytics } from "@danielgtmn/umami-react";

function App() {
  return (
    <html lang="en">
      <body>
        <UmamiAnalytics />
        {children}
      </body>
    </html>
  );
}
```

## Configuration

Configure Umami Analytics by setting environment variables in your `.env` file:

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| UMAMI_URL | `string` | Your Umami instance URL | `""` |
| UMAMI_ID | `string` | Your website tracking ID | `""` |
| UMAMI_DEBUG | `string` | Enable debug logging | `"false"` |
| UMAMI_LAZY_LOAD | `string` | Enable lazy loading of analytics script | `"false"` |

### Example .env file:

```env
UMAMI_URL=https://analytics.example.com
UMAMI_ID=your-website-id
UMAMI_DEBUG=false
UMAMI_LAZY_LOAD=true
```

## Advanced Usage

### Lazy Loading

Enable lazy loading to improve initial page load performance. The analytics script will only load after the first user interaction:

```env
UMAMI_LAZY_LOAD=true
```

### Debug Mode

Enable debug mode during development to see detailed logs:

```env
UMAMI_DEBUG=true
```

## Roadmap

- [ ] Custom Event Tracking

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](https://choosealicense.com/licenses/mit/)