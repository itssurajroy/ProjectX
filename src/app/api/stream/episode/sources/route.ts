
// src/app/api/stream/episode/sources/route.ts — FINAL WORKING VERSION (NO CHEERIO EVER)
import { NextRequest } from "next/server";

// YOUR WORKING API (CHANGE IF YOU USE DIFFERENT)
const API_BASE = "https://api.hianime.to/api/v2/hianime";
// OR use your own: https://aniwatch-api-five-dusky.vercel.app/api/v2/hianime

const M3U8_PROXY = "https://m3u8proxy-kohl-one.vercel.app/?url=";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const animeEpisodeId = searchParams.get("animeEpisodeId");
  const server = searchParams.get("server") || "hd-1";
  const category = searchParams.get("category") || "sub";

  if (!animeEpisodeId) {
    return new Response(JSON.stringify({ success: false, message: "Missing episode ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }

  try {
    const apiUrl = `${API_BASE}/episode/sources?animeEpisodeId=${animeEpisodeId}&server=${server}&category=${category}`;
    
    const res = await fetch(apiUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://hianime.to",
      },
    });

    if (!res.ok) throw new Error(`API responded ${res.status}`);

    const data = await res.json();

    if (!data.success || !data.data?.sources?.length) {
      throw new Error("No sources found");
    }

    // AUTO PROXY ALL M3U8 + VTT
    const proxied = {
      ...data,
      data: {
        ...data.data,
        sources: data.data.sources.map((s: any) => ({
          ...s,
          url: s.isM3U8 ? `${M3U8_PROXY}${encodeURIComponent(s.url)}` : s.url,
        })),
        subtitles: (data.data.subtitles || []).map((s: any) => ({
          ...s,
          url: `${M3U8_PROXY}${encodeURIComponent(s.url)}`,
        })),
      },
    };

    return new Response(JSON.stringify(proxied), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (error: any) {
    console.error("Stream proxy error:", error.message);

    return new Response(
      JSON.stringify({
        success: false,
        message: "Server temporarily unavailable. Trying next server...",
        error: error.message,
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      }
    );
  }
}

export const dynamic = "force-dynamic";
