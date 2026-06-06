import { UAParser } from 'ua-parser-js';

const TEXT_BROWSERS = ['curl', 'HTTPie', 'httpie-go', 'Wget', 'fetch libfetch', 'Go', 'Go-http-client', 'ddclient', 'Mikrotik', 'cf-dns-update'];

function htmlEscape(s: string | null | undefined): string {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function extractIP(request: Request): string | null {
  return request.headers.get('x-real-ip') ??
    request.headers.get('x-forwarded-for') ??
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-client-ip') ??
    request.headers.get('client-ip') ??
    request.headers.get('remote-addr') ??
    request.headers.get('fastly-client-ip') ??
    request.headers.get('true-client-ip') ??
    request.headers.get('x-cluster-client-ip');
}

function isTextBrowser(userAgent: string | null): boolean {
  const userAgentProduct = new UAParser(userAgent?.toString()).getUA().split('/')[0];

  return TEXT_BROWSERS.includes(userAgentProduct);
}

function row(label: string, value: string | null | undefined, highlight = false): string {
  const safe = htmlEscape(value);
  const cls = highlight ? 'highlight' : safe ? '' : 'empty';
  return `<div class="data-row"><span class="data-row__label">${label}</span><span class="data-row__value ${cls}">${safe || '—'}</span></div>`;
}

function generateHTMLContent(ip: string | null, cf: any, userAgent: string | null): string {
  const browser = new UAParser(userAgent?.toString());
  const safeIP = htmlEscape(ip);
  const reqId = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IP Checker — ffbdev</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Fragment+Mono:ital@0;1&family=IBM+Plex+Sans:wght@300;400;600&display=swap" rel="stylesheet">
  <style>
    :root{--bg:#04080f;--bg-card:#080f1e;--bg-row:#0d1e35;--border:#152d4a;--accent:#00e5ff;--accent-glow:rgba(0,229,255,.12);--text:#d8e8f4;--text-dim:#7a9ab8;--text-label:#5a7a98;--mono:'Fragment Mono','Courier New',monospace;--sans:'IBM Plex Sans',system-ui,sans-serif}
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    body{background:var(--bg);color:var(--text);font-family:var(--sans);font-size:15px;line-height:1.6;min-height:100vh;overflow-x:hidden}
    body::before{content:'';position:fixed;inset:0;background-image:linear-gradient(rgba(0,229,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,.025) 1px,transparent 1px);background-size:44px 44px;pointer-events:none;z-index:0}
    body::after{content:'';position:fixed;inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(0,229,255,.04) 0%,transparent 60%),radial-gradient(ellipse at center,transparent 45%,rgba(4,8,15,.75) 100%);pointer-events:none;z-index:0}
    .container{position:relative;z-index:1;max-width:860px;margin:0 auto;padding:0 2rem}
    header{padding:1.5rem 0 1rem;display:flex;align-items:center;justify-content:space-between}
    .logo img{display:block;width:64px;height:64px;object-fit:contain}
    .status{display:flex;align-items:center;gap:.45rem;font-size:.65rem;font-family:var(--mono);color:var(--text-label);letter-spacing:.12em}
    .status-dot{width:6px;height:6px;border-radius:50%;background:#00e676;animation:blink 2.4s ease-in-out infinite;flex-shrink:0}
    @keyframes blink{0%,100%{opacity:1}55%{opacity:.25}}
    .hero{padding:4rem 0 2.5rem;text-align:center}
    .hero__label{font-family:var(--mono);font-size:.65rem;letter-spacing:.35em;color:var(--accent);text-transform:uppercase;margin-bottom:1.4rem;opacity:0;animation:rise .5s ease forwards .2s}
    .hero__ip{font-family:var(--mono);font-size:clamp(2.2rem,7.5vw,5rem);font-weight:normal;color:#fff;letter-spacing:-.02em;line-height:1;text-shadow:0 0 50px rgba(0,229,255,.35),0 0 100px rgba(0,229,255,.12);opacity:0;animation:reveal .85s cubic-bezier(.16,1,.3,1) forwards .45s}
    @keyframes reveal{from{opacity:0;transform:translateY(14px);filter:blur(10px)}to{opacity:1;transform:translateY(0);filter:blur(0)}}
    @keyframes rise{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}
    .copy-btn{display:inline-flex;align-items:center;gap:.45rem;margin-top:1.6rem;padding:.42rem 1rem;border:1px solid var(--border);border-radius:2px;background:transparent;color:var(--text-dim);font-family:var(--mono);font-size:.65rem;letter-spacing:.12em;cursor:pointer;transition:all .2s ease;opacity:0;animation:rise .5s ease forwards 1s}
    .copy-btn:hover{border-color:var(--accent);color:var(--accent);background:var(--accent-glow)}
    .copy-btn.copied{border-color:#00e676;color:#00e676}
    .api-bar{display:flex;align-items:center;justify-content:center;gap:.8rem;margin:1rem 0 2rem;opacity:0;animation:rise .5s ease forwards 1.05s}
    .api-bar a{font-family:var(--mono);font-size:.65rem;color:var(--text-dim);text-decoration:none;padding:.3rem .75rem;border:1px solid var(--border);border-radius:2px;letter-spacing:.08em;transition:all .2s}
    .api-bar a:hover{color:var(--accent);border-color:var(--accent);background:var(--accent-glow)}
    .data-card{background:var(--bg-card);border:1px solid var(--border);border-radius:3px;margin-bottom:4rem;overflow:hidden;opacity:0;animation:rise .6s ease forwards .75s}
    .data-card__head{padding:.7rem 1.4rem;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
    .data-card__head-title{font-family:var(--mono);font-size:.62rem;letter-spacing:.28em;color:var(--accent);text-transform:uppercase}
    .data-card__head-meta{font-family:var(--mono);font-size:.58rem;color:var(--text-label)}
    .section-label{padding:.38rem 1.4rem;background:rgba(0,229,255,.02);border-bottom:1px solid var(--border);font-family:var(--mono);font-size:.58rem;letter-spacing:.22em;color:var(--text-label);text-transform:uppercase}
    .data-row{display:grid;grid-template-columns:180px 1fr;border-bottom:1px solid var(--border);transition:background .15s ease}
    .data-row:last-child{border-bottom:none}
    .data-row:hover{background:var(--bg-row)}
    .data-row__label{padding:.7rem 1.4rem;font-size:.63rem;font-family:var(--mono);letter-spacing:.06em;color:var(--text-label);text-transform:uppercase;border-right:1px solid var(--border)}
    .data-row__value{padding:.7rem 1.4rem;font-family:var(--mono);font-size:.82rem;color:var(--text);word-break:break-all}
    .data-row__value.highlight{color:var(--accent)}
    .data-row__value.empty{color:var(--text-label)}
    footer{padding:2rem 0;text-align:center;border-top:1px solid var(--border);opacity:0;animation:rise .5s ease forwards 1.2s}
    footer p{font-family:var(--mono);font-size:.6rem;color:var(--text-label);letter-spacing:.18em}
    footer a{color:var(--text-dim);text-decoration:none;transition:color .2s}
    footer a:hover{color:var(--accent)}
    @media(max-width:600px){.data-row{grid-template-columns:1fr}.data-row__label{border-right:none;padding-bottom:.25rem}.data-row__value{padding-top:.25rem}}
  </style>
</head>
<body>
<div class="container">
  <header>
    <a href="/" class="logo"><img src="https://ik.imagekit.io/ffbdev/logo_full_white_sm_400x400.png?updatedAt=1724196803264&amp;ik-sdk-version=javascript-1.4.3" alt="ffbdev" width="64" height="64"></a>
    <div class="status"><div class="status-dot"></div>CONNECTED</div>
  </header>

  <section class="hero">
    <p class="hero__label">Your IP Address</p>
    <h1 class="hero__ip">${safeIP}</h1>
    <button class="copy-btn" data-ip="${safeIP}">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="1"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
      <span>COPY ADDRESS</span>
    </button>
  </section>

  <div class="api-bar"><a href="/json">JSON API &rarr;</a></div>

  <div class="data-card">
    <div class="data-card__head">
      <span class="data-card__head-title">Network Intelligence</span>
      <span class="data-card__head-meta">REQ_${reqId}</span>
    </div>
    <div class="section-label">// Geolocation</div>
    ${row('IP Address', ip, true)}
    ${row('Country', cf?.country)}
    ${row('Continent', cf?.continent)}
    ${row('Region', cf?.region)}
    ${row('Region Code', cf?.regionCode)}
    ${row('City', cf?.city)}
    ${row('Latitude', cf?.latitude)}
    ${row('Longitude', cf?.longitude)}
    ${row('Timezone', cf?.timezone)}
    <div class="section-label">// Network</div>
    ${row('ASN', cf?.asn)}
    ${row('Organization', cf?.asOrganization)}
    <div class="section-label">// Client</div>
    ${row('User Agent', browser.getUA())}
    ${row('Browser', browser.getBrowser()['name'])}
    ${row('Version', browser.getBrowser()['version'])}
  </div>

  <footer><p>FFBDEV &nbsp;&middot;&nbsp; <a href="https://fboaventura.dev">fboaventura.dev</a></p></footer>
</div>
<script>
  document.querySelector('.copy-btn').addEventListener('click', function() {
    var btn = this;
    var label = btn.querySelector('span');
    navigator.clipboard.writeText(btn.dataset.ip).then(function() {
      label.textContent = '✓ COPIED';
      btn.classList.add('copied');
      setTimeout(function() {
        label.textContent = 'COPY ADDRESS';
        btn.classList.remove('copied');
      }, 2200);
    });
  });
</script>
</body>
</html>`;
}

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const ip = extractIP(request);
    const url = new URL(request.url);
    const path = url.pathname;
    const userAgent = request.headers.get('user-agent');
    const cf = request.cf;

    if (isTextBrowser(userAgent) && path === '/') {
      return new Response(`${ip}\n`, { headers: { 'content-type': 'text/plain;charset=UTF-8' } });
    } else if (path === '/') {
      return new Response(generateHTMLContent(ip, cf, userAgent), { headers: { 'content-type': 'text/html;charset=UTF-8' } });
    } else if (path === '/json') {
      return new Response(JSON.stringify({
        ip,
        country: cf?.country,
        continent: cf?.continent,
        region: cf?.region,
        region_code: cf?.regionCode,
        city: cf?.city,
        latitude: cf?.latitude,
        longitude: cf?.longitude,
        timezone: cf?.timezone,
        asn: cf?.asn,
        as_organization: cf?.asOrganization,
        hostname: cf?.hostname,
        user_agent: userAgent
      }), { headers: { 'content-type': 'application/json;charset=UTF-8' } });
    }

    return new Response('Not Found', { status: 404 });
  }
} satisfies ExportedHandler<Env>;
