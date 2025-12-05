/**
 * Next.js Middleware - Auth Protection
 * Checks for auth cookies and redirects to /unauthorized if not authenticated
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get auth cookies
  const authToken = request.cookies.get("auth_token");
  const refreshToken = request.cookies.get("refresh_token");

  // Check if user is authenticated
  const isAuthenticated = !!(authToken && refreshToken);

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/auth/callback", "/unauthorized", "/api/auth"];

  // Check if current path is public
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Allow public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Redirect to /unauthorized if not authenticated
  if (!isAuthenticated) {
    console.log("⚠️ Unauthenticated access attempt to:", pathname);
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // User is authenticated, allow access
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
