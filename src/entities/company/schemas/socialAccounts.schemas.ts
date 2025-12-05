import {
  pgTable,
  text,
  uuid,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { company } from "@/entities/company/schemas/company.schema"; // absolute import
import {
  accountStatusEnum,
  socialPlatformEnum,
} from "@/entities/company/schemas/enums.schemas";

export const socialAccounts = pgTable(
  "social_accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => company.id, { onDelete: "cascade" }),
    platform: socialPlatformEnum("platform").notNull(),
    platformAccountId: text("platform_account_id").notNull(),
    username: text("username").notNull(),
    displayName: text("display_name"),
    profilePicture: text("profile_picture"),
    accessToken: text("access_token").notNull(),
    refreshToken: text("refresh_token"),
    tokenExpiresAt: timestamp("token_expires_at"),
    lastSyncedAt: timestamp("last_synced_at"),
    status: accountStatusEnum("status").default("active").notNull(),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("social_accounts_company_id_idx").on(table.companyId),
    index("social_accounts_status_idx").on(table.status),
  ]
);

export type SocialAccount = typeof socialAccounts.$inferSelect;
export type NewSocialAccount = typeof socialAccounts.$inferInsert;
