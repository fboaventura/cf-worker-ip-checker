# Network Connectivity Test — Design

## Goal

Add a connectivity-test feature to the IP checker: for a fixed list of
well-known sites (Google, YouTube, GitHub, Cloudflare, Claude, ChatGPT,
WeChat, Netflix, and a few others), show whether each is reachable from
the visitor's own network, and how that compares to reachability from
Cloudflare's edge. A mismatch between the two (edge reaches it fine, the
visitor's browser doesn't) is a signal of local blocking/censorship/ISP
issues rather than the site being down.

## Architecture

Single Cloudflare Worker (`src/index.ts`), no new dependencies.

1. **Shared site allowlist** — one array of `{key, label, url}` in
   `index.ts`, each entry marked whether it appears in the homepage
   "quick check" subset. Used by both the API endpoint (as an allowlist)
   and both HTML views (to render rows). Adding a site means editing
   this one list.
2. **`GET /api/network-test?site=<key>`** — Worker-side check. Looks up
   `key` in the allowlist (400 if not found), fetches the site's URL
   from Cloudflare's edge with an AbortController timeout (~5s), and
   returns JSON: `{site, reachable, status, latencyMs}`. On any
   error/timeout, returns `{reachable: false, status: null,
   latencyMs: null}` rather than throwing.
3. **Client-side test runner** — vanilla inline JS (matching the
   existing style, no framework/build step). For each rendered site row,
   runs two checks concurrently:
   - **Client-side reachability**: `new Image()` pointed at the site's
     favicon, timed with `performance.now()`, capped by a ~5s timeout.
     `onload` = reachable; `onerror`/timeout = blocked/unreachable. Uses
     `no-cors` image loading, so this cannot distinguish a real block
     from a 404 favicon — mitigated by picking known-good favicon paths,
     and documented as an approximate signal in the UI copy.
   - **Edge-side reachability**: calls `/api/network-test?site=<key>` on
     this same Worker.
   Each row updates independently as its two results arrive (no
   blocking on the full set).

## UI / data flow

- **Homepage (`/`)**: existing IP card unchanged. New "Quick
  Connectivity Check" section below it, showing only the sites flagged
  as homepage-subset (Google, GitHub, Cloudflare). Tests auto-run on
  page load. A "Full network test →" link goes to `/network`.
- **`/network` page** (new route): same row component, renders the full
  allowlist. Includes a short explainer of what "client" vs "edge"
  results mean. A "Retest" button re-runs all tests; no
  polling/auto-refresh otherwise.
- **Row rendering**: status dot + label (`REACHABLE` / `BLOCKED` /
  `TIMEOUT`) using status colors (good/critical) with icon + text label,
  never color alone. Client latency, edge latency, and a latency bar
  (single-hue, magnitude-scaled against a fixed max e.g. 3000ms,
  clamped visually for slow entries) per row.

## Error handling

- Worker fetch: try/catch + AbortController timeout; failure path
  returns a well-formed JSON payload, never a 5xx for a normal
  unreachable-site case.
- Endpoint validates `site` against the allowlist and returns 400 for
  anything else — this is the SSRF guard, since the Worker will not
  fetch an arbitrary caller-supplied URL.
- Client-side image test failures (CORS-opaque, 404 favicon, real block)
  are all treated as "not reachable within timeout" — a known precision
  limit, called out in the UI copy rather than hidden.

## Testing

- Vitest unit tests (extending `test/index.spec.ts`) for
  `/api/network-test`: valid site key → correct shape; invalid/unlisted
  key → 400; simulated timeout/fetch error → `reachable:false` without
  throwing.
- Manual browser verification of `/` and `/network` for visual/status
  behavior and the client-vs-edge comparison, since real cross-origin
  image timing isn't practically unit-testable.

## Out of scope

- Historical results / persistence across visits.
- Arbitrary user-supplied URLs (allowlist only).
- Precise HTTP status codes for the client-side check (not obtainable
  cross-origin without CORS support from the target site).
