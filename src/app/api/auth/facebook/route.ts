// src/app/api/auth/facebook/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { db } from "@/shared/db";
import { socialAccounts } from "@/entities/company/schemas/socialAccounts.schemas";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code)
    return NextResponse.json({ error: "No code provided" }, { status: 400 });

  const tokenRes = await axios.get(
    "https://graph.facebook.com/v16.0/oauth/access_token",
    {
      params: {
        client_id: process.env.FB_APP_ID,
        client_secret: process.env.FB_APP_SECRET,
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/facebook`,
        code,
      },
    }
  );

  const { access_token } = tokenRes.data;

  // Fetch user info
  const userRes = await axios.get("https://graph.facebook.com/me", {
    params: {
      access_token,
      fields: "id,name,email,picture",
    },
  });

  const fbUser = userRes.data;

  // Save in database using Drizzle ORM
  const existing = await db
    .select()
    .from(socialAccounts)
    .where(eq(socialAccounts.providerId, fbUser.id));

  if (existing.length === 0) {
    await db.insert(socialAccounts).values({
      provider: "facebook",
      providerId: fbUser.id,
      accessToken: access_token,
      name: fbUser.name,
      email: fbUser.email,
      picture: fbUser.picture.data.url,
    });
  }

  return NextResponse.redirect("/dashboard"); // redirect to your frontend page
}
