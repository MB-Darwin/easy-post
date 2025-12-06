import axios from "axios";
import { db } from "@/shared/db";
import { socialAccounts } from "@/entities/company/schemas/socialAccounts.schemas";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return Response.json({ error: "postId is required" }, { status: 400 });
    }

    // Get the Facebook access token
    const [account] = await db
      .select()
      .from(socialAccounts)
      .where(eq(socialAccounts.platform, "facebook"));

    if (!account?.accessToken) {
      return Response.json(
        { error: "Facebook account not connected" },
        { status: 400 }
      );
    }

    const accessToken = account.accessToken;

    // ---- Fetch Likes ----
    const likesRes = await axios.get(
      `https://graph.facebook.com/${postId}/likes`,
      {
        params: { access_token: accessToken, limit: 100 },
      }
    );

    // ---- Fetch Comments ----
    const commentsRes = await axios.get(
      `https://graph.facebook.com/${postId}/comments`,
      {
        params: { access_token: accessToken, limit: 100 },
      }
    );

    return Response.json({
      postId,
      likes: likesRes.data.data || [],
      comments: commentsRes.data.data || [],
    });
  } catch (error: any) {
    console.error("Facebook API Error:", error?.response?.data || error);

    return Response.json(
      { error: "Failed to fetch engagement from Facebook" },
      { status: 500 }
    );
  }
}
