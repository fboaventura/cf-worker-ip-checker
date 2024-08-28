import { UAParser } from 'ua-parser-js';

const TEXT_BROWSERS = ['curl', 'HTTPie', 'httpie-go', 'Wget', 'fetch libfetch', 'Go', 'Go-http-client', 'ddclient', 'Mikrotik'];
const HTML_STYLE = `:root{--primary-color:#432e30;--primary-color-light:#8e7474;--accent-color:#fe6a6b;--accent-color-light:#ffe4e4;--accent-color-dark:#b94b4c;--white-color:#fafbfc;--light-gray-color:#c6cbd1;--medium-gray-color:#959da5;--dark-gray-color:#444d56;--bg-color:#f8f8fa;--code-bg-color:#f0e8e8}body,html{background-color:#fff;font-family:Nunito Sans,sans-serif;margin:0;padding:0}p{color:#4a4a4a;font-weight:300}a,a:hover{color:var(--primary-color);text-decoration:none}hr{border:0;border-bottom:1px solid var(--bg-color);padding:1rem 0}*{box-sizing:border-box}.section__title{color:var(--primary-color)}.tab__container{position:relative}.tab__container>ul{list-style:none;margin:0;padding-left:0;position:absolute;right:1rem;top:-2rem}.tab__container .code{padding:1rem 1.5rem;white-space:normal}.tab{cursor:pointer;font-weight:200;padding:.3rem .5rem}.tab,.tab.active{display:inline-block}.tab.active{border-bottom:1px solid var(--primary-color);font-weight:700}.tab__pane{display:none}.tab__pane.active{display:block}.code{background:var(--bg-color);border:1px solid var(--code-bg-color);border-radius:3px;color:var(--primary-color-light);font-family:Space Mono,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace}.code--block{padding:0 1.5rem;white-space:pre-line}.code--inline{font-size:80%;padding:3px 6px}.button--primary{background-color:var(--accent-color);border:0;color:#fff;padding:10px 22px;position:relative;text-decoration:none;transition:all .3s ease-out}.button--primary:after{background-color:var(--accent-color-light);content:"";height:1rem;position:absolute;right:-.4rem;top:-.4rem;transition:all .3s ease-out;width:1rem}.button--primary:hover{color:#fff;text-shadow:0 1px 1px var(--accent-color-dark);transform:translate3D(0,-3px,0)}.button--primary:hover:after{transform:rotate(90deg)}.button--secondary{border:2px solid var(--primary-color);padding:10px 22px;transition:all .5s ease-out}.button--secondary:hover{border-color:var(--accent-color);color:var(--accent-color)}.link{text-decoration:none;transition:all .3s ease-out}.link:hover{color:var(--accent-color)}.link--dark{color:var(--primary-color)}.link--light{color:var(--accent-color)}nav{background-color:var(--bg-color);display:grid;float:left;grid-template-columns:70px auto}.menu{list-style:none;margin:0;overflow:hidden;text-align:right}.toggle{display:none;position:relative}.toggle span,.toggle span:after,.toggle span:before{background:var(--primary-color);border-radius:2px;content:"";cursor:pointer;display:block;height:2px;position:absolute;right:0;transition:all .3s ease-in-out;width:18px}.toggle span:before{top:-6px}.toggle span:after{bottom:-6px}.toggle.open span{background-color:transparent}.toggle.open span:after,.toggle.open span:before{top:0}.toggle.open span:before{transform:rotate(45deg)}.toggle.open span:after{transform:rotate(-45deg)}.menu__item{display:inline-block;padding:1rem}.menu__item.toggle{display:none}table{border-collapse:collapse;margin-bottom:2rem;transition:color .3s ease-out;width:100%}table td,table th{border:1px solid var(--code-bg-color);font-weight:300;padding:.8rem}table th{background-color:#fff;border-color:#fff;border-bottom-color:var(--code-bg-color);text-align:left}table td:first-child{background-color:var(--bg-color);font-weight:600}@media screen and (max-width:600px){nav{grid-template-columns:70px auto}.menu__item{display:none}.menu__item.toggle{display:inline-block}.menu{padding:.5rem 1rem;text-align:right}.toggle{display:block}.menu.responsive .menu__item:not(:first-child){display:block;padding:0 0 .5rem}}.wrapper{margin:0 auto;width:70%}.footer{background-color:var(--medium-gray-color);color:#fff;padding:2rem;text-align:center}@keyframes fadeUp{0%{opacity:0;transform:translate3d(0,30px,0)}to{transform:translateZ(0)}}.logo{background:url(https://ik.imagekit.io/ffbdev/logo_full_white_sm_400x400.png?updatedAt=1724196803264&ik-sdk-version=javascript-1.4.3) no-repeat;background-size:100px;height:100px;margin:1rem 0 0 1rem;width:100px}.hero{background-color:var(--bg-color);padding:2rem 0 3rem;text-align:center}.hero__title{color:var(--primary-color);font-weight:900}.hero__description{margin:-1rem auto 2rem}.hero__terminal{animation:fadeUp 2s;background-color:#232323;border-radius:4px;box-shadow:0 12px 37px 9px rgba(0,0,0,.1);color:#fff;margin:-11rem auto 3rem;min-height:285px;padding:0 1rem;text-align:left;width:60%}.hero__terminal pre{padding-top:1rem;white-space:pre-line}.feature{display:flex;flex-wrap:wrap}.feature__item{margin:0 20px 0 0;max-width:calc(33% - 20px)}.feature__item .section__title{margin-bottom:0}.feature__item p{margin-top:.5rem}.keybinding{display:flex;margin-left:30%;margin-top:3rem}.keybinding__detail{border:1px solid var(--code-bg-color);flex-basis:50%;line-height:2rem;list-style:none;padding:2rem 1rem 1rem;position:relative}.keybinding__detail:first-child{padding-right:1rem;text-align:right}.keybinding__detail:last-child{margin-left:-1px;padding-left:1rem}.keybinding__detail:first-child .keybinding__title{background-color:#fff;padding:0 .5rem;position:absolute;right:.5rem;top:-2rem}.keybinding__detail:last-child .keybinding__title{background-color:#fff;left:.5rem;padding:0 .5rem;position:absolute;top:-2rem}.keybinding__label{background:var(--white-color);border:1px solid var(--light-gray-color);border-radius:3px;box-shadow:0 1px 0 0 var(--medium-gray-color);color:var(--dark-gray-color);font-family:Courier,monospace;font-size:.7rem;padding:3px 3px 1px;vertical-align:middle}.callout{padding:1rem 0 3rem;text-align:center}.callout .button--primary{display:inline-block;margin-top:.5rem}.changelog{background-color:var(--bg-color);padding:2rem 0}.changelog__item{display:flex}.changelog__meta{flex-basis:25%}.changelog__meta small{color:var(--primary-color-light);font-weight:200;letter-spacing:1px}.changelog__title{margin-bottom:0}.changelog__callout{margin:3rem auto 2rem;text-align:center}@media (max-width:750px){.hero__terminal{width:70%}.tab__container>ul{left:0;padding-left:0;right:auto}.tab__container .code{margin-top:2rem}.changelog__item,.feature,.keybinding{flex-direction:column}.feature__item{margin:0;max-width:100%}.keybinding{font-size:.8rem}}`;

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

function generateHTMLContent(ip: string | null, cf: any, userAgent: string | null): string {
  const browser = new UAParser(userAgent?.toString());
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>FFBDev - IP Config</title>
  <style>${HTML_STYLE}</style>
</head>
<body>
<nav>
  <div class="logo">&nbsp;</div>
</nav>
<div class="hero">
  <h1 class="hero__title">${ip}</h1>
</div>
<div class="keybinding">
  <ul class="keybinding__detail">
    <h3 class="keybinding__title">IP Address Details</h3>
    <table class="info-table">
      <tr><th scope="row">IP&nbsp;address</th><td>${ip}</td></tr>
      <tr><th scope="row">Country</th><td>${cf?.country ?? ''}</td></tr>
      <tr><th scope="row">Continent</th><td>${cf?.continent ?? ''}</td></tr>
      <tr><th scope="row">Region</th><td>${cf?.region ?? ''}</td></tr>
      <tr><th scope="row">Region&nbsp;code</th><td>${cf?.regionCode ?? ''}</td></tr>
      <tr><th scope="row">City</th><td>${cf?.city ?? ''}</td></tr>
      <tr><th scope="row">Latitude</th><td>${cf?.latitude ?? ''}</td></tr>
      <tr><th scope="row">Longitude</th><td>${cf?.longitude ?? ''}</td></tr>
      <tr><th scope="row">Timezone</th><td>${cf?.timezone ?? ''}</td></tr>
      <tr><th scope="row">ASN</th><td>${cf?.asn ?? ''}</td></tr>
      <tr><th scope="row">ASN (organization)</th><td>${cf?.asOrganization ?? ''}</td></tr>
      <tr><th scope="row">Hostname</th><td>&nbsp;</td></tr>
      <tr><th scope="row">User&nbsp;agent</th><td>${browser.getUA()}</td></tr>
      <tr><th scope="row">Browser Name</th><td>${browser.getBrowser()['name']}</td></tr>
      <tr><th scope="row">Browser Version</th><td>${browser.getBrowser()['version']}</td></tr>
    </table>
  </ul>
</div>
<footer class="footer"></footer>
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

    if (TEXT_BROWSERS.includes(new UAParser(userAgent?.toString()).getUA().split('/')[0]) && path === '/') {
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
