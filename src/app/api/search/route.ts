
// src/app/api/search/route.ts
import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://aniwatch-api-five-dusky.vercel.app/api/v2/hianime";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q")?.trim();

  // Suggestion endpoint
  if (request.nextUrl.pathname.endsWith('/suggestion')) {
      if (!q) {
          return NextResponse.json({ success: false, message: "Query parameter 'q' is required for suggestions." }, { status: 400 });
      }
      try {
          const res = await fetch(`${BASE_URL}/search/suggestion?q=${encodeURIComponent(q)}`, {
              next: { revalidate: 300 } // Cache suggestions for 5 mins
          });
          if (!res.ok) {
              const errorBody = await res.text();
              console.error(`[API Suggestion Error] ${res.status}: ${errorBody}`);
              throw new Error(`Suggestion API failed with status: ${res.status}`);
          }
          const data = await res.json();
          return NextResponse.json(data);
      } catch (error: any) {
          console.error('[Search Suggestion API Error]', error);
          return NextResponse.json(
              { success: false, message: "Suggestions temporarily unavailable" },
              { status: 503 }
          );
      }
  }

  // Advanced search endpoint
  if (!q) {
    return NextResponse.json({
      success: false,
      message: "Search query 'q' must be provided.",
    }, { status: 400 });
  }

  const advancedParams = new URLSearchParams();
  searchParams.forEach((value, key) => {
      advancedParams.append(key, value);
  });

  try {
    const searchRes = await fetch(
      `${BASE_URL}/search?${advancedParams.toString()}`,
      { next: { revalidate: 300 } }
    );
    
    if (!searchRes.ok) {
        const errorBody = await searchRes.text();
        console.error(`[API Search Error] ${searchRes.status}: ${errorBody}`);
        throw new Error(`Primary search failed with status: ${searchRes.status}`);
    }

    const data = await searchRes.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('[Search API Error]', error);
    return NextResponse.json(
      { success: false, message: "Search temporarily unavailable", error: error.message },
      { status: 503 }
    );
  }
}

export const dynamic = "force-dynamic";
