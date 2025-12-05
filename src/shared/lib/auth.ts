import { JWTPayload, SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { serverEnv } from "../env/server-env";
import { companyService } from "../services/database";
// Cookie names
const SESSION_COOKIE_NAME = "session";
const REFRESH_COOKIE_NAME = "refresh_session";

// Cookie durations
const SESSION_MAX_AGE = 60 * 60 * 7; // 7 hours in seconds
const REFRESH_MAX_AGE = 60 * 60 * 24 * 30; // 30 days in seconds

interface SessionPayload extends JWTPayload {
  companyId: string;
  type: "session" | "refresh";
}

function getSecret() {
  return new TextEncoder().encode(serverEnv.GENUKA_CLIENT_SECRET);
}

/**
 * Generate session and refresh tokens (without setting cookies)
 */
export async function generateTokens(companyId: string) {
  const secret = getSecret();

  // Create session token (short-lived: 7h)
  const sessionToken = await new SignJWT({ companyId, type: "session" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7h")
    .sign(secret);

  // Create refresh token (long-lived: 30 days)
  const refreshToken = await new SignJWT({ companyId, type: "refresh" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);

  return { sessionToken, refreshToken };
}

/**
 * Set session cookies on a NextResponse object
 * Use this when redirecting from API routes
 */
export function setSessionCookies(
  response: NextResponse,
  sessionToken: string,
  refreshToken: string
) {
  const isProd = serverEnv.NODE_ENV === "production";

  // Set session cookie (7h)
  response.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });

  // Set refresh cookie (30 days)
  response.cookies.set(REFRESH_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: REFRESH_MAX_AGE,
    path: "/",
  });

  return response;
}

/**
 * Create session and set cookies on a NextResponse
 * Returns the response with cookies set
 */
export async function createSessionWithResponse(
  companyId: string,
  response: NextResponse
): Promise<NextResponse> {
  const { sessionToken, refreshToken } = await generateTokens(companyId);
  return setSessionCookies(response, sessionToken, refreshToken);
}

/**
 * Create both session and refresh cookies for a company
 * Use this in Server Components or Server Actions (NOT in API routes with redirects)
 */
export async function createSession(companyId: string) {
  const { sessionToken, refreshToken } = await generateTokens(companyId);
  const isProd = serverEnv.NODE_ENV === "production";

  const cookieStore = await cookies();

  // Set session cookie (7h)
  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });

  // Set refresh cookie (30 days)
  cookieStore.set(REFRESH_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: REFRESH_MAX_AGE,
    path: "/",
  });

  return sessionToken;
}

/**
 * Verify a JWT token and return the payload
 *
 * @param token
 * @returns
 */
export async function verifyJwt(token: string): Promise<SessionPayload | null> {
  try {
    const secret = getSecret();
    const { payload } = await jwtVerify(token, secret);
    return payload as SessionPayload;
  } catch (error) {
    // Don't log expected expiration errors
    const isExpiredError =
      error instanceof Error && error.message.includes("expired");
    if (!isExpiredError) {
      console.error("JWT verification failed:", error);
    }
    return null;
  }
}

/**
 * Get the session token from cookies
 *
 * @returns
 */
export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value || null;
}

/**
 * Get the refresh token from cookies
 */
export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_COOKIE_NAME)?.value || null;
}

/**
 * Verify refresh token and return companyId
 * This is used for secure session refresh
 */
export async function verifyRefreshToken(): Promise<string | null> {
  const token = await getRefreshToken();

  if (!token) {
    return null;
  }

  const payload = await verifyJwt(token);

  // Ensure it's a refresh token, not a session token
  if (!payload || payload.type !== "refresh") {
    return null;
  }

  return payload.companyId;
}

/**
 * Get the authenticated company from the session
 */
export async function getAuthenticatedCompany() {
  const token = await getSessionToken();

  if (!token) {
    return null;
  }

  const payload = await verifyJwt(token);

  if (!payload || payload.type !== "session") {
    return null;
  }

  return (await companyService.findById(payload.companyId)) ?? null;
}

/**
 * Check if the request is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const company = await getAuthenticatedCompany();
  return company !== null;
}

/**
 * Get authenticated company or throw error
 */
export async function requireAuth() {
  const company = await getAuthenticatedCompany();

  if (!company) {
    throw new Error("Unauthorized");
  }

  return company;
}

/**
 * Destroy both session and refresh cookies (logout)
 */
export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  cookieStore.delete(REFRESH_COOKIE_NAME);
}
