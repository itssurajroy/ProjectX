
import { NextRequest, NextResponse } from 'next/server';

// Use the environment variable for the base URL.
const API_BASE_URL = process.env.NEXT_PUBLIC_HIANIME_API_BASE;

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  if (!API_BASE_URL) {
    return new NextResponse(JSON.stringify({ error: 'API base URL is not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiPath = params.path.join('/');
  const searchParams = request.nextUrl.search;
  const targetUrl = `${API_BASE_URL}/${apiPath}${searchParams}`;

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
