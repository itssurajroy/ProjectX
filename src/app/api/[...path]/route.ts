
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://aniwatch-api-five-dusky.vercel.app/api/v2/hianime';

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  const { search } = req.nextUrl;
  
  // Exclude search from this generic proxy
  if (path.startsWith('search')) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'This endpoint is deprecated. Use /api/search instead.' }),
        { status: 404 }
      );
  }

  const url = `${API_BASE_URL}/${path}${search}`;

  try {
    const apiRes = await fetch(url, {
      headers: {
        'User-Agent': 'ProjectX/1.0 (Server-Side Proxy)',
      },
      next: { revalidate: 300 } // Revalidate every 5 minutes
    });

    if (!apiRes.ok) {
      const errorBody = await apiRes.text();
      return new NextResponse(errorBody, {
        status: apiRes.status,
        statusText: apiRes.statusText,
      });
    }

    const data = await apiRes.json();
    
    const res = NextResponse.json(data);
    // Allow requests from anywhere in the browser
    res.headers.set('Access-Control-Allow-Origin', '*');

    return res;

  } catch (error: any) {
    console.error(`[API PROXY ERROR] Failed to fetch ${url}:`, error);
    return new NextResponse(
      JSON.stringify({ success: false, message: 'API proxy failed', error: error.message }),
      { status: 502 }
    );
  }
}

export const dynamic = 'force-dynamic';
