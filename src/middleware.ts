
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith('/admin')) {
    // In Edge middleware, we only check for the presence of the session cookie.
    // The client-side ProtectedRoute will handle the actual token verification and role enforcement.
    const token = request.cookies.get('__session')?.value || request.cookies.get('auth-token')?.value;

    if (!token) {
      // If no token, redirect to login immediately.
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', path); // Optional: redirect back after login
      return NextResponse.redirect(loginUrl);
    }

    // Allow the request to proceed. The client-side `ProtectedRoute`
    // will verify the token's validity and the user's role.
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
