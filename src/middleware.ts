
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // This middleware is no longer needed as the admin panel is removed.
  // We will return the response to continue the middleware chain.
  return NextResponse.next();
}

export const config = {
  // No paths to match as the admin panel is removed.
  matcher: [],
};
