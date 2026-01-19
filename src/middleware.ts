import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    // The dynamic redirect logic that used Firebase Admin SDK has been removed
    // because middleware must run on the Edge and cannot use Node.js-specific modules.
    // This file can be extended with edge-compatible logic (e.g., header manipulation, auth checks).
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
