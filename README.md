# Sprout Website

Static documentation site for the [Sprout](https://github.com/Flix-29/Sprout) annotation
processor, built with [Astro Starlight](https://starlight.astro.build/).

## Development

```bash
# Install dependencies
npm install

# Start local dev server (hot-reload)
npm run dev
# → http://localhost:4321

# Production build (output in dist/)
npm run build

# Preview the production build locally
npm run preview
```

## Structure

```
src/
  content/docs/
    index.mdx               Landing page (splash template)
    guides/                 Getting Started section
      introduction.md
      requirements.md
      installation.md
      quick-start.md
    reference/              Reference section
      generated-code.md
      marker-class.md
      endpoints.md
      annotations.md
      integrations.md
      sprout-runtime.md
      customization.md
      id-resolution.md
    help/                   Help section
      troubleshooting.md
      limitations.md
  styles/
    custom.css              Brand theme (green accent + dark navy)
  assets/
    sprout-logo.svg         Site logo
public/
  favicon.svg
astro.config.mjs            Starlight configuration (sidebar, social links, etc.)
```

## Deploying to GitHub Pages

This folder is self-contained and can be moved to a dedicated repository.

Before deploying, update `astro.config.mjs`:

```js
export default defineConfig({
  site: 'https://<your-github-username>.github.io',
  base: '/<repo-name>',   // omit if deploying to the root domain
  // ...
});
```

A ready-to-use GitHub Actions workflow is in `.github/workflows/deploy.yml` — uncomment it
and push to trigger the first deployment.
