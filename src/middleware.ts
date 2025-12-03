
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getUserRole } from '@/lib/adminRoles';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps } from 'firebase-admin/app';

if (!getApps().length) {
  initializeApp();
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith("/admin")) {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const decoded = await getAuth().verifyIdToken(token);
      const role = await getUserRole(decoded.uid);

      if (!role) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      // Optional: Block specific tabs based on role
      const blockedPaths = {
        viewer: ["/admin/users", "/admin/settings", "/admin/cache"],
        moderator: ["/admin/settings", "/admin/cache"],
        admin: ["/admin/cache"]
      };

      if (role && blockedPaths[role as keyof typeof blockedPaths]?.some(p => path.startsWith(p))) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }

      // Add role to headers for client-side use
      const response = NextResponse.next();
      response.headers.set("x-user-role", role);
      return response;
    } catch (error) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"]
};

export const runtime = 'nodejs';
