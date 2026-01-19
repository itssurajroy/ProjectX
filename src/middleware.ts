import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { adminDb } from '@/firebase/server';

interface Redirect {
    id: string;
    from: string;
    to: string;
    type: 301 | 302;
}

// A simple in-memory cache to avoid hitting Firestore on every request.
let redirectsCache: Redirect[] | null = null;
let lastFetchTimestamp = 0;
const CACHE_DURATION = 60 * 1000; // 1 minute

async function getRedirects(): Promise<Redirect[]> {
    const now = Date.now();
    // In a serverless environment, this cache might not be very effective,
    // but it's better than nothing for bursts of traffic.
    if (redirectsCache && (now - lastFetchTimestamp < CACHE_DURATION)) {
        return redirectsCache;
    }

    try {
        const redirectsSnapshot = await adminDb.collection('settings_redirects').get();
        const redirects = redirectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Redirect));
        redirectsCache = redirects;
        lastFetchTimestamp = now;
        return redirects;
    } catch (error) {
        console.error("[Middleware] Error fetching redirects:", error);
        // If fetch fails, use stale cache if available, otherwise return empty array.
        return redirectsCache || [];
    }
}


export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    
    const allRedirects = await getRedirects();
    const foundRedirect = allRedirects.find(r => r.from === pathname);

    if (foundRedirect) {
        const url = request.nextUrl.clone();
        url.pathname = foundRedirect.to;
        return NextResponse.redirect(url, { status: foundRedirect.type });
    }

    return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
