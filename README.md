# React Simple Umami Analytics Loader

The Umami Analytics Loader is a lightweight script that enables you to easily integrate Umami Analytics into your website. Umami is a simple, open-source website analytics tool that provides valuable insights into your website's traffic without compromising privacy.

## Features

- Easy Integration
- Umami Analytics

## Installation

Install  with npm

```bash
  npm i danielgietmann/umami-react
```

## Usage/Examples
In the Main Layout File
Add the UmamiAnalytics Component to the Body of your Website

```javascript
import {UmamiAnalytics} from "@danielgietmann/umami-react";

function App() {
  return (
      <html lang="en">
            <body>
                <UmamiAnalytics/>
                {children}
            </body>
        </html>

  )
}
```

## Options
Set in your .env File

| Option | Type     | Description                | Default   |
|--------|----------|----------------------------|-----------|
| UMAMI_URL | `string` | The URL of your Umami Instance | `""`      |
| UMAMI_ID | `string` | The ID of your Umami Instance | `""`      |
| UMAMI_DEBUG | `string` | The ID of your Umami Instance | `"false"` |


## Roadmap


- Cookies Check (DSGVO)


## License

[MIT](https://choosealicense.com/licenses/mit/)