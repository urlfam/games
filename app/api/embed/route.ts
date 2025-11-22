// Simple proxy endpoint for embedding remote HTML under your domain.
// WARNING: Proxying and serving third-party playable content may violate the
// provider's Terms of Service. Use only for hosts you have permission for.
// The route is intentionally conservative: it only allows hosts matching
// a small allowlist and streams the response back. It does NOT rewrite
// resource URLs or guarantee the embedded page will function perfectly.

import { NextResponse } from 'next/server';

const ALLOW_HOSTS = ['crazygames.com', 'crazygames.fr', 'www.crazygames.com'];

export async function GET(req: Request) {
  try {
    const url = new URL(req.url).searchParams.get('url');
    if (!url) {
      return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
    }

    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid url' }, { status: 400 });
    }

    const hostname = parsed.hostname.toLowerCase();
    const allowed = ALLOW_HOSTS.some(h => hostname === h || hostname.endsWith('.' + h));
    if (!allowed) {
      return NextResponse.json({ error: 'Host not allowed' }, { status: 403 });
    }

    // Fetch the remote content server-side and stream it directly to the client.
    const res = await fetch(url, {
      // Forward some headers from the original request to look more like a real user
      headers: { 
        'User-Agent': req.headers.get('User-Agent') || 'puzzio-proxy/1.0',
        'Accept': req.headers.get('Accept') || '*/*',
        'Accept-Language': req.headers.get('Accept-Language') || 'en-US,en;q=0.9',
        'Referer': parsed.origin, // Set referer to the game's own origin
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: `Upstream returned ${res.status}` }, { status: 502 });
    }

    const contentType = res.headers.get('content-type') || 'text/html; charset=utf-8';

    // Stream response back with original content-type. We intentionally do not
    // copy all headers (security) — only content-type and cache-control when present.
    const headers: Record<string, string> = { 'content-type': contentType };
    const cacheControl = res.headers.get('cache-control');
    if (cacheControl) headers['cache-control'] = cacheControl;

    const body = await res.text();

    // CRITICAL FIX 1: Inject a <base> tag using a more robust regex
    const baseUrl = `<base href="${parsed.origin}/">`;
    // This regex finds <head> even if it has attributes
    const modifiedBodyWithBase = body.replace(/<head[^>]*>/, `$&\\n${baseUrl}`);

    // CRITICAL FIX 2: Strip any Content-Security-Policy meta tags that could block execution
    const finalBody = modifiedBodyWithBase.replace(/<meta http-equiv="Content-Security-Policy" content="[^"]*">/gi, '');


    return new NextResponse(finalBody, { status: 200, headers });
  } catch (err: any) {
    console.error(`Proxy error for url: ${req.url}`, err);
    return NextResponse.json({ error: err?.message || 'Unknown error' }, { status: 500 });
  }
}
