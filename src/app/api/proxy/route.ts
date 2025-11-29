
import { NextRequest, NextResponse } from 'next/server';

// This is the target API that all requests will be proxied to.
const API_BASE_URL = 'https://aniwatch-api-five-dusky.vercel.app/api/v2/hianime';

// The GET function now accepts a `params` object to access the dynamic route segments.
export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  const { searchParams } = new URL(request.url);
  const externalUrl = searchParams.get('url');

  // This block correctly handles proxying for external media like M3U8 files.
  if (externalUrl) {
    try {
      const response = await fetch(externalUrl, {
        headers: {
          'Referer': new URL(externalUrl).origin,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
      });

      if (!response.ok) {
        return new NextResponse(`Failed to fetch from external URL: ${response.statusText}`, { status: response.status });
      }

      const contentType = response.headers.get('content-type') || 'application/octet-stream';
      const body = await response.text();
      
      return new NextResponse(body, {
        status: 200,
        headers: { 'Content-Type': contentType, 'Access-Control-Allow-Origin': '*' },
      });
    } catch (error) {
      console.error('Proxy error for external URL:', error);
      return new NextResponse('Error fetching from external URL', { status: 500 });
    }
  }
  
  // This block handles proxying for the main anime API.
  // It now correctly joins the `params.path` array to get the API endpoint.
  const apiPath = params.path.join('/');
  const fullTargetPath = `${API_BASE_URL}/${apiPath}?${searchParams.toString()}`;

  try {
    const response = await fetch(fullTargetPath, {
      headers: {
        ...request.headers,
        'Host': new URL(API_BASE_URL).host,
      } as HeadersInit,
    });

    // Create a new response to return to the client
    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  } catch (error) {
    console.error(`[API PROXY] Failed to fetch ${fullTargetPath}:`, error);
    return NextResponse.json({ error: 'API proxy failed' }, { status: 500 });
  }
}
