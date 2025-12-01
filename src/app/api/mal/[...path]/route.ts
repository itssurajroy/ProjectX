
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://api.myanimelist.net/v2';
const CLIENT_ID = process.env.NEXT_PUBLIC_MAL_CLIENT_ID;

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  if (!CLIENT_ID) {
    console.error('[MAL PROXY] Error: NEXT_PUBLIC_MAL_CLIENT_ID is not set.');
    return new NextResponse(
      JSON.stringify({ success: false, message: 'Server configuration error: MAL Client ID is missing.' }),
      { status: 500 }
    );
  }
    
  const path = params.path.join('/');
  const { search } = req.nextUrl;
  const url = `${API_BASE_URL}/${path}${search}`;

  try {
    const apiRes = await fetch(url, {
      headers: {
        'X-MAL-CLIENT-ID': CLIENT_ID,
        'User-Agent': 'ProjectX/1.0 (Server-Side MAL Proxy)',
      },
      next: { revalidate: 3600 } // Revalidate every hour
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
    res.headers.set('Access-Control-Allow-Origin', '*');

    return res;

  } catch (error: any) {
    console.error(`[MAL PROXY ERROR] Failed to fetch ${url}:`, error);
    return new NextResponse(
      JSON.stringify({ success: false, message: 'MAL API proxy failed', error: error.message }),
      { status: 502 }
    );
  }
}

export const dynamic = 'force-dynamic';
