import { pgEnum } from "drizzle-orm/pg-core";

/**
 * Status of a linked social media account
 */
export const accountStatusEnum = pgEnum("account_status", [
  "active",
  "inactive",
  "revoked",
  "expired",
]);

/**
 * Supported social media platforms
 */
export const socialPlatformEnum = pgEnum("social_platform", [
  "facebook",
  "instagram",
  "tiktok",
  "twitter",
  "linkedin",
  "youtube",
]);
