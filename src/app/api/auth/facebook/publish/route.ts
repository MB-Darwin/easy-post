import axios from "axios";
import { db } from "@/shared/db";
import { socialAccounts } from "@/entities/company/schemas/socialAccounts.schemas";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server"; // Use NextResponse for Next.js 13+

// Define the expected shape of the request body
interface PostRequestBody {
  pageId: string;
  message: string;
  link?: string; // Optional link for a link post
  // Add support for scheduling later if needed:
  // published?: boolean;
  // scheduled_publish_time?: string;
}

// Handler for POST /api/facebook/publish
export async function POST(req: Request) {
  try {
    const { pageId, message, link }: PostRequestBody = await req.json();

    if (!pageId || !message) {
      return NextResponse.json(
        { error: "pageId and message are required" },
        { status: 400 }
      );
    }

    // 1. Get the Facebook Page Access Token from the database
    // This token must be a Long-Lived Page Access Token with 'pages_manage_posts' permission.
    const [account] = await db
      .select()
      .from(socialAccounts)
      .where(eq(socialAccounts.platform, "facebook"));
    // A better implementation would find the account by pageId, but we'll use the existing structure for simplicity.

    if (!account?.accessToken) {
      return NextResponse.json(
        { error: "Facebook Page not connected or token missing" },
        { status: 400 }
      );
    }

    const accessToken = account.accessToken;

    // 2. Publish the Post (POST /page_id/feed)
    // The documentation specifies the endpoint and parameters.
    const postRes = await axios.post(
      `https://graph.facebook.com/v20.0/${pageId}/feed`,
      {
        message: message,
        ...(link && { link: link }), // Conditionally include the link
        access_token: accessToken,
      }
    );

    // 3. Return the result
    const postId = postRes.data.id; // The API returns the post ID on success.

    return NextResponse.json(
      {
        message: "Post published successfully",
        postId: postId,
        url: `https://www.facebook.com/${postId}`, // Permalinks are structured this way.
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(
      "Facebook Posting API Error:",
      error?.response?.data || error
    );

    return NextResponse.json(
      {
        error: "Failed to publish post to Facebook",
        details: error?.response?.data?.error || "Unknown API error",
      },
      { status: 500 }
    );
  }
}
