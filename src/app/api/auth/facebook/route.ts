// src/app/api/auth/facebook/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { db } from "@/shared/db";
import { socialAccounts } from "@/entities/company/schemas/socialAccounts.schemas";
import { eq } from "drizzle-orm";
import { facebookConfig } from "./config/facebook";
import { encrypt } from "./utils/encryption";
import { createSession, getSessionCompanyId } from "./utils/session";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    // Handle OAuth errors
    if (error) {
      return NextResponse.redirect(
        `${
          process.env.NEXT_PUBLIC_APP_URL
        }/auth/error?message=${encodeURIComponent(error)}`
      );
    }

    if (!code) {
      return NextResponse.json(
        { error: "No authorization code provided" },
        { status: 400 }
      );
    }

    // 1. Exchange authorization code for access token
    const tokenResponse = await axios.get(
      `https://graph.facebook.com/${facebookConfig.apiVersion}/oauth/access_token`,
      {
        params: {
          client_id: facebookConfig.appId,
          client_secret: facebookConfig.appSecret,
          redirect_uri: facebookConfig.redirectUri,
          code,
        },
      }
    );

    const { access_token, expires_in } = tokenResponse.data;

    // 2. Fetch Facebook user data
    const fbUserRes = await axios.get(
      `https://graph.facebook.com/${facebookConfig.apiVersion}/me`,
      {
        params: {
          access_token,
          fields: "id,name,email,picture",
        },
      }
    );

    const fbUser = fbUserRes.data;

    // 3. 🔥 Retrieve the logged-in companyId from your session
    const companyId = await getSessionCompanyId();

    if (!companyId) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/auth/error?message=No+company+session+found`
      );
    }

    // Encrypt token
    const encryptedToken = encrypt(access_token);
    const expiresAt = new Date(Date.now() + expires_in * 1000);

    // 4. Check if account already exists
    const existing = await db
      .select()
      .from(socialAccounts)
      .where(eq(socialAccounts.platformAccountId, fbUser.id));

    if (existing.length === 0) {
      // 🔥 Insert new social account for this company
      await db.insert(socialAccounts).values({
        companyId,
        platform: "facebook",
        platformAccountId: fbUser.id,
        username: fbUser.name,
        displayName: fbUser.name,
        profilePicture: fbUser.picture?.data?.url,
        accessToken: encryptedToken,
        tokenExpiresAt: expiresAt,
        metadata: {
          email: fbUser.email,
        },
      });
    } else {
      // 🔥 Update existing account
      await db
        .update(socialAccounts)
        .set({
          accessToken: encryptedToken,
          tokenExpiresAt: expiresAt,
          updatedAt: new Date(),
        })
        .where(eq(socialAccounts.platformAccountId, fbUser.id));
    }

    // 5. Create a session tied to this Facebook account (OPTIONAL)
    const { session } = await createSession(companyId, fbUser.id);

    const res = NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
    );

    res.cookies.set("session", session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return res;
  } catch (err: any) {
    console.error("Facebook OAuth Error:", err.response?.data || err.message);

    const message = encodeURIComponent(
      err.response?.data?.error?.message ?? "Authentication failed"
    );

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/auth/error?message=${message}`
    );
  }
}
