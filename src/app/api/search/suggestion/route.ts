
// src/app/api/search/suggestion/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = 'https://aniwatch-api-five-dusky.vercel.app/meta/anilist';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get('q');

  if (!API_BASE_URL) {
    return NextResponse.json(
      { success: false, message: "API base URL is not configured." },
      { status: 500 }
    );
  }

  if (!q) {
    return NextResponse.json(
      { success: false, message: "Query parameter 'q' is required." },
      { status: 400 }
    );
  }

  try {
    const url = `${API_BASE_URL}/search/suggest?q=${encodeURIComponent(q)}`;
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
    return NextResponse.json(data);

  } catch (error: any) {
    console.error(`[API Suggestion ERROR] Failed to fetch suggestions for "${q}":`, error);
    return new NextResponse(
      JSON.stringify({ success: false, message: 'API suggestion proxy failed', error: error.message }),
      { status: 502 }
    );
  }
}

export const dynamic = 'force-dynamic';

