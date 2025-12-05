CREATE TYPE "public"."account_status" AS ENUM('active', 'disconnected', 'expired');--> statement-breakpoint
CREATE TYPE "public"."campaign_status" AS ENUM('DRAFT', 'SCHEDULED', 'ACTIVE', 'COMPLETED', 'PAUSED');--> statement-breakpoint
CREATE TYPE "public"."post_status" AS ENUM('draft', 'scheduled', 'published', 'failed');--> statement-breakpoint
CREATE TYPE "public"."post_type" AS ENUM('STORY', 'REEL', 'PUBLICATION');--> statement-breakpoint
CREATE TYPE "public"."social_platform" AS ENUM('facebook', 'instagram', 'threads', 'tiktok', 'linkedin', 'twitter', 'discord');--> statement-breakpoint
CREATE TABLE "analytics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_account_id" uuid NOT NULL,
	"likes" integer DEFAULT 0,
	"comments" integer DEFAULT 0,
	"shares" integer DEFAULT 0,
	"views" integer DEFAULT 0,
	"raw_data" jsonb,
	"fetched_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "post_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"account_id" uuid NOT NULL,
	"platform_post_id" text,
	"status" "post_status" DEFAULT 'scheduled' NOT NULL,
	"error" text,
	"retry_count" integer DEFAULT 0,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"title" text,
	"content" text NOT NULL,
	"type" "post_type" DEFAULT 'PUBLICATION' NOT NULL,
	"status" "post_status" DEFAULT 'draft' NOT NULL,
	"scheduled_at" timestamp,
	"published_at" timestamp,
	"media" jsonb,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "social_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"platform" "social_platform" NOT NULL,
	"platform_account_id" text NOT NULL,
	"username" text NOT NULL,
	"display_name" text,
	"profile_picture" text,
	"access_token" text NOT NULL,
	"refresh_token" text,
	"token_expires_at" timestamp,
	"last_synced_at" timestamp,
	"status" "account_status" DEFAULT 'active' NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "analytics" ADD CONSTRAINT "analytics_post_account_id_post_accounts_id_fk" FOREIGN KEY ("post_account_id") REFERENCES "public"."post_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_accounts" ADD CONSTRAINT "post_accounts_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_accounts" ADD CONSTRAINT "post_accounts_account_id_social_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."social_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_company_id_ep_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."ep_company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "social_accounts" ADD CONSTRAINT "social_accounts_company_id_ep_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."ep_company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ep_company" ADD CONSTRAINT "company_handle_unique" UNIQUE("handle");