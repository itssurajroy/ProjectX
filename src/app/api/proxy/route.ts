
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return new NextResponse('URL parameter is missing', { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'Referer': new URL(url).origin, // Set a referer to mimic a direct browser request
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
    });

    if (!response.ok) {
      return new NextResponse(`Failed to fetch from external URL: ${response.statusText}`, { status: response.status });
    }

    // Get the content type from the original response
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    
    // Create a new response with the fetched data and correct content type
    const body = await response.text();
    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*', // Allow any origin to access this resource
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new NextResponse('Error fetching from external URL', { status: 500 });
  }
}
