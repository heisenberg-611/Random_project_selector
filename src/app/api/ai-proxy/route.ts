import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { url, method = 'GET', headers = {}, body } = await req.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid target url' }, { status: 400 });
    }

    const parsedUrl = new URL(url);
    const host = parsedUrl.hostname.toLowerCase();
    const isAllowed =
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '::1' ||
      host.startsWith('192.168.') ||
      host.startsWith('10.') ||
      host.startsWith('172.') ||
      host.endsWith('googleapis.com') ||
      host.endsWith('openai.com') ||
      host.endsWith('.loca.lt') ||
      host.endsWith('.trycloudflare.com') ||
      host.endsWith('.ngrok-free.app') ||
      host.endsWith('.ngrok.io') ||
      host.endsWith('.ts.net') ||
      host.endsWith('.pinggy.link');

    if (!isAllowed) {
      return NextResponse.json({ error: 'Target host is not permitted by proxy security filter' }, { status: 403 });
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
