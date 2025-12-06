CREATE TYPE "public"."account_status" AS ENUM('active', 'disconnected', 'expired');--> statement-breakpoint
CREATE TYPE "public"."campaign_status" AS ENUM('DRAFT', 'SCHEDULED', 'ACTIVE', 'COMPLETED', 'PAUSED');--> statement-breakpoint
CREATE TYPE "public"."post_status" AS ENUM('draft', 'scheduled', 'published', 'failed');--> statement-breakpoint
CREATE TYPE "public"."post_type" AS ENUM('STORY', 'REEL', 'PUBLICATION');--> statement-breakpoint
CREATE TYPE "public"."social_platform" AS ENUM('facebook', 'instagram', 'threads', 'tiktok', 'linkedin', 'twitter', 'discord');--> statement-breakpoint
CREATE TABLE "ep_analytics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_account_id" uuid NOT NULL,
	"likes" integer DEFAULT 0,
	"comments" integer DEFAULT 0,
	"shares" integer DEFAULT 0,
	"views" integer DEFAULT 0,
	"raw_data" jsonb,
	"fetched_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ep_category" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ep_company" (
	"id" text PRIMARY KEY NOT NULL,
	"category_id" uuid,
	"name" text NOT NULL,
	"handle" text,
	"description" text,
	"logo_url" text,
	"phone" text,
	"is_First_Login" boolean DEFAULT true,
	"access_token" text,
	"refresh_token" text,
	"token_expires_at" timestamp,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ep_permission" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid NOT NULL,
	"name" varchar,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ep_permission_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "ep_permission_category" (
	"category_id" uuid,
	"permission_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ep_post_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"account_id" uuid NOT NULL,
	"platform_post_id" text,
	"status" "post_status" DEFAULT 'scheduled' NOT NULL,
	"error" text,
	"retry_count" integer DEFAULT 0,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "post_accounts_unique" UNIQUE("post_id","account_id")
);
--> statement-breakpoint
CREATE TABLE "ep_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" text NOT NULL,
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
CREATE TABLE "ep_social_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" text NOT NULL,
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
CREATE TABLE "ep_workspace" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" text NOT NULL,
	"posts_id" uuid,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ep_analytics" ADD CONSTRAINT "ep_analytics_post_account_id_ep_post_accounts_id_fk" FOREIGN KEY ("post_account_id") REFERENCES "public"."ep_post_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ep_company" ADD CONSTRAINT "ep_company_category_id_ep_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."ep_category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ep_permission" ADD CONSTRAINT "ep_permission_category_id_ep_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."ep_category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ep_permission_category" ADD CONSTRAINT "ep_permission_category_category_id_ep_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."ep_category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ep_permission_category" ADD CONSTRAINT "ep_permission_category_permission_id_ep_permission_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."ep_permission"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ep_post_accounts" ADD CONSTRAINT "ep_post_accounts_post_id_ep_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."ep_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ep_post_accounts" ADD CONSTRAINT "ep_post_accounts_account_id_ep_social_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."ep_social_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ep_posts" ADD CONSTRAINT "ep_posts_company_id_ep_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."ep_company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ep_social_accounts" ADD CONSTRAINT "ep_social_accounts_company_id_ep_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."ep_company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ep_workspace" ADD CONSTRAINT "ep_workspace_company_id_ep_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."ep_company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ep_workspace" ADD CONSTRAINT "ep_workspace_posts_id_ep_posts_id_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."ep_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "company_handle_idx" ON "ep_company" USING btree ("handle");--> statement-breakpoint
CREATE INDEX "company_name_idx" ON "ep_company" USING btree ("name");--> statement-breakpoint
CREATE INDEX "post_accounts_post_id_idx" ON "ep_post_accounts" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "post_accounts_account_id_idx" ON "ep_post_accounts" USING btree ("account_id");