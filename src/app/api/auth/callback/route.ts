import { createSessionWithResponse } from "@/shared/lib/auth";
import { oauthService } from "@/entities/auth/services/oauth.service";
import { companyService } from "@/shared/services/database";
import { NextRequest, NextResponse } from "next/server";

const DEFAULT_REDIRECT_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const companyId = searchParams.get("company_id");
  const code = searchParams.get("code");
  const timestamp = searchParams.get("timestamp");
  const hmac = searchParams.get("hmac");
  const redirectToEncoded = searchParams.get("redirect_to");

  const redirectToDecoded = redirectToEncoded
    ? decodeURIComponent(redirectToEncoded)
    : DEFAULT_REDIRECT_URL;

  console.log({
    companyId,
    code,
    timestamp,
    hmac,
    redirectToEncoded,
    redirectToDecoded,
  });

  // Basic validation
  if (!companyId || !hmac) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  try {
    // 1. Check if company already exists
    const existingCompany = await companyService.findById(companyId);

    if (existingCompany) {
      // ✅ EXISTING USER
      console.log("Existing company found:", {
        id: existingCompany.id,
        handle: existingCompany.handle,
        name: existingCompany.name,
      });

      // Create redirect response FIRST
      const redirectUrl = new URL(`${redirectToDecoded}/console`, request.url);
      const response = NextResponse.redirect(redirectUrl);

      // Then set cookies on the response
      await createSessionWithResponse(companyId, response);

      console.log(
        "Session cookies set, redirecting to:",
        redirectUrl.toString()
      );

      return response;
    }

    // 2. NEW INSTALLATION
    console.log("New company - proceeding with OAuth installation");

    if (!code) {
      return NextResponse.json(
        { error: "Authorization code required for new installation" },
        { status: 400 }
      );
    }

    if (
      !oauthService.validateCallbackParams({ code, companyId, timestamp, hmac })
    ) {
      return NextResponse.json(
        { error: "Invalid OAuth parameters" },
        { status: 400 }
      );
    }

    await oauthService.handleCallback({
      code,
      companyId,
      timestamp: timestamp!,
      hmac,
      redirectTo: redirectToEncoded || DEFAULT_REDIRECT_URL,
    });

    // Create redirect response FIRST
    const redirectUrl = new URL(`${redirectToDecoded}/onboarding`, request.url);
    const response = NextResponse.redirect(redirectUrl);

    // Then set cookies on the response
    await createSessionWithResponse(companyId, response);

    console.log("Session cookies set, redirecting to:", redirectUrl.toString());

    return response;
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
