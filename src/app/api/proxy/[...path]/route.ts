
import { NextRequest, NextResponse } from "next/server";
import { env } from '@/lib/env';

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  
  if (!path) {
    return NextResponse.json({ error: 'Missing path parameter' }, { status: 400 });
  }

  // Reconstruct the original query parameters intended for the target API
  const targetParams = new URLSearchParams(req.nextUrl.search);

  const targetUrl = `${env.HIANIME_API_BASE}/${path}?${targetParams.toString()}`;

  const forwardHeaders = new Headers();
  if (req.headers.has('user-agent')) {
    forwardHeaders.set('User-Agent', req.headers.get('user-agent')!);
  }
  forwardHeaders.set('Accept', 'application/json');
  
  try {
    const res = await fetch(targetUrl, { headers: forwardHeaders });

    if (!res.ok) {
        let errorBody;
        try {
            errorBody = await res.json();
        } catch {
            errorBody = { error: await res.text() };
        }
        console.error(`Upstream API error for ${targetUrl}:`, res.status, errorBody);
        return NextResponse.json({ error: 'Upstream API Error', details: errorBody }, { status: res.status });
    }

    const data = await res.json();

    return NextResponse.json(data, {
      status: res.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (e: any) {
    console.error(`Proxy request failed for ${targetUrl}:`, e);
    return NextResponse.json({ error: 'Proxy failed', details: e.message }, { status: 502 });
  }
}
