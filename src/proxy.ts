import { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/shared/i18n/routing";

const SESSION_COOKIE_NAME = "session";

const handleI18nRouting = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Extract locale-agnostic pathname
  const localePattern = /^\/(en|fr)(\/|$)/;
  const pathWithoutLocale = pathname.replace(localePattern, "/");

  // Redirect root to /console
  if (pathWithoutLocale === "/") {
    const locale = pathname.match(localePattern)?.[1];
    const redirectPath = locale ? `/${locale}/console` : "/console";
    const url = request.nextUrl.clone();
    url.pathname = redirectPath;
    return Response.redirect(url);
  }

  // Public routes
  const publicRoutes = ["/sign-in", "/sign-up", "/forgot-password"];
  const isPublicRoute = publicRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  );

  if (isPublicRoute) {
    return handleI18nRouting(request);
  }

  // Protected routes
  const protectedRoutes = ["/ct", "/pt", "/st"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  );

  if (isProtectedRoute) {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      return new Response("Unauthorized", { status: 401 });
    }

    try {
      const secret = new TextEncoder().encode(
        process.env.GENUKA_CLIENT_SECRET!
      );
      const { jwtVerify } = await import("jose");
      await jwtVerify(token, secret);
    } catch {
      return new Response("Unauthorized", { status: 401 });
    }
  }

  // Apply i18n routing - handles locale prefix logic
  return handleI18nRouting(request);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
