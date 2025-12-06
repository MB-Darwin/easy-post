// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/shared/i18n/routing";

const SESSION_COOKIE_NAME = "session";

const handleI18nRouting = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Extract locale-agnostic pathname
  const localePattern = /^\/(en|fr)(\/|$)/;
  const pathWithoutLocale = pathname.replace(localePattern, "/");

  // 2. Identify Protected Routes
  const isProtectedRoute = pathWithoutLocale.startsWith("/console");

  if (isProtectedRoute) {
    
    // --- 🟢 LOCAL DEV BYPASS 🟢 ---
    // This lets you see the app locally without logging in!
    if (process.env.NODE_ENV === "development") {
      console.log("⚡️ Dev Mode: Skipping Auth Check");
      return handleI18nRouting(request);
    }
    // -----------------------------

    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    // If no token in production, redirect to login
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/en/auth/login"; 
      return NextResponse.redirect(url);
    }

    try {
      const secret = new TextEncoder().encode(
        process.env.GENUKA_CLIENT_SECRET!
      );
      const { jwtVerify } = await import("jose");
      await jwtVerify(token, secret);
    } catch (err) {
      // If token is bad, redirect to login
      const url = request.nextUrl.clone();
      url.pathname = "/en/auth/login";
      return NextResponse.redirect(url);
    }
  }

  // Apply i18n routing
  return handleI18nRouting(request);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};