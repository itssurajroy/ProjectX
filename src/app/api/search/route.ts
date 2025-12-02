
// src/app/api/search/route.ts
import { NextRequest } from "next/server";

const BASE_URL = "https://aniwatch-api-five-dusky.vercel.app/api/v2/hianime";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q")?.trim();
  const page = searchParams.get("page") || "1";

  if (!q || q.length < 2) {
    return Response.json({
      success: false,
      message: "Search query must be at least 2 characters",
    }, { status: 400 });
  }

  try {
    // Main search
    const searchRes = await fetch(
      `${BASE_URL}/search?keyword=${encodeURIComponent(q)}&page=${page}`,
      { next: { revalidate: 300 } }
    );
    
    if (!searchRes.ok) {
        throw new Error(`Primary search failed with status: ${searchRes.status}`);
    }

    const data = await searchRes.json();

    // The new API structure returns data directly, not nested in a `data` property.
    // Let's check for the presence of the `animes` array.
    if (!data.animes || data.animes.length === 0) {
      const homeRes = await fetch(`${BASE_URL}/home`, { next: { revalidate: 600 } });
      const homeDataResponse = await homeRes.json();
      const homeData = homeDataResponse.data;


      const allAnimes = [
        ...(homeData.spotlightAnimes || []),
        ...(homeData.trendingAnimes || []),
        ...(homeData.top10Animes?.today || []),
        ...(homeData.top10Animes?.week || []),
        ...(homeData.latestEpisodeAnimes || []),
      ];

      const filtered = allAnimes
        .filter((a: any) =>
          a.name?.toLowerCase().includes(q.toLowerCase()) ||
          a.jname?.toLowerCase().includes(q.toLowerCase())
        )
        .slice(0, 20);

      return Response.json({
        success: true,
        data: {
          animes: filtered,
          currentPage: 1,
          hasNextPage: false,
          totalResults: filtered.length,
        }
      });
    }
    
    // The original API response might be what we need, ensure it's wrapped correctly.
    // If data is already in the right structure from the primary API, just pass it through.
    return Response.json({ success: true, data });

  } catch (error) {
    console.error('[Search API Error]', error);
    return Response.json(
      { success: false, message: "Search temporarily unavailable" },
      { status: 503 }
    );
  }
}

export const dynamic = "force-dynamic";
