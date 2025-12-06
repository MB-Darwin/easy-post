import { NextResponse } from "next/server";
import { facebookConfig } from "@/app/api/auth/facebook/config/facebook";

export async function GET() {
  const redirectUri = encodeURIComponent(facebookConfig.redirectUri);
  const state = "some-random-string"; // Optional: for CSRF protection
  const scope = "email,public_profile";

  const fbAuthUrl = `https://www.facebook.com/${facebookConfig.apiVersion}/dialog/oauth?client_id=${facebookConfig.appId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;

  return NextResponse.redirect(fbAuthUrl);
}
