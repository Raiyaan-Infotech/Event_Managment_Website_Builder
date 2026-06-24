import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

// Copy the backend's Set-Cookie headers onto the builder's OWN domain so the
// vendor session becomes first-party here. The builder then talks to the
// backend through its same-origin proxy, so 'lax' is sufficient.
const copyBackendCookies = (backendResponse: Response, response: NextResponse) => {
  let setCookieList: string[] = backendResponse.headers.getSetCookie?.() ?? [];
  if (setCookieList.length === 0) {
    const raw = backendResponse.headers.get('set-cookie');
    if (raw) setCookieList = raw.split(/,\s*(?=[a-zA-Z][a-zA-Z0-9_-]*=)/);
  }

  for (const cookieStr of setCookieList) {
    const parts = cookieStr.split(/;\s*/);
    const [nameValue, ...attrs] = parts;
    const eqIdx = nameValue.indexOf('=');
    if (eqIdx === -1) continue;

    const name = nameValue.slice(0, eqIdx).trim();
    const value = nameValue.slice(eqIdx + 1).trim();
    const attrMap: Record<string, string | boolean> = {};

    for (const attr of attrs) {
      const pos = attr.indexOf('=');
      if (pos === -1) attrMap[attr.toLowerCase().trim()] = true;
      else attrMap[attr.slice(0, pos).toLowerCase().trim()] = attr.slice(pos + 1).trim();
    }

    const maxAgeRaw = attrMap['max-age'];
    const maxAge = maxAgeRaw !== undefined ? parseInt(String(maxAgeRaw), 10) : undefined;
    response.cookies.set(name, value, {
      httpOnly: attrMap['httponly'] === true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      ...(maxAge !== undefined && !isNaN(maxAge) ? { maxAge } : {}),
    });
  }
};

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  const homeUrl = new URL('/', request.url);

  if (!token) {
    homeUrl.searchParams.set('handoff_error', '1');
    return NextResponse.redirect(homeUrl);
  }

  try {
    const backendResponse = await fetch(`${BACKEND_URL}/vendors/auth/handoff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
      cache: 'no-store',
    });

    if (!backendResponse.ok) {
      homeUrl.searchParams.set('handoff_error', '1');
      return NextResponse.redirect(homeUrl);
    }

    const response = NextResponse.redirect(homeUrl);
    response.headers.set('Cache-Control', 'no-store');
    response.headers.set('Referrer-Policy', 'no-referrer');
    copyBackendCookies(backendResponse, response);
    return response;
  } catch {
    homeUrl.searchParams.set('handoff_error', '1');
    return NextResponse.redirect(homeUrl);
  }
}
