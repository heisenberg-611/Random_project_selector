import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { url, method = 'GET', headers = {}, body } = await req.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid target url' }, { status: 400 });
    }

    // Security check: Only allow localhost / 127.0.0.1 / private loopback or known AI endpoints
    const parsedUrl = new URL(url);
    const isLocalhost =
      parsedUrl.hostname === 'localhost' ||
      parsedUrl.hostname === '127.0.0.1' ||
      parsedUrl.hostname === '::1' ||
      parsedUrl.hostname.startsWith('192.168.') ||
      parsedUrl.hostname.startsWith('10.') ||
      parsedUrl.hostname.startsWith('172.');

    if (!isLocalhost && !parsedUrl.hostname.endsWith('googleapis.com') && !parsedUrl.hostname.endsWith('openai.com')) {
      return NextResponse.json({ error: 'Forbidden target host' }, { status: 403 });
    }

    const fetchOptions: RequestInit = {
      method: method.toUpperCase(),
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    if (body && ['POST', 'PUT', 'PATCH'].includes(fetchOptions.method || '')) {
      fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    const targetRes = await fetch(url, fetchOptions);
    const textData = await targetRes.text();

    let jsonData;
    try {
      jsonData = JSON.parse(textData);
    } catch {
      jsonData = null;
    }

    return new NextResponse(jsonData ? JSON.stringify(jsonData) : textData, {
      status: targetRes.status,
      headers: {
        'Content-Type': jsonData ? 'application/json' : 'text/plain',
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Proxy connection failed: ${errorMsg}` }, { status: 502 });
  }
}
