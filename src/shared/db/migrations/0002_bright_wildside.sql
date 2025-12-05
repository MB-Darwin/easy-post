ALTER TABLE "analytics" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "analytics" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
CREATE INDEX "post_accounts_post_id_idx" ON "post_accounts" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "post_accounts_account_id_idx" ON "post_accounts" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "posts_company_id_idx" ON "posts" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "posts_status_idx" ON "posts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "posts_scheduled_at_idx" ON "posts" USING btree ("scheduled_at");--> statement-breakpoint
CREATE INDEX "social_accounts_company_id_idx" ON "social_accounts" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "social_accounts_status_idx" ON "social_accounts" USING btree ("status");--> statement-breakpoint
ALTER TABLE "post_accounts" ADD CONSTRAINT "post_accounts_unique" UNIQUE("post_id","account_id");