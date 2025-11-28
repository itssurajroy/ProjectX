
import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const apiPath = params.path.join('/');
  const searchParams = request.nextUrl.search;
  const targetUrl = `${env.NEXT_PUBLIC_HIANIME_API_BASE}/${apiPath}${searchParams}`;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return new NextResponse(errorBody, {
        status: response.status,
        statusText: response.statusText,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Proxy error:', error);
    return new NextResponse(JSON.stringify({ error: 'Proxy failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
