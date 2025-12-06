import { JWTPayload, SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { serverEnv } from "../env/server-env";
import { companyService } from "@/entities/company";

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
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Token exchange failed: ${error.response?.status} ${JSON.stringify(
          error.response?.data
        )}`
      );
    }
    throw error;
  }
}

export async function refreshAccessToken(
  refreshToken: string
): Promise<TokenResponse> {
  try {
    const response = await axios.post(
      `${serverEnv.GENUKA_API_URL}/oauth/refresh`,
      {
        refresh_token: refreshToken,
        client_id: serverEnv.GENUKA_CLIENT_ID,
        client_secret: serverEnv.GENUKA_CLIENT_SECRET,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        httpsAgent,
      }
    );

    return response.data as TokenResponse;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Token refresh failed: ${error.response?.status} ${JSON.stringify(
          error.response?.data
        )}`
      );
    }
    throw error;
  }
}

export async function getCompanyInfo(companyId: string) {
  const genuka = await initializeGenuka(companyId);
  return await genuka.company.retrieve();
}
