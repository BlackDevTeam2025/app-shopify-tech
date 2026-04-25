# app-shopify-tech

Merchant-facing Shopify embedded app UI for SnapTip.

This project is intentionally separate from `snaptip.tech`:

- `https://snaptip.tech` serves the public landing page, OAuth backend, webhooks, and internal admin.
- `https://snaptip.tech/auth/start` starts Shopify OAuth.
- `https://snaptip.tech/auth/callback` saves installation data, then redirects to this app.
- `https://app.snaptip.tech` is the Shopify embedded app UI merchants see after install.

## Deploy

Deploy this repository to Vercel and assign the custom domain:

```bash
app.snaptip.tech
```

The app is a static embedded shell. No Shopify secrets belong in this repo.

If DNS is managed by Cloudflare, add a DNS-only CNAME:

```text
Name: app
Target: cname.vercel-dns.com
Proxy: DNS only
```

Then add `app.snaptip.tech` as a custom domain in the Vercel project for this repo.

## Shopify app config

Keep the Shopify app configured as:

```toml
application_url = "https://snaptip.tech/auth/start"

[auth]
redirect_urls = [ "https://snaptip.tech/auth/callback" ]
```

The landing backend should set:

```env
SHOPIFY_EMBEDDED_APP_URL=https://app.snaptip.tech
```

After a successful OAuth callback, `snaptip.tech` should redirect merchants to:

```text
https://app.snaptip.tech/?shop=<shop>.myshopify.com&host=<host>&embedded=1
```

This app uses those query params to render inside Shopify Admin.

## Local preview

Open `index.html` directly or serve the directory with any static server.
