
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_DOMAINS = [
  "megacloud.tv",
  "vidstreaming.io",
  "gogocdn.net",
  "kwik.cx",
  "filemoon.sx",
  "streamwish.to",
  "vidoza.net",
  "animespa.com",
  "sunshinerays93.live",
  "haildrop77.pro",
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
  
  const targetUrlObj = new URL(targetUrl);
  const targetHostname = targetUrlObj.hostname;

  if (!ALLOWED_DOMAINS.some(domain => targetHostname.endsWith(domain))) {
    console.warn(`[Stream Proxy] Denied access to domain: ${targetHostname}`);
    return new Response("Domain not allowed for proxying.", { status: 403 });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout

    const origin = targetUrlObj.origin;
    const referer = origin + '/';

    const res = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        ...req.headers,
        "Origin": origin,
        "Referer": referer,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
      }
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`[Stream Proxy] Failed to fetch stream from ${targetUrl}: Status ${res.status}`);
      return new Response(res.body, { status: res.status, statusText: res.statusText });
    }

    const contentType = res.headers.get('content-type') || 'application/octet-stream';
    const isM3U8 = contentType.includes('application/x-mpegURL') || contentType.includes('application/vnd.apple.mpegurl') || targetUrl.endsWith('.m3u8');

    let body: BodyInit;

    if (isM3U8) {
        let text = await res.text();
        const baseUrl = new URL(targetUrl);
        const proxyBaseUrl = req.nextUrl.origin + '/api/stream?url=';
        
        // Regex to find URLs in the manifest, handling both absolute and relative paths
        text = text.replace(/^(?!#)(.*)$/gm, (line) => {
            if (line.startsWith('http')) {
                return `${proxyBaseUrl}${encodeURIComponent(line)}`;
            } else if (line.trim() !== '') {
                const absoluteUrl = new URL(line, baseUrl);
                return `${proxyBaseUrl}${encodeURIComponent(absoluteUrl.href)}`;
            }
            return line;
        });
        body = text;
    } else {
        body = res.body;
    }
    
    const responseHeaders = new Headers(res.headers);
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Range');
    responseHeaders.set('Content-Type', contentType);

    return new Response(body, {
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
