
// src/app/api/search/route.ts
import { NextRequest, NextResponse } from "next/server";

const BASE_URL = 'https://aniwatch-api-five-dusky.vercel.app';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  
  if (!BASE_URL) {
    return NextResponse.json(
      { success: false, message: "API base URL is not configured." },
      { status: 500 }
    );
  }

  const q = searchParams.get('q');
  
  // This route no longer handles suggestions.
  // That logic is now in /api/search/suggestion
  if (request.nextUrl.pathname.includes('/suggestion')) {
      return NextResponse.json({ success: false, message: "This endpoint is deprecated. Use /api/search/suggestion instead." }, { status: 410 });
  }

  const advancedParams = new URLSearchParams(searchParams.toString());
  let hasFilter = false;
  searchParams.forEach((value, key) => {
      if (['type', 'genres', 'year', 'sort'].includes(key) && value) {
          hasFilter = true;
      }
  });

  const hasQuery = q && q.trim() !== '';

  // If sorting by popularity without a query, the API fails. Add a default query.
  if (advancedParams.get('sort') && !hasQuery) {
      advancedParams.set('q', 'a');
  } else if (!hasQuery && !hasFilter) {
    return NextResponse.json({
      success: false,
      message: "Search query 'q' or at least one filter must be provided.",
    }, { status: 400 });
  }

  try {
    const searchRes = await fetch(
      `${BASE_URL}/api/v2/hianime/search?${advancedParams.toString()}`,
      { 
        headers: {
            'User-Agent': 'ProjectX/1.0 (Server-Side Proxy)',
            'Connection': 'close',
        },
        next: { revalidate: 300 } // Cache for 5 minutes
      }
    );
    
    if (!searchRes.ok) {
        const errorBody = await searchRes.text();
        console.error(`[API Search Error] ${searchRes.status}: ${errorBody}`);
        throw new Error(`Primary search failed with status: ${searchRes.status}`);
    }

    const data = await searchRes.json();
    return NextResponse.json({ data });

  } catch (error: any) {
    console.error('[Search API Error]', error);
    return NextResponse.json(
      { success: false, message: "Search temporarily unavailable", error: error.message },
      { status: 503 }
    );
  }
}

export const dynamic = "force-dynamic";
