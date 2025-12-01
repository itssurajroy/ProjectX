// src/app/api/stream/[...path]/route.ts
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: { path: string[] } }) => {
  const fullPath = params.path.join("/");
  const query = req.nextUrl.search;
  const targetUrl = `https://aniwatch-api-five-dusky.vercel.app/api/v2/hianime/${fullPath}${query}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Referer": "https://hianime.to",
        "Origin": "https://hianime.to",
        "Accept": "application/json",
      },
    });

    clearTimeout(timeout);

    const data = await response.text();

    return new Response(data, {
      status: response.ok ? 200 : response.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "*",
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Stream proxy failed", 
        error: error.message 
      }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
};

export const OPTIONS = () => {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "*",
    },
  });
};

export const dynamic = "force-dynamic";