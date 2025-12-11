
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware is not currently in use.
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
