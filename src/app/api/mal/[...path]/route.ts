
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/firebase/server';

const API_BASE_URL = 'https://api.myanimelist.net/v2';

let malClientIdCache: string | null = null;
let lastKeyFetch = 0;
const KEY_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

async function getMalClientId(): Promise<string | null> {
    const now = Date.now();
    if (malClientIdCache && (now - lastKeyFetch < KEY_CACHE_DURATION)) {
        return malClientIdCache;
    }

    try {
        const doc = await adminDb.doc('settings/api_keys').get();
        if (doc.exists) {
            const data = doc.data();
            if (data?.malClientId) {
                malClientIdCache = data.malClientId;
                lastKeyFetch = now;
                return malClientIdCache;
            }
        }
    } catch (error) {
        console.error("Error fetching MAL Client ID from Firestore:", error);
    }
    return null;
}


export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const CLIENT_ID = await getMalClientId();

  if (!CLIENT_ID) {
    console.error('[MAL PROXY] Error: MAL Client ID not found in Firestore settings.');
    return new NextResponse(
      JSON.stringify({ success: false, message: 'Server configuration error: MAL Client ID is missing.' }),
      { status: 500 }
    );
  }
    
  const path = params.path.join('/');
  const { search } = req.nextUrl;
  const url = `${API_BASE_URL}/${path}${search}`;

  try {
    const apiRes = await fetch(url, {
      headers: {
        'X-MAL-CLIENT-ID': CLIENT_ID,
        'User-Agent': 'ProjectX/1.0 (Server-Side MAL Proxy)',
      },
      next: { revalidate: 3600 } // Revalidate every hour
    });

    if (!apiRes.ok) {
      const errorBody = await apiRes.text();
      return new NextResponse(errorBody, {
        status: apiRes.status,
        statusText: apiRes.statusText,
      });
    }

    const data = await apiRes.json();
    
    const res = NextResponse.json(data);
    res.headers.set('Access-Control-Allow-Origin', '*');

    return res;

  } catch (error: any) {
    console.error(`[MAL PROXY ERROR] Failed to fetch ${url}:`, error);
    return new NextResponse(
      JSON.stringify({ success: false, message: 'MAL API proxy failed', error: error.message }),
      { status: 502 }
    );
  }
}

export const dynamic = 'force-dynamic';
