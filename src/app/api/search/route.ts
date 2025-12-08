
// src/app/api/search/route.ts
import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

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

  const advancedParams = new URLSearchParams();
  let hasQuery = false;
  searchParams.forEach((value, key) => {
      advancedParams.append(key, value);
      if (key === 'q' && value) {
          hasQuery = true;
      }
  });

  if (!hasQuery && advancedParams.toString() === 'page=1') {
    return NextResponse.json({
      success: false,
      message: "Search query 'q' must be provided for a general search.",
    }, { status: 400 });
  }

  try {
    const searchRes = await fetch(
      `${BASE_URL}/search?${advancedParams.toString()}`,
      { next: { revalidate: 300 } } // Cache for 5 minutes
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

