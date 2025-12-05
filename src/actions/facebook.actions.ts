// src/actions/facebook.actions.ts
"use server";

import { db } from "@/shared/db";
import { socialAccounts } from "@/shared/db/schema";
import { eq, and } from "drizzle-orm";
import axios from "axios";

interface FacebookAuthResponse {
  accessToken: string;
  userID: string;
  expiresIn: number;
  signedRequest?: string;
  graphDomain?: string;
}

interface FacebookPageData {
  id: string;
  name: string;
  username?: string;
  access_token: string;
  category: string;
  picture?: {
    data: {
      url: string;
    };
  };
}

/**
 * Verify Facebook token with Facebook Graph API
 */
async function verifyFacebookToken(accessToken: string) {
  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;

  if (!appId || !appSecret) {
    throw new Error("Facebook credentials not configured");
  }

  const debugUrl = `https://graph.facebook.com/v19.0/debug_token?input_token=${accessToken}&access_token=${appId}|${appSecret}`;

  const response = await fetch(debugUrl);
  const data = await response.json();

  if (!data?.data?.is_valid) {
    throw new Error("Invalid Facebook token");
  }

  return {
    isValid: data.data.is_valid,
    userId: data.data.user_id,
    appId: data.data.app_id,
    expiresAt: data.data.expires_at,
    scopes: data.data.scopes,
  };
}

/**
 * Exchange short-lived token for long-lived token
 */
async function getLongLivedToken(shortLivedToken: string) {
  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;

  const response = await axios.get(
    "https://graph.facebook.com/v19.0/oauth/access_token",
    {
      params: {
        grant_type: "fb_exchange_token",
        client_id: appId,
        client_secret: appSecret,
        fb_exchange_token: shortLivedToken,
      },
    }
  );

  return {
    accessToken: response.data.access_token,
    expiresIn: response.data.expires_in,
  };
}

/**
 * Fetch Facebook Pages the user manages
 */
async function getFacebookPages(
  accessToken: string
): Promise<FacebookPageData[]> {
  const response = await axios.get(
    "https://graph.facebook.com/v19.0/me/accounts",
    {
      params: {
        access_token: accessToken,
        fields: "id,name,username,access_token,category,picture,fan_count",
      },
    }
  );

  return response.data.data || [];
}

/**
 * Link Facebook account - Main server action
 */
export async function linkFacebookAccount(
  companyId: string,
  authResponse: FacebookAuthResponse
) {
  try {
    if (!authResponse.accessToken || !authResponse.userID) {
      return {
        success: false,
        error: "Missing Facebook credentials",
      };
    }

    // 1. Verify the token with Facebook
    const tokenVerification = await verifyFacebookToken(
      authResponse.accessToken
    );

    if (!tokenVerification.isValid) {
      return {
        success: false,
        error: "Invalid Facebook token",
      };
    }

    // 2. Exchange for long-lived token
    const longLivedToken = await getLongLivedToken(authResponse.accessToken);

    // Calculate token expiry
    const tokenExpiresAt = new Date();
    tokenExpiresAt.setSeconds(
      tokenExpiresAt.getSeconds() + longLivedToken.expiresIn
    );

    // 3. Fetch Facebook Pages
    const pages = await getFacebookPages(longLivedToken.accessToken);

    if (pages.length === 0) {
      return {
        success: false,
        error:
          "No Facebook Pages found. You must be an admin of at least one Facebook Page.",
      };
    }

    // 4. Check if any page is already linked to another company
    for (const page of pages) {
      const existingAccount = await db.query.socialAccounts.findFirst({
        where: and(
          eq(socialAccounts.platform, "facebook"),
          eq(socialAccounts.platformAccountId, page.id)
        ),
      });

      if (existingAccount && existingAccount.companyId !== companyId) {
        return {
          success: false,
          error: `Facebook Page "${page.name}" is already linked to another company`,
        };
      }
    }

    // 5. Save or update Facebook Pages in database
    const savedAccounts = [];

    for (const page of pages) {
      const accountData = {
        companyId,
        platform: "facebook" as const,
        platformAccountId: page.id,
        username: page.username || page.id,
        displayName: page.name,
        profilePicture: page.picture?.data?.url || null,
        accessToken: page.access_token, // Page access token (never expires)
        tokenExpiresAt: null, // Page tokens don't expire
        lastSyncedAt: new Date(),
        status: "active" as const,
        metadata: {
          category: page.category,
          fanCount: (page as any).fan_count || 0,
          linkedAt: new Date().toISOString(),
        },
      };

      // Upsert (insert or update)
      const [account] = await db
        .insert(socialAccounts)
        .values(accountData)
        .onConflictDoUpdate({
          target: [
            socialAccounts.companyId,
            socialAccounts.platform,
            socialAccounts.platformAccountId,
          ],
          set: {
            accessToken: accountData.accessToken,
            displayName: accountData.displayName,
            username: accountData.username,
            profilePicture: accountData.profilePicture,
            status: "active",
            lastSyncedAt: new Date(),
            metadata: accountData.metadata,
            updatedAt: new Date(),
          },
        })
        .returning();

      savedAccounts.push(account);
    }

    return {
      success: true,
      message: `Successfully linked ${savedAccounts.length} Facebook Page(s)`,
      accounts: savedAccounts,
    };
  } catch (error: any) {
    console.error("Facebook linking error:", error);

    return {
      success: false,
      error:
        error.response?.data?.error?.message ||
        error.message ||
        "Failed to link Facebook account",
    };
  }
}

/**
 * Unlink/Disconnect Facebook account
 */
export async function unlinkFacebookAccount(
  companyId: string,
  accountId: string
) {
  try {
    // Verify the account belongs to this company
    const account = await db.query.socialAccounts.findFirst({
      where: and(
        eq(socialAccounts.id, accountId),
        eq(socialAccounts.companyId, companyId)
      ),
    });

    if (!account) {
      return {
        success: false,
        error: "Facebook account not found",
      };
    }

    // Update status to disconnected instead of deleting
    await db
      .update(socialAccounts)
      .set({
        status: "disconnected",
        updatedAt: new Date(),
      })
      .where(eq(socialAccounts.id, accountId));

    return {
      success: true,
      message: "Facebook account disconnected successfully",
    };
  } catch (error: any) {
    console.error("Facebook unlinking error:", error);

    return {
      success: false,
      error: error.message || "Failed to unlink Facebook account",
    };
  }
}

/**
 * Refresh Facebook Page data
 */
export async function refreshFacebookAccount(
  companyId: string,
  accountId: string
) {
  try {
    const account = await db.query.socialAccounts.findFirst({
      where: and(
        eq(socialAccounts.id, accountId),
        eq(socialAccounts.companyId, companyId),
        eq(socialAccounts.platform, "facebook")
      ),
    });

    if (!account) {
      return {
        success: false,
        error: "Facebook account not found",
      };
    }

    // Fetch fresh page data from Facebook
    const response = await axios.get(
      `https://graph.facebook.com/v19.0/${account.platformAccountId}`,
      {
        params: {
          fields: "id,name,username,category,picture,fan_count",
          access_token: account.accessToken,
        },
      }
    );

    const pageData = response.data;

    // Update account with fresh data
    const [updatedAccount] = await db
      .update(socialAccounts)
      .set({
        displayName: pageData.name,
        username: pageData.username || account.username,
        profilePicture: pageData.picture?.data?.url || account.profilePicture,
        lastSyncedAt: new Date(),
        metadata: {
          ...((account.metadata as any) || {}),
          category: pageData.category,
          fanCount: pageData.fan_count || 0,
        },
        updatedAt: new Date(),
      })
      .where(eq(socialAccounts.id, accountId))
      .returning();

    return {
      success: true,
      message: "Facebook account refreshed successfully",
      account: updatedAccount,
    };
  } catch (error: any) {
    console.error("Facebook refresh error:", error);

    // If token is invalid, mark as expired
    if (error.response?.data?.error?.code === 190) {
      await db
        .update(socialAccounts)
        .set({
          status: "expired",
          updatedAt: new Date(),
        })
        .where(eq(socialAccounts.id, accountId));

      return {
        success: false,
        error: "Facebook token has expired. Please reconnect your account.",
      };
    }

    return {
      success: false,
      error:
        error.response?.data?.error?.message ||
        error.message ||
        "Failed to refresh Facebook account",
    };
  }
}

/**
 * Get all Facebook accounts for a company
 */
export async function getFacebookAccounts(companyId: string) {
  try {
    const accounts = await db.query.socialAccounts.findMany({
      where: and(
        eq(socialAccounts.companyId, companyId),
        eq(socialAccounts.platform, "facebook")
      ),
      orderBy: (accounts, { desc }) => [desc(accounts.createdAt)],
    });

    return {
      success: true,
      accounts,
    };
  } catch (error: any) {
    console.error("Get Facebook accounts error:", error);

    return {
      success: false,
      error: error.message || "Failed to fetch Facebook accounts",
      accounts: [],
    };
  }
}
