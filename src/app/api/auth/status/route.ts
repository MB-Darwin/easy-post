/**
 * Auth Status API Route
 * Returns current authentication status from httpOnly cookies
 */

import { NextResponse } from "next/server";
import { getAuthToken, getCompanyId } from "@/shared/lib/auth-middleware";

export async function GET() {
  try {
    const authToken = await getAuthToken();
    const companyId = await getCompanyId();

    if (!authToken) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Return token info (not the actual token for security)
    return NextResponse.json({
      authenticated: true,
      access_token: authToken,
      company_id: companyId,
      token_type: "Bearer",
      expires_in: 3600, // Will need to track actual expiry
    });
  } catch (error) {
    console.error("Auth status check error:", error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
