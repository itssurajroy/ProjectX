
import { NextRequest } from "next/server";

const ALLOWED_DOMAINS = [
  "megacloud.tv",
  "vidstreaming.io",
  "gogocdn.net",
  "kwik.cx",
  "filemoon.sx",
  "streamwish.to",
  "vidoza.net",
];

export const GET = async (req: NextRequest) => {
  const urlParam = req.nextUrl.searchParams.get("url");
  if (!urlParam) return new Response("Missing url", { status: 400 });

  let targetUrl: string;
  try {
    targetUrl = decodeURIComponent(urlParam);
  } catch {
    return new Response("Invalid URL encoding", { status: 400 });
  }

  // Security check
  const hostname = new URL(targetUrl).hostname;
  if (!ALLOWED_DOMAINS.some(d => hostname.includes(d))) {
    return new Response("Domain not allowed", { status: 403 });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const res = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        Referer: "https://hianime.to",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        Origin: "https://hianime.to",
      },
    });

    clearTimeout(timeout);

    if (!res.ok || !res.body) {
      console.warn(`[Stream Proxy] Failed: ${targetUrl} → ${res.status}`);
      return new Response(JSON.stringify({ error: "Stream unavailable", status: res.status }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      });
    }

    const headers = new Headers();
    const contentType = res.headers.get("content-type") || "application/octet-stream";
    headers.set("Content-Type", contentType);
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
    headers.set("X-Stream-Status", "ok");

    return new Response(res.body, { headers });
  } catch (error: any) {
    if (error.name === "AbortError") {
      return new Response(JSON.stringify({ error: "Stream timeout" }), { status: 504 });
    }
    console.error("[Stream Proxy] Exception:", error);
    return new Response(JSON.stringify({ error: "Stream failed", details: error.message }), { status: 502 });
  }
};

export const dynamic = "force-dynamic";
