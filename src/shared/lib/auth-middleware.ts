/**
 * Auth Middleware
 * Server-side utility to get auth token from cookies
 */

import { cookies } from "next/headers";

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value ?? null;
}

export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("refresh_token")?.value ?? null;
}

export async function getCompanyId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("company_id")?.value ?? null;
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  cookieStore.delete("refresh_token");
  cookieStore.delete("company_id");
}
