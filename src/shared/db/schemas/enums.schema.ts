import { pgEnum } from "drizzle-orm/pg-core";

export const socialPlatformEnum = pgEnum("social_platform", [
  "facebook",
  "instagram",
  "threads",
  "tiktok",
  "linkedin",
  "twitter",
  "discord",
]);

export const postStatusEnum = pgEnum("post_status", [
  "draft",
  "scheduled",
  "published",
  "failed",
]);

export const accountStatusEnum = pgEnum("account_status", [
  "active",
  "disconnected",
  "expired",
]);

export const campaignStatusEnum = pgEnum("campaign_status", [
  "DRAFT",
  "SCHEDULED",
  "ACTIVE",
  "COMPLETED",
  "PAUSED",
]);

export const postTypeEnum = pgEnum("post_type", [
  "STORY",
  "REEL",
  "PUBLICATION",
]);