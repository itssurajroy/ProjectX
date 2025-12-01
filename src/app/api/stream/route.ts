
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_DOMAINS = [
  "megacloud.tv",
  "vidstreaming.io",
  "gogocdn.net",
  "kwik.cx",
  "filemoon.sx",
  "streamwish.to",
  "vidoza.net",
  "animespa.com", // Add any other domains you expect to proxy
];

export async function GET(req: NextRequest) {
  const urlParam = req.nextUrl.searchParams.get("url");
  if (!urlParam) {
    return new Response("Missing url parameter", { status: 400 });
  }

  let targetUrl: string;
  try {
    targetUrl = decodeURIComponent(urlParam);
  } catch (e) {
    return new Response("Invalid URL encoding", { status: 400 });
  }
  
  const targetHostname = new URL(targetUrl).hostname;

  if (!ALLOWED_DOMAINS.some(domain => targetHostname.endsWith(domain))) {
    console.warn(`[Stream Proxy] Denied access to domain: ${targetHostname}`);
    return new Response("Domain not allowed for proxying.", { status: 403 });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout

    const res = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        ...req.headers,
        "Origin": new URL(targetUrl).origin,
        "Referer": new URL(targetUrl).origin + '/',
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
      }
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`[Stream Proxy] Failed to fetch stream from ${targetUrl}: Status ${res.status}`);
      return new Response(res.body, { status: res.status, statusText: res.statusText });
    }

    const responseHeaders = new Headers(res.headers);
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Range');

    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: responseHeaders,
    });

  } catch (error: any) {
    if (error.name === 'AbortError') {
      return new Response("Request timed out.", { status: 504 });
    }
    console.error("[Stream Proxy] Critical error:", error);
    return new Response("An internal error occurred while proxying the request.", { status: 500 });
  }
}

export const dynamic = "force-dynamic";
