CREATE TABLE "ep_company" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"handle" text,
	"description" text,
	"logo_url" text,
	"phone" text,
	"access_token" text,
	"refresh_token" text,
	"token_expires_at" timestamp,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "company_handle_idx" ON "ep_company" USING btree ("handle");--> statement-breakpoint
CREATE INDEX "company_name_idx" ON "ep_company" USING btree ("name");