import axios from "axios";
import { db } from "@/shared/db";
import { socialAccounts } from "@/entities/company/schemas/socialAccounts.schemas";
import {
  posts,
  postStatusEnum,
} from "@/entities/company/schemas/posts.schemas"; // Assuming you export your posts schema and enums
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// Define the shape of the data coming from the client, aligning with DB fields
interface PostRequestBody {
  companyId: string; // Required by your DB schema
  pageId: string;
  title?: string;
  content: string; // Used for the post message
  scheduledAt?: string; // Optional: ISO string or similar timestamp for scheduling
  // media?: any; // To be implemented later for photos/videos
}

export async function POST(req: Request) {
  const now = new Date();

  try {
    const { companyId, pageId, title, content, scheduledAt }: PostRequestBody =
      await req.json();

    if (!pageId || !content || !companyId) {
      return NextResponse.json(
        { error: "companyId, pageId, and content are required" },
        { status: 400 }
      );
    }

    // 1. Get the Facebook Page Access Token
    // NOTE: For a multi-page app, you should query by companyId and pageId.
    const [account] = await db
      .select()
      .from(socialAccounts)
      .where(eq(socialAccounts.platform, "facebook"));

    if (!account?.accessToken) {
      return NextResponse.json(
        { error: "Facebook Page not connected or token missing" },
        { status: 400 }
      );
    }

    const accessToken = account.accessToken;
    const isScheduled = !!scheduledAt;

    // Facebook API request parameters
    const facebookParams: any = {
      message: content,
      access_token: accessToken,
    };

    let localPostStatus: (typeof postStatusEnum.enumValues)[number];
    let localPublishedAt: Date | null = null;
    let localScheduledAt: Date | null = null;

    if (isScheduled) {
      // 2. Configure for Scheduled Post
      const scheduledTime = new Date(scheduledAt as string);

      facebookParams.published = false;
      // Convert to UNIX timestamp (in seconds) as required by Facebook
      facebookParams.scheduled_publish_time = Math.floor(
        scheduledTime.getTime() / 1000
      );

      localPostStatus = "scheduled";
      localScheduledAt = scheduledTime;
    } else {
      // 3. Configure for Immediate Post
      localPostStatus = "published";
      localPublishedAt = now;
    }

    // 4. Publish the Post (POST /page_id/feed)
    const postRes = await axios.post(
      `https://graph.facebook.com/v20.0/${pageId}/feed`,
      facebookParams
    );

    const facebookPostId = postRes.data.id;

    // 5. Save the post to your local database
    const [newPost] = await db
      .insert(posts)
      .values({
        companyId: companyId,
        title: title,
        content: content,
        // Assuming default type is PUBLICATION, can be adjusted
        status: localPostStatus,
        scheduledAt: localScheduledAt,
        publishedAt: localPublishedAt,
        metadata: {
          platform: "facebook",
          platformPostId: facebookPostId, // The Facebook ID is saved here
          pageId: pageId,
        },
      })
      .returning({ id: posts.id });

    // 6. Return the result
    return NextResponse.json(
      {
        message: isScheduled
          ? "Post scheduled successfully"
          : "Post published successfully",
        postId: newPost.id, // Your internal DB ID
        facebookPostId: facebookPostId,
        url: isScheduled
          ? undefined
          : `https://www.facebook.com/${facebookPostId}`,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(
      "Facebook Posting API Error:",
      error?.response?.data || error
    );

    // Rollback DB transaction or ensure cleanup if partial failure occurred
    // (A full transaction wrapper is recommended for production)

    return NextResponse.json(
      {
        error: "Failed to process post request",
        details: error?.response?.data?.error || "Unknown API error",
      },
      { status: 500 }
    );
  }
}
