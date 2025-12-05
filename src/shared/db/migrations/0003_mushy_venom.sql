CREATE TABLE "catergory" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar,
	"decription" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "permision" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid NOT NULL,
	"name" varchar,
	"decription" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "permision_name_unique" UNIQUE("name")
);
--> statement-breakpoint
DROP INDEX "posts_company_id_idx";--> statement-breakpoint
DROP INDEX "posts_status_idx";--> statement-breakpoint
DROP INDEX "posts_scheduled_at_idx";--> statement-breakpoint
DROP INDEX "social_accounts_company_id_idx";--> statement-breakpoint
DROP INDEX "social_accounts_status_idx";--> statement-breakpoint
ALTER TABLE "ep_company" ADD COLUMN "category_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "permision" ADD CONSTRAINT "permision_category_id_catergory_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."catergory"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ep_company" ADD CONSTRAINT "ep_company_category_id_catergory_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."catergory"("id") ON DELETE cascade ON UPDATE no action;