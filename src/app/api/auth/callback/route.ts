/**
 * Genuka OAuth Callback API Route
 * Handles OAuth redirect from Genuka and processes authentication
 * Based on official Genuka boilerplate patterns
 */

import { NextRequest, NextResponse } from "next/server";
import { OAuthService } from "@/shared/services/oauth.service";

const oauthService = new OAuthService();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Extract OAuth callback parameters
    const code = searchParams.get("code");
    const companyId = searchParams.get("company_id");
    const timestamp = searchParams.get("timestamp");
    const hmac = searchParams.get("hmac");
    const redirectToEncoded = searchParams.get("redirect_to");

    // Get full query string for HMAC validation (needed for both flows)
    const url = new URL(request.url);
    const queryString = url.search.substring(1); // Remove leading '?'

    // Handle Genuka's installation verification ping (no code, just HMAC validation)
    if (!code && companyId && timestamp && hmac) {
      console.log("Received installation verification ping from Genuka");

      const validation = await oauthService.validateCallback({
        queryString,
        hmac: hmac!,
        timestamp: timestamp!,
      });

      if (!validation.valid) {
        console.error("Verification ping validation failed:", validation.error);
        return NextResponse.json({ error: validation.error }, { status: 401 });
      }

      console.log(
        "✅ Installation verification successful for company:",
        companyId
      );

      // Redirect to onboarding page
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }

    // Validate required parameters for full OAuth flow
    if (
      !oauthService.validateCallbackParams({ code, companyId, timestamp, hmac })
    ) {
      console.error("Missing required OAuth parameters");
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Validate HMAC with full query string
    const validation = await oauthService.validateCallback({
      queryString,
      hmac: hmac!,
      timestamp: timestamp!,
    });

    if (!validation.valid) {
      console.error("Callback validation failed:", validation.error);
      return NextResponse.json({ error: validation.error }, { status: 401 });
    }

    // Exchange authorization code for access token
    const tokenResponse = await oauthService.getToken(code!);

    // Calculate token expiration
    const tokenExpiresAt = new Date(
      Date.now() + (tokenResponse.expires_in || 3600) * 1000
    );

    // Fetch company information
    let companyInfo = null;
    try {
      companyInfo = await oauthService.getCompanyInfo(
        companyId!,
        tokenResponse.access_token
      );
    } catch (error) {
      console.warn("Failed to fetch company info:", error);
      // Continue anyway - company info is optional
    }

    // Prepare redirect
    const redirectToDecoded = redirectToEncoded
      ? decodeURIComponent(redirectToEncoded)
      : "/dashboard";

    // Create response with redirect
    const response = NextResponse.redirect(
      new URL(redirectToDecoded, request.url)
    );

    // Set secure httpOnly cookies
    const isProduction = process.env.NODE_ENV === "production";

    response.cookies.set("auth_token", tokenResponse.access_token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: tokenResponse.expires_in || 3600,
      path: "/",
    });

    if (tokenResponse.refresh_token) {
      response.cookies.set("refresh_token", tokenResponse.refresh_token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/",
      });
    }

    response.cookies.set("company_id", companyId!, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    // Store token expiration
    response.cookies.set("token_expires_at", tokenExpiresAt.toISOString(), {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    // Optionally store company name for UI
    if (companyInfo?.name) {
      response.cookies.set("company_name", companyInfo.name, {
        httpOnly: false, // Accessible to JS for UI display
        secure: isProduction,
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
    }

    console.log("OAuth callback successful for company:", companyId);

    return response;
  } catch (error) {
    console.error("OAuth callback error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
