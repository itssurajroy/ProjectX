
// src/app/api/search/route.ts
import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://aniwatch-api-five-dusky.vercel.app/api/v2/hianime";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  
  const q = searchParams.get('q');
  
  if (request.nextUrl.pathname.includes('/suggestion')) {
      if (!q) {
          return NextResponse.json({ success: false, message: "Query 'q' is required for suggestions." }, { status: 400 });
      }
      const suggestionUrl = `${BASE_URL}/search/suggestion?q=${encodeURIComponent(q)}`;
      try {
          const res = await fetch(suggestionUrl, { next: { revalidate: 300 } }); // Cache for 5 minutes
          if (!res.ok) throw new Error(`Suggestion API failed with status: ${res.status}`);
          const data = await res.json();
          return NextResponse.json(data);
      } catch (error: any) {
          console.error('[Search Suggestion API Error]', error);
          return NextResponse.json({ success: false, message: "Suggestions unavailable", error: error.message }, { status: 503 });
      }
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

