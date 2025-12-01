// src/app/api/v2/hianime/[...path]/route.ts
import { NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  // Reconstruct the path and query from the incoming request.
  const path = params.path.join('/');
  const query = req.nextUrl.search;

  // The target URL for the external HiAnime API.
  const url = `https://api.hianime.to/api/v2/hianime/${path}${query}`;

  try {
    // Fetch from the external API.
    const res = await fetch(url, {
        headers: {
            'Accept': 'application/json',
            'User-Agent': 'ProjectX/1.0 (Proxy)'
        },
        // Leverage Next.js caching. Revalidate every 5 minutes.
        next: { revalidate: 300 } 
    });

    // If the external API call was not successful, forward the error response.
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Failed to parse error response from upstream' }));
        return Response.json(errorData, { status: res.status });
    }

    // If successful, parse the JSON and return it.
    const data = await res.json();
    return Response.json(data);

  } catch (error: any) {
    // Handle network errors or other exceptions during the fetch.
    return Response.json({
        success: false,
        message: 'Proxy fetch failed',
        error: error.message
    }, { status: 502 }); // 502 Bad Gateway
  }
}
